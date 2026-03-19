# RevWorkforce HRM - Microservices Backend

## Architecture

| Service | Port | Description |
|---|---|---|
| eureka-server | 8761 | Service Discovery |
| api-gateway | 8000 | JWT Auth + Routing |
| auth-service | 8001 | Login, Password Management |
| employee-service | 8002 | Employee Profiles, Directory |
| leave-service | 8003 | Leave Applications, Balances |
| performance-service | 8004 | Reviews, Goals |
| admin-service | 8005 | Admin Panel, Departments, Reports |
| notification-service | 8006 | In-App Notifications |

## Quick Start

### 1. Setup environment
```bash
cp .env .env
# Edit .env with your values
```

### 2. Run with Docker Compose
```bash
docker-compose up --build
```

### 3. Access Services
- Eureka Dashboard: http://localhost:8761
- API Gateway: http://localhost:8000
- Swagger (each service): http://localhost:{PORT}/swagger-ui/index.html

## Build Locally (without Docker)
```bash
# Build common-library first
mvn install -pl common-library

# Build all services
mvn clean package -DskipTests

# Run each service
java -jar {service}/target/{service}-1.0.0.jar
```

## API Request Headers
All requests through the gateway need:
```
Authorization: Bearer <JWT_TOKEN>
```

## JWT Token Claims
```json
{
  "userId": 1,
  "role": "EMPLOYEE|MANAGER|ADMIN",
  "employeeId": "EMP001",
  "email": "user@example.com"
}
```

## Environment Variables
| Variable | Description |
|---|---|
| JWT_SECRET | JWT signing secret (min 32 chars) |
| DB_USERNAME | MySQL username |
| DB_PASSWORD | MySQL password |
| EUREKA_URL | Eureka server URL |

## Service Communication
- All inter-service calls use **OpenFeign** via Eureka service discovery
- Gateway injects `X-User-Id`, `X-User-Role`, `X-User-Email`, `X-Employee-Id` headers
- Services use these headers — no hardcoded URLs
