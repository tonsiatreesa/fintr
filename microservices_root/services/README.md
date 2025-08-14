Each folder in `services/` is a minimal Node microservice with a Dockerfile and an `index.js` HTTP stub.

To run locally:
1. cd microservices_root
2. docker compose up --build

Ports:
- api-gateway: 4000
- auth-service: 4001
- account-service: 4002
- transaction-service: 4003
- category-service: 4004
- analytics-service: 4005
- subscription-service: 4006
- notification-service: 4007
- frontend: 3000
