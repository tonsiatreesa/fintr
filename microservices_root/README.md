# Fintr Microservices Architecture

This is the microservices version of the Fintr finance application, broken down into individual containerized services.

## Architecture

- **Frontend Service** (Port 3000) - Next.js application
- **API Gateway** (Port 4000) - Routes requests to microservices
- **Account Service** (Port 4002) - Manages user accounts
- **Transaction Service** (Port 4003) - Handles financial transactions
- **Category Service** (Port 4004) - Manages transaction categories
- **Analytics Service** (Port 4005) - Provides financial analytics and summaries
- **Plaid Service** (Port 4006) - Integrates with Plaid for bank connections
- **Subscription Service** (Port 4007) - Manages premium subscriptions via LemonSqueezy

## Local Development

1. **Prerequisites:**
   - Docker and Docker Compose installed
   - Copy `.env.example` to `.env` and fill in your actual API keys

2. **Start all services:**
   ```bash
   docker compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:4000
   - Individual services: http://localhost:400[2-7]

4. **Health checks:**
   ```bash
   curl http://localhost:4000/health  # API Gateway
   curl http://localhost:4002/health  # Account Service
   curl http://localhost:4003/health  # Transaction Service
   curl http://localhost:4004/health  # Category Service
   curl http://localhost:4005/health  # Analytics Service
   curl http://localhost:4006/health  # Plaid Service
   curl http://localhost:4007/health  # Subscription Service
   ```

## Service Communication

The frontend communicates with all services through the API Gateway at `http://localhost:4000`. The API Gateway proxies requests to the appropriate microservice based on the URL path:

- `/api/accounts/*` → Account Service
- `/api/transactions/*` → Transaction Service  
- `/api/categories/*` → Category Service
- `/api/summary/*` → Analytics Service
- `/api/plaid/*` → Plaid Service
- `/api/subscriptions/*` → Subscription Service

## Database

All services share a single PostgreSQL database for simplicity. In production, you might want to consider separate databases per service.

## Next Steps for Production

1. **Kubernetes Deployment** - Add K8s manifests for EKS deployment
2. **Service Mesh** - Consider Istio for advanced traffic management
3. **Monitoring** - Add Prometheus, Grafana, and distributed tracing
4. **CI/CD** - Set up GitHub Actions for automated builds and deployments
5. **Security** - Implement proper service-to-service authentication
