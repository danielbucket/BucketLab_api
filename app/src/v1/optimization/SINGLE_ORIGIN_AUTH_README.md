# Single-Origin JWT Authentication Middleware

## Overview

The `singleOriginKey_auth` middleware provides enhanced security by implementing JWT authentication with origin tracking. It restricts authenticated tokens to a single sign-on location and monitors for suspicious multi-location access patterns.

## Features

- **JWT Token Validation**: Verifies token signatures using `JWT_SECRET`
- **Token Expiration**: Enforces 24-hour token lifetime
- **Origin Tracking**: Collects and aggregates request origin information
- **Single-Origin Enforcement**: Restricts tokens to a maximum of 2 unique origin locations
- **Suspicious Activity Detection**: Automatically revokes tokens accessed from more than 2 unique origins
- **Security Logging**: Detailed logging of security events and anomalies
- **Data Collection**: Sends origin data to external access analytics server

## Configuration

### Required Environment Variables

```env
JWT_SECRET=your_jwt_secret_key
ACCESS_DATA_COLLECTION_SERVER_URL=https://your-collection-server.com/api/origins
COLLECTION_SERVER_API_KEY=your_api_key_for_collection_server
NODE_ENV=development|production
```

## Usage

### Basic Implementation

The middleware is already integrated into `app.js`:

```javascript
const { singleOriginKey_auth } = require('./optimization/singleOriginKey_auth.js');

app.use(singleOriginKey_auth);
```

### Protected Routes

Routes that require authentication must include the `origin_auth_key` header:

```bash
curl -H "origin_auth_key: your_jwt_token" https://api.example.com/protected-route
```

### Public Routes

The following routes are accessible without authentication:
- `/hello-world`
- `/health`

All other routes require a valid `origin_auth_key` header.

## How It Works

### 1. Token Extraction
The middleware extracts the JWT token from the `origin_auth_key` header.

### 2. Token Validation
- **Signature Verification**: Validates the JWT signature using `JWT_SECRET`
- **Expiration Check**: Ensures token is not older than 24 hours
- **Revocation Status**: Checks if token has been revoked due to suspicious activity

### 3. Origin Information Collection
For each request, the middleware collects:
- **IP Address**: Request source IP (considers proxy headers for Cloudflare)
- **User Agent**: Client browser/application information
- **Origin/Referer**: HTTP origin or referer header
- **Country**: From Cloudflare's `cf-ipcountry` header (if available)
- **Timestamp**: Request timestamp in ISO format

A unique key is generated from the composite of IP + User Agent to identify distinct origins.

### 4. Origin Tracking
- **First Request**: Token record is initialized with the first origin
- **Subsequent Requests**: New origins are tracked and added to the token's origin set
- **Threshold Check**: If a token is accessed from more than 2 unique origins, security alert is triggered

### 5. Security Response
When the threshold is exceeded:
1. Detailed error logs are generated with all origin information
2. The token is immediately revoked
3. All future requests with that token are rejected
4. An alert is sent to the access data collection server
5. HTTP 403 response is returned to the client

### 6. Data Collection
Origin data is asynchronously sent to the collection server for:
- Successful authentications (normal usage patterns)
- Suspicious activity detection (multi-origin access)

## API Reference

### Middleware Function

```javascript
singleOriginKey_auth(req, res, next)
```

**Parameters:**
- `req` (Object): Express request object
- `res` (Object): Express response object
- `next` (Function): Express next middleware function

**Request Properties Set:**
- `req.user`: Decoded JWT payload
- `req.originData`: Origin information for current request
- `req.authToken`: The JWT token used

### Helper Functions

#### `extractOriginInfo(req)`
Extracts comprehensive origin information from a request.

**Returns:**
```javascript
{
  ipAddress: string,
  userAgent: string,
  origin: string,
  timestamp: string (ISO format),
  country: string,
  uniqueKey: string // IP|UserAgent composite
}
```

#### `sendOriginDataToCollectionServer(originData, tokenId)`
Sends collected origin data to the external collection server.

**Parameters:**
- `originData` (Object): Origin information to send
- `tokenId` (string): Associated token identifier

#### `isTokenExpired(token)`
Checks if a token has exceeded the 24-hour lifetime.

**Returns:** boolean

#### `revokeTokenAuthentication(token)`
Immediately revokes a token, blocking all future access.

#### `cleanupExpiredTokens()`
Removes expired token records from memory. Runs automatically every hour.

## Response Formats

### Success (200)
Request proceeds with authentication data attached to `req`.

### Missing Token (401)
```json
{
  "status": "fail",
  "message": "Unauthorized. Missing origin_auth_key header."
}
```

### Expired Token (401)
```json
{
  "status": "fail",
  "message": "Token expired. Maximum token lifetime is 24 hours."
}
```

### Invalid Signature (401)
```json
{
  "status": "fail",
  "message": "Unauthorized. Invalid token signature."
}
```

### Revoked Token (403)
```json
{
  "status": "fail",
  "message": "Access denied. Authentication revoked due to suspicious activity."
}
```

### Multiple Origins Detected (403)
```json
{
  "status": "fail",
  "message": "Access denied. Token accessed from multiple locations. Authentication revoked."
}
```

### Server Error (500)
```json
{
  "status": "error",
  "message": "Internal server error during authentication."
}
```

## Security Logging

### Normal Access
```
[timestamp] Origin data successfully collected for user [userId]
```

### Suspicious Activity Detection
```
SECURITY ALERT: Token abc123def456... accessed from 3 unique origins
User: user-id-123, Origins: [origin1, origin2, origin3]
  Origin 1: IP=192.168.1.1, UA=Mozilla/5.0..., Country=US
  Origin 2: IP=192.168.1.2, UA=Mozilla/5.0..., Country=US
  Origin 3: IP=10.0.0.1, UA=Chrome Mobile..., Country=CN
Token authentication revoked due to multiple origin detection
```

## Collection Server Integration

The middleware expects the collection server to expose an endpoint that accepts POST requests with the following payload:

```json
{
  "tokenId": "abc123def456...",
  "originData": {
    "event": "successful_auth|suspicious_activity_detected",
    "userId": "user-123",
    "originInfo": { ... },
    "tokenFirstSeenAt": 1234567890
  },
  "collectedAt": "2026-04-10T12:30:00Z"
}
```

## Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `TOKEN_EXPIRY_HOURS` | 24 | Maximum token lifetime in hours |
| `MAX_UNIQUE_ORIGINS_PER_TOKEN` | 2 | Maximum allowed unique origins per token |
| `TOKEN_EXPIRY_MS` | 86,400,000 | Token lifetime in milliseconds |

## Performance Considerations

- **In-Memory Store**: Token records are stored in memory for fast access
- **Automatic Cleanup**: Expired token records are removed every hour
- **Non-Blocking Collection**: Origin data sending doesn't block request processing
- **Composite Key Matching**: Uses IP + User Agent for reliable origin identification

## Testing

The module exports several functions for testing:
- `tokenOriginStore`: Direct access to the token store (for testing only)
- `extractOriginInfo()`: Can be called independently to test origin extraction
- `cleanupExpiredTokens()`: Can be called to manually trigger cleanup

## Troubleshooting

### Tokens Expiring Too Quickly
- Check `JWT_SECRET` matches token generation
- Verify system time is synchronized
- Check `iat` claim in JWT is being set correctly

### Origin Not Being Tracked
- Verify `origin_auth_key` header is being sent
- Check proxy configuration if behind reverse proxy (ensure `trust proxy` is set)
- Verify Cloudflare headers are passed if using Cloudflare

### Collection Server Not Receiving Data
- Verify `ACCESS_DATA_COLLECTION_SERVER_URL` is configured
- Check `COLLECTION_SERVER_API_KEY` is correct
- Review error logs for failed POST requests
- Ensure collection server is accessible from this service

### Tokens Being Revoked Unexpectedly
- Check if User Agent changes (browser updates, incognito mode)
- Verify client isn't behind rotating proxy
- Check for geographic location changes
- Review detailed origin logs for actual access patterns

## Future Enhancements

- Database persistence for token records
- Configurable origin threshold
- IP geolocation validation
- Device fingerprinting
- Token refresh mechanism
- Rate limiting per user
- Whitelist/blacklist management
