const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// In-memory store for tracking token origins
// Structure: { token: { origins: Set, firstSeenAt: timestamp, userId: string } }
const tokenOriginStore = new Map();

// Configuration constants
const TOKEN_EXPIRY_HOURS = 24;
const MAX_UNIQUE_ORIGINS_PER_TOKEN = 2;
const TOKEN_EXPIRY_MS = TOKEN_EXPIRY_HOURS * 60 * 60 * 1000;

/**
 * Extracts origin information from the request
 * @param {Object} req - Express request object
 * @returns {Object} Origin information object
 */
function extractOriginInfo(req) {
  const ipAddress = req.ip || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress || 
    req.connection.socket?.remoteAddress ||
    'unknown';
  
  const userAgent = req.get('user-agent') || 'unknown';
  const origin = req.get('origin') || req.get('referer') || 'direct';
  const timestamp = new Date().toISOString();
  
  return {
    ipAddress,
    userAgent,
    origin,
    timestamp,
    country: req.get('cf-ipcountry') || 'unknown', // Cloudflare header if available
    uniqueKey: `${ipAddress}|${userAgent}` // Composite key for uniqueness
  };
}

/**
 * Sends origin data to the access data collection server
 * @param {Object} originData - Origin data to send
 * @param {string} tokenId - JWT token ID
 * @returns {Promise<void>}
 */
async function sendOriginDataToCollectionServer(originData, tokenId) {
  try {
    const collectionServerUrl = process.env.ACCESS_DATA_COLLECTION_SERVER_URL;
    if (!collectionServerUrl) {
      console.warn('ACCESS_DATA_COLLECTION_SERVER_URL not configured, skipping origin data collection');
      return;
    }

    const response = await fetch(collectionServerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.COLLECTION_SERVER_API_KEY || ''
      },
      body: JSON.stringify({
        tokenId,
        originData,
        collectedAt: new Date().toISOString()
      })
    });

    if (!response.ok) {
      console.error(`Failed to send origin data to collection server: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error sending origin data to collection server:', error.message);
    // Non-blocking error - continue operation even if collection fails
  }
}

/**
 * Checks if token has expired
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired
 */
function isTokenExpired(token) {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.iat) return true;
    
    const tokenAge = Date.now() - (decoded.iat * 1000);
    return tokenAge > TOKEN_EXPIRY_MS;
  } catch (error) {
    return true;
  }
}

/**
 * Revokes authentication for a token by removing it from the store
 * @param {string} token - JWT token to revoke
 */
function revokeTokenAuthentication(token) {
  tokenOriginStore.delete(token);
  console.warn(`Token authentication revoked due to multiple origin detection`);
}

/**
 * Main middleware function for single-origin JWT authentication
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function singleOriginKey_auth(req, res, next) {
  // Only check protected routes or if header is present
  if (!req.get('origin_auth_key') && req.path === '/hello-world') {
    return next();
  }

  try {
    const authToken = req.get('origin_auth_key');
    
    if (!authToken) {
      // Token not required for unprotected routes, continue
      if (req.path === '/hello-world' || req.path === '/health') {
        return next();
      }
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized. Missing origin_auth_key header.'
      });
    }

    // Verify token expiration
    if (isTokenExpired(authToken)) {
      return res.status(401).json({
        status: 'fail',
        message: 'Token expired. Maximum token lifetime is 24 hours.'
      });
    }

    // Verify JWT signature
    let decoded;
    try {
      decoded = jwt.verify(authToken, JWT_SECRET);
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized. Invalid token signature.'
      });
    }

    // Extract current request origin
    const currentOrigin = extractOriginInfo(req);

    // Check if this is a new token or a returning one
    if (!tokenOriginStore.has(authToken)) {
      // First time seeing this token - initialize tracking
      tokenOriginStore.set(authToken, {
        origins: new Set([currentOrigin.uniqueKey]),
        originDetails: [currentOrigin],
        firstSeenAt: Date.now(),
        userId: decoded.id || decoded.userId || 'unknown',
        isRevoked: false
      });
    } else {
      const tokenRecord = tokenOriginStore.get(authToken);

      // Check if token has been revoked
      if (tokenRecord.isRevoked) {
        console.warn(`Access denied: Token has been revoked due to suspicious activity`);
        return res.status(403).json({
          status: 'fail',
          message: 'Access denied. Authentication revoked due to suspicious activity.'
        });
      }

      // Add origin if new
      tokenRecord.origins.add(currentOrigin.uniqueKey);
      tokenRecord.originDetails.push(currentOrigin);

      // Check if exceeded maximum unique origins
      if (tokenRecord.origins.size > MAX_UNIQUE_ORIGINS_PER_TOKEN) {
        console.error(`SECURITY ALERT: Token ${authToken.substring(0, 10)}... accessed from ${tokenRecord.origins.size} unique origins`);
        console.error(`User: ${tokenRecord.userId}, Origins:`, Array.from(tokenRecord.origins));
        
        // Log detailed origin information
        tokenRecord.originDetails.forEach((origin, index) => {
          console.error(`  Origin ${index + 1}: IP=${origin.ipAddress}, UA=${origin.userAgent}, Country=${origin.country}`);
        });

        // Revoke token authentication
        revokeTokenAuthentication(authToken);

        // Send alert to collection server (fire and forget)
        sendOriginDataToCollectionServer({
          event: 'suspicious_activity_detected',
          tokenId: authToken.substring(0, 20),
          userId: tokenRecord.userId,
          uniqueOriginCount: tokenRecord.origins.size,
          origins: tokenRecord.originDetails,
          threshold: MAX_UNIQUE_ORIGINS_PER_TOKEN
        }, authToken);

        return res.status(403).json({
          status: 'fail',
          message: 'Access denied. Token accessed from multiple locations. Authentication revoked.'
        });
      }
    }

    // Attach decoded token and origin data to request
    req.user = decoded;
    req.originData = extractOriginInfo(req);
    req.authToken = authToken;

    // Send origin data to collection server for logging (non-blocking)
    sendOriginDataToCollectionServer({
      event: 'successful_auth',
      userId: decoded.id || decoded.userId || 'unknown',
      originInfo: req.originData,
      tokenFirstSeenAt: tokenOriginStore.get(authToken).firstSeenAt
    }, authToken);

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during authentication.'
    });
  }
}

/**
 * Cleanup function to remove expired tokens from store
 * Should be called periodically (e.g., every hour)
 */
function cleanupExpiredTokens() {
  const now = Date.now();
  let removedCount = 0;

  for (const [token, record] of tokenOriginStore.entries()) {
    if (now - record.firstSeenAt > TOKEN_EXPIRY_MS) {
      tokenOriginStore.delete(token);
      removedCount++;
    }
  }

  if (removedCount > 0) {
    console.log(`Cleaned up ${removedCount} expired token records`);
  }
}

// Schedule cleanup every hour
setInterval(cleanupExpiredTokens, 60 * 60 * 1000);

module.exports = { 
  singleOriginKey_auth,
  cleanupExpiredTokens,
  extractOriginInfo,
  sendOriginDataToCollectionServer,
  tokenOriginStore // Export for testing purposes
};