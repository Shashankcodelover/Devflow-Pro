# DevFlow Pro

DevFlow Pro is a full-stack task and job tracking application built with a React frontend and an Express/Node.js backend.

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
