import { Request, Response } from 'express';

export const getDashboard = async (req: Request, res: Response): Promise<void> => {
  const collegeId = req.collegeId;

  // Mock data for quick deployment - replace with real aggregations later
  res.json({
    success: true,
    data: {
      kpiCards: [
        { title: 'Active Buses', value: 8, change: 0, trend: 'stable' as const },
        { title: 'Students Onboard', value: 485, change: 12, trend: 'up' as const },
        { title: 'On-Time %', value: 92, change: 3, trend: 'up' as const },
        { title: 'Pending Fees', value: 45000, change: -2000, trend: 'down' as const },
        { title: 'Active Trips', value: 6, change: 1, trend: 'up' as const },
        { title: 'Complaints', value: 3, change: -2, trend: 'down' as const },
      ],
      charts: {
        dailyTrips: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          data: [12, 14, 13, 15, 12, 8],
        },
        onTimePerformance: {
          labels: ['Route A', 'Route B', 'Route C', 'Route D'],
          data: [94, 88, 91, 96],
        },
        feeCollection: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [85000, 92000, 88000, 95000, 90000, 87000],
        },
        busUtilization: {
          labels: ['Bus 1', 'Bus 2', 'Bus 3', 'Bus 4', 'Bus 5'],
          data: [85, 92, 78, 88, 95],
        },
      },
      recentActivity: [
        { type: 'TRIP_START', message: 'Trip Route A - Morning started', time: '10 min ago' },
        { type: 'ATTENDANCE', message: 'Alice Smith boarded Bus 1', time: '15 min ago' },
        { type: 'ALERT', message: 'Bus 3 delayed by 8 minutes', time: '20 min ago' },
        { type: 'MAINTENANCE', message: 'Bus 2 service completed', time: '1 hour ago' },
      ],
      liveFleet: [
        { busId: '1', registrationNumber: 'KA-01-AB-1234', route: 'Route A', status: 'ON_TRIP', speed: 35, nextStop: 'Tech Campus', eta: '5 min' },
        { busId: '2', registrationNumber: 'KA-01-CD-5678', route: 'Route B', status: 'ON_TRIP', speed: 42, nextStop: 'Koramangala', eta: '12 min' },
        { busId: '3', registrationNumber: 'KA-01-EF-9012', route: 'Route C', status: 'IDLE', speed: 0, nextStop: '-', eta: '-' },
      ],
    },
    timestamp: new Date().toISOString(),
  });
};

export const getStudentDashboard = async (req: Request, res: Response): Promise<void> => {
  res.json({
    success: true,
    data: {
      busLocation: { lat: 12.9716, lng: 77.5946, speed: 35, heading: 180 },
      eta: '7 minutes',
      nextStop: 'Koramangala Bus Stand',
      driverName: 'Suresh Patel',
      driverContact: '+919876543210',
      busNumber: 'KA-01-AB-1234',
      todayTrip: { route: 'Route A - Morning', status: 'IN_PROGRESS', startTime: '07:30 AM' },
      attendance: { present: 22, absent: 1, total: 23 },
      feeStatus: { totalDue: 5000, totalPaid: 15000, lastPayment: '2026-06-15' },
      notifications: [
        { title: 'Bus arriving in 5 min', time: '2 min ago', read: false },
        { title: 'Fee reminder: Rs.5000 due', time: '1 day ago', read: true },
      ],
    },
    timestamp: new Date().toISOString(),
  });
};

export const getParentDashboard = async (req: Request, res: Response): Promise<void> => {
  res.json({
    success: true,
    data: {
      children: [
        {
          name: 'Alice Smith',
          busLocation: { lat: 12.9716, lng: 77.5946 },
          eta: '7 minutes',
          status: 'ON_TRIP',
          boardedAt: '07:35 AM',
          lastStop: 'Koramangala',
          nextStop: 'Tech Campus',
        },
      ],
      notifications: [
        { title: 'Alice boarded the bus', time: '30 min ago', type: 'BOARDING' },
        { title: 'Bus arriving at stop in 5 min', time: '2 min ago', type: 'ARRIVAL' },
      ],
      feeSummary: { totalDue: 5000, totalPaid: 15000, upcomingDue: '2026-08-15' },
    },
    timestamp: new Date().toISOString(),
  });
};

export const getDriverDashboard = async (req: Request, res: Response): Promise<void> => {
  res.json({
    success: true,
    data: {
      todayRoute: { name: 'Route A - Morning', stops: 8, completed: 3 },
      currentTrip: { status: 'STARTED', startTime: '07:30 AM', passengers: 42, nextStop: 'Tech Campus' },
      passengerList: [
        { name: 'Alice Smith', status: 'BOARDED', stop: 'Koramangala' },
        { name: 'Bob Johnson', status: 'PENDING', stop: 'HSR Layout' },
      ],
      alerts: [
        { type: 'SPEED', message: 'Speed limit: 50 km/h', severity: 'WARNING' },
        { type: 'FEE', message: 'Student has pending fees', severity: 'INFO' },
      ],
      metrics: { distance: 12.5, fuel: 3.2, avgSpeed: 38, maxSpeed: 52 },
    },
    timestamp: new Date().toISOString(),
  });
};
