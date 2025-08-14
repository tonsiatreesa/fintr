#!/bin/bash

# Microservices Local Testing Script
echo "🚀 Testing Fintr Microservices Architecture"
echo "=============================================="

# Check prerequisites
echo "📋 Checking Prerequisites..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed or not in PATH"
    exit 1
fi

if ! command -v docker &> /dev/null || ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available"
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Please run this script from the microservices_root directory"
    exit 1
fi

echo "✅ Found docker-compose.yml"

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your actual API keys before proceeding"
    echo "   For testing, you can use mock values temporarily"
fi

echo ""
echo "🔨 Building and Starting Services..."
echo "====================================="

# Start PostgreSQL first
echo "1️⃣ Starting PostgreSQL database..."
docker compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Check if PostgreSQL is healthy
if docker compose ps postgres | grep -q "healthy"; then
    echo "✅ PostgreSQL is ready"
else
    echo "⚠️  PostgreSQL might still be starting up..."
fi

# Start all other services
echo ""
echo "2️⃣ Starting all microservices..."
docker compose up --build -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 15

echo ""
echo "🏥 Health Check - Testing Service Endpoints"
echo "==========================================="

# Function to test endpoint
test_endpoint() {
    local url=$1
    local service_name=$2
    
    echo -n "Testing $service_name ($url)... "
    
    if curl -s -f "$url" > /dev/null 2>&1; then
        echo "✅ OK"
        return 0
    else
        echo "❌ FAILED"
        return 1
    fi
}

# Test all health endpoints
test_endpoint "http://localhost:4000/health" "API Gateway"
test_endpoint "http://localhost:4002/health" "Account Service"
test_endpoint "http://localhost:4003/health" "Transaction Service"  
test_endpoint "http://localhost:4004/health" "Category Service"
test_endpoint "http://localhost:4005/health" "Analytics Service"
test_endpoint "http://localhost:4006/health" "Plaid Service"
test_endpoint "http://localhost:4007/health" "Subscription Service"

# Test frontend
echo -n "Testing Frontend (http://localhost:3000)... "
if curl -s -f "http://localhost:3000" > /dev/null 2>&1; then
    echo "✅ OK"
else
    echo "❌ FAILED (Frontend might still be building)"
fi

echo ""
echo "📊 Service Status Overview"
echo "=========================="
docker compose ps

echo ""
echo "📝 Next Steps for Testing:"
echo "=========================="
echo "1. Open http://localhost:3000 in your browser"
echo "2. Check API Gateway routes:"
echo "   - curl http://localhost:4000/health"
echo "   - curl http://localhost:4000/api/accounts/ (requires auth)"
echo "3. View service logs:"
echo "   - docker compose logs [service-name]"
echo "4. Stop services:"
echo "   - docker compose down"

echo ""
echo "🔧 Troubleshooting Commands:"
echo "============================"
echo "# View logs for a specific service"
echo "docker compose logs api-gateway"
echo ""
echo "# Restart a service"
echo "docker compose restart account-service"
echo ""
echo "# View all running containers"
echo "docker compose ps"
echo ""
echo "# Stop all services"
echo "docker compose down"
