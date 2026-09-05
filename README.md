# ⚡ DevFlow Pro

[![Automated Tests](https://img.shields.io/badge/Tests-6%2F6%20Passing-brightgreen?style=for-the-badge&logo=node.js)](devflow-api/test/)
[![Frontend Build](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-blue?style=for-the-badge&logo=react)](devflow-pro/)
[![Backend Architecture](https://img.shields.io/badge/Backend-Express%205%20%2B%20TypeScript-orange?style=for-the-badge&logo=express)](devflow-api/)
[![Setup Guide](https://img.shields.io/badge/Guide-Project%20Setup%20%26%20Init-orange?style=for-the-badge)](PROJECT_SETUP.md)
[![Showcase](https://img.shields.io/badge/Docs-Showcase%20%26%20Screenshots-purple?style=for-the-badge)](docs/showcase/README.md)
[![Status](https://img.shields.io/badge/Status-100%25%20Complete%20%26%20Certified-success?style=for-the-badge)]()

> **Full-Stack Task Engineering, Job Pipeline Tracking & Real-Time Focus Analytics**

> 📖 **New to the project?** Follow the complete **[Project Setup & Initialization Guide (PROJECT_SETUP.md)](PROJECT_SETUP.md)** for detailed prerequisites, Redis cache setup, MongoDB, Supabase/Postgres, and environment templates.

## Project Structure

The project is divided into two main parts:

- **devflow-pro/**: The frontend built with React, TypeScript, Vite, Zustand, and React Query. It contains pages for login, task management, job tracking, and coding session timers.
- **devflow-api/**: The backend API built with Express, TypeScript, and JSON Web Tokens (JWT). It handles user authentication (register, login, refresh tokens) and CRUD operations for tasks.

## Getting Started

To run the project locally, you need two terminal windows:

### 1. Start the Backend API
Navigate to the backend directory and start the server:
```powershell
cd devflow-api
npm install
npm run dev
```

### 2. Start the Frontend App
Navigate to the frontend directory and start the Vite dev server:
```powershell
cd devflow-pro
npm install
npm run dev
```

The frontend will be accessible at `http://localhost:5173/` and it communicates with the backend running on `http://localhost:3001/`.

## 📸 Visual Showcase

For high-resolution screenshots and architecture breakdowns of all 6 application views, see [Showcase Documentation](docs/showcase/README.md).
