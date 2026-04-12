# Single-Origin JWT Authentication - Quick Start Guide

## What Was Implemented

A comprehensive JWT authentication middleware that:

1. **Validates JWT tokens** from the `origin_auth_key` header
2. **Tracks request origins** using IP address + User Agent as a composite key
3. **Enforces single-location policy** - allows maximum 2 unique origins per token
4. **Auto-revokes tokens** that exceed the origin threshold (detected as suspicious activity)
5. **Sends security alerts** to an external data collection server
6. **Expires tokens** after 24 hours

## Setup Steps

### 1. Update Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and set:

```env
JWT_SECRET=your_secret_key_here
ACCESS_DATA_COLLECTION_SERVER_URL=https://your-collection-server.com/api/origins
COLLECTION_SERVER_API_KEY=your_api_key_here
```

### 2. Install Dependencies (if needed)

```bash
cd app
npm install jsonwebtoken
npm install
```

### 3. Start the Server

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

### 4. Test the Middleware

#### Get the health check (public route):
```bash
curl http://localhost:4020/health
```

#### Access protected route without token:
```bash
curl http://localhost:4020/profiles
# Returns 401: Missing origin_auth_key header
```

#### Generate a token and test protected route:
```bash
# Generate token (use your JWT library or jwt.io)
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# First request (from Location 1)
curl -H "origin_auth_key: $TOKEN" \
     -H "user-agent: Mozilla/5.0 Desktop" \
     -H "origin: https://app.example.com" \
     http://localhost:4020/profiles

# Second request (from Location 2 - different User Agent)
curl -H "origin_auth_key: $TOKEN" \
     -H "user-agent: Chrome Mobile" \
     -H "origin: https://app.example.com" \
     http://localhost:4020/profiles

# Third request (from Location 3 - triggers revocation)
curl -H "origin_auth_key: $TOKEN" \
     -H "user-agent: Safari iPad" \
     -H "origin: https://app.example.com" \
     http://localhost:4020/profiles
# Returns 403: Token accessed from multiple locations
```

## How the Middleware Works

### Request Flow

```
Request arrives
    ↓
Check if origin_auth_key header exists
    ↓
Is it a public route? → Allow (no auth needed)
    ↓
No → Extract JWT token
    ↓
Verify JWT signature and expiration
    ↓
Extract request origin info (IP, User Agent, etc.)
    ↓
Look up token in origin store
    ↓
New token? → Create tracking record with first origin
    ↓
Known token? → Add new origin (if unique)
    ↓
Check unique origin count
    ↓
> 2 unique origins? → Revoke token, send alert, return 403
    ↓
≤ 2 unique origins? → Attach user data to request, call next()
```

### Origin Tracking Logic

Origins are identified by a **composite key**: `IP_ADDRESS | USER_AGENT`

- **Same IP + Same User Agent** = Same origin (no new entry)
- **Different IP or Different User Agent** = Different origin (increments count)

**Example:**
- Desktop from Home (IP: 192.168.1.1, UA: Firefox) = Origin 1
- Mobile from Home (IP: 192.168.1.1, UA: Chrome Mobile) = Origin 2 ✓
- Desktop from Coffee Shop (IP: 10.20.30.40, UA: Firefox) = Origin 3 ❌ REVOKED

## File Structure

```
app/
├── src/v1/
│   ├── app.js (middleware integrated here)
│   └── optimization/
│       ├── singleOriginKey_auth.js (main implementation)
│       └── SINGLE_ORIGIN_AUTH_README.md (detailed docs)
├── __tests__/
│   └── unit/
│       └── singleOriginAuth.test.js (comprehensive tests)
├── .env.example
└── package.json

COLLECTION_SERVER_INTEGRATION.md (collection server setup)
```

## Running Tests

```bash
cd app
npm test -- __tests__/unit/singleOriginAuth.test.js
```

## Key Security Features

✅ **JWT Signature Verification** - Prevents token forgery
✅ **24-Hour Expiration** - Tokens must be refreshed daily
✅ **Origin Tracking** - Monitors where tokens are used
✅ **Automatic Revocation** - Suspicious activity triggers immediate lockout
✅ **Composite Key Matching** - Prevents spoofing via IP rotation
✅ **Detailed Logging** - Security alerts with full context
✅ **Async Data Collection** - Non-blocking security event logging

## Constants You Can Adjust

In `app/src/v1/optimization/singleOriginKey_auth.js`:

```javascript
TOKEN_EXPIRY_HOURS = 24                    // Token lifetime
MAX_UNIQUE_ORIGINS_PER_TOKEN = 2           // Origin threshold
TOKEN_EXPIRY_MS = 86,400,000               // Calculated from hours
```

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `JWT_SECRET` | Signs/verifies tokens | `your_secret_key` |
| `ACCESS_DATA_COLLECTION_SERVER_URL` | Where to send origin data | `https://collection.com/api` |
| `COLLECTION_SERVER_API_KEY` | Authentication for collection server | `api_key_12345` |
| `NODE_ENV` | Environment mode | `development` or `production` |

## Common Scenarios

### Legitimate User with Mobile + Desktop

**Day 1:**
- Desktop login from home (IP: 192.168.1.1, Firefox)
- Mobile login from same home (IP: 192.168.1.1, Chrome Mobile)
- ✅ Works - 2 unique origins

**Day 2:**
- Desktop login from office (IP: 203.0.113.45, Firefox) - NEW ORIGIN
- ❌ Revoked - exceeds 2 origins, suspicious activity

**Solution:** Issue new token or whitelist office IP

### Attacker Attempting Token Theft

1. Steals token via XSS or network sniffing
2. First request from attacker's location ✅ Works
3. Original user makes request from home ✅ Works - 2 origins
4. Attacker makes second request from different location ❌ Revoked

Token automatically revoked and alert sent to security team.

## Production Checklist

- [ ] Set strong `JWT_SECRET` (minimum 32 characters)
- [ ] Configure `ACCESS_DATA_COLLECTION_SERVER_URL`
- [ ] Deploy collection server to receive origin data
- [ ] Set up monitoring/alerting for security events
- [ ] Configure database for collecting origin logs
- [ ] Test token generation and validation
- [ ] Load test to ensure middleware performance
- [ ] Review and test token revocation flow
- [ ] Set up log aggregation for security alerts
- [ ] Document token refresh procedure for clients
- [ ] Set up automated token cleanup (hourly via `cleanupExpiredTokens()`)

## Troubleshooting

### Token keeps getting revoked for legitimate users

1. **Check User Agent consistency** - Browser extensions, updates, incognito mode can change UA
2. **Check Cloudflare headers** - May be masking real IP
3. **Increase MAX_UNIQUE_ORIGINS_PER_TOKEN** - Set to 3 or 4 temporarily to debug
4. **Review logs** - See what origins are being detected

### Collection server not receiving data

1. Verify `ACCESS_DATA_COLLECTION_SERVER_URL` is correct
2. Check API key matches `COLLECTION_SERVER_API_KEY`
3. Ensure collection server is online
4. Check firewall/networking rules
5. Review app logs for failed POST attempts

### High false positive rate

- Legitimate users triggering revocation unnecessarily
- **Solutions:**
  - Whitelist certain IP ranges (office, home)
  - Implement grace period for first revocation
  - Use geolocation to allow distant origins if spaced >1 hour
  - Add device fingerprinting for better origin identification

## Next Steps

1. **Deploy collection server** - See `COLLECTION_SERVER_INTEGRATION.md`
2. **Generate test tokens** - Use your auth service to create tokens
3. **Run integration tests** - `npm test`
4. **Monitor first week** - Watch logs for issues
5. **Gather user feedback** - Adjust thresholds based on real usage patterns

## Additional Resources

- Detailed middleware documentation: `app/src/v1/optimization/SINGLE_ORIGIN_AUTH_README.md`
- Collection server guide: `COLLECTION_SERVER_INTEGRATION.md`
- Test suite: `app/__tests__/unit/singleOriginAuth.test.js`
- JWT specification: https://tools.ietf.org/html/rfc7519

## Support

For issues or questions:
1. Check logs in console output
2. Review test cases for examples
3. Consult detailed README files
4. Enable debug logging by checking `console.error()` and `console.log()` output
