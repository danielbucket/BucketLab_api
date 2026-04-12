# Access Data Collection Server Integration Guide

This guide helps you set up the external access data collection server that receives origin tracking data from the BucketLab API authentication middleware.

## Overview

The access data collection server receives POST requests containing:
- Authentication events (successful logins)
- Security alerts (multi-origin access attempts)
- Origin metadata (IP, location, device info)

## Expected API Contract

### Endpoint

```
POST /api/origins
```

### Authentication

```
Headers:
  Authorization: Bearer {COLLECTION_SERVER_API_KEY}
  Content-Type: application/json
```

The API key should match the `COLLECTION_SERVER_API_KEY` environment variable in the BucketLab API.

### Request Payload

#### Successful Authentication Event
```json
{
  "tokenId": "token_abc123...",
  "originData": {
    "event": "successful_auth",
    "userId": "user-id-12345",
    "originInfo": {
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "origin": "https://app.example.com",
      "timestamp": "2026-04-10T14:30:00Z",
      "country": "US",
      "uniqueKey": "192.168.1.100|Mozilla/5.0..."
    },
    "tokenFirstSeenAt": 1712774400000
  },
  "collectedAt": "2026-04-10T14:30:00Z"
}
```

#### Suspicious Activity Alert
```json
{
  "tokenId": "token_abc123...",
  "originData": {
    "event": "suspicious_activity_detected",
    "userId": "user-id-12345",
    "tokenId": "token_abc123...",
    "uniqueOriginCount": 3,
    "threshold": 2,
    "origins": [
      {
        "ipAddress": "192.168.1.100",
        "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "origin": "https://app.example.com",
        "timestamp": "2026-04-10T14:30:00Z",
        "country": "US",
        "uniqueKey": "192.168.1.100|Mozilla/5.0..."
      },
      {
        "ipAddress": "10.0.0.50",
        "userAgent": "Chrome Mobile",
        "origin": "https://app.example.com",
        "timestamp": "2026-04-10T14:30:30Z",
        "country": "CN",
        "uniqueKey": "10.0.0.50|Chrome Mobile"
      },
      {
        "ipAddress": "203.45.67.89",
        "userAgent": "Safari/537.36",
        "origin": "https://app.example.com",
        "timestamp": "2026-04-10T14:31:00Z",
        "country": "JP",
        "uniqueKey": "203.45.67.89|Safari/537.36"
      }
    ]
  },
  "collectedAt": "2026-04-10T14:31:00Z"
}
```

### Response Format

The server should respond with a 2xx status code on success:

```json
{
  "status": "success",
  "message": "Origin data received and processed",
  "id": "event-id-12345"
}
```

On error, return 4xx/5xx with error details:

```json
{
  "status": "error",
  "message": "Invalid request payload",
  "details": "userId field is required"
}
```

## Environment Variables to Set

Add these to your `.env` file in the BucketLab API root:

```env
# Access data collection server
ACCESS_DATA_COLLECTION_SERVER_URL=https://your-collection-server.com/api/origins
COLLECTION_SERVER_API_KEY=your_secret_api_key_12345
```

## Example Implementation (Node.js/Express)

Here's a minimal example collection server:

```javascript
const express = require('express');
const app = express();

const API_KEY = process.env.COLLECTION_SERVER_API_KEY;

app.use(express.json());

// Middleware for API key validation
app.use((req, res, next) => {
  const authHeader = req.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (token !== API_KEY) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized'
    });
  }
  next();
});

app.post('/api/origins', async (req, res) => {
  try {
    const { tokenId, originData, collectedAt } = req.body;

    // Validate payload
    if (!tokenId || !originData) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    console.log('Received origin data:', {
      event: originData.event,
      userId: originData.userId,
      timestamp: collectedAt
    });

    // Store in database
    if (originData.event === 'suspicious_activity_detected') {
      console.warn('SECURITY ALERT: Multi-origin access detected', {
        userId: originData.userId,
        originCount: originData.uniqueOriginCount,
        origins: originData.origins
      });
      
      // Send notification to security team
      // await notifySecurityTeam(originData);
    }

    // TODO: Persist to database
    // await OriginLog.create({
    //   tokenId,
    //   event: originData.event,
    //   userId: originData.userId,
    //   originInfo: originData.originInfo,
    //   collectedAt
    // });

    res.status(200).json({
      status: 'success',
      message: 'Origin data received and processed',
      id: `event-${Date.now()}`
    });
  } catch (error) {
    console.error('Error processing origin data:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

const PORT = process.env.PORT || 4021;
app.listen(PORT, () => {
  console.log(`Access data collection server listening on port ${PORT}`);
});
```

## Database Schema Recommendations

### Origin Logs Table

```sql
CREATE TABLE origin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id VARCHAR(100) NOT NULL,
  event VARCHAR(50) NOT NULL, -- 'successful_auth', 'suspicious_activity_detected'
  user_id VARCHAR(100) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  origin_url TEXT,
  country VARCHAR(2),
  timestamp TIMESTAMP DEFAULT NOW(),
  collected_at TIMESTAMP NOT NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_token_id (token_id),
  INDEX idx_event (event),
  INDEX idx_timestamp (timestamp)
);
```

### Security Alerts Table

```sql
CREATE TABLE security_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id VARCHAR(100) NOT NULL UNIQUE,
  user_id VARCHAR(100) NOT NULL,
  alert_type VARCHAR(50) DEFAULT 'multi_origin_access',
  origin_count INT NOT NULL,
  threshold INT NOT NULL,
  origins JSONB NOT NULL,
  alert_timestamp TIMESTAMP DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP,
  notes TEXT,
  INDEX idx_user_id (user_id),
  INDEX idx_token_id (token_id),
  INDEX idx_resolved (resolved)
);
```

## Data Analysis Queries

### Find users with suspicious activity

```sql
SELECT user_id, COUNT(*) as alert_count, MAX(alert_timestamp) as latest_alert
FROM security_alerts
WHERE resolved = FALSE
GROUP BY user_id
ORDER BY alert_count DESC;
```

### Track origin patterns for a user

```sql
SELECT ip_address, country, COUNT(*) as login_count, 
       COUNT(DISTINCT DATE(collected_at)) as days_active
FROM origin_logs
WHERE user_id = 'user-123'
  AND event = 'successful_auth'
  AND collected_at > NOW() - INTERVAL '30 days'
GROUP BY ip_address, country
ORDER BY login_count DESC;
```

### Identify impossible travel scenarios

```sql
WITH ranked_logins AS (
  SELECT user_id, ip_address, country, collected_at,
         LAG(ip_address) OVER (PARTITION BY user_id ORDER BY collected_at) as prev_ip,
         LAG(country) OVER (PARTITION BY user_id ORDER BY collected_at) as prev_country,
         LAG(collected_at) OVER (PARTITION BY user_id ORDER BY collected_at) as prev_time
  FROM origin_logs
  WHERE event = 'successful_auth'
)
SELECT user_id, prev_country, country, prev_time, collected_at,
       EXTRACT(EPOCH FROM (collected_at - prev_time))/60 as minutes_between
FROM ranked_logins
WHERE prev_country != country
  AND EXTRACT(EPOCH FROM (collected_at - prev_time))/60 < 60; -- Less than 1 hour between countries
```

## Deployment Checklist

- [ ] Create `.env` file with `COLLECTION_SERVER_API_KEY` and `ACCESS_DATA_COLLECTION_SERVER_URL`
- [ ] Set up database (PostgreSQL recommended)
- [ ] Deploy collection server
- [ ] Configure firewall rules to allow BucketLab API to POST
- [ ] Set up logging and monitoring
- [ ] Create alerts for suspicious activities
- [ ] Test end-to-end with sample tokens
- [ ] Set up automated cleanup of old logs (e.g., delete logs older than 90 days)
- [ ] Document API contract for team

## Monitoring & Alerting

Monitor these metrics:

1. **Failed Authentication Rate**: Track unauthorized attempts
2. **Multi-Origin Detections**: Number of suspicious activities per day
3. **False Positive Rate**: Legitimate multi-origin access (e.g., user with desktop + mobile)
4. **API Response Time**: Ensure collection doesn't impact BucketLab API performance
5. **Database Size**: Monitor storage growth of origin logs

## Security Considerations

- API key should be rotated periodically
- Collection server should use HTTPS only
- Implement rate limiting on the collection endpoint
- Sanitize all inputs before storing
- Encrypt sensitive fields in database (IP, user agent)
- Implement proper access controls for viewing origin data
- Follow GDPR/CCPA regulations for data retention
- Set up log rotation and archival for old data

## Troubleshooting

### Collection server not receiving data

1. Check `ACCESS_DATA_COLLECTION_SERVER_URL` is correct
2. Verify API key matches `COLLECTION_SERVER_API_KEY`
3. Check network connectivity between BucketLab API and collection server
4. Review BucketLab API logs for failed POST requests
5. Ensure collection server is returning 2xx status codes

### False positives (legitimate multi-origin access)

1. Increase `MAX_UNIQUE_ORIGINS_PER_TOKEN` threshold (requires code change)
2. Implement whitelist for known device/location combinations
3. Add time-based logic (e.g., allow multiple origins if spaced >1 hour apart)
4. Use geolocation to detect impossible travel, not just origin count

### Database growing too large

1. Implement data retention policy (e.g., delete logs > 90 days old)
2. Archive old logs to cold storage
3. Add database indexes for common queries
4. Consider partitioning large tables by date
