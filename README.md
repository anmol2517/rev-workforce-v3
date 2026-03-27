<div align="center">

![RevWorkforce Banner](https://img.shields.io/badge/RevWorkforce-HRM%20System-1A3C5E?style=for-the-badge&logo=spring&logoColor=white)

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-17+-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**A full-stack Human Resource Management System built on Microservices Architecture.**  
*Spring Boot 3 · Angular 17+ · Netflix Eureka · Spring Cloud Gateway · JWT Security · Docker*

[Features](#-features) • [Architecture](#-architecture) • [Services](#-microservices) • [Setup](#-getting-started) • [API Docs](#-api-documentation) • [Frontend](#-frontend)

</div>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Architecture](#-architecture)
- [Microservices](#-microservices)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Frontend](#-frontend)
- [JWT Security Flow](#-jwt-security-flow)
- [Key Flows](#-key-flows)
- [Docker Deployment](#-docker-deployment)
- [Contributing](#-contributing)

---

## 🧠 About the Project

**RevWorkforce HRM** is a complete Human Resource Management System designed using a **Microservices Architecture**. Instead of one monolithic application, the system is split into **8 independent Spring Boot services** — each with its own responsibility and its own MySQL database.

> Think of it like a company with separate departments — HR, Leave, Finance — all working independently but connected through a single reception desk (API Gateway).

**The Angular frontend talks to only ONE endpoint — the API Gateway (port 8000).** The gateway validates JWT tokens and routes each request to the correct microservice via Netflix Eureka service discovery.

---

## ✨ Features

### 👨‍💼 Employee
- View & update own profile
- Apply for leaves, check leave balance, cancel pending leaves
- Create personal goals, update progress
- Submit self-assessment performance reviews
- View in-app notifications

### 🧑‍💼 Manager
- View team members
- Approve / Reject leave requests (with mandatory comments on rejection)
- Assign goals to team members, add feedback
- Provide ratings & feedback on performance reviews

### 👑 Admin
- Create, activate, deactivate employees (orchestrates auth + employee services)
- Manage departments, designations, holidays, announcements
- Assign & adjust leave quotas for employees
- View all leaves, goals, and reviews across the organization
- Full audit trail via activity logs
- Configure leave types and default days

---

## 🏗️ Architecture

```
                        ┌─────────────────────────────────┐
                        │         Angular Frontend          │
                        │           (Port 4200)             │
                        └──────────────┬──────────────────┘
                                       │  HTTP Requests
                                       ▼
                        ┌─────────────────────────────────┐
                        │          API Gateway             │
                        │    JWT Validate + Route          │
                        │          (Port 8000)             │
                        └──────────────┬──────────────────┘
                                       │
               ┌───────────────────────▼──────────────────────────┐
               │              Netflix Eureka (8761)                │
               │         Service Registry & Discovery              │
               └───┬──────┬──────┬──────┬──────┬──────┬──────┬───┘
                   │      │      │      │      │      │      │
                   ▼      ▼      ▼      ▼      ▼      ▼      ▼
                ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
                │auth│ │emp │ │leav│ │perf│ │noti│ │adm │ │    │
                │8081│ │8082│ │8083│ │8084│ │8085│ │8086│ │    │
                └──┬─┘ └──┬─┘ └──┬─┘ └──┬─┘ └──┬─┘ └──┬─┘ └────┘
                   │      │      │      │      │      │
                   ▼      ▼      ▼      ▼      ▼      ▼
                ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
                │ DB │ │ DB │ │ DB │ │ DB │ │ DB │ │ DB │
                └────┘ └────┘ └────┘ └────┘ └────┘ └────┘
```

**Request Flow:**
```
Angular → API Gateway → [JWT Validate] → Eureka Lookup → Microservice → MySQL → Response
```

---

## 🧩 Microservices

| Service | Port | Responsibility |
|---|---|---|
| `eureka-server` | 8761 | Service Registry — all services register here on startup |
| `api-gateway` | 8000 | Single entry point — validates JWT, routes requests |
| `auth-service` | 8081 | Login, JWT generation, password management |
| `employee-service` | 8082 | Employee CRUD and profile management |
| `leave-service` | 8083 | Leave apply, approve, reject, balance tracking |
| `performance-service` | 8084 | Goals and performance reviews |
| `notification-service` | 8085 | In-app alerts (created by other services via Feign) |
| `admin-service` | 8086 | Master control — departments, holidays, employee lifecycle |
| `common-library` | N/A | Shared DTOs, Enums, Exceptions (Maven dependency) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend Framework** | Spring Boot 3.x |
| **Service Discovery** | Netflix Eureka (Spring Cloud) |
| **API Gateway** | Spring Cloud Gateway (Reactive / WebFlux) |
| **Inter-Service Calls** | OpenFeign |
| **Security** | Spring Security + JWT (HMACSHA256) |
| **Database** | MySQL 8.0 — one schema per service |
| **ORM** | Spring Data JPA + Hibernate |
| **Frontend** | Angular 17+ (Standalone Components) |
| **HTTP Client** | Angular HttpClient + RxJS Observables |
| **Build Tool** | Maven (multi-module) |
| **Containerization** | Docker + Docker Compose |
| **API Docs** | Swagger / OpenAPI 3 |
| **Boilerplate** | Lombok |

---

## 📁 Project Structure

```
RevWorkforce/
├── common-library/               # Shared code — no HTTP port
│   └── src/main/java/
│       ├── dto/                  # ApiResponse, EmployeeDTO, LeaveBalanceDTO ...
│       ├── enums/                # Role, LeaveType, GoalStatus, ReviewStatus ...
│       ├── exceptions/           # ResourceNotFoundException, BadRequestException ...
│       └── security/             # JwtUtil, UserPrincipal
│
├── eureka-server/                # Service registry (port 8761)
├── api-gateway/                  # JWT filter + routing (port 8000)
├── auth-service/                 # Login, JWT, passwords (port 8081)
├── employee-service/             # Employee profiles (port 8082)
├── leave-service/                # Leave management (port 8083)
├── performance-service/          # Goals & reviews (port 8084)
├── notification-service/         # In-app alerts (port 8085)
├── admin-service/                # Admin operations (port 8086)
│
├── frontend/                     # Angular 17+ app
│   └── src/app/
│       ├── core/
│       │   ├── constants/        # api.constants.ts — all API URLs
│       │   ├── guards/           # authGuard, adminGuard, managerGuard
│       │   ├── interceptors/     # auth.interceptor, response.interceptor
│       │   ├── models/           # TypeScript interfaces
│       │   └── services/         # auth, employee, leave, admin services
│       └── features/
│           ├── auth/             # Login page
│           ├── admin/            # Admin dashboard, employees, depts
│           ├── manager/          # Team, leave approvals, reviews
│           └── employee/         # Profile, leaves, goals
│
├── docker-compose.yml
├── .env                          # Environment variables
└── pom.xml                       # Parent Maven POM
```

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Node.js 18+ & npm
- MySQL 8.0
- Docker & Docker Compose (for containerized setup)
- Maven 3.8+

---

### ⚙️ Option 1 — Run with Docker Compose (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/revworkforce-hrm.git
cd revworkforce-hrm

# 2. Create your .env file (see Environment Variables section)
cp .env.example .env

# 3. Start everything
docker-compose up --build
```

All services will start in the correct order automatically.

---

### 🖥️ Option 2 — Run Manually (without Docker)

**Step 1 — Start MySQL** and create databases for each service:

```sql
CREATE DATABASE auth_db;
CREATE DATABASE employee_db;
CREATE DATABASE leave_db;
CREATE DATABASE performance_db;
CREATE DATABASE notification_db;
CREATE DATABASE admin_db;
```

**Step 2 — Install common-library** into local Maven repo:

```bash
cd common-library
mvn clean install
```

**Step 3 — Start services in this exact order:**

```bash
# 1. Eureka Server (wait for it to be UP before starting others)
cd eureka-server && mvn spring-boot:run

# 2. Start all microservices (in separate terminals)
cd auth-service        && mvn spring-boot:run
cd employee-service    && mvn spring-boot:run
cd leave-service       && mvn spring-boot:run
cd performance-service && mvn spring-boot:run
cd notification-service && mvn spring-boot:run
cd admin-service       && mvn spring-boot:run

# 3. Start API Gateway last
cd api-gateway && mvn spring-boot:run
```

**Step 4 — Start Angular Frontend:**

```bash
cd frontend
npm install
ng serve
```

Frontend runs on: **http://localhost:4200**

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# MySQL
MYSQL_ROOT_PASSWORD=root
MYSQL_HOST=localhost

# JWT
JWT_SECRET=your_super_secret_key_here_min_32_chars
JWT_ACCESS_EXPIRY=3600000        # 1 hour in ms
JWT_REFRESH_EXPIRY=604800000     # 7 days in ms

# Eureka
EUREKA_HOST=localhost
EUREKA_PORT=8761

# Service Ports
AUTH_SERVICE_PORT=8081
EMPLOYEE_SERVICE_PORT=8082
LEAVE_SERVICE_PORT=8083
PERFORMANCE_SERVICE_PORT=8084
NOTIFICATION_SERVICE_PORT=8085
ADMIN_SERVICE_PORT=8086
GATEWAY_PORT=8000
```

---

## 📖 API Documentation

Each service exposes its own Swagger UI:

| Service | Swagger URL |
|---|---|
| Auth Service | http://localhost:8081/swagger-ui/index.html |
| Employee Service | http://localhost:8082/swagger-ui/index.html |
| Leave Service | http://localhost:8083/swagger-ui/index.html |
| Performance Service | http://localhost:8084/swagger-ui/index.html |
| Notification Service | http://localhost:8085/swagger-ui/index.html |
| Admin Service | http://localhost:8086/swagger-ui/index.html |
| Eureka Dashboard | http://localhost:8761 |

> **Note:** In production, only the API Gateway (port 8000) should be exposed. Individual service ports are for development/debugging only.

---

### Key API Endpoints

#### 🔐 Auth Service
```
POST   /api/auth/login                    → Login, returns JWT tokens
POST   /api/auth/refresh                  → Get new access token
POST   /api/auth/change-password          → Change own password
POST   /api/auth/forgot-password          → Generate reset token
POST   /api/auth/reset-password           → Reset password with token
```

#### 👤 Employee Service
```
GET    /api/employees/me                  → Get own profile
PUT    /api/employees/me                  → Update own profile
GET    /api/employees/{id}                → Get employee by ID
GET    /api/employees/directory           → All employees (paginated)
GET    /api/employees/manager/team        → Manager's team
```

#### 🏖️ Leave Service
```
POST   /api/leaves/apply                  → Apply for leave
GET    /api/leaves/my                     → My leave history
PUT    /api/leaves/{id}/cancel            → Cancel pending leave
GET    /api/leaves/balance                → My leave balance
GET    /api/leaves/team                   → Team leaves (Manager)
PUT    /api/leaves/{id}/approve           → Approve leave (Manager)
PUT    /api/leaves/{id}/reject            → Reject leave (Manager)
```

#### 📊 Performance Service
```
POST   /api/performance/goals             → Create goal
PUT    /api/performance/goals/{id}/progress → Update progress
POST   /api/performance/reviews           → Create self-review
PUT    /api/performance/reviews/{id}/submit → Submit review
PUT    /api/performance/reviews/{id}/feedback → Manager feedback
```

#### 🔔 Notification Service
```
GET    /api/notifications                 → All notifications
GET    /api/notifications/unread          → Unread only
GET    /api/notifications/unread/count    → Unread count (badge)
PUT    /api/notifications/{id}/read       → Mark as read
PUT    /api/notifications/read-all        → Mark all as read
```

---

## 🖥️ Frontend

Built with **Angular 17+** using the Standalone Components pattern.

### Routing Structure

```
/login                    → Public
/admin/**                 → adminGuard (ADMIN role only)
  /admin/dashboard
  /admin/employees
  /admin/departments
  /admin/holidays
  /admin/leaves
  /admin/announcements
/manager/**               → managerGuard (MANAGER role only)
  /manager/team
  /manager/leaves
  /manager/goals
  /manager/reviews
/employee/**              → employeeGuard (EMPLOYEE role only)
  /employee/profile
  /employee/leaves
  /employee/goals
  /employee/directory
```

### Core Interceptors

**Auth Interceptor** — Automatically attaches JWT to every request:
```typescript
const token = inject(AuthService).getToken();
if (token) {
  req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}
```

**Response Interceptor** — Unwraps `ApiResponse.data` automatically:
```typescript
// Backend returns: { success: true, data: {...}, message: "..." }
// Interceptor extracts .data → component receives clean object directly
if (response.body?.success === true) {
  return response.clone({ body: response.body.data });
}
// On 401 → auto logout
```

---

## 🔒 JWT Security Flow

### Token Structure (Payload)

```json
{
  "sub": "john@company.com",
  "userId": 1001,
  "role": "EMPLOYEE",
  "employeeId": 1001,
  "email": "john@company.com",
  "empCode": "EMP-001",
  "iat": 1704067200,
  "exp": 1704070800
}
```

Signed with: `HMACSHA256(base64Header + "." + base64Payload, SECRET_KEY)`

### API Gateway Filter — Steps

```
1. Is path public? (login, swagger, actuator) → Skip JWT, pass through
2. Authorization header present? "Bearer TOKEN" format? → else 401
3. Extract token after "Bearer "
4. Validate: HMACSHA256 signature + expiry check → else 401
5. Extract claims: userId, role, email, empCode
6. Add headers to downstream request:
      X-User-Id      → numeric userId (e.g. 1001)
      X-User-Role    → EMPLOYEE / MANAGER / ADMIN
      X-Employee-Id  → numeric userId (NOT "EMP-001" — services call Long.parseLong())
      X-Emp-Code     → EMP-001
      X-User-Email   → john@company.com
7. Forward modified request to target service
```

---

## 🔄 Key Flows

### 1. Login Flow

```
User submits form
      │
      ▼
Angular POST /api/auth/login → API Gateway (public path, JWT skipped)
      │
      ▼
auth-service → find user → BCrypt.matches(input, stored)
      │
      ▼
Generate Access Token (1hr) + Refresh Token (7days)
      │
      ▼
Save refresh token to DB, update lastLogin
      │
      ▼
Return { accessToken, refreshToken, userId, role, email, employeeCode }
      │
      ▼
Angular → localStorage (rw_token, rw_user) → navigate to role dashboard
```

---

### 2. Leave Apply Flow

```
Employee fills form (leaveType, startDate, endDate, reason)
      │
      ▼
POST /api/leaves/apply → Gateway (JWT validated, X-Employee-Id header added)
      │
      ▼
LeaveService:
  ├─ Validate dates (end > start)
  ├─ Check overlapping leaves
  ├─ Calculate working days (skip Saturday & Sunday)
  ├─ Check LeaveBalance (enough days?)
  ├─ Save LeaveApplication (status = PENDING)
  └─ Feign → notification-service → manager gets alert
```

---

### 3. Admin Creates Employee Flow

```
Admin fills form (name, email, password, dept, salary, role)
      │
      ▼
admin-service:
  Step 1 → AuthClient.registerInternal()
           → auth-service creates User → returns userId
  Step 2 → EmployeeClient.createEmployee()
           → employee-service creates Employee (userId explicitly set)
  Step 3 → Generate empCode (EMP-001 format)
           → AuthClient.updateEmployeeCode() → sync both services
  Step 4 → Save ActivityLog
```

---

## 🐳 Docker Deployment

### Service Start Order

```
1. eureka-server     (8761)  ← Registry must be ready first
2. MySQL databases           ← All DBs must be available
3. All microservices         ← Register with Eureka on startup
4. api-gateway       (8000)  ← Needs Eureka service list to route
5. Angular frontend  (4200)  ← Start after all backends are up
```

### Docker Commands

```bash
# Start all services
docker-compose up --build

# Start in background
docker-compose up -d

# View logs of a specific service
docker-compose logs -f auth-service

# Stop all services
docker-compose down

# Stop and remove volumes (fresh start)
docker-compose down -v
```

### Port Mapping

```
localhost:4200  → Angular Frontend (dev only)
localhost:8000  → API Gateway      (expose ONLY this in production)
localhost:8761  → Eureka Dashboard
localhost:8081  → auth-service     (dev only)
localhost:8082  → employee-service (dev only)
localhost:8083  → leave-service    (dev only)
localhost:8084  → performance-service (dev only)
localhost:8085  → notification-service (dev only)
localhost:8086  → admin-service    (dev only)
localhost:3306  → MySQL
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

Made with ❤️ by **RevWorkforce Team**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=flat-square&logo=springboot)](https://spring.io/)
[![Angular](https://img.shields.io/badge/Angular-17+-DD0031?style=flat-square&logo=angular)](https://angular.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)

</div>
