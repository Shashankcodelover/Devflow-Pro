# ⚡ DevFlow Pro — Developer Career & Task Operating System

[![Automated Tests](https://img.shields.io/badge/Tests-6%2F6%20Passing-brightgreen?style=for-the-badge&logo=node.js)](devflow-api/test/)
[![Frontend Build](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-blue?style=for-the-badge&logo=react)](devflow-pro/)
[![Backend Architecture](https://img.shields.io/badge/Backend-Express%205%20%2B%20TypeScript-orange?style=for-the-badge&logo=express)](devflow-api/)
[![Showcase](https://img.shields.io/badge/Docs-Showcase%20%26%20Screenshots-purple?style=for-the-badge)](docs/showcase/README.md)
[![Status](https://img.shields.io/badge/Status-100%25%20Complete%20%26%20Certified-success?style=for-the-badge)]()

> **Full-Stack Task Engineering, Job Pipeline Tracking & Real-Time Focus Analytics**  
> Built for modern software engineers to manage active engineering tasks, track multi-stage job applications, analyze coding session velocity, and collaborate via WebSockets with Redis caching and PostgreSQL persistence.

---

## 📸 Canonical Showcase Gallery

### 1. Unified Authentication & Developer Hub
| Screen | Screenshot | Key Features |
|---|---|---|
| **Login & Register Portal** | ![Login Portal](screenshots/devflow_01_login_portal.png) | High-contrast dark authentication gateway with JWT access & refresh token rotation. |
| **Developer Dashboard** | ![Dashboard](screenshots/devflow_02_dashboard.png) | Executive command center with session timers, quick task dispatch, and productivity metrics. |

### 2. Core Task & Job Workflows
| Screen | Screenshot | Key Features |
|---|---|---|
| **Task Engineering Manager** | ![Tasks Manager](screenshots/devflow_03_tasks_manager.png) | Priority-tagged Kanban task matrix with real-time Socket.io live dispatch (`task:new`, `task:updated`). |
| **Job Application Tracker** | ![Job Tracker](screenshots/devflow_04_job_tracker.png) | Interactive career pipeline with status chips (Applied, Interview, Offer, Rejected) and salary range analysis. |

### 3. Analytics & Environment Settings
| Screen | Screenshot | Key Features |
|---|---|---|
| **Coding Session Analytics** | ![Analytics](screenshots/devflow_05_analytics_sessions.png) | Session velocity graphs, completion ratios, and time-in-flow metrics. |
| **Settings & Preferences** | ![Settings](screenshots/devflow_06_settings_portal.png) | Profile preferences, notification controls, and API token management. |

---

## 🛠️ Architecture & Tech Stack

- **Frontend (`devflow-pro/`)**:
  - React 19 + TypeScript + Vite 8
  - State Management: Zustand + TanStack React Query v5
  - Styling: Custom modern dark-theme tokens with responsive layout
  - Real-Time: Socket.io Client for instant task synchronization
- **Backend (`devflow-api/`)**:
  - Node.js + Express 5 + TypeScript
  - Security: Helmet, CORS, Rate Limiting, HTTP-only Cookie Refresh Tokens
  - Real-Time: Socket.io Room Clustering
  - Caching & Persistence: Redis Cloud (`ioredis`) + PostgreSQL (`pg`) + MongoDB Atlas
- **Automated Tests**:
  - `node:test` runner via `tsx`
  - 6/6 tests passing (Health, Auth Security, Protected Task/Job Routes, Token Refresh)
