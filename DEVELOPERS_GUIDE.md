# Developer Guide: Using the Single-Origin JWT Authentication Middleware

## For API Consumers (Frontend Developers)

### Getting a Token

1. **Login/Register**
   ```javascript
   // Send credentials to auth service
   const response = await fetch('https://api.example.com/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email: 'user@example.com', password: '...' })
   });
   
   const { token } = await response.json();
   // Save token to localStorage/sessionStorage
   localStorage.setItem('api_token', token);
   ```

2. **Making Protected Requests**
   ```javascript
   const token = localStorage.getItem('api_token');
   
   const response = await fetch('https://api.example.com/profiles', {
     method: 'GET',
     headers: {
       'Content-Type': 'application/json',
       'origin_auth_key': token  // ← Required header!
     }
   });
   ```

### Handling Authentication Errors

```javascript
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('api_token');
  
  const response = await fetch(`https://api.example.com${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'origin_auth_key': token
    }
  });
  
  if (response.status === 401) {
    // Token missing or invalid
    // Redirect to login
    window.location.href = '/login';
    return;
  }
  
  if (response.status === 403) {
    // Token revoked due to multi-location access
    console.error('Authentication revoked. Your token was used from multiple locations.');
    console.error('For security, you have been logged out. Please log in again.');
    localStorage.removeItem('api_token');
    window.location.href = '/login';
    return;
  }
  
  return response.json();
}
```

### Expected Behavior

**Legitimate Usage:**
- Desktop browser from home ✓
- Mobile app from same location ✓ (different User Agent = new origin)
- Both continue to work indefinitely

**Suspicious Pattern:**
- Desktop from home ✓
- Mobile from home ✓
- Tablet from office ✗ → Token revoked!

### Configuring Multiple Devices (If Needed)

If legitimate business requires more than 2 unique origins:

1. **Request admin action** to whitelist origin
2. **Refresh token** - Get new token that can access from additional location
3. **Use VPN** - Maintain same IP address across locations (less ideal for security)

---

## For Backend Developers

### Accessing Authenticated User Data

```javascript
// In your route handlers, req.user is populated:
app.get('/profiles/:id', singleOriginKey_auth, (req, res) => {
  // req.user contains decoded JWT payload
  console.log(req.user.id);      // User ID
  console.log(req.user.email);   // User email
  
  // req.originData contains origin information
  console.log(req.originData.ipAddress);    // e.g., "192.168.1.1"
  console.log(req.originData.userAgent);    // e.g., "Mozilla/5.0..."
  console.log(req.originData.country);      // e.g., "US"
  console.log(req.originData.timestamp);    // ISO string
  
  // Your handler logic...
  res.json({ profile: { id: req.user.id } });
});
```

### Creating Protected Routes

```javascript
const express = require('express');
const { singleOriginKey_auth } = require('./optimization/singleOriginKey_auth');

const router = express.Router();

// This route requires authentication
router.get('/user-profile', singleOriginKey_auth, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    lastOrigin: req.originData
  });
});

// This route is public (no middleware needed)
router.get('/public-info', (req, res) => {
  res.json({ info: 'This is public' });
});

// Conditional protection
router.get('/maybe-protected', (req, res) => {
  if (req.get('origin_auth_key')) {
    // Authentication header provided
    return res.json({ 
      status: 'authenticated', 
      user: req.user 
    });
  }
  // No auth header
  return res.json({ 
    status: 'public_access' 
  });
});

module.exports = router;
```

### Logging and Monitoring

```javascript
// Log successful authenticated requests
app.get('/api/action', singleOriginKey_auth, (req, res) => {
  console.log({
    event: 'authenticated_request',
    user: req.user.id,
    endpoint: req.path,
    origin: req.originData.ipAddress,
    country: req.originData.country,
    timestamp: req.originData.timestamp
  });
  
  // Your handler...
});

// Monitor for revocation events (check app logs)
// When a token is revoked, you'll see:
// "SECURITY ALERT: Token abc123... accessed from 3 unique origins"
```

### Accessing the Token Store (Testing Only)

```javascript
const { tokenOriginStore } = require('./optimization/singleOriginKey_auth');

// Check how many tokens are currently tracked
console.log(`Active tokens: ${tokenOriginStore.size}`);

// Get details about a specific token (for debugging)
const tokenInfo = tokenOriginStore.get(someToken);
console.log(`Origins for this token:`, Array.from(tokenInfo.origins));
console.log(`First seen at:`, new Date(tokenInfo.firstSeenAt));
console.log(`Revoked:`, tokenInfo.isRevoked);

// WARNING: Only for testing/debugging!
// Don't rely on this in production
```

---

## For Security/DevOps Engineers

### Monitoring Collection Server Integration

```javascript
// The middleware sends data to collection server
// Monitor that these requests succeed:

// Example collection server setup
app.post('/api/origins', (req, res) => {
  const { tokenId, originData, collectedAt } = req.body;
  
  // Store in database
  if (originData.event === 'suspicious_activity_detected') {
    // ALERT! Send notification to security team
    alertSecurityTeam({
      severity: 'HIGH',
      event: 'multi_origin_access',
      userId: originData.userId,
      originCount: originData.uniqueOriginCount
    });
  }
  
  res.json({ status: 'success' });
});
```

### Setting Up Alerts

```javascript
// Example: Monitor for specific patterns
const suspiciousPatterns = {
  'impossible_travel': {
    // User in different countries within impossible time
    check: (origins) => {
      // Implement logic
    }
  },
  'rapid_rotation': {
    // Many origins in short time
    check: (origins) => {
      // Implement logic
    }
  },
  'datacenter_access': {
    // Access from known datacenter IPs
    check: (origins) => {
      // Implement logic
    }
  }
};
```

### Performance Monitoring

```javascript
// Track middleware performance
const startTime = Date.now();

app.use((req, res, next) => {
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    if (duration > 10) {
      console.warn(`Slow auth middleware: ${duration}ms`);
    }
  });
  next();
});
```

### Database Maintenance

```javascript
// For production with collection server:

// Daily: Archive old origin logs
const archiveOldLogs = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await OriginLog.deleteMany({ 
    collectedAt: { $lt: thirtyDaysAgo },
    event: 'successful_auth'  // Keep alerts longer
  });
};

// Weekly: Analyze patterns
const generateSecurityReport = async () => {
  const report = await OriginLog.aggregate([
    {
      $group: {
        _id: '$userId',
        totalLogins: { $sum: 1 },
        uniqueOrigins: { $addToSet: '$ipAddress' },
        countries: { $addToSet: '$country' }
      }
    },
    {
      $match: {
        uniqueOrigins: { $size: { $gt: 2 } }
      }
    }
  ]);
  return report;
};
```

---

## For QA/Testing Teams

### Testing Authentication

```javascript
// Test 1: Public route access
test('Health endpoint should be public', async () => {
  const res = await request(app).get('/health');
  expect(res.status).toBe(200);
  expect(res.body.status).toBe('healthy');
});

// Test 2: Protected route without token
test('Protected route should require token', async () => {
  const res = await request(app).get('/profiles');
  expect(res.status).toBe(401);
  expect(res.body.message).toContain('Missing origin_auth_key');
});

// Test 3: Protected route with valid token
test('Protected route with valid token should work', async () => {
  const token = generateTestToken({ id: 'test-user' });
  
  const res = await request(app)
    .get('/profiles')
    .set('origin_auth_key', token)
    .set('user-agent', 'TestAgent/1.0');
    
  expect(res.status).not.toBe(401);
});

// Test 4: Multi-origin detection
test('Should revoke token on 3rd unique origin', async () => {
  const token = generateTestToken({ id: 'test-user' });
  
  // Request 1: Desktop
  await request(app)
    .get('/profiles')
    .set('origin_auth_key', token)
    .set('user-agent', 'Mozilla Desktop');
  
  // Request 2: Mobile (different UA)
  await request(app)
    .get('/profiles')
    .set('origin_auth_key', token)
    .set('user-agent', 'Chrome Mobile');
  
  // Request 3: Tablet (should be revoked)
  const res = await request(app)
    .get('/profiles')
    .set('origin_auth_key', token)
    .set('user-agent', 'Safari iPad');
    
  expect(res.status).toBe(403);
  expect(res.body.message).toContain('multiple locations');
});

// Test 5: Revoked token denial
test('Revoked token should be denied on next request', async () => {
  const token = generateTestToken({ id: 'test-user' });
  
  // Revoke the token (trigger with 3 unique origins)
  // ... (trigger revocation)
  
  // Any subsequent request should fail
  const res = await request(app)
    .get('/profiles')
    .set('origin_auth_key', token)
    .expect(403);
    
  expect(res.body.message).toContain('revoked');
});
```

### Manual Testing Commands

```bash
# Test 1: Public health check
curl -i http://localhost:4020/health

# Test 2: Protected route without token
curl -i http://localhost:4020/profiles

# Test 3: Generate token (using your auth service)
TOKEN=$(curl -X POST http://localhost:4020/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"..."}' \
  | jq -r '.token')

# Test 4: Protected route with token
curl -i \
  -H "origin_auth_key: $TOKEN" \
  -H "user-agent: Mozilla/5.0 Desktop" \
  http://localhost:4020/profiles

# Test 5: Second origin (different UA)
curl -i \
  -H "origin_auth_key: $TOKEN" \
  -H "user-agent: Chrome Mobile" \
  http://localhost:4020/profiles

# Test 6: Third origin (should fail)
curl -i \
  -H "origin_auth_key: $TOKEN" \
  -H "user-agent: Safari iPad" \
  http://localhost:4020/profiles
# Should return 403 Forbidden
```

### Expected Error Scenarios

| Scenario | Status | Message |
|----------|--------|---------|
| No token, protected route | 401 | Missing origin_auth_key header |
| Expired token | 401 | Token expired. Maximum token lifetime is 24 hours |
| Invalid signature | 401 | Unauthorized. Invalid token signature |
| Revoked token | 403 | Access denied. Authentication revoked |
| Multi-origin access | 403 | Access denied. Token accessed from multiple locations |
| Internal error | 500 | Internal server error during authentication |

---

## Common Issues & Solutions

### Issue: Token works locally but not in production

**Causes:**
- Different `JWT_SECRET` values
- IP address detection issues behind proxy
- User Agent changes (browser updates)

**Solutions:**
1. Verify `JWT_SECRET` matches token generation service
2. Enable `trust proxy` in Express (already done in app.js)
3. Check Cloudflare headers are being forwarded

### Issue: Legitimate users getting revoked frequently

**Causes:**
- Browser extensions changing User Agent
- Incognito mode (different User Agent)
- VPN/Proxy rotation
- Antivirus software modifying headers

**Solutions:**
1. Increase `MAX_UNIQUE_ORIGINS_PER_TOKEN` to 3
2. Implement whitelist for known office IPs
3. Use more sophisticated origin identification (device fingerprinting)
4. Add time-based logic (only revoke if within 5 minutes)

### Issue: Collection server not receiving data

**Causes:**
- Network connectivity issue
- Wrong URL in `ACCESS_DATA_COLLECTION_SERVER_URL`
- API key mismatch

**Solutions:**
1. Test collection server is accessible:
   ```bash
   curl -H "Authorization: Bearer YOUR_KEY" \
        https://collection.example.com/api/origins
   ```
2. Check API logs for failed POST requests
3. Verify environment variables are set

---

## Integration Examples

### Express.js (Your Current Setup)
See examples in this guide above.

### React Frontend
```javascript
// React hook for authenticated API calls
import { useAuth } from './useAuth';

export function useApi() {
  const { token } = useAuth();
  
  return async (endpoint, options = {}) => {
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}${endpoint}`,
      {
        ...options,
        headers: {
          ...options.headers,
          'origin_auth_key': token
        }
      }
    );
    
    if (response.status === 403) {
      // Token revoked
      throw new Error('Session revoked for security');
    }
    
    return response.json();
  };
}
```

### Python Backend Client
```python
import requests

class BucketLabAPIClient:
    def __init__(self, api_url, token):
        self.api_url = api_url
        self.token = token
    
    def request(self, method, endpoint, **kwargs):
        headers = kwargs.pop('headers', {})
        headers['origin_auth_key'] = self.token
        
        response = requests.request(
            method,
            f'{self.api_url}{endpoint}',
            headers=headers,
            **kwargs
        )
        
        if response.status_code == 403:
            raise Exception('Authentication revoked')
        
        response.raise_for_status()
        return response.json()

# Usage
client = BucketLabAPIClient('https://api.example.com', token)
profiles = client.request('GET', '/profiles')
```

---

## Reference

- **Full Documentation**: See `SINGLE_ORIGIN_AUTH_README.md`
- **Quick Start**: See `SINGLE_ORIGIN_AUTH_QUICKSTART.md`
- **Architecture**: See `ARCHITECTURE_DIAGRAM.md`
- **Collection Server**: See `COLLECTION_SERVER_INTEGRATION.md`
- **Implementation Details**: `app/src/v1/optimization/singleOriginKey_auth.js`
- **Tests**: `app/__tests__/unit/singleOriginAuth.test.js`
