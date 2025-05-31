# Microservices with NestJS & RabbitMQ
## Getting Started

### Prerequisites

- Node.js v20+
- NestJS v10+
- npm
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd MicroservicesArchitecture-NestJS-RabbitMQ
   ```
2. **Run with Docker Compose**
   `docker compose up --build`

3. **To stop the Services**
   `docker compose down`

## Notes

- All inter-service communication (token validation, user events) is handled via RabbitMQ.
- For development, use `npm run start:dev` inside each service for hot-reloading.
- Adjust .env files as needed for your environment.

---

# Demonstration

A demonstration of a microservices architecture using **NestJS** and **RabbitMQ** for inter-service communication between an **Auth Service** and a **Product Service**.

---

## Table of Contents

- [Features](#features)
- [Services](#services)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)

---

## Features

- User authentication (registration, login, logout)
- JWT token management (access & refresh tokens)
- Product catalog management (CRUD operations)
- Service-to-service authentication via RabbitMQ RPC
- Event-driven architecture with RabbitMQ Pub/Sub
- Containerized with Docker
- Comprehensive API documentation with Swagger

---

## Services

### Auth

- Handles user authentication and authorization
- Manages JWT tokens (access & refresh)
- Provides RPC endpoints for token validation
- Publishes user events to RabbitMQ
- **Check if Service Started:** [http://localhost:3001/](http://localhost:3000)
- **Swagger UI:** [http://localhost:3000/api](http://localhost:3000/api)

### Product

- Manages product catalog with owner-based permissions
- Consumes Auth Service via RabbitMQ RPC
- Subscribes to user events (e.g., logs when a user registers)
- **Check if Service Started:** [http://localhost:3001/](http://localhost:3001)
- **Swagger UI:** [http://localhost:3001/api](http://localhost:3001/api)

---

## Architecture

- REST APIs for external communication
- RabbitMQ for internal service communication (Pub/Sub and RPC)
- MongoDB for data persistence
- Docker for containerization

---

## Technology Stack

- **Backend Framework:** NestJS
- **Message Broker:** RabbitMQ
- **Database:** MongoDB
- **ORM:** Typegoose
- **Containerization:** Docker
- **API Documentation:** Swagger/OpenAPI

---
