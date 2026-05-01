# Environment Configuration - Quick Reference

## TL;DR

| For | File | Command |
|-----|------|---------|
| **Development** (local work) | `.env.dev` | `docker compose -f compose.dev.yaml up --build` |
| **Production** (deployed) | `.env` | `docker compose -f compose.production.yaml up --build` |

---

## What Goes in Each File

### `.env.dev` (Development)
```bash
MONGO_DB_USERNAME=empirical_explorer
MONGO_DB_PASSWORD=hg48s.2s9dFF.EZpoopin
MONGO_DB_DATABASE=bucketlab
JWT_SECRET=your_dev_secret_key_here
JWT_EXPIRES_IN=7d
TUNNEL_TOKEN=your_development_tunnel_token
APP_RUN_MODE=development
```

### `.env` (Production)
```bash
MONGO_DB_USERNAME=prod_db_user
MONGO_DB_PASSWORD=strong_secure_password_here
MONGO_DB_DATABASE=bucketlab_prod
JWT_SECRET=secure_random_jwt_secret_here
JWT_EXPIRES_IN=24h
TUNNEL_TOKEN=your_production_tunnel_token
APP_RUN_MODE=production
```

---

## Which File to Use When

- **Working on your local machine?** → Use `.env.dev`
- **Deploying to production server?** → Use `.env`
- **Writing documentation?** → Mention both, explain the difference
- **Running tests?** → Services use `.env.dev` automatically

---

## Files That Reference These Environment Files

1. **compose.dev.yaml** - Uses `.env.dev`
   ```yaml
   cloudflared:
     env_file: .env.dev
   ```

2. **compose.production.yaml** - Uses `.env`
   ```yaml
   cloudflared:
     env_file: .env
   ```

3. **STARTUP_PROCEDURE.md** - Documents the startup process (updated to reference correct files)

4. **README.md** - Setup instructions (updated with dev vs prod examples)

5. **ENVIRONMENT_SETUP.md** - Comprehensive environment configuration guide (newly created)

---

## One-Time Setup

```bash
# 1. Clone the repository
git clone https://github.com/danielbucket/BucketLab_api.git
cd BucketLab_api

# 2. Create development environment file
cat > .env.dev << EOF
MONGO_DB_USERNAME=empirical_explorer
MONGO_DB_PASSWORD=hg48s.2s9dFF.EZpoopin
MONGO_DB_DATABASE=bucketlab
JWT_SECRET=dev_secret_key_change_for_production
JWT_EXPIRES_IN=7d
TUNNEL_TOKEN=your_tunnel_token_here
APP_RUN_MODE=development
EOF

# 3. Start development
docker compose -f compose.dev.yaml up --build

# ✓ Services should be running and healthy
```

---

## Common Commands

```bash
# View environment variables in running container
docker exec app_server_dev env | grep -E "MONGO|JWT|TUNNEL"

# Check which compose file is active
docker ps --filter name=app_server | grep dev  # dev environment
docker ps --filter name=app_server | grep prod # production environment

# Check environment file location in compose config
grep "env_file:" compose*.yaml

# Stop and remove all dev containers
docker compose -f compose.dev.yaml down

# Restart with fresh environment
docker compose -f compose.dev.yaml down -v
docker compose -f compose.dev.yaml up --build
```

---

## Summary of Changes Made

### Documentation Updated
- ✅ **STARTUP_PROCEDURE.md** - Clarified that development uses only `.env.dev`
- ✅ **README.md** - Added separate instructions for dev vs production setup
- ✅ **ENVIRONMENT_SETUP.md** - New comprehensive environment configuration guide

### Verified
- ✅ `compose.dev.yaml` correctly uses `env_file: .env.dev`
- ✅ `compose.production.yaml` correctly uses `env_file: .env`
- ✅ No conflicting references in Dockerfiles
- ✅ Services read environment variables correctly from their respective files

### No Changes Needed
- ❌ Compose files are already correct
- ❌ Dockerfile references are correct
- ❌ Service code correctly uses `process.env` to access variables

---

## Next Steps

1. **Review the new guides:**
   - Read [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for detailed explanation
   - Read [STARTUP_PROCEDURE.md](./STARTUP_PROCEDURE.md) for startup flow

2. **Verify your setup:**
   ```bash
   # Make sure .env.dev exists
   ls -la .env.dev
   
   # Start services
   docker compose -f compose.dev.yaml up --build
   
   # Check logs
   docker compose logs -f app_server
   ```

3. **For production:**
   - Create `.env` file on production server
   - Use `compose.production.yaml` for deployment
   - Never commit `.env` to Git

---

**Status: ✓ Environment configuration is now correctly documented and separated by environment.**

