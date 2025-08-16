# Dockerfile for App Service - Linux Deployment
FROM node:22.14.0-alpine

# Install required packages
RUN apk --no-cache add wget curl

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S bucketlab -u 1001

# Copy package files first for better caching
COPY app/package*.json ./

# Install dependencies
RUN npm ci --only=production --no-audit --no-fund && \
    npm cache clean --force

# Copy application code
COPY app/ ./

# Fix ownership
RUN chown -R bucketlab:nodejs /app

# Switch to non-root user
USER bucketlab

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4020/health || exit 1

# Expose port
EXPOSE 4020

# Start application
CMD ["npm", "run", "start:prod"]
