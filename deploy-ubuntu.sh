#!/bin/bash
# Deployment script for BucketLab API on Ubuntu Server
# This script addresses the MessagesController module loading issue

set -e  # Exit on any error

echo "🚀 Starting BucketLab API deployment for Ubuntu Server..."

# Check if we're on Ubuntu/Linux
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "✅ Detected Linux environment"
else
    echo "⚠️  Warning: This script is optimized for Linux environments"
fi

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check for required environment file
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create .env file with required variables:"
    echo "   - MONGO_DB_USERNAME"
    echo "   - MONGO_DB_PASSWORD"
    echo "   - TUNNEL_TOKEN"
    echo "   - APP_RUN_MODE"
    exit 1
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f compose.production.yaml down 2>/dev/null || true

# Remove any dangling images
echo "🧹 Cleaning up old images..."
docker image prune -f

# Build and start services
echo "🔨 Building and starting services..."
if docker compose version &> /dev/null; then
    # Use new Docker Compose V2 syntax
    docker compose -f compose.production.yaml up --build -d
else
    # Use legacy docker-compose
    docker-compose -f compose.production.yaml up --build -d
fi

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check service health
echo "🏥 Checking service health..."
SERVICES=("app_server" "auth_server" "laboratory_server" "bucketlab_empire_database")

for service in "${SERVICES[@]}"; do
    if docker ps --filter "name=$service" --filter "status=running" | grep -q "$service"; then
        echo "✅ $service is running"
    else
        echo "❌ $service is not running"
        docker logs "$service" --tail 20
    fi
done

# Test API endpoints
echo "🧪 Testing API endpoints..."
sleep 10

# Test main API gateway
if curl -s -f "http://localhost:4020/health" > /dev/null; then
    echo "✅ App Server API is responding"
else
    echo "❌ App Server API is not responding"
    docker logs app_server --tail 20
fi

# Test auth service through gateway
if curl -s -f "http://localhost:4020/auth/accounts" > /dev/null; then
    echo "✅ Auth Service is accessible through gateway"
else
    echo "⚠️  Auth Service may not be fully initialized yet"
fi

# Test laboratory service through gateway
if curl -s -f "http://localhost:4020/laboratory/messages" > /dev/null; then
    echo "✅ Laboratory Service is accessible through gateway"
else
    echo "⚠️  Laboratory Service may not be fully initialized yet"
fi

echo "📊 Current container status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "   - Check logs: docker logs <service_name>"
echo "   - Monitor resources: docker stats"
echo "   - View all services: docker ps"
echo "   - Stop services: docker-compose -f compose.production.yaml down"
