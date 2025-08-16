# BucketLab API Ubuntu Server Deployment Guide

## Issue: "Cannot find module '../controllers/MessagesController'"

### Root Cause Analysis

This error occurs when deploying Docker containers from macOS to Ubuntu Server due to:

1. **File System Case Sensitivity**: macOS uses a case-insensitive file system, while Ubuntu Linux uses case-sensitive
2. **Volume Mount Issues**: Docker volume mounts behave differently between macOS and Linux
3. **File Permission Differences**: User ID and group ID mismatches between host and container

### Solutions Provided

#### 1. Production Compose File (`compose.production.yaml`)

- Uses custom Dockerfiles that copy files instead of mounting volumes
- Eliminates case sensitivity and permission issues
- Optimized for production deployment

#### 2. Individual Service Dockerfiles

- `Dockerfile.app` - App Service (API Gateway)
- `Dockerfile.auth` - Authentication Service
- `Dockerfile.laboratory` - Laboratory Service (Messages)

#### 3. Deployment Script (`deploy-ubuntu.sh`)

- Automated deployment process for Ubuntu Server
- Health checks and validation
- Error handling and logging

### Quick Fix Instructions

1. **Use the production compose file:**

   ```bash
   docker-compose -f compose.production.yaml up --build -d
   ```

2. **Or run the deployment script:**
   ```bash
   ./deploy-ubuntu.sh
   ```

### Manual Verification Steps

If you still encounter issues, verify these items:

1. **Check file structure in container:**

   ```bash
   docker exec -it laboratory_server find /laboratory/src/v1/controllers -name "*.js"
   ```

2. **Verify MessagesController index.js:**

   ```bash
   docker exec -it laboratory_server cat /laboratory/src/v1/controllers/MessagesController/index.js
   ```

3. **Test module loading:**

   ```bash
   docker exec -it laboratory_server node -e "console.log(require('/laboratory/src/v1/controllers/MessagesController'))"
   ```

4. **Check logs for specific errors:**
   ```bash
   docker logs laboratory_server --tail 50
   ```

### Alternative Quick Fix (Volume Mount)

If you must use volume mounts, try this configuration in your compose file:

```yaml
laboratory_server:
  container_name: laboratory_server
  image: node:22.14.0-alpine
  working_dir: /laboratory
  volumes:
    - type: bind
      source: ./laboratory
      target: /laboratory
      consistency: cached
  command: sh -c "ls -la /laboratory/src/v1/controllers/ && npm run start:prod"
```

### File Structure Verification

The correct structure should be:

```
laboratory/src/v1/controllers/
├── MessagesController/
│   ├── index.js          ← Main export file
│   ├── GET_/
│   │   ├── index.js
│   │   ├── get_all_messages.js
│   │   ├── get_message_by_message_id.js
│   │   ├── get_messages_by_receiver_id.js
│   │   └── get_messages_by_sender_id.js
│   ├── POST_/
│   │   ├── index.js
│   │   └── new_message.js
│   ├── PATCH_/
│   │   ├── index.js
│   │   └── update_message_by_message_id.js
│   └── DELETE_/
│       ├── index.js
│       └── delete_message_by_message_id.js
└── ProfileController/
```

### Debugging Commands

1. **Container file permissions:**

   ```bash
   docker exec -it laboratory_server ls -la /laboratory/src/v1/controllers/
   ```

2. **Node.js module resolution:**

   ```bash
   docker exec -it laboratory_server node -e "console.log(require.resolve('../controllers/MessagesController'))"
   ```

3. **Full container inspection:**
   ```bash
   docker exec -it laboratory_server sh
   cd /laboratory/src/v1
   ls -la controllers/MessagesController/
   ```

### Contact

If issues persist after following this guide, check:

- Container logs: `docker logs laboratory_server`
- Host file permissions: `ls -la laboratory/src/v1/controllers/`
- Docker daemon logs: `journalctl -u docker.service`
