#!/bin/bash

echo "🚀 Setting up Fintr with Neon Database"
echo "======================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from example..."
    cp .env.local.example .env.local
fi

echo "⚠️  IMPORTANT: You need to configure your environment variables in .env.local"
echo ""
echo "Required from Neon (https://neon.tech/):"
echo "  - DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
echo ""
echo "Optional services:"
echo "  - Clerk (Auth): https://clerk.com/"
echo "  - Plaid (Banking): https://plaid.com/"
echo "  - LemonSqueezy (Payments): https://lemonsqueezy.com/"
echo ""

read -p "Have you added your Neon DATABASE_URL to .env.local? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please add your Neon DATABASE_URL to .env.local first"
    echo "   Edit the file and add: DATABASE_URL=your_neon_connection_string"
    exit 1
fi

echo "🏗️  Building and starting the application..."
docker-compose up --build -d

echo "⏳ Waiting for application to start..."
sleep 15

echo "🗄️  Running database migrations..."
docker-compose exec app npm run db:migrate:docker

echo ""
echo "✅ Setup complete!"
echo "🌐 Application: http://localhost:3000"
echo ""
echo "Useful commands:"
echo "  docker-compose logs -f app    # View app logs"
echo "  docker-compose down           # Stop services"
echo "  docker-compose up -d          # Start services"
