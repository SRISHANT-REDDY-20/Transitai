# TransitAI — Architecture Document

## 1. System Overview

TransitAI is a multi-tenant SaaS platform for educational institution transportation management. It serves colleges, universities, and schools with real-time GPS tracking, QR-based attendance, fee management, AI analytics, and fleet operations.

## 2. Architectural Style

**Microservices-Ready Monolith** (Modular Monolith)
- Start as a modular monolith for rapid development and deployment
- Each domain module is self-contained with clear boundaries
- Can be extracted into microservices when scale demands it
- Communication via internal event bus (prepared for message queue migration)

## 3. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Web App │  │ Mobile   │  │ Driver   │  │ Admin    │     │
│  │ (React)  │  │ (PWA)    │  │ (PWA)    │  │ Dashboard│     │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘     │
└───────┼─────────────┼─────────────┼─────────────┼─────────────┘
        │             │             │             │
        └─────────────┴──────┬──────┴─────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────┐
│                    API GATEWAY / LOAD BALANCER                 │
│              (Rate Limiting, SSL Termination)                  │
└────────────────────────────┼─────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────┐
│                    APPLICATION LAYER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Express    │  │  Socket.IO   │  │   Bull Queue │        │
│  │   REST API   │  │  Real-time   │  │   Workers    │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
└─────────┼─────────────────┼─────────────────┼──────────────────┘
          │                 │                 │
┌─────────┼─────────────────┼─────────────────┼──────────────────┐
│         │      DOMAIN MODULES (Modular Monolith)              │
│  ┌──────┴──┐ ┌──────┴──┐ ┌──────┴──┐ ┌──────┴──┐ ┌──────┴──┐ │
│  │  Auth   │ │ College │ │  User   │ │  Route  │ │   Bus   │ │
│  │ Module  │ │ Module  │ │ Module  │ │ Module  │ │ Module  │ │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ │
│  ┌────┴────┐ ┌────┴────┐ ┌────┴────┐ ┌────┴────┐ ┌────┴────┐ │
│  │  Trip   │ │  GPS    │ │   Fee   │ │  Maint. │ │   AI    │ │
│  │ Module  │ │ Module  │ │ Module  │ │ Module  │ │ Module  │ │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ │
│  ┌────┴────┐ ┌────┴────┐ ┌────┴────┐ ┌────┴────┐        │      │
│  │Notif.   │ │Complaint│ │  Audit  │ │Analytics│        │      │
│  │Module   │ │ Module  │ │ Module  │ │ Module  │        │      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘        │      │
└─────────────────────────────────────────────────────────┼──────┘
          │                                               │
┌─────────┼───────────────────────────────────────────────┼──────┐
│         │              DATA LAYER                        │      │
│  ┌──────┴──────┐  ┌──────────────┐  ┌──────────────────┐│      │
│  │  MongoDB    │  │    Redis     │  │   Cloudinary     ││      │
│  │  (Primary)  │  │  (Cache/Queue│  │   (Files/Images) ││      │
│  └─────────────┘  └──────────────┘  └──────────────────┘│      │
│  ┌──────────────┐  ┌──────────────┐                      │      │
│  │Firebase FCM  │  │   Socket.IO  │                      │      │
│  │(Push Notif.) │  │   (Pub/Sub)  │                      │      │
│  └──────────────┘  └──────────────┘                      │      │
└─────────────────────────────────────────────────────────┘      │
```

## 4. Domain-Driven Design (DDD) Boundaries

| Module | Responsibility | Key Entities |
|--------|---------------|--------------|
| Auth | Authentication, RBAC, JWT, Sessions | User, Role, Permission, Session |
| College | Multi-tenancy, college onboarding | College, CollegeSettings, Subscription |
| User | Student, Parent, Driver, Staff management | Student, Parent, Driver, Staff |
| Route | Route planning, stops, schedules | Route, Stop, Schedule, RouteAssignment |
| Bus | Fleet, maintenance, documents | Bus, Maintenance, Document, FuelLog |
| Trip | Trip execution, status, history | Trip, TripStop, TripEvent |
| GPS | Real-time tracking, geofencing | GPSLog, Geofence, LocationHistory |
| Fee | Billing, payments, receipts | FeeStructure, Invoice, Payment, Receipt |
| Notification | Push, SMS, email, in-app | Notification, NotificationTemplate |
| Complaint | Issue tracking, AI classification | Complaint, ComplaintCategory |
| Audit | Compliance, activity logs | AuditLog, SystemEvent |
| Analytics | Reports, dashboards, AI insights | Report, Dashboard, Metric |
| AI | NLP, recommendations, summaries | AIQuery, AIResponse, ModelConfig |

## 5. Multi-Tenant Strategy

**Database-per-Tenant (Logical Isolation)**
- Single MongoDB database with `collegeId` field on every collection
- Compound indexes on `[collegeId, ...]` for query performance
- Middleware automatically filters by `collegeId` from JWT context
- Super Admin bypasses tenant filter via `isSuperAdmin` flag

**Tenant Resolution:**
1. Subdomain: `college1.transitai.app` → resolve college
2. Header: `X-College-ID: 123` → explicit tenant
3. JWT claim: `collegeId` embedded in token

## 6. Authentication & Authorization

**JWT Strategy:**
- Access Token: 15 minutes, contains `userId`, `role`, `collegeId`, `permissions[]`
- Refresh Token: 7 days, stored in Redis (rotating)
- Token blacklist on logout

**RBAC Hierarchy:**
```
Super Admin
  └── College Admin
        ├── Transport Manager
        ├── Accountant
        ├── Security Guard
        ├── Driver
        ├── Student
        └── Parent
```

**Permission Matrix:**
- 50+ granular permissions (e.g., `trip:read`, `trip:update`, `fee:create`)
- Role = collection of permissions
- Middleware checks both role AND permission

## 7. Real-Time Architecture

**Socket.IO Rooms:**
- `college:{collegeId}` — college-wide broadcasts
- `bus:{busId}` — specific bus tracking
- `trip:{tripId}` — trip-specific updates
- `user:{userId}` — personal notifications
- `driver:{driverId}` — driver commands

**GPS Pipeline:**
```
Driver App → POST /gps (every 5s)
           → Redis GeoAdd (spatial index)
           → Socket.IO broadcast to room `bus:{busId}`
           → MongoDB insert (batch every 30s)
           → Geofence check → Alert if violated
```

**Offline Buffering:**
- Driver app queues GPS points in IndexedDB
- Syncs when connection restored
- Server deduplicates by `(driverId, timestamp)` hash

## 8. AI Architecture

**AI Services (Modular):**
1. **Chat Assistant** — OpenAI GPT-4o / Claude 3.5 Sonnet via API
2. **Complaint Classification** — Fine-tuned text classification
3. **Trip Summary** — LLM summarization of trip events
4. **Driver Performance** — Rule engine + LLM narrative generation
5. **Maintenance Recommendation** — Time-series forecasting + rules
6. **Analytics NLP** — Natural language → MongoDB aggregation pipeline
7. **Executive Report** — Automated report generation

**AI Pipeline:**
```
User Query → Intent Classification → Route to AI Service
                                      ↓
                           Context Retrieval (RAG)
                                      ↓
                           LLM Generation + Structured Output
                                      ↓
                           Response + Confidence Score
```

## 9. Security Architecture

| Layer | Measures |
|-------|----------|
| Network | HTTPS, CORS, Rate Limiting, IP Whitelisting |
| Application | Helmet, Input Sanitization, XSS Protection, CSRF Tokens |
| Authentication | JWT, Bcrypt (cost=12), MFA (optional), Session Management |
| Authorization | RBAC, ABAC (Attribute-Based), Resource Ownership |
| Data | Field-level encryption (PII), AES-256 at rest, TLS in transit |
| Audit | Immutable audit logs, tamper detection |
| File Upload | Virus scan, type validation, size limits, Cloudinary secure URLs |

## 10. Scalability Strategy

**Horizontal Scaling:**
- Stateless API servers behind load balancer
- Redis for session sharing across instances
- MongoDB replica sets + sharding (when needed)
- Socket.IO with Redis adapter for multi-instance broadcast

**Performance:**
- Redis caching: User sessions, college configs, route data
- MongoDB indexes: All query paths optimized
- Pagination: Cursor-based for large datasets
- Compression: Brotli for API responses
- CDN: Cloudinary for static assets

**Database Sharding Strategy:**
- Shard key: `collegeId` (natural tenant boundary)
- Hot colleges → dedicated shards
- Archive old trips to cold storage (S3 + Athena)

## 11. Deployment Architecture

```
┌─────────────────────────────────────────┐
│              Vercel (Frontend)          │
│         CDN + Edge Functions            │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────┼───────────────────────┐
│           Railway (Backend)             │
│  ┌───────────┐  ┌───────────┐           │
│  │ API Server│  │ Worker    │           │
│  │ (3 replicas│  │ (Bull)    │           │
│  └───────────┘  └───────────┘           │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────┼───────────────────────┐
│         MongoDB Atlas (Database)        │
│    Replica Set + Automated Backups      │
└─────────────────────────────────────────┘
                  │
┌─────────────────┼───────────────────────┐
│         Redis Cloud (Cache/Queue)       │
│         Upstash / Redis Enterprise        │
└─────────────────────────────────────────┘
```

## 12. Technology Justifications

| Choice | Reason |
|--------|--------|
| React 19 + Vite | Latest React features, fast HMR, optimal bundle |
| Tailwind + Shadcn | Rapid UI development, consistent design system |
| Zustand | Lightweight, no boilerplate, TypeScript-friendly |
| TanStack Query | Server state management, caching, background sync |
| Express + TypeScript | Mature ecosystem, strong typing, middleware pattern |
| MongoDB | Flexible schema for multi-tenant, geospatial queries, horizontal scale |
| Mongoose | Schema validation, middleware, aggregation helpers |
| Socket.IO | Fallback support, room management, reconnection handling |
| Redis | Caching, pub/sub, rate limiting, session store, job queues |
| Bull Queue | Job scheduling, retry logic, dashboard UI |
| Cloudinary | Image optimization, transformations, CDN delivery |
| Firebase FCM | Free push notifications, topic-based messaging |
| GitHub Actions | Native integration, matrix builds, deployment automation |

## 13. Data Flow Diagrams

### GPS Tracking Flow
```
Driver App → GPS Service → Redis (Geo) → Socket.IO → Client Maps
                     ↓
              MongoDB (History)
                     ↓
              Geofence Service → Alert Service → FCM → Parent App
```

### QR Boarding Flow
```
Driver Scan → Attendance Service → Fee Check → Alert (if pending)
                          ↓
                    MongoDB (Attendance)
                          ↓
                    Notification Service → FCM → Parent
                          ↓
                    Socket.IO → Admin Dashboard
```

### Fee Payment Flow
```
Student/Parent → Payment Gateway (Stripe/Razorpay)
                          ↓
                    Webhook → Payment Service
                          ↓
                    Invoice Generation → Email
                          ↓
                    Receipt → Cloudinary PDF
                          ↓
                    Notification → All stakeholders
```

## 14. Error Handling Strategy

- **API Layer:** Standardized error responses `{ success: false, error: { code, message, details } }`
- **Service Layer:** Custom error classes (ValidationError, NotFoundError, UnauthorizedError)
- **Global Handler:** Express error middleware with logging
- **Client:** TanStack Query error boundaries, retry logic
- **Critical Errors:** PagerDuty/Slack integration (prepared)

## 15. Monitoring & Observability

- **Logging:** Winston (structured JSON logs)
- **Metrics:** Prometheus + Grafana (prepared)
- **APM:** Sentry for error tracking
- **Uptime:** UptimeRobot / Pingdom
- **Health Checks:** `/health`, `/ready`, `/metrics` endpoints

---

*Document Version: 1.0*
*Last Updated: 2026-07-18*
*Author: TransitAI Engineering Team*
