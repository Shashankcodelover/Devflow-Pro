# DevFlow Pro — System Architecture

DevFlow Pro is a full-stack developer task management engine backed by PostgreSQL and Express TypeScript backend with real-time Socket.io board synchronization.

## Architecture Layers

```
[React 18 + TypeScript Frontend]
       │
       ├─ REST API (JWT Headers) ──► [Express TypeScript Backend]
       └─ WebSocket Events ─────────► [Socket.io Engine]
                                               │
                                               ▼
                                     [PostgreSQL Database]
```
