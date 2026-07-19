export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  COLLEGE_ADMIN = 'COLLEGE_ADMIN',
  TRANSPORT_MANAGER = 'TRANSPORT_MANAGER',
  ACCOUNTANT = 'ACCOUNTANT',
  SECURITY_GUARD = 'SECURITY_GUARD',
  DRIVER = 'DRIVER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
}

export enum TripStatus {
  SCHEDULED = 'SCHEDULED',
  STARTED = 'STARTED',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum BusStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  RETIRED = 'RETIRED',
}

export enum DriverStatus {
  AVAILABLE = 'AVAILABLE',
  ON_DUTY = 'ON_DUTY',
  OFF_DUTY = 'OFF_DUTY',
  SUSPENDED = 'SUSPENDED',
}

export enum InvoiceStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  WAIVED = 'WAIVED',
  CANCELLED = 'CANCELLED',
}

export enum ComplaintStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  ESCALATED = 'ESCALATED',
}

export enum ComplaintPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum NotificationCategory {
  BOARDING = 'BOARDING',
  DROP = 'DROP',
  ARRIVAL = 'ARRIVAL',
  DELAY = 'DELAY',
  EMERGENCY = 'EMERGENCY',
  FEE = 'FEE',
  GENERAL = 'GENERAL',
}

export enum MaintenanceType {
  SERVICE = 'SERVICE',
  REPAIR = 'REPAIR',
  INSPECTION = 'INSPECTION',
  EMERGENCY = 'EMERGENCY',
}

export enum SubscriptionPlan {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  TRIAL = 'TRIAL',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
}

export enum AttendanceType {
  BOARDING = 'BOARDING',
  DROPPING = 'DROPPING',
}

export enum AttendanceStatus {
  VALID = 'VALID',
  INVALID_BUS = 'INVALID_BUS',
  DUPLICATE = 'DUPLICATE',
  PENDING_FEE = 'PENDING_FEE',
}

export enum FeeAction {
  WARN = 'WARN',
  ALLOW = 'ALLOW',
  DENY = 'DENY',
}

export enum EmergencyType {
  DRIVER_PANIC = 'DRIVER_PANIC',
  STUDENT_EMERGENCY = 'STUDENT_EMERGENCY',
  ACCIDENT = 'ACCIDENT',
  MEDICAL = 'MEDICAL',
  SECURITY = 'SECURITY',
}

export enum DocumentType {
  INSURANCE = 'INSURANCE',
  FITNESS = 'FITNESS',
  POLLUTION = 'POLLUTION',
  PERMIT = 'PERMIT',
  LICENSE = 'LICENSE',
  MEDICAL = 'MEDICAL',
  BACKGROUND_CHECK = 'BACKGROUND_CHECK',
}

export enum RouteType {
  MORNING = 'MORNING',
  EVENING = 'EVENING',
  BOTH = 'BOTH',
}

export enum RouteStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum BusType {
  BUS = 'BUS',
  MINIBUS = 'MINIBUS',
  VAN = 'VAN',
}

export enum FuelType {
  DIESEL = 'DIESEL',
  PETROL = 'PETROL',
  CNG = 'CNG',
  ELECTRIC = 'ELECTRIC',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  UPI = 'UPI',
  NET_BANKING = 'NET_BANKING',
  WALLET = 'WALLET',
}

export enum PaymentGateway {
  RAZORPAY = 'RAZORPAY',
  STRIPE = 'STRIPE',
  CASH = 'CASH',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
  SCAN_QR = 'SCAN_QR',
  START_TRIP = 'START_TRIP',
  END_TRIP = 'END_TRIP',
  EMERGENCY = 'EMERGENCY',
}

export enum AuditSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

export enum GeofenceType {
  COLLEGE = 'COLLEGE',
  STOP = 'STOP',
  CUSTOM = 'CUSTOM',
  DANGER_ZONE = 'DANGER_ZONE',
}

export enum FeeType {
  MONTHLY = 'MONTHLY',
  SEMESTER = 'SEMESTER',
  ANNUAL = 'ANNUAL',
  ONE_TIME = 'ONE_TIME',
}

export enum FeeItemType {
  BASE_FEE = 'BASE_FEE',
  LATE_FEE = 'LATE_FEE',
  DISCOUNT = 'DISCOUNT',
}

export enum MaintenanceCategory {
  ENGINE = 'ENGINE',
  BRAKES = 'BRAKES',
  TIRES = 'TIRES',
  ELECTRICAL = 'ELECTRICAL',
  BODY = 'BODY',
  AC = 'AC',
  TRANSMISSION = 'TRANSMISSION',
}

export enum ComplaintCategory {
  DRIVER_BEHAVIOR = 'DRIVER_BEHAVIOR',
  BUS_CONDITION = 'BUS_CONDITION',
  ROUTE_ISSUE = 'ROUTE_ISSUE',
  SAFETY = 'SAFETY',
  FEE = 'FEE',
  OTHER = 'OTHER',
}

export enum NotificationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum NotificationType {
  PUSH = 'PUSH',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  IN_APP = 'IN_APP',
}

export enum DeviceType {
  WEB = 'WEB',
  ANDROID = 'ANDROID',
  IOS = 'IOS',
  DRIVER_APP = 'DRIVER_APP',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
}

export enum ParentRelation {
  FATHER = 'FATHER',
  MOTHER = 'MOTHER',
  GUARDIAN = 'GUARDIAN',
}

export enum StopStatus {
  PENDING = 'PENDING',
  ARRIVED = 'ARRIVED',
  DEPARTED = 'DEPARTED',
  SKIPPED = 'SKIPPED',
}

export enum MaintenanceStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum Currency {
  INR = 'INR',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
}

export enum LateFeeType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export enum AIIntent {
  BUS_LOCATION_QUERY = 'BUS_LOCATION_QUERY',
  ETA_QUERY = 'ETA_QUERY',
  DRIVER_QUERY = 'DRIVER_QUERY',
  FEE_QUERY = 'FEE_QUERY',
  ROUTE_PERFORMANCE_QUERY = 'ROUTE_PERFORMANCE_QUERY',
  DRIVER_PERFORMANCE_QUERY = 'DRIVER_PERFORMANCE_QUERY',
  GENERAL_QUERY = 'GENERAL_QUERY',
}

export enum AIService {
  CHAT = 'CHAT',
  CLASSIFICATION = 'CLASSIFICATION',
  SUMMARY = 'SUMMARY',
  ANALYTICS = 'ANALYTICS',
  RECOMMENDATION = 'RECOMMENDATION',
}

export enum IncidentType {
  OVERSPEEDING = 'OVERSPEEDING',
  HARSH_BRAKING = 'HARSH_BRAKING',
  ROUTE_DEVIATION = 'ROUTE_DEVIATION',
  GEOFENCE_BREACH = 'GEOFENCE_BREACH',
  ACCIDENT = 'ACCIDENT',
  BREAKDOWN = 'BREAKDOWN',
  MEDICAL = 'MEDICAL',
  OTHER = 'OTHER',
}

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum EmergencyTarget {
  ALL_DRIVERS = 'ALL_DRIVERS',
  ALL_STUDENTS = 'ALL_STUDENTS',
  ALL_PARENTS = 'ALL_PARENTS',
  ALL_STAFF = 'ALL_STAFF',
  EVERYONE = 'EVERYONE',
}

export enum EmergencySeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum GeofenceAlertType {
  ENTRY = 'ENTRY',
  EXIT = 'EXIT',
  DWELL = 'DWELL',
}

export enum GeofenceGeometryType {
  CIRCLE = 'Circle',
  POLYGON = 'Polygon',
}

export enum FeeApplicableTo {
  STUDENT = 'STUDENT',
  STAFF = 'STAFF',
}

export enum FeeStructureStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

export enum CollegeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  GRADUATED = 'GRADUATED',
  SUSPENDED = 'SUSPENDED',
}

export enum ParentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum NotificationStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
}

// Permission definitions
export const PERMISSIONS = {
  COLLEGE: ['college:create', 'college:read', 'college:update', 'college:delete'],
  USER: ['user:create', 'user:read', 'user:update', 'user:delete'],
  STUDENT: ['student:create', 'student:read', 'student:update', 'student:delete'],
  DRIVER: ['driver:create', 'driver:read', 'driver:update', 'driver:delete'],
  BUS: ['bus:create', 'bus:read', 'bus:update', 'bus:delete'],
  ROUTE: ['route:create', 'route:read', 'route:update', 'route:delete'],
  TRIP: ['trip:create', 'trip:read', 'trip:update', 'trip:delete', 'trip:start', 'trip:end'],
  ATTENDANCE: ['attendance:read', 'attendance:scan'],
  FEE: ['fee:create', 'fee:read', 'fee:update', 'fee:delete', 'fee:collect'],
  MAINTENANCE: ['maintenance:create', 'maintenance:read', 'maintenance:update'],
  COMPLAINT: ['complaint:create', 'complaint:read', 'complaint:update', 'complaint:assign'],
  NOTIFICATION: ['notification:create', 'notification:read', 'notification:send'],
  ANALYTICS: ['analytics:read', 'analytics:export'],
  AUDIT: ['audit:read', 'audit:export'],
  SETTINGS: ['settings:read', 'settings:update'],
  EMERGENCY: ['emergency:trigger', 'emergency:respond'],
  AI: ['ai:chat', 'ai:analytics'],
} as const;

// Role-Permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.SUPER_ADMIN]: Object.values(PERMISSIONS).flat(),
  [UserRole.COLLEGE_ADMIN]: [
    ...PERMISSIONS.USER,
    ...PERMISSIONS.STUDENT,
    ...PERMISSIONS.DRIVER,
    ...PERMISSIONS.BUS,
    ...PERMISSIONS.ROUTE,
    ...PERMISSIONS.TRIP,
    ...PERMISSIONS.ATTENDANCE,
    ...PERMISSIONS.FEE,
    ...PERMISSIONS.MAINTENANCE,
    ...PERMISSIONS.COMPLAINT,
    ...PERMISSIONS.NOTIFICATION,
    ...PERMISSIONS.ANALYTICS,
    ...PERMISSIONS.AUDIT,
    ...PERMISSIONS.SETTINGS,
    ...PERMISSIONS.EMERGENCY,
    ...PERMISSIONS.AI,
  ],
  [UserRole.TRANSPORT_MANAGER]: [
    'user:read',
    'student:read',
    'driver:read', 'driver:update',
    'bus:read', 'bus:update',
    'route:read', 'route:update',
    'trip:read', 'trip:start', 'trip:end',
    'attendance:read', 'attendance:scan',
    'maintenance:read', 'maintenance:update',
    'complaint:read', 'complaint:update', 'complaint:assign',
    'notification:read', 'notification:send',
    'analytics:read',
    'emergency:trigger', 'emergency:respond',
    'ai:chat',
  ],
  [UserRole.ACCOUNTANT]: [
    'user:read',
    'student:read',
    'fee:read', 'fee:update', 'fee:collect',
    'analytics:read',
    'ai:chat',
  ],
  [UserRole.SECURITY_GUARD]: [
    'user:read',
    'student:read',
    'bus:read',
    'trip:read',
    'attendance:read', 'attendance:scan',
    'emergency:trigger', 'emergency:respond',
  ],
  [UserRole.DRIVER]: [
    'trip:read', 'trip:start', 'trip:end',
    'attendance:scan',
    'emergency:trigger',
  ],
  [UserRole.STUDENT]: [
    'student:read',
    'trip:read',
    'attendance:read',
    'fee:read',
    'complaint:create',
    'ai:chat',
  ],
  [UserRole.PARENT]: [
    'student:read',
    'trip:read',
    'attendance:read',
    'fee:read',
    'complaint:create',
    'ai:chat',
  ],
};

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS][number];

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  collegeId?: string;
  permissions: string[];
  iat: number;
  exp: number;
}

// API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}

// Pagination
export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// GPS Location
export interface GPSLocation {
  lat: number;
  lng: number;
}

// Audit Metadata
export interface AuditMetadata {
  ipAddress?: string;
  userAgent?: string;
  deviceId?: string;
  location?: GPSLocation;
}
