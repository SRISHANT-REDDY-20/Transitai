# TransitAI — API Specification

## Base URL
```
Production:  https://api.transitai.app/v1
Development: http://localhost:5000/v1
```

## Authentication
All endpoints require Bearer token except `/auth/*`.
```
Authorization: Bearer <access_token>
X-College-ID: <college_id>  // Required for multi-tenant routes
```

## Response Format
```json
{
  "success": true,
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  },
  "timestamp": "2026-07-18T12:00:00Z"
}
```

## Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Email is required" }
    ]
  },
  "timestamp": "2026-07-18T12:00:00Z"
}
```

---

## 1. AUTHENTICATION

### POST /auth/register
Register a new user (Super Admin only for college creation).

**Request:**
```json
{
  "email": "admin@college.edu",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210",
  "role": "COLLEGE_ADMIN",
  "collegeId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "role": "..." },
    "tokens": {
      "accessToken": "eyJhbG...",
      "refreshToken": "dGhpcyB...",
      "expiresIn": 900
    }
  }
}
```

### POST /auth/login
Authenticate user.

**Request:**
```json
{
  "email": "admin@college.edu",
  "password": "SecurePass123!",
  "deviceId": "web-chrome-123",
  "deviceInfo": "Chrome 126 / Windows 11"
}
```

**Response:** Same as register.

### POST /auth/refresh
Refresh access token.

**Request:**
```json
{ "refreshToken": "dGhpcyB..." }
```

### POST /auth/logout
Invalidate tokens.

**Request:**
```json
{ "refreshToken": "dGhpcyB...", "allDevices": false }
```

### POST /auth/forgot-password
Send reset email.

### POST /auth/reset-password
Reset with token.

### POST /auth/change-password
Change current password (authenticated).

### GET /auth/me
Get current user profile.

### PUT /auth/me
Update current user profile.

---

## 2. COLLEGES (Super Admin)

### GET /colleges
List all colleges with pagination.

**Query:** `?page=1&limit=20&status=ACTIVE&search=tech`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Tech University",
      "slug": "tech-university",
      "subdomain": "tech-uni",
      "status": "ACTIVE",
      "subscription": { "plan": "PRO", "expiresAt": "..." },
      "stats": { "students": 500, "buses": 12, "drivers": 15 }
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 50 }
}
```

### POST /colleges
Create new college.

**Request:**
```json
{
  "name": "Tech University",
  "slug": "tech-university",
  "subdomain": "tech-uni",
  "address": {
    "street": "123 Campus Road",
    "city": "Bangalore",
    "state": "Karnataka",
    "country": "India",
    "zipCode": "560001",
    "coordinates": { "lat": 12.9716, "lng": 77.5946 }
  },
  "contact": {
    "phone": "+918012345678",
    "email": "contact@techuni.edu",
    "website": "https://techuni.edu"
  },
  "subscription": {
    "plan": "PRO",
    "maxBuses": 20,
    "maxStudents": 1000,
    "maxDrivers": 25
  }
}
```

### GET /colleges/:id
Get college details.

### PUT /colleges/:id
Update college.

### DELETE /colleges/:id
Soft delete college.

### GET /colleges/:id/settings
Get college settings.

### PUT /colleges/:id/settings
Update college settings.

### GET /colleges/:id/stats
Get college dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalStudents": 500,
    "totalBuses": 12,
    "totalDrivers": 15,
    "activeTrips": 8,
    "todayAttendance": 485,
    "pendingFees": 45000,
    "overdueInvoices": 23,
    "maintenanceDue": 2,
    "complaintsOpen": 5,
    "averageDelay": 3.5,
    "onTimePercentage": 92
  }
}
```

---

## 3. USERS

### GET /users
List users with filters.

**Query:** `?role=DRIVER&status=ACTIVE&search=john&page=1&limit=20`

### POST /users
Create user (Admin/Manager).

**Request:**
```json
{
  "email": "driver1@college.edu",
  "password": "TempPass123!",
  "firstName": "Rajesh",
  "lastName": "Kumar",
  "phone": "+919876543210",
  "role": "DRIVER",
  "permissions": ["trip:read", "trip:update"]
}
```

### GET /users/:id
Get user details.

### PUT /users/:id
Update user.

### DELETE /users/:id
Soft delete user.

### PUT /users/:id/activate
Activate/deactivate user.

### PUT /users/:id/permissions
Update user permissions.

---

## 4. STUDENTS

### GET /students
List students with filters.

**Query:** `?route=route_id&bus=bus_id&feeStatus=OVERDUE&search=john`

### POST /students
Create student.

**Request:**
```json
{
  "email": "student@college.edu",
  "password": "StudentPass123!",
  "firstName": "Alice",
  "lastName": "Smith",
  "phone": "+919876543210",
  "studentId": "TU2025001",
  "department": "Computer Science",
  "course": "B.Tech",
  "year": 2,
  "semester": 4,
  "dateOfBirth": "2004-05-15",
  "gender": "FEMALE",
  "bloodGroup": "O+",
  "address": {
    "street": "456 Student Lane",
    "city": "Bangalore",
    "state": "Karnataka",
    "zipCode": "560002",
    "coordinates": { "lat": 12.9352, "lng": 77.6245 }
  },
  "emergencyContacts": [
    { "name": "Robert Smith", "relation": "FATHER", "phone": "+919876543211", "isPrimary": true }
  ],
  "assignedRoute": "route_id",
  "assignedStop": "stop_id",
  "parentIds": ["parent_id"]
}
```

### GET /students/:id
Get student with full details.

### PUT /students/:id
Update student.

### DELETE /students/:id
Soft delete student.

### GET /students/:id/attendance
Get student attendance history.

**Query:** `?from=2026-01-01&to=2026-07-18&page=1&limit=20`

### GET /students/:id/fees
Get student fee status.

### GET /students/:id/trips
Get student trip history.

### GET /students/:id/qr-pass
Generate/retrieve QR bus pass.

**Response:**
```json
{
  "success": true,
  "data": {
    "qrCode": "TRANSIT_AI_STU_abc123xyz",
    "qrImageUrl": "https://res.cloudinary.com/.../qr.png",
    "expiresAt": "2026-12-31T23:59:59Z",
    "isActive": true
  }
}
```

---

## 5. DRIVERS

### GET /drivers
List drivers.

### POST /drivers
Create driver.

**Request:**
```json
{
  "email": "driver@college.edu",
  "password": "DriverPass123!",
  "firstName": "Suresh",
  "lastName": "Patel",
  "phone": "+919876543210",
  "licenseNumber": "KA-01-2024-1234567",
  "licenseExpiry": "2029-06-30",
  "experienceYears": 5,
  "assignedBus": "bus_id"
}
```

### GET /drivers/:id
Get driver details.

### PUT /drivers/:id
Update driver.

### GET /drivers/:id/performance
Get driver performance metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTrips": 245,
    "averageRating": 4.7,
    "onTimePercentage": 94.5,
    "overspeedingCount": 3,
    "harshBrakingCount": 8,
    "idleTimeMinutes": 45,
    "aiSummary": "Suresh maintains excellent punctuality with a 94.5% on-time record...",
    "monthlyStats": [
      { "month": "2026-06", "trips": 42, "rating": 4.8, "delayAvg": 2.1 }
    ]
  }
}
```

### GET /drivers/:id/trips
Get driver trip history.

---

## 6. BUSES

### GET /buses
List buses.

### POST /buses
Create bus.

**Request:**
```json
{
  "registrationNumber": "KA-01-AB-1234",
  "model": "Tata Starbus Ultra",
  "manufacturer": "Tata Motors",
  "year": 2023,
  "capacity": 52,
  "color": "Yellow",
  "type": "BUS",
  "fuelType": "DIESEL",
  "mileage": 45000,
  "assignedDriver": "driver_id",
  "assignedRoute": "route_id",
  "documents": [
    { "type": "INSURANCE", "number": "INS-2024-001", "expiryDate": "2025-06-30" }
  ]
}
```

### GET /buses/:id
Get bus details.

### PUT /buses/:id
Update bus.

### DELETE /buses/:id
Soft delete bus.

### GET /buses/:id/location
Get current bus location.

**Response:**
```json
{
  "success": true,
  "data": {
    "busId": "...",
    "location": { "lat": 12.9716, "lng": 77.5946 },
    "speed": 35,
    "heading": 180,
    "updatedAt": "2026-07-18T12:05:00Z",
    "driver": { "id": "...", "name": "Suresh Patel" },
    "currentTrip": { "id": "...", "routeName": "Route A - Morning" }
  }
}
```

### GET /buses/:id/maintenance
Get maintenance history.

### POST /buses/:id/maintenance
Add maintenance record.

### GET /buses/:id/documents
Get document status.

---

## 7. ROUTES

### GET /routes
List routes.

### POST /routes
Create route.

**Request:**
```json
{
  "name": "Route A - Koramangala to Campus",
  "code": "RTE-A",
  "description": "Morning route from Koramangala to main campus",
  "type": "MORNING",
  "stops": [
    {
      "name": "Koramangala Bus Stand",
      "address": "Koramangala, Bangalore",
      "coordinates": { "lat": 12.9352, "lng": 77.6245 },
      "order": 1,
      "estimatedArrivalTime": "07:30",
      "estimatedDepartureTime": "07:35",
      "radius": 100
    },
    {
      "name": "Tech University Campus",
      "address": "Campus Road, Bangalore",
      "coordinates": { "lat": 12.9716, "lng": 77.5946 },
      "order": 2,
      "estimatedArrivalTime": "08:15",
      "isCollege": true
    }
  ],
  "assignedBuses": ["bus_id"],
  "assignedDrivers": ["driver_id"]
}
```

### GET /routes/:id
Get route with stops.

### PUT /routes/:id
Update route.

### DELETE /routes/:id
Soft delete route.

### GET /routes/:id/students
Get students on this route.

### GET /routes/:id/trips
Get trip history for route.

---

## 8. TRIPS

### GET /trips
List trips with filters.

**Query:** `?date=2026-07-18&status=STARTED&route=route_id&bus=bus_id`

### POST /trips
Schedule a trip.

**Request:**
```json
{
  "routeId": "route_id",
  "busId": "bus_id",
  "driverId": "driver_id",
  "type": "MORNING",
  "date": "2026-07-19",
  "scheduledStartTime": "2026-07-19T07:30:00Z",
  "scheduledEndTime": "2026-07-19T08:30:00Z"
}
```

### GET /trips/:id
Get trip details.

### PUT /trips/:id/start
Start trip (Driver).

**Request:**
```json
{
  "location": { "lat": 12.9352, "lng": 77.6245 },
  "odometerReading": 45200
}
```

### PUT /trips/:id/pause
Pause trip.

### PUT /trips/:id/resume
Resume trip.

### PUT /trips/:id/complete
Complete trip.

**Request:**
```json
{
  "location": { "lat": 12.9716, "lng": 77.5946 },
  "odometerReading": 45235,
  "fuelConsumed": 5.2
}
```

### PUT /trips/:id/cancel
Cancel trip.

### GET /trips/:id/attendance
Get trip attendance.

### GET /trips/:id/gps
Get GPS trail for trip.

**Query:** `?interval=5` (seconds)

### GET /trips/:id/replay
Get trip replay data.

**Response:**
```json
{
  "success": true,
  "data": {
    "trip": { "..." },
    "gpsTrail": [
      { "timestamp": "...", "location": { "lat": 12.935, "lng": 77.624 }, "speed": 30 }
    ],
    "events": [
      { "type": "STOP_ARRIVAL", "stopName": "...", "timestamp": "...", "delay": 2 }
    ],
    "attendance": [
      { "studentName": "...", "type": "BOARDING", "time": "..." }
    ]
  }
}
```

---

## 9. ATTENDANCE (QR BOARDING)

### POST /attendance/scan
Scan student QR code.

**Request:**
```json
{
  "qrCode": "TRANSIT_AI_STU_abc123xyz",
  "tripId": "trip_id",
  "stopId": "stop_id",
  "type": "BOARDING",
  "location": { "lat": 12.9352, "lng": 77.6245 },
  "photoUrl": "https://..."  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "attendance": {
      "id": "...",
      "studentId": "...",
      "studentName": "Alice Smith",
      "type": "BOARDING",
      "scannedAt": "2026-07-18T07:35:00Z",
      "status": "VALID"
    },
    "alerts": [
      {
        "type": "PENDING_FEE",
        "severity": "HIGH",
        "message": "Student has pending fees of Rs.5,000",
        "action": "WARN"
      }
    ],
    "notificationsSent": ["PARENT", "TRANSPORT_MANAGER", "ACCOUNTANT"]
  }
}
```

### GET /attendance
List attendance records.

**Query:** `?trip=trip_id&student=student_id&type=BOARDING&date=2026-07-18`

### GET /attendance/:id
Get attendance record.

---

## 10. GPS TRACKING

### POST /gps/location
Submit GPS location (Driver app, every 5 seconds).

**Request:**
```json
{
  "busId": "bus_id",
  "tripId": "trip_id",
  "location": { "lat": 12.9352, "lng": 77.6245 },
  "speed": 35,
  "heading": 180,
  "accuracy": 5,
  "altitude": 920,
  "batteryLevel": 78,
  "timestamp": "2026-07-18T12:05:00Z",
  "isOffline": false
}
```

### POST /gps/batch
Submit buffered offline GPS points.

**Request:**
```json
{
  "locations": [
    { "lat": 12.935, "lng": 77.624, "speed": 30, "timestamp": "..." },
    { "lat": 12.936, "lng": 77.625, "speed": 32, "timestamp": "..." }
  ]
}
```

### GET /gps/buses
Get all active bus locations.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "busId": "...",
      "registrationNumber": "KA-01-AB-1234",
      "location": { "lat": 12.9716, "lng": 77.5946 },
      "speed": 35,
      "heading": 180,
      "status": "ON_TRIP",
      "driver": "Suresh Patel",
      "route": "Route A",
      "nextStop": "Tech University Campus",
      "eta": "08:15",
      "passengerCount": 42
    }
  ]
}
```

### GET /gps/buses/:id/history
Get location history.

**Query:** `?from=2026-07-18T07:00:00Z&to=2026-07-18T09:00:00Z&interval=30`

---

## 11. FEES

### GET /fees/structures
List fee structures.

### POST /fees/structures
Create fee structure.

**Request:**
```json
{
  "name": "Semester Transport Fee 2026",
  "description": "Transport fee for Semester 1, 2026",
  "type": "SEMESTER",
  "amount": 15000,
  "applicableTo": ["STUDENT"],
  "applicableRoutes": ["route_id"],
  "academicYear": "2025-2026",
  "semester": 1,
  "dueDate": "2026-08-15",
  "lateFee": { "type": "PERCENTAGE", "value": 5, "graceDays": 7 }
}
```

### GET /fees/invoices
List invoices.

**Query:** `?student=student_id&status=OVERDUE&from=2026-01-01&to=2026-07-18`

### POST /fees/invoices
Generate invoice.

**Request:**
```json
{
  "studentId": "student_id",
  "feeStructureId": "fee_structure_id",
  "items": [
    { "description": "Semester Transport Fee", "amount": 15000, "type": "BASE_FEE" }
  ],
  "discount": 0,
  "notes": "First semester transport fee"
}
```

### GET /fees/invoices/:id
Get invoice details.

### POST /fees/invoices/:id/pay
Process payment.

**Request:**
```json
{
  "amount": 15000,
  "method": "UPI",
  "upiId": "student@upi"
}
```

### GET /fees/invoices/:id/receipt
Get payment receipt.

### GET /fees/pending
Get all pending fees summary.

### GET /fees/overdue
Get overdue fees with alerts.

### POST /fees/reminders/send
Send fee reminders.

**Request:**
```json
{
  "invoiceIds": ["invoice_id"],
  "channels": ["EMAIL", "SMS", "PUSH"]
}
```

---

## 12. MAINTENANCE

### GET /maintenance
List maintenance records.

### POST /maintenance
Create maintenance record.

**Request:**
```json
{
  "busId": "bus_id",
  "type": "SERVICE",
  "category": "ENGINE",
  "description": "Regular engine service and oil change",
  "cost": 8500,
  "serviceProvider": "AutoCare Bangalore",
  "serviceProviderContact": "+918012345678",
  "partsReplaced": [
    { "name": "Engine Oil", "cost": 2500, "warrantyMonths": 6 }
  ],
  "odometerReading": 45000,
  "nextServiceOdometer": 50000,
  "nextServiceDate": "2026-10-18",
  "scheduledDate": "2026-07-20"
}
```

### GET /maintenance/:id
Get maintenance details.

### PUT /maintenance/:id
Update maintenance.

### GET /maintenance/upcoming
Get upcoming maintenance.

### GET /maintenance/overdue
Get overdue maintenance.

### GET /maintenance/ai-recommendations
Get AI maintenance recommendations.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "busId": "...",
      "registrationNumber": "KA-01-AB-1234",
      "recommendation": "Based on 45,000 km mileage and recent harsh braking patterns...",
      "priority": "HIGH",
      "suggestedAction": "Brake pad inspection within 500 km",
      "estimatedCost": 3500,
      "confidence": 0.92
    }
  ]
}
```

---

## 13. COMPLAINTS

### GET /complaints
List complaints.

**Query:** `?status=OPEN&priority=HIGH&category=DRIVER_BEHAVIOR`

### POST /complaints
Create complaint.

**Request:**
```json
{
  "title": "Bus AC not working",
  "description": "The AC in bus KA-01-AB-1234 is not working since yesterday",
  "category": "BUS_CONDITION",
  "priority": "MEDIUM",
  "relatedBusId": "bus_id",
  "relatedTripId": "trip_id"
}
```

### GET /complaints/:id
Get complaint details.

### PUT /complaints/:id
Update complaint.

### PUT /complaints/:id/assign
Assign complaint.

### PUT /complaints/:id/resolve
Resolve complaint.

### GET /complaints/ai-classify
AI classify complaint text.

**Request:**
```json
{ "text": "The driver was driving very fast and didn't stop at my stop" }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "category": "DRIVER_BEHAVIOR",
    "confidence": 0.94,
    "priority": "HIGH",
    "suggestedActions": ["Review driver performance", "Check GPS logs for speeding"]
  }
}
```

---

## 14. NOTIFICATIONS

### GET /notifications
List user notifications.

**Query:** `?unreadOnly=true&page=1&limit=20`

### PUT /notifications/:id/read
Mark as read.

### PUT /notifications/read-all
Mark all as read.

### DELETE /notifications/:id
Delete notification.

### POST /notifications/send
Send notification (Admin).

**Request:**
```json
{
  "userIds": ["user_id"],
  "title": "Bus Delay Alert",
  "body": "Bus KA-01-AB-1234 is running 15 minutes late due to traffic",
  "category": "DELAY",
  "priority": "HIGH",
  "channels": ["PUSH", "EMAIL"],
  "data": { "tripId": "...", "busId": "..." }
}
```

---

## 15. ANALYTICS

### GET /analytics/dashboard
Get admin dashboard data.

**Response:**
```json
{
  "success": true,
  "data": {
    "kpiCards": [
      { "title": "Active Buses", "value": 8, "change": 0, "trend": "stable" },
      { "title": "Students Onboard", "value": 485, "change": 12, "trend": "up" }
    ],
    "charts": {
      "dailyTrips": { "labels": ["Mon", "Tue"], "data": [12, 14] },
      "onTimePerformance": { "labels": ["Route A", "Route B"], "data": [92, 88] }
    }
  }
}
```

### GET /analytics/trips
Get trip analytics.

**Query:** `?from=2026-06-01&to=2026-07-18&groupBy=DAY`

### GET /analytics/drivers
Get driver performance analytics.

### GET /analytics/routes
Get route performance analytics.

### GET /analytics/fees
Get fee collection analytics.

### GET /analytics/ai-query
Natural language analytics query.

**Request:**
```json
{ "query": "Which route has the highest average delay this month?" }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "query": "Which route has the highest average delay this month?",
    "intent": "ROUTE_PERFORMANCE_QUERY",
    "result": {
      "route": "Route C - Whitefield",
      "averageDelay": 8.5,
      "unit": "minutes",
      "comparison": "35% higher than average"
    },
    "chart": {
      "type": "bar",
      "labels": ["Route A", "Route B", "Route C"],
      "data": [2.1, 3.5, 8.5]
    },
    "explanation": "Route C has the highest average delay at 8.5 minutes..."
  }
}
```

### GET /analytics/reports/monthly
Generate monthly executive report.

**Response:**
```json
{
  "success": true,
  "data": {
    "month": "June 2026",
    "summary": "AI-generated executive summary...",
    "sections": [
      { "title": "Fleet Performance", "content": "...", "metrics": {} },
      { "title": "Safety Incidents", "content": "...", "metrics": {} },
      { "title": "Financial Overview", "content": "...", "metrics": {} }
    ],
    "pdfUrl": "https://res.cloudinary.com/.../report.pdf"
  }
}
```

---

## 16. AI ASSISTANT

### POST /ai/chat
Chat with AI assistant.

**Request:**
```json
{
  "message": "Where is my bus?",
  "context": {
    "studentId": "student_id",
    "currentLocation": { "lat": 12.935, "lng": 77.624 }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "Your bus (KA-01-AB-1234) is currently 2.3 km away, approaching Koramangala stop. Estimated arrival: 7 minutes.",
    "intent": "BUS_LOCATION_QUERY",
    "confidence": 0.96,
    "actions": [
      { "type": "SHOW_MAP", "data": { "busLocation": { "lat": 12.94, "lng": 77.63 } } }
    ]
  }
}
```

### POST /ai/trip-summary
Generate trip summary.

**Request:**
```json
{ "tripId": "trip_id" }
```

### POST /ai/driver-summary
Generate driver performance summary.

**Request:**
```json
{ "driverId": "driver_id", "period": "MONTH", "month": "2026-06" }
```

### POST /ai/maintenance-recommendation
Get maintenance recommendation.

**Request:**
```json
{ "busId": "bus_id" }
```

---

## 17. AUDIT LOGS

### GET /audit-logs
List audit logs.

**Query:** `?entityType=STUDENT&action=UPDATE&user=user_id&from=2026-07-01&to=2026-07-18`

### GET /audit-logs/:id
Get audit log details.

### GET /audit-logs/export
Export audit logs.

**Query:** `?format=CSV&from=2026-01-01&to=2026-07-18`

---

## 18. SETTINGS

### GET /settings
Get college settings.

### PUT /settings
Update college settings.

### GET /settings/roles
Get role definitions.

### PUT /settings/roles/:role
Update role permissions.

---

## 19. EMERGENCY

### POST /emergency/sos
Trigger emergency alert.

**Request:**
```json
{
  "type": "DRIVER_PANIC",
  "location": { "lat": 12.935, "lng": 77.624 },
  "busId": "bus_id",
  "tripId": "trip_id",
  "message": "Medical emergency on board"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "alertId": "...",
    "status": "BROADCASTING",
    "notified": ["TRANSPORT_MANAGER", "SECURITY", "ADMIN"],
    "estimatedResponse": "2 minutes"
  }
}
```

### POST /emergency/broadcast
Send emergency broadcast.

**Request:**
```json
{
  "message": "All buses return to campus immediately due to weather alert",
  "severity": "CRITICAL",
  "target": "ALL_DRIVERS"
}
```

---

## 20. WEBSOCKET EVENTS

### Connection
```javascript
const socket = io('wss://api.transitai.app', {
  auth: { token: 'Bearer <access_token>' }
});
```

### Events

**Client to Server:**
- `gps:update` — Send GPS location
- `trip:join` — Join trip room
- `trip:leave` — Leave trip room
- `bus:subscribe` — Subscribe to bus updates
- `bus:unsubscribe` — Unsubscribe

**Server to Client:**
- `gps:location` — Bus location update
- `trip:status` — Trip status change
- `trip:stop-arrival` — Bus arrived at stop
- `trip:stop-departure` — Bus departed stop
- `attendance:scan` — QR scan event
- `notification:new` — New notification
- `emergency:alert` — Emergency alert
- `driver:sos` — Driver SOS triggered

**Room Patterns:**
- `college:{collegeId}` — College-wide events
- `bus:{busId}` — Specific bus tracking
- `trip:{tripId}` — Trip-specific events
- `user:{userId}` — Personal notifications

---

## Rate Limits

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Auth | 5 requests | 1 minute |
| General API | 100 requests | 1 minute |
| GPS | 12 requests | 1 minute |
| AI Chat | 20 requests | 1 minute |
| File Upload | 10 requests | 1 minute |

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

*Document Version: 1.0*
*Last Updated: 2026-07-18*
