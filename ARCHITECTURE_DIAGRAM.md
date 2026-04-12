# Single-Origin JWT Authentication Architecture

## System Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         BucketLab API Gateway                           │
│                          (Port 4020)                                    │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │                      Express.js Middleware Stack              │   │
│  ├────────────────────────────────────────────────────────────────┤   │
│  │ 1. CORS Middleware (corsConfig)                              │   │
│  │ 2. Rate Limiter (rateLimiter)                                │   │
│  │ 3. Request Time Attachment                                  │   │
│  │ 4. >>> SINGLE ORIGIN JWT AUTHENTICATION <<<                │   │
│  │    - Extract origin_auth_key header                          │   │
│  │    - Verify JWT signature                                    │   │
│  │    - Check token expiration (24h max)                        │   │
│  │    - Extract origin info (IP, UA, location)                  │   │
│  │    - Track origin in memory store                            │   │
│  │    - Validate unique origins (max 2)                         │   │
│  │    - Send to data collection server (async)                  │   │
│  │ 5. Routing to Microservices                                  │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                              ↓                                          │
│                        Request Allowed                                  │
│                     OR 401/403 Response                                 │
└─────────────────────────────────────────────────────────────────────────┘
        ↓                                        ↓
  ┌──────────────────────────────────┐  ┌──────────────────────────────────┐
  │  Microservices                   │  │ Access Data Collection Server     │
  │  - /profiles                     │  │ (Separate Server)                │
  │  - /auth                         │  │                                  │
  │  - /messages                     │  │ Receives:                        │
  │  - /laboratory                   │  │ - Successful auth events         │
  └──────────────────────────────────┘  │ - Security alerts                │
                                        │ - Origin metadata                │
                                        │ - Multi-origin detections        │
                                        │                                  │
                                        │ Stores in Database:              │
                                        │ - origin_logs table              │
                                        │ - security_alerts table          │
                                        └──────────────────────────────────┘
                                                  ↓
                                        ┌──────────────────────────────────┐
                                        │   Analytics & Monitoring         │
                                        │ - Track user locations           │
                                        │ - Detect suspicious patterns     │
                                        │ - Generate security reports      │
                                        └──────────────────────────────────┘
```

## Request Processing Flow

### Successful Request (Single Origin)

```
Client Request
  ↓
  Header: origin_auth_key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ↓
Extract Token from Header
  ↓
Verify JWT Signature
  ✓ Valid
  ↓
Check Token Expiration
  ✓ Not expired (< 24 hours)
  ↓
Extract Origin Info
  IP: 192.168.1.1
  UA: Mozilla/5.0 Desktop
  Location: US
  ↓
First Request with This Token?
  YES → Create token record with this origin
  ↓
Token Store:
{
  token: {
    origins: Set(["192.168.1.1|Mozilla..."]),
    originDetails: [{ ip, ua, country, timestamp }],
    firstSeenAt: 1712774400000,
    userId: "user-123",
    isRevoked: false
  }
}
  ↓
Send to Collection Server (async):
{
  event: "successful_auth",
  userId: "user-123",
  originInfo: { ... }
}
  ↓
Attach to Request:
  req.user = { id, email, ... }
  req.originData = { ipAddress, userAgent, ... }
  req.authToken = token
  ↓
Next Middleware/Route Handler
  ↓
✓ 200 OK Response
```

### Suspicious Activity (Multiple Origins)

```
Client Request #3
  ↓
Header: origin_auth_key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ↓
Extract Token
  ✓ Valid signature
  ✓ Not expired
  ↓
Extract Origin Info
  IP: 203.45.67.89         ← DIFFERENT IP
  UA: Safari iPad          ← DIFFERENT USER AGENT
  Location: CN
  ↓
Check Token Store
  Token exists, fetch record
  ↓
Current Origins: 2 (Desktop + Mobile from home)
New Origin: 3rd unique origin detected!
  ↓
CHECK THRESHOLD:
  3 > MAX_UNIQUE_ORIGINS_PER_TOKEN (2)
  ↓
SECURITY ALERT TRIGGERED!
  ↓
Log Detailed Information:
  "SECURITY ALERT: Token abc123... accessed from 3 unique origins"
  "User: user-123"
  "Origin 1: IP=192.168.1.1, UA=Mozilla Desktop, Country=US"
  "Origin 2: IP=192.168.1.1, UA=Chrome Mobile, Country=US"
  "Origin 3: IP=203.45.67.89, UA=Safari iPad, Country=CN"
  ↓
Revoke Token:
  token.isRevoked = true
  Remove from store
  ↓
Send Alert to Collection Server:
{
  event: "suspicious_activity_detected",
  userId: "user-123",
  uniqueOriginCount: 3,
  threshold: 2,
  origins: [...]
}
  ↓
Return Response:
  403 Forbidden
  {
    status: "fail",
    message: "Access denied. Token accessed from multiple 
              locations. Authentication revoked."
  }
  ↓
Future Requests with Same Token:
  ✓ Valid signature, not expired
  But: token.isRevoked = true
  ↓
Return 403 Immediately:
  "Access denied. Token has been revoked due to 
   suspicious activity."
```

## Data Flow - Origin Tracking

```
Request
  ↓
┌─────────────────────────────────────────┐
│   extractOriginInfo(req)                │
│                                         │
│ Collects:                              │
│ - req.ip (or proxy headers)            │
│ - req.get('user-agent')                │
│ - req.get('origin') / req.get('referer')
│ - req.get('cf-ipcountry')              │
│ - Current timestamp                    │
│                                         │
│ Creates:                               │
│ {                                      │
│   ipAddress: "192.168.1.1",           │
│   userAgent: "Mozilla/5.0...",        │
│   origin: "https://app.com",          │
│   timestamp: "2026-04-10T14:30Z",     │
│   country: "US",                      │
│   uniqueKey: "192.168.1.1|Mozilla..." │
│ }                                      │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│   Update Token Store                    │
│                                         │
│ If new token:                          │
│   tokenOriginStore.set(token, {        │
│     origins: Set(uniqueKey),           │
│     originDetails: [originInfo],       │
│     firstSeenAt: Date.now(),           │
│     userId: decoded.id,                │
│     isRevoked: false                   │
│   })                                   │
│                                         │
│ If known token:                        │
│   Add new uniqueKey to origins Set     │
│   Push originInfo to originDetails[]   │
│   Check size of origins Set            │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│   Send to Collection Server (async)     │
│                                         │
│ POST /api/origins                      │
│ Body: {                                │
│   tokenId: "abc123...",               │
│   originData: { ... },                │
│   collectedAt: timestamp              │
│ }                                      │
│                                         │
│ Non-blocking:                         │
│ - Doesn't delay request                │
│ - Errors logged but not returned       │
└─────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────┐
│   Collection Server                    │
│   (External Service)                   │
│                                         │
│ Stores in Database:                   │
│ - origin_logs (all auth events)       │
│ - security_alerts (multi-origin)      │
│                                         │
│ Performs:                              │
│ - Logging                             │
│ - Analytics                           │
│ - Notifications                       │
└─────────────────────────────────────────┘
```

## Token Lifecycle

```
TOKEN CREATION
    ↓
User logs in, receives JWT token
  Payload: { id, email, iat, exp }
  Lifetime: 24 hours from iat
    ↓
TOKEN FIRST USE
    ↓
Client sends request with origin_auth_key header
Middleware verifies signature, checks expiration
Token record created in memory store
First origin tracked
  ↓
TOKEN IN USE (Same Origin)
    ↓
Multiple requests from same origin
(Same IP + Same User Agent)
No new entries added to token record
  ↓
TOKEN IN USE (New Origin)
    ↓
Request from new origin (different IP or UA)
New unique key added to origins Set
Count increases: origins.size += 1
Check threshold (MAX 2 allowed)
    ↓
              ┌─────────────────────┐
              │                     │
              ▼                     ▼
        UNDER LIMIT          EXCEEDS LIMIT
          (≤ 2)                  (> 2)
            │                      │
            ▼                      ▼
      Token Valid            SECURITY ALERT
        Continue          Detailed logging
      Next request        Send to collection
                          Revoke immediately
                          Return 403
            │                      │
            └─────────┬────────────┘
                      ▼
              TOKEN REVOKED/EXPIRED
                      ↓
            isRevoked = true
            OR older than 24h
                      ↓
    (Future requests return 401/403)
                      ↓
        CLEANUP (hourly scheduled)
                      ↓
    Remove from tokenOriginStore
    Memory freed up
```

## Memory Management

```
IN-MEMORY STORAGE (tokenOriginStore)

Map Structure:
{
  "token_string_1": {
    origins: Set(["ip1|ua1", "ip2|ua2"]),
    originDetails: [
      { ipAddress, userAgent, origin, timestamp, country, uniqueKey },
      { ipAddress, userAgent, origin, timestamp, country, uniqueKey }
    ],
    firstSeenAt: 1712774400000,
    userId: "user-123",
    isRevoked: false
  },
  "token_string_2": { ... },
  "token_string_3": { ... }
}

CLEANUP PROCESS (runs every 1 hour):
1. Iterate through all entries
2. Check: now - firstSeenAt > TOKEN_EXPIRY_MS
3. If true: tokenOriginStore.delete(token)
4. Log: "Cleaned up X expired token records"

Memory Impact:
- Per token: ~500 bytes (depends on origin details stored)
- 1000 active tokens ≈ 500KB
- 10000 active tokens ≈ 5MB
- Automatic cleanup prevents memory leaks
```

## Security Model

```
THREAT MODEL 1: Token Theft via XSS/Network
─────────────────────────────────────────

Attacker gains token: eyJhbGciOiJIUzI1NiI...

Request 1 from attacker's location
  ✓ Verified, new origin tracked (1/2)
  
Original user makes legitimate request
  ✓ Verified, different origin tracked (2/2)
  
Attacker makes 2nd request from different location
  ✗ Detected! 3rd unique origin
  ✗ Token immediately revoked
  ✗ Alert sent to security team
  ✗ Original user's subsequent requests blocked
  
Result: Attack detected and mitigated in < 1 second


THREAT MODEL 2: Man-in-the-Middle
─────────────────────────────────

Attacker intercepts traffic, modifies token
Modified token sent with request

JWT Signature Verification FAILS
✗ Return 401 Unauthorized

Result: Attack blocked by crypto, no token tracking needed


THREAT MODEL 3: Impossible Travel
──────────────────────────────────

Request from New York (US)
  ✓ Approved

Immediately after, request from Tokyo (JP)
  Would require impossible travel time
  
Current mitigation: Tracked in collection server
  Database can detect if origins are too far apart
  for travel time between requests
  
Future enhancement: Calculate travel time in middleware


THREAT MODEL 4: Proxy Rotation Attack
──────────────────────────────────────

Attacker uses proxy/VPN to appear from different IPs
Request 1: IP 10.0.0.1 ✓ (Origin 1)
Request 2: IP 10.0.0.2 ✓ (Origin 2)
Request 3: IP 10.0.0.3 ✗ (Origin 3 - Revoked!)

Result: Attack limited to 2 requests before detection


TRUST BOUNDARIES
────────────────

1. JWT Secret
   - Trust: Only server knows secret
   - Protect: Store in environment variable, rotate periodically

2. Origin Information
   - Trust: IP address from proxy headers (trust proxy enabled)
   - Trust: User-Agent from headers (client-controlled)
   - Mitigation: Composite key requires BOTH to match

3. Request Headers
   - Trust: Limited trust (can be spoofed)
   - Mitigation: Only used with JWT verification + signature

4. Collection Server
   - Trust: Same organization, HTTPS only
   - Protect: API key authentication
   - Mitigation: Non-blocking (failures don't affect auth)
```

## Performance Characteristics

```
OPERATION                    TIME        NOTES
────────────────────────────────────────────────────
JWT Verify                   < 1ms      Cryptographic
Extract Origin               < 0.5ms    String operations
Token Store Lookup           < 0.1ms    HashMap O(1)
Origin Uniqueness Check      < 0.2ms    Set operations
Total Middleware             < 2ms      Typical case
Collection Server POST       100-500ms  Async, non-blocking

SCALABILITY
───────────
Tokens in Memory:           Scales linearly with active users
Origins per Token:          Fixed (max 2 tracked)
Request Latency:            < 2ms additional overhead
CPU Usage:                  Minimal (JWT verify is only CPU work)
Memory Usage:               500KB per 1000 active tokens
Database Queries:           None (memory-based)
```

## Integration Points

```
CLIENT                    BucketLab API              Collection Server
  │                            │                            │
  │  1. Generate Token         │                            │
  ├────────────────────────────→ /auth service             │
  │                            │                            │
  │  2. Get JWT Token          │                            │
  │←────────────────────────────┤                            │
  │                            │                            │
  │  3. Protected Request       │                            │
  │  + origin_auth_key header   │                            │
  ├────────────────────────────→ singleOriginKey_auth       │
  │                            │ (middleware)               │
  │                            │                            │
  │                            │  4. Extract & Validate    │
  │                            │  5. Check Origins         │
  │                            │  6. Track in Memory       │
  │                            │                            │
  │                            │  7. POST Origin Data      │
  │                            ├───────────────────────────→
  │                            │                            │
  │                            │  8. Store in Database     │
  │                            │  9. Send Alert (if needed)│
  │                            │←───────────────────────────┤
  │                            │  10. Response OK          │
  │                            │                            │
  │  11. Proxied to Service    │                            │
  │←────────────────────────────┤                            │
  │  Response                  │                            │
```

## Deployment Architecture

```
Production Environment
━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────┐
│         Cloudflare (DDoS Protection, Caching)           │
│         api.example.com                                 │
└─────────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│         Load Balancer                                    │
│         (Routes to multiple API instances)              │
└─────────────────────────────────────────────────────────┘
                     ↓
        ┌────────────┴────────────┐
        ↓                         ↓
┌──────────────────┐     ┌──────────────────┐
│ BucketLab API    │     │ BucketLab API    │
│ Instance 1       │     │ Instance 2       │
│                  │     │                  │
│ Express Server   │     │ Express Server   │
│ Port 4020        │     │ Port 4020        │
│                  │     │                  │
│ ┌──────────────┐ │     │ ┌──────────────┐ │
│ │ Auth         │ │     │ │ Auth         │ │
│ │ Middleware   │ │     │ │ Middleware   │ │
│ │              │ │     │ │              │ │
│ │ Tracks       │ │     │ │ Tracks       │ │
│ │ Origins      │ │     │ │ Origins      │ │
│ └──────────────┘ │     │ └──────────────┘ │
└──────────────────┘     └──────────────────┘
        │                         │
        └────────────┬────────────┘
                     ↓
        ┌────────────────────────────┐
        │  Shared Message Queue/     │
        │  Event Bus (optional)      │
        │  (for syncing revocations) │
        └────────────────────────────┘
                     ↓
        ┌────────────────────────────┐
        │ Collection Server          │
        │ (Separate Deployment)      │
        │                            │
        │ - Receives origin data     │
        │ - Stores in Database       │
        │ - Performs analytics       │
        │ - Sends alerts             │
        └────────────────────────────┘
                     ↓
        ┌────────────┴────────────┐
        ↓                         ↓
    ┌────────────┐         ┌────────────┐
    │ PostgreSQL │         │ Redis      │
    │ (Logs)     │         │ (Cache)    │
    └────────────┘         └────────────┘

NOTE: In-memory token store (tokenOriginStore) on each instance
means each API instance tracks origins independently. 
For sticky sessions or sync across instances, use shared cache.
```
