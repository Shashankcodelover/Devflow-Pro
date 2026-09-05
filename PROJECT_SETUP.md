# 🛠️ DevFlow Pro — Project Setup & Environment Initialization Guide

This document provides a comprehensive, production-grade guide to setting up, configuring, and initializing all components and services required to run **DevFlow Pro** (Frontend + Backend + Databases + Cache + WebSockets).

---

## 📋 Table of Contents
1. [Architecture Overview](#-architecture-overview)
2. [Prerequisites & System Requirements](#-prerequisites--system-requirements)
3. [Required Services & Infrastructure](#-required-services--infrastructure)
   - [Redis](#1-redis-in-memory-cache--rate-limiting)
   - [MongoDB](#2-mongodb-primary-document-store)
   - [PostgreSQL / Supabase](#3-postgresql--supabase-relational-data--jobs)
   - [Socket.io WebSockets](#4-socketio-real-time-engine)
4. [Environment Configuration](#-environment-configuration)
5. [Step-by-Step Installation](#-step-by-step-installation)
   - [Backend API Setup](#1-backend-api-devflow-api)
   - [Frontend Web Setup](#2-frontend-web-devflow-pro)
6. [Docker Quickstart (Optional)](#-docker-quickstart-for-local-services)
7. [Verification & Diagnostic Tests](#-verification--diagnostic-tests)
8. [Troubleshooting & FAQs](#-troubleshooting--faqs)

---

## 🏛️ Architecture Overview

DevFlow Pro is a dual-tier full-stack application composed of:
- **`devflow-api/` (Backend)**: Express 5 + TypeScript running Node.js 20+, incorporating JWT authentication, MongoDB (Mongoose), PostgreSQL/Supabase connection pool (`pg`), Redis caching & rate limiting (`ioredis`), and Socket.io duplex event communication.
- **`devflow-pro/` (Frontend)**: React 19 + TypeScript + Vite, powered by Zustand, TanStack React Query, Lucide icons, and Axios with automated JWT refresh interceptors.

```text
               ┌──────────────────────────────┐
               │    DevFlow Pro (React 19)    │
               │  http://localhost:5173       │
               └──────────────┬───────────────┘
                              │ HTTP / REST / Socket.io
                              ▼
               ┌──────────────────────────────┐
               │     DevFlow API (Node/TS)    │
               │  http://localhost:3001       │
               └──┬───────────┬────────────┬──┘
                  │           │            │
          ┌───────▼──────┐ ┌──▼─────────┐ ┌▼──────────────┐
          │    Redis     │ │  MongoDB   │ │  PostgreSQL   │
          │ Rate Limiting│ │ Tasks &    │ │ Job Pipeline  │
          │ & Cache      │ │ Users      │ │ & Telemetry   │
          └──────────────┘ └────────────┘ └───────────────┘
```

---

## 💻 Prerequisites & System Requirements

Ensure the following tools are installed on your workstation:

| Tool | Minimum Version | Recommended Version | Verification Command |
|---|---|---|---|
| **Node.js** | `v18.0.0` | `v20.x` or higher | `node -v` |
| **npm** | `v9.0.0` | `v10.x` or higher | `npm -v` |
| **Git** | `2.30+` | Latest | `git --version` |
| **Redis** | `v6.2+` | `v7.x` / Cloud | `redis-cli ping` |
| **MongoDB** | `v6.0+` | `v7.x` / Atlas | `mongosh --version` |
| **PostgreSQL** | `v14+` | `v16+` / Supabase | `psql --version` |

---

## 🗄️ Required Services & Infrastructure

### 1. Redis (In-Memory Cache & Rate Limiting)
- **Role in Project**:
  - **API Rate Limiting** (`devflow-api/src/middleware/rateLimiter.ts`): Implements atomic sliding-window IP request counters using `INCR`, `EXPIRE`, and `TTL` to protect endpoints against abuse (100 requests / minute / IP).
  - **High-Performance Caching** (`devflow-api/src/services/cacheService.ts`): Caches high-traffic database results with custom TTL and pattern invalidation (`deletePattern`).
- **Connection Configuration**:
  - Environment variable: `REDIS_URL`
  - Local default: `redis://localhost:6379`
  - Cloud managed option: Upstash or Redis Cloud (`redis://default:<password>@<host>:<port>`)
- **Quick Validation**:
  ```powershell
  cd devflow-api
  npx tsx src/redis-test.ts
  ```

### 2. MongoDB (Primary Document Store)
- **Role in Project**:
  - Persists **Users** (hashed credentials, refresh tokens) and **Tasks** (titles, descriptions, priorities, deadlines, status).
- **Connection Configuration**:
  - Environment variable: `MONGODB_URI`
  - Local default: `mongodb://localhost:27017/devflow`
  - Cloud managed option: MongoDB Atlas cluster string (`mongodb+srv://...`)

### 3. PostgreSQL / Supabase (Relational Data & Jobs)
- **Role in Project**:
  - Manages **Job Pipelines**, telemetry counters, and status tracking via pooled connections (`pg` Pool).
- **Connection Configuration**:
  - Environment variable: `SUPABASE_URL` or `DATABASE_URL`
  - Local default: `postgresql://postgres:postgres@localhost:5432/devflow`
  - Cloud managed option: Supabase connection pooling string.

### 4. Socket.io (Real-Time Engine)
- **Role in Project**:
  - Attached directly to Node HTTP Server in `devflow-api/src/index.ts`.
  - Provides real-time task sync events (`task:create` -> `task:new`) and user room segregation (`join -> user:{id}`).
  - Automatically configured when starting the backend server on port 3001.

---

## ⚙️ Environment Configuration

### Backend: `devflow-api/.env`
Create a `.env` file in `devflow-api/` (refer to `devflow-api/.env.example`):

```env
# Server
PORT=3001
NODE_ENV=development

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Databases & Cache
MONGODB_URI=mongodb://localhost:27017/devflow
SUPABASE_URL=postgresql://postgres:postgres@localhost:5432/devflow
REDIS_URL=redis://localhost:6379
```

> **Security Note**: Never commit `.env` containing sensitive credentials into GitHub. Use `.env.example` templates for onboarding.

### Frontend: `devflow-pro/.env`
Create a `.env` file in `devflow-pro/` (refer to `devflow-pro/.env.example`):

```env
VITE_API_URL=http://localhost:3001
```

---

## 🚀 Step-by-Step Installation

### 1. Backend API (`devflow-api`)
Open a terminal in the project root:

```powershell
# Navigate to backend directory
cd devflow-api

# Install dependencies
npm install

# Initialize environment variables
cp .env.example .env

# Run database & cache verification test
npm test

# Start the development server (with hot reload via tsx watch)
npm run dev
```
Backend will be live at: `http://localhost:3001`
Health check endpoint: `http://localhost:3001/health`

---

### 2. Frontend Web (`devflow-pro`)
Open a second terminal:

```powershell
# Navigate to frontend directory
cd devflow-pro

# Install dependencies
npm install

# Initialize environment variables
cp .env.example .env

# Start Vite development server
npm run dev
```
Frontend will be accessible at: `http://localhost:5173`

---

## 🐳 Docker Quickstart for Local Services

If you do not have Redis, MongoDB, or PostgreSQL installed locally, you can start all 3 backing services in Docker with one command:

```powershell
# Start Redis container
docker run -d --name devflow-redis -p 6379:6379 redis:7-alpine

# Start MongoDB container
docker run -d --name devflow-mongo -p 27017:27017 mongo:7

# Start PostgreSQL container
docker run -d --name devflow-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=devflow -p 5432:5432 postgres:16-alpine
```

---

## 🧪 Verification & Diagnostic Tests

To verify that your entire environment and all dependencies are initialized properly:

1. **Verify Backend Automated Tests (6/6 passing)**:
   ```powershell
   cd devflow-api
   npm test
   ```
2. **Verify Redis Connectivity & Cache Mechanics**:
   ```powershell
   cd devflow-api
   npx tsx src/redis-test.ts
   ```
   *Expected output*: `GET name: Preetham`, `Session exists: 1`, `Count: 3`.
3. **Verify Frontend Build & TypeScript Typings**:
   ```powershell
   cd devflow-pro
   npm run build
   ```
4. **Verify HTTP & Health Check**:
   ```powershell
   curl http://localhost:3001/health
   # Returns: {"status":"OK","timestamp":"..."}
   ```

---

## ❓ Troubleshooting & FAQs

- **Error: `ECONNREFUSED 127.0.0.1:6379` (Redis)**:
  - Redis server is not running or `REDIS_URL` in `devflow-api/.env` is incorrect. Ensure Redis is started via `docker run -d -p 6379:6379 redis:7-alpine` or check your cloud Redis connection string.
- **Error: `querySrv ENOTFOUND` or MongoDB Timeout**:
  - If using MongoDB Atlas, check your network whitelist (allow your current IP address in Atlas Network Access) or set Google DNS (`8.8.8.8`) in your system.
- **Error: `CORS policy blocked` in browser console**:
  - The backend CORS origins in `devflow-api/src/index.ts` permit `http://localhost:5173`. Make sure the frontend is running on port 5173 or update the allowed origin array in `devflow-api/src/index.ts`.
- **Port Conflict on 3001 or 5173**:
  - Change `PORT` in `devflow-api/.env` and update `VITE_API_URL` in `devflow-pro/.env` accordingly.
