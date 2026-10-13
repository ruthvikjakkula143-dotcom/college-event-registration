# College Event Registration System

A web application for publishing college events and letting students register online.

| Layer     | Technology                      |
|-----------|---------------------------------|
| Frontend  | React 18 (Vite), React Router   |
| Backend   | Java 17, Spring Boot 3.3        |
| Database  | MySQL 8                         |
| Build     | Maven (backend), npm (frontend) |

## Features
- Students: sign up, log in, browse events, register, track status (Pending / Confirmed / Cancelled), withdraw.
- Admins: add, edit and delete events; view all registrations; confirm or cancel them.
- Rules enforced on the server: no duplicate registrations, seat capacity limits, role-based access.
- Passwords are stored as BCrypt hashes.

## Prerequisites
Java 17+, Maven 3.8+, Node 18+, MySQL 8 running on localhost:3306.

## Run it

**1. Backend** (creates the `college_events` database and tables automatically)
cd backend
# Option A: With MySQL (Defaults: user "root", password "root"):
#   export DB_USERNAME=myuser DB_PASSWORD=mypassword
mvn spring-boot:run

# Option B: Quick start without MySQL (using embedded H2 database):
mvn spring-boot:run "-Dspring-boot.run.profiles=h2"
```
API runs at http://localhost:8080.

**2. Frontend**
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173.

**Demo admin login:** `admin@college.edu` / `admin123` (seeded on first run; change it before any real use).
Three sample events are seeded too. Students create their own accounts from the Register page.

## REST API
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register`, `/api/auth/login` | Public |
| GET | `/api/events` | Public |
| POST / PUT / DELETE | `/api/events[/{id}]` | Admin |
| POST | `/api/registrations` | Student |
| GET | `/api/registrations/me` | Student |
| GET | `/api/registrations` | Admin |
| PATCH | `/api/registrations/{id}/status` | Admin |
| DELETE | `/api/registrations/{id}` | Owner or Admin |

## Project layout
```
backend/   Spring Boot app (model, repository, service, controller, config)
frontend/  React app (pages, components, auth context, API helper)
```

## Notes and next steps
- Login sessions are kept in server memory, so users log in again after a restart. For production, switch to JWT with Spring Security.
- Future scope from the abstract: email notifications, QR-code attendance, certificate generation.
