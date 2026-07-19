# TransitAI

Enterprise AI-Powered Smart Transportation Management Platform

## Overview

TransitAI is a production-grade SaaS platform for managing educational institution transportation systems. It serves colleges, universities, and schools with real-time GPS tracking, QR-based attendance, fee management, AI analytics, and fleet operations.

## Features

- **Multi-Tenant Architecture**: Support unlimited colleges with complete data isolation
- **Real-Time GPS Tracking**: Live bus tracking with 5-second updates, offline buffering, geofencing
- **QR-Based Attendance**: Unique QR codes per student, driver scanning, automatic parent notifications
- **Fee Management**: Transport fees, online payments, automatic reminders, pending fee alerts
- **AI-Powered Analytics**: Natural language queries, trip summaries, driver performance analysis
- **Safety Features**: SOS button, overspeed alerts, route deviation detection, emergency broadcast
- **Fleet Management**: Maintenance schedules, document expiry tracking, fuel logs
- **Role-Based Access**: 8 roles from Super Admin to Student/Parent with granular permissions

## Tech Stack

### Frontend
- React 19 + Vite + TypeScript
- Tailwind CSS + Shadcn UI
- TanStack Query + Zustand
- React Router + Framer Motion
- Recharts + Leaflet Maps
- Socket.IO Client

### Backend
- Node.js + Express + TypeScript
- MongoDB Atlas + Mongoose
- Redis (Cache + Pub/Sub)
- Socket.IO (Real-time)
- JWT + Refresh Tokens + RBAC
- Bull Queue (Background Jobs)
- Winston Logger

### Infrastructure
- Frontend: Vercel (CDN + Edge)
- Backend: Railway (Docker)
- Database: MongoDB Atlas
- Cache: Redis Cloud (Upstash)
- CI/CD: GitHub Actions

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- Redis (local or cloud)

### Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Docker Setup
```bash
docker-compose up -d
```

## API Documentation

See [API Specification](docs/api/API_SPECIFICATION.md)

## Architecture

See [Architecture Document](docs/architecture/ARCHITECTURE.md)

## Database Schema

See [Database Schema](docs/architecture/DATABASE_SCHEMA.md)

## Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Railway)
```bash
cd backend
railway login
railway link
railway up
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...
JWT_SECRET=your-secret
JWT_REFRESH_SECRET=your-refresh-secret
CLOUDINARY_CLOUD_NAME=...
FIREBASE_PROJECT_ID=...
OPENAI_API_KEY=...
```

### Frontend (.env)
```
VITE_API_URL=https://api.transitai.app/api/v1
```

## Project Structure

```
transitai/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Redis, Logger
│   │   ├── models/          # Mongoose schemas (21 collections)
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, RBAC, Rate Limit, Validation
│   │   ├── services/        # Business services
│   │   ├── utils/           # Helpers
│   │   ├── types/           # TypeScript types & enums
│   │   └── server.ts        # Entry point
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Dashboard pages (Admin, Student, Parent, Driver)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── stores/          # Zustand stores
│   │   ├── services/        # API clients
│   │   └── App.tsx
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── docs/
│   ├── architecture/
│   └── api/
├── .github/workflows/       # CI/CD pipelines
├── docker-compose.yml
└── README.md
```

## License

MIT

## Author

TransitAI Engineering Team
