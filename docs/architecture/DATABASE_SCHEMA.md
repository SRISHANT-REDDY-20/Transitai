# TransitAI — Database Schema Design

## Design Principles

1. **Multi-Tenancy:** Every collection includes `collegeId` as the first field in compound indexes
2. **Soft Deletes:** All documents have `isDeleted` (boolean) and `deletedAt` (Date) fields
3. **Audit Fields:** `createdAt`, `updatedAt`, `createdBy`, `updatedBy` on all collections
4. **Referential Integrity:** Enforced via Mongoose middleware (pre-save, pre-delete)
5. **Indexing Strategy:** Covering indexes for common query patterns
6. **Data Types:** Consistent use of ObjectId references, enums, and embedded documents

---

## Collection: `users`

Core user accounts for all roles. Role-specific data in separate collections.

```javascript
{
  _id: ObjectId,
  collegeId: ObjectId,           // Index: 1
  email: String,                 // Index: 1, unique per college
  password: String,               // bcrypt hash
  role: String,                  // Enum: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'TRANSPORT_MANAGER', 'ACCOUNTANT', 'SECURITY_GUARD', 'DRIVER', 'STUDENT', 'PARENT']
  firstName: String,
  lastName: String,
  phone: String,
  avatar: String,                // Cloudinary URL
  isActive: Boolean,
  isEmailVerified: Boolean,
  lastLoginAt: Date,
  loginAttempts: Number,
  lockUntil: Date,
  mfaEnabled: Boolean,
  mfaSecret: String,            // encrypted
  permissions: [String],         // Override role permissions
  preferences: {
    language: String,            // 'en', 'hi', etc.
    timezone: String,
    notifications: {
      push: Boolean,
      email: Boolean,
      sms: Boolean
    }
  },
  // Audit
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,
  updatedBy: ObjectId,
  isDeleted: Boolean,
  deletedAt: Date
}
```

**Indexes:**
- `{ collegeId: 1, email: 1 }` — unique
- `{ collegeId: 1, role: 1, isActive: 1 }`
- `{ collegeId: 1, phone: 1 }`
- `{ collegeId: 1, isDeleted: 1, createdAt: -1 }`

---

## Collection: `colleges`

Tenant isolation root. Each college is a separate tenant.

```javascript
{
  _id: ObjectId,
  name: String,
  slug: String,                  // URL-friendly, unique
  subdomain: String,             // college1.transitai.app
  logo: String,                  // Cloudinary URL
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  settings: {
    timezone: String,
    currency: String,            // 'INR', 'USD'
    academicYearStart: Date,
    academicYearEnd: Date,
    feePolicy: {
      lateFeePercentage: Number,
      lateFeeGraceDays: Number,
      pendingFeeAction: String   // 'WARN', 'ALLOW', 'DENY'
    },
    qrBoarding: {
      enabled: Boolean,
      requirePhoto: Boolean,
      autoNotifyParent: Boolean
    },
    gps: {
      updateInterval: Number,    // seconds (default: 5)
      offlineBufferLimit: Number // max points to buffer
    },
    notifications: {
      boardingAlert: Boolean,
      dropAlert: Boolean,
      arrivalAlert: Boolean,
      delayAlert: Boolean,
      emergencyAlert: Boolean
    }
  },
  subscription: {
    plan: String,                // 'FREE', 'BASIC', 'PRO', 'ENTERPRISE'
    status: String,              // 'ACTIVE', 'TRIAL', 'EXPIRED', 'SUSPENDED'
    startedAt: Date,
    expiresAt: Date,
    maxBuses: Number,
    maxStudents: Number,
    maxDrivers: Number,
    features: [String]
  },
  isActive: Boolean,
  // Audit
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,
  updatedBy: ObjectId,
  isDeleted: Boolean,
  deletedAt: Date
}
```

**Indexes:**
- `{ slug: 1 }` — unique
- `{ subdomain: 1 }` — unique
- `{ 'subscription.status': 1, 'subscription.expiresAt': 1 }`
- `{ isActive: 1, isDeleted: 1 }`

---

## Collection: `students`

Student profiles linked to users.

```javascript
{
  _id: ObjectId,
  collegeId: ObjectId,
  userId: ObjectId,              // Reference: users
  studentId: String,              // College roll number
  enrollmentNumber: String,
  department: String,
  course: String,
  year: Number,
  semester: Number,
  dateOfBirth: Date,
  gender: String,                // Enum
  bloodGroup: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: { lat: Number, lng: Number }
  },
  emergencyContacts: [{
    name: String,
    relation: String,
    phone: String,
    isPrimary: Boolean
  }],
  busPass: {
    qrCode: String,              // Unique hash
    qrImage: String,             // Cloudinary URL
    issuedAt: Date,
    expiresAt: Date,
    isActive: Boolean
  },
  assignedRoute: ObjectId,        // Reference: routes
  assignedStop: ObjectId,         // Reference: stops
  assignedBus: ObjectId,          // Reference: buses
  feeStatus: {
    totalDue: Number,
    totalPaid: Number,
    lastPaymentDate: Date,
    isBlocked: Boolean
  },
  parentIds: [ObjectId],          // Reference: parents
  // Audit
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,
  updatedBy: ObjectId,
  isDeleted: Boolean,
  deletedAt: Date
}
```

**Indexes:**
- `{ collegeId: 1, studentId: 1 }` — unique
- `{ collegeId: 1, userId: 1 }` — unique
- `{ collegeId: 1, 'busPass.qrCode': 1 }`
- `{ collegeId: 1, assignedRoute: 1 }`
- `{ collegeId: 1, assignedBus: 1 }`
- `{ collegeId: 1, 'feeStatus.isBlocked': 1 }`

---

## Collection: `parents`

Parent/guardian profiles.

```javascript
{
  _id: ObjectId,
  collegeId: ObjectId,
  userId: ObjectId,
  children: [ObjectId],          // Reference: students
  relation: String,               // 'FATHER', 'MOTHER', 'GUARDIAN'
  occupation: String,
  alternatePhone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  notificationPreferences: {
    boarding: Boolean,
    drop: Boolean,
    arrival: Boolean,
    delay: Boolean,
    emergency: Boolean,
    feeReminder: Boolean
  },
  fcmTokens: [String],
  // Audit
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,
  updatedBy: ObjectId,
  isDeleted: Boolean,
  deletedAt: Date
}
```

**Indexes:**
- `{ collegeId: 1, userId: 1 }` — unique
- `{ collegeId: 1, children: 1 }`

---

## Collection: `drivers`

Driver profiles and performance metrics.

```javascript
{
  _id: ObjectId,
  collegeId: ObjectId,
  userId: ObjectId,
  licenseNumber: String,
  licenseExpiry: Date,
  licenseImage: String,
  experienceYears: Number,
  rating: Number,                 // 1-5 average
  totalTrips: Number,
  status: String,                 // 'AVAILABLE', 'ON_DUTY', 'OFF_DUTY', 'SUSPENDED'
  currentLocation: {
    lat: Number,
    lng: Number,
    updatedAt: Date
  },
  assignedBus: ObjectId,
  performance: {
    overspeedingCount: Number,
    harshBrakingCount: Number,
    idleTimeMinutes: Number,
    onTimePercentage: Number,
    averageRating: Number
  },
  documents: [{
    type: String,                // 'LICENSE', 'MEDICAL', 'BACKGROUND_CHECK'
    url: String,
    expiryDate: Date,
    verified: Boolean
  }],
  // Audit
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,
  updatedBy: ObjectId,
  isDeleted: Boolean,
  deletedAt: Date
}
```

**Indexes:**
- `{ collegeId: 1, userId: 1 }` — unique
- `{ collegeId: 1, licenseNumber: 1 }`
- `{ collegeId: 1, status: 1 }`
- `{ collegeId: 1, assignedBus: 1 }`

---

## Collection: `buses`

Fleet vehicle records.

```javascript
{
  _id: ObjectId,
  collegeId: ObjectId,
  registrationNumber: String,     // Unique per college
  busModel: string;
  manufacturer: String,
  year: Number,
  capacity: Number,
  color: String,
  type: String,                   // 'BUS', 'MINIBUS', 'VAN'
  status: String,                // 'ACTIVE', 'MAINTENANCE', 'RETIRED'
  currentLocation: {
    lat: Number,
    lng: Number,
    updatedAt: Date
  },
  assignedDriver: ObjectId,
  assignedRoute: ObjectId,
  fuelType: String,               // 'DIESEL', 'PETROL', 'CNG', 'ELECTRIC'
  mileage: Number,
  documents: [{
    type: String,                // 'INSURANCE', 'FITNESS', 'POLLUTION', 'PERMIT'
    number: String,
    url: String,
    issueDate: Date,
    expiryDate: Date,
    verified: Boolean
  }],
  maintenanceSchedule: {
    lastServiceDate: Date,
    nextServiceDate: Date,
    serviceIntervalKm: Number,
    currentKm: Number
  },
  // Audit
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,
  updatedBy: ObjectId,
  isDeleted: Boolean,
  deletedAt: Date
}
```

**Indexes:**
- `{ collegeId: 1, registrationNumber: 1 }` — unique
- `{ collegeId: 1, status: 1 }`
- `{ collegeId: 1, assignedDriver: 1 }`
- `{ collegeId: 1, 'documents.expiryDate': 1 }`
- `{ collegeId: 1, 'maintenanceSchedule.nextServiceDate': 1 }`

---

## Collection: `routes`

Bus routes with stops.

```javascript
{
  _id: ObjectId,
  collegeId: ObjectId,
  name: String,
  code: String,                   // Route identifier
  description: String,
  type: String,                   // 'MORNING', 'EVENING', 'BOTH'
  status: String,                 // 'ACTIVE', 'INACTIVE'
  totalDistanceKm: Number,
  estimatedDurationMinutes: Number,
  stops: [{
    _id: ObjectId,
    name: String,
    address: String,
    coordinates: { lat: Number, lng: Number },
    order: Number,
    estimatedArrivalTime: String,  // "HH:MM" format
    estimatedDepartureTime: String,
    radius: Number,               // meters for geofence
    landmark: String,
    isCollege: Boolean
  }],
  assignedBuses: [ObjectId],
  assignedDrivers: [ObjectId],
  // Audit
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,
  updatedBy: ObjectId,
  isDeleted: Boolean,
  deletedAt: Date
}
```

**Indexes:**
- `{ collegeId: 1, code: 1 }` — unique
- `{ collegeId: 1, status: 1 }`
- `{ collegeId: 1, 'stops.coordinates': '2dsphere' }`

---

## Collection: `trips`

Individual trip executions.

```javascript
{
  _id: ObjectId,
  collegeId: ObjectId,
  routeId: ObjectId,
  busId: ObjectId,
  driverId: ObjectId,
  type: String,                   // 'MORNING', 'EVENING'
  date: Date,
  status: String,                // 'SCHEDULED', 'STARTED', 'PAUSED', 'COMPLETED', 'CANCELLED'
  startedAt: Date,
  completedAt: Date,
  scheduledStartTime: Date,
  scheduledEndTime: Date,
  actualStartTime: Date,
  actualEndTime: Date,
  stops: [{
    stopId: ObjectId,
    scheduledArrival: Date,
    actualArrival: Date,
    scheduledDeparture: Date,
    actualDeparture: Date,
    delayMinutes: Number,
    boardedCount: Number,
    droppedCount: Number,
    status: String                 // 'PENDING', 'ARRIVED', 'DEPARTED', 'SKIPPED'
  }],
  passengerCount: {
    boarded: Number,
    dropped: Number,
    expected: Number
  },
  metrics: {
    totalDistanceKm: Number,
    averageSpeed: Number,
    maxSpeed: Number,
    idleTimeMinutes: Number,
    fuelConsumed: Number,
    overspeedingEvents: Number,
    harshBrakingEvents: Number
  },
  aiSummary: String,              // Generated after completion
  incidents: [{
    type: String,
    description: String,
    timestamp: Date,
    severity: String
  }],
  // Audit
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,
  updatedBy: ObjectId,
  isDeleted: Boolean,
  deletedAt: Date
}
```

**Indexes:**
- `{ collegeId: 1, date: -1, status: 1 }`
- `{ collegeId: 1, routeId: 1, date: -1 }`
- `{ collegeId: 1, busId: 1, date: -1 }`
- `{ collegeId: 1, driverId: 1, date: -1 }`
- `{ collegeId: 1, status: 1, date: -1 }`
- `{ collegeId: 1, date: -1, 'metrics.averageSpeed': 1 }`

---

## Collection: `attendance`

QR-based attendance records.

```javascript
{
  _id: ObjectId,
  collegeId: ObjectId,
  tripId: ObjectId,
  studentId: ObjectId,
  stopId: ObjectId,
  type: String,                   // 'BOARDING', 'DROPPING'
  scannedAt: Date,
  scannedBy: ObjectId,            // Driver who scanned
  scannedByBus: ObjectId,
  location: {
    lat: Number,
    lng: Number
  },
  qrCode: String,
  status: String,                 // 'VALID', 'INVALID_BUS', 'DUPLICATE', 'PENDING_FEE'
  feeAlertTriggered: Boolean,
  photoUrl: String,               // Optional boarding photo
  // Audit
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,
  updatedBy: ObjectId,
  isDeleted: Boolean,
  deletedAt: Date
}
```

**Indexes:**
- `{ collegeId: 1, tripId: 1, studentId: 1, type: 1 }` — unique
- `{ collegeId: 1, studentId: 1, scannedAt: -1 }`
- `{ collegeId: 1, tripId: 1, type: 1 }`
- `{ collegeId: 1, 'scannedAt': -1 }`

---

## Collection: `gps_logs`

GPS location history (time-series data).

```javascript
{
  _id: ObjectId,
  collegeId: ObjectId,
  busId: ObjectId,
  driverId: ObjectId,
  tripId: ObjectId,
  timestamp: Date,
  location: {
    type: 'Point',
    coordinates: [lng, lat]       // GeoJSON format
  },
  speed: Number,                  // km/h
  heading: Number,                // degrees
  accuracy: Number,               // meters
  altitude: Number,
  batteryLevel: Number,           // driver phone battery
  isOffline: Boolean,             // was this from offline buffer?
  syncedAt: Date,                 // when server received it
  // TTL index for automatic cleanup (90 days)
}
```

**Indexes:**
- `{ collegeId: 1, busId: 1, timestamp: -1 }`
- `{ collegeId: 1, tripId: 1, timestamp: 1 }`
- `{ location: '2dsphere' }`
- `{ timestamp: 1 }` — TTL index (expire after 90 days)

---

## Collection: `fee_structures`

Fee templates and configurations.

```javascript
{
  _id: ObjectId,
  collegeId: ObjectId,
  name: String,
  description: String,
  type: String,                   // 'MONTHLY', 'SEMESTER', 'ANNUAL', 'ONE_TIME'
  amount: Number,
  applicableTo: [String],        // ['STUDENT', 'STAFF']
  applicableRoutes: [ObjectId],   // null = all routes
  applicableBuses: [ObjectId],    // null = all buses
  academicYear: String,           // "2025-2026"
  semester: Number,
  dueDate: Date,
  lateFee: {
    type: String,                 // 'PERCENTAGE', 'FIXED'
    value: Number,
    graceDays: Number
  },
  isActive: Boolean,
  // Audit
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,
  updatedBy: ObjectId,
  isDeleted: Boolean,
  deletedAt: Date
}
```

**Indexes:**
- `{ collegeId: 1, name: 1 }`
- `{ collegeId: 1, isActive: 1 }`
- `{ collegeId: 1, academicYear: 1, semester: 1 }`

---

## Collection: `invoices`

Student fee invoices.

```javascript
{
  _id: ObjectId,
  collegeId: ObjectId,
  invoiceNumber: String,          // Unique per college
  studentId: ObjectId,
  feeStructureId: ObjectId,
  items: [{
    description: String,
    amount: Number,
    type: String                  // 'BASE_FEE', 'LATE_FEE', 'DISCOUNT'
  }],
  subtotal: Number,
  lateFee: Number,
  discount: Number,
  totalAmount: Number,
  paidAmount: Number,
  balanceDue: Number,
  status: String,                 // 'PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'WAIVED', 'CANCELLED'
  dueDate: Date,
  paidAt: Date,
  paymentMethod: String,          // 'CASH', 'CARD', 'UPI', 'NET_BANKING', 'WALLET'
  transactionId: String,
  receiptUrl: String,             // Cloudinary PDF
  reminderSentAt: [Date],
  notes: String,
  // Audit
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,
  updatedBy: ObjectId,
  isDeleted: Boolean,
  deletedAt: Date
}
```

**Indexes:**
- `{ collegeId: 1, invoiceNumber: 1 }` — unique
- `{ collegeId: 1, studentId: 1, status: 1 }`
- `{ collegeId: 1, status: 1, dueDate: 1 }`
- `{ collegeId: 1, 'balanceDue': { $gt: 0 } }`

---

## Collection: `payments`

Payment transaction records.

```javascript
{
  _id: ObjectId,
  collegeId: ObjectId,
  invoiceId: ObjectId,
  studentId: ObjectId,
  amount: Number,
  currency: String,
  status: String,                 // 'PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'
  gateway: String,                // 'RAZORPAY', 'STRIPE', 'CASH'
  gatewayTransactionId: String,
  gatewayResponse: Object,        // Raw gateway response
  paidAt: Date,
  refundedAt: Date,
  refundAmount: Number,
  refundReason: String,
  metadata: Object,
  // Audit
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,
  updatedBy: ObjectId,
  isDeleted: Boolean,
  deletedAt: Date
}
```

**Indexes:**
- `{ collegeId: 1, gatewayTransactionId: 1 }`
- `{ collegeId: 1, studentId: 1, status: 1 }`
- `{ collegeId: 1, status: 1, createdAt: -1 }`

---

## Collection: `maintenance_logs`

Fleet maintenance records.

```javascript
{
  _id: ObjectId,
  collegeId: ObjectId,
  busId: ObjectId,
  type: String,                   // 'SERVICE', 'REPAIR', 'INSPECTION', 'EMERGENCY'
  category: String,               // 'ENGINE', 'BRAKES', 'TIRES', 'ELECTRICAL', 'BODY'
  description: String,
  cost: Number,
  serviceProvider: String,
  serviceProviderContact: String,
  partsReplaced: [{
    name: String,
    cost: Number,
    warrantyMonths: Number
  }],
  odometerReading: Number,
  nextServiceOdometer: Number,
  nextServiceDate: Date,
  documents: [String],            // Cloudinary URLs
  status: String,                 // 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
  scheduledDate: Date,
  completedDate: Date,
  aiRecommendation: String,       // AI-generated maintenance advice
  // Audit
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,
  updatedBy: ObjectId,
  isDeleted: Boolean,
  deletedAt: Date
}
```

**Indexes:**
- `{ collegeId: 1, busId: 1, scheduledDate: -1 }`
- `{ collegeId: 1, status: 1, scheduledDate: 1 }`
- `{ collegeId: 1, 'nextServiceDate': 1 }`

---

## Collection: `complaints`

Issue tracking and AI classification.

```javascript
{
  _id: ObjectId,
  collegeId: ObjectId,
  ticketNumber: String,           // Unique per college
  reportedBy: ObjectId,           // User who reported
  reportedByRole: String,
  category: String,               // 'DRIVER_BEHAVIOR', 'BUS_CONDITION', 'ROUTE_ISSUE', 'SAFETY', 'FEE', 'OTHER'
  aiCategory: String,             // AI-classified category
  aiConfidence: Number,
  priority: String,               // 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  aiPriority: String,
  status: String,                 // 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ESCALATED'
  title: String,
  description: String,
  attachments: [String],
  relatedTripId: ObjectId,
  relatedBusId: ObjectId,
  relatedDriverId: ObjectId,
  assignedTo: ObjectId,
  resolution: String,
  resolvedAt: Date,
  satisfactionRating: Number,     // 1-5
  aiSummary: String,
  // Audit
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,
  updatedBy: ObjectId,
  isDeleted: Boolean,
  deletedAt: Date
}
```

**Indexes:**
- `{ collegeId: 1, ticketNumber: 1 }` — unique
- `{ collegeId: 1, status: 1, priority: 1 }`
- `{ collegeId: 1, reportedBy: 1 }`
- `{ collegeId: 1, assignedTo: 1 }`
- `{ collegeId: 1, category: 1 }`

---

## Collection: `notifications`

In-app and push notification records.

```javascript
{
  _id: ObjectId,
  collegeId: ObjectId,
  userId: ObjectId,
  type: String,                   // 'PUSH', 'EMAIL', 'SMS', 'IN_APP'
  category: String,               // 'BOARDING', 'DROP', 'ARRIVAL', 'DELAY', 'EMERGENCY', 'FEE', 'GENERAL'
  title: String,
  body: String,
  data: Object,                   // Payload for deep linking
  channels: {
    push: { sent: Boolean, sentAt: Date, delivered: Boolean },
    email: { sent: Boolean, sentAt: Date, opened: Boolean },
    sms: { sent: Boolean, sentAt: Date, delivered: Boolean },
    inApp: { read: Boolean, readAt: Date }
  },
  priority: String,               // 'LOW', 'NORMAL', 'HIGH', 'URGENT'
  expiresAt: Date,
  // Audit
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,
  updatedBy: ObjectId,
  isDeleted: Boolean,
  deletedAt: Date
}
```

**Indexes:**
- `{ collegeId: 1, userId: 1, 'channels.inApp.read': 1 }`
- `{ collegeId: 1, userId: 1, createdAt: -1 }`
- `{ collegeId: 1, category: 1 }`
- `{ expiresAt: 1 }` — TTL for cleanup

---

## Collection: `audit_logs`

Immutable audit trail.

```javascript
{
  _id: ObjectId,
  collegeId: ObjectId,
  userId: ObjectId,
  userRole: String,
  action: String,                 // 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'SCAN_QR'
  entityType: String,             // 'STUDENT', 'BUS', 'TRIP', 'FEE', etc.
  entityId: ObjectId,
  previousData: Object,           // Before change (for updates)
  newData: Object,                // After change
  metadata: {
    ipAddress: String,
    userAgent: String,
    deviceId: String,
    location: { lat: Number, lng: Number }
  },
  severity: String,             // 'INFO', 'WARNING', 'CRITICAL'
  // Audit (self-auditing)
  createdAt: Date
}
```

**Indexes:**
- `{ collegeId: 1, entityType: 1, entityId: 1 }`
- `{ collegeId: 1, userId: 1, createdAt: -1 }`
- `{ collegeId: 1, action: 1, createdAt: -1 }`
- `{ collegeId: 1, severity: 1 }`
- `{ createdAt: 1 }` — TTL (2 years)

---

## Collection: `geofences`

Virtual boundaries for alerts.

```javascript
{
  _id: ObjectId,
  collegeId: ObjectId,
  name: String,
  type: String,                   // 'COLLEGE', 'STOP', 'CUSTOM', 'DANGER_ZONE'
  referenceId: ObjectId,          // Related stop/college
  geometry: {
    type: String,                 // 'Circle', 'Polygon'
    coordinates: Object,           // GeoJSON
    radius: Number                 // For circles (meters)
  },
  alertOn: {
    entry: Boolean,
    exit: Boolean,
    dwell: Boolean
  },
  dwellTimeLimit: Number,         // minutes
  isActive: Boolean,
  // Audit
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,
  updatedBy: ObjectId,
  isDeleted: Boolean,
  deletedAt: Date
}
```

**Indexes:**
- `{ collegeId: 1, type: 1 }`
- `{ collegeId: 1, referenceId: 1 }`
- `{ geometry: '2dsphere' }`

---

## Collection: `ai_queries`

AI interaction history.

```javascript
{
  _id: ObjectId,
  collegeId: ObjectId,
  userId: ObjectId,
  userRole: String,
  query: String,
  intent: String,                 // Classified intent
  context: Object,                // Retrieved context (RAG)
  response: String,
  structuredResponse: Object,     // For chart/data queries
  modelUsed: String,
  tokensUsed: {
    prompt: Number,
    completion: Number
  },
  confidence: Number,
  feedback: {
    helpful: Boolean,
    rating: Number,
    comment: String
  },
  executionTimeMs: Number,
  // Audit
  createdAt: Date,
  updatedAt: Date,
  isDeleted: Boolean,
  deletedAt: Date
}
```

**Indexes:**
- `{ collegeId: 1, userId: 1, createdAt: -1 }`
- `{ collegeId: 1, intent: 1 }`

---

## Collection: `refresh_tokens`

JWT refresh token storage.

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  token: String,                  // Hashed
  deviceId: String,
  deviceInfo: String,
  ipAddress: String,
  expiresAt: Date,
  revoked: Boolean,
  revokedAt: Date,
  replacedBy: ObjectId,
  createdAt: Date
}
```

**Indexes:**
- `{ userId: 1, deviceId: 1 }`
- `{ token: 1 }` — unique
- `{ expiresAt: 1 }` — TTL

---

## Collection: `sessions`

Active user sessions.

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  collegeId: ObjectId,
  deviceId: String,
  deviceType: String,             // 'WEB', 'ANDROID', 'IOS', 'DRIVER_APP'
  socketId: String,
  ipAddress: String,
  location: { lat: Number, lng: Number },
  isActive: Boolean,
  lastActivityAt: Date,
  createdAt: Date
}
```

**Indexes:**
- `{ userId: 1, isActive: 1 }`
- `{ socketId: 1 }`
- `{ lastActivityAt: 1 }` — TTL (30 days inactive)

---

## Index Summary

| Collection | Total Indexes | Key Patterns |
|------------|--------------|--------------|
| users | 4 | collegeId+email, role, phone |
| colleges | 3 | slug, subdomain, subscription |
| students | 6 | studentId, qrCode, route, bus, fee |
| parents | 2 | userId, children |
| drivers | 4 | userId, license, status, bus |
| buses | 5 | regNumber, status, driver, docs, maintenance |
| routes | 3 | code, status, geo |
| trips | 6 | date, route, bus, driver, status, speed |
| attendance | 4 | trip+student, student+time, trip+type |
| gps_logs | 4 | bus+time, trip+time, geo, TTL |
| fee_structures | 3 | name, active, academicYear |
| invoices | 4 | number, student+status, dueDate, balance |
| payments | 3 | transactionId, student+status, status+time |
| maintenance_logs | 3 | bus+date, status, nextService |
| complaints | 5 | ticket, status+priority, reporter, assignee, category |
| notifications | 4 | user+read, user+time, category, TTL |
| audit_logs | 5 | entity, user+time, action, severity, TTL |
| geofences | 3 | type, reference, geo |
| ai_queries | 2 | user+time, intent |
| refresh_tokens | 3 | user+device, token, TTL |
| sessions | 3 | user+active, socket, TTL |

**Total: 78 indexes across 21 collections**

---

## Data Retention Policy

| Data Type | Retention | Action |
|-----------|-----------|--------|
| GPS Logs | 90 days | TTL auto-delete |
| Notifications | 30 days | TTL auto-delete |
| Audit Logs | 2 years | TTL auto-delete |
| Session Data | 30 days inactive | TTL auto-delete |
| Refresh Tokens | Until expiry | TTL auto-delete |
| Trip History | Permanent | Archive to S3 after 1 year |
| Attendance | Permanent | Archive to S3 after 2 years |
| Invoices | Permanent | Never delete (compliance) |

---

*Document Version: 1.0*
*Last Updated: 2026-07-18*
