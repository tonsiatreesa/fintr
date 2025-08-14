#!/bin/bash

# Development setup script for Docker

echo "🚀 Starting Fintr application with Docker..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from example..."
    cp .env.local.example .env.local
    echo "⚠️  Please edit .env.local with your actual environment variables"
fi

# Build and start containers
echo "🏗️  Building and starting containers..."
docker-compose up --build -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose exec app npx drizzle-kit migrate

# Optional: Seed the database
echo "🌱 Do you want to seed the database? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    docker-compose exec app npm run db:seed
fi

echo "✅ Application is running at http://localhost:3000"
echo "📊 Database is running at localhost:5432"
echo ""
echo "Useful commands:"
echo "  docker-compose logs -f app    # View app logs"
echo "  docker-compose logs -f db     # View database logs"
echo "  docker-compose down           # Stop all services"
echo "  docker-compose up -d          # Start services in background"
