import rateLimit from 'express-rate-limit';
import { config } from '../config';
import { getRedisClient } from '../config/redis';

export const apiRateLimit = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'RATE_LIMIT', message: 'Too many requests, please try again later' },
  },
  keyGenerator: (req) => {
    return req.ip || 'unknown';
  },
});

export const authRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'RATE_LIMIT', message: 'Too many login attempts, please try again later' },
  },
});

export const gpsRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 12, // 12 GPS updates per minute (every 5 seconds)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'RATE_LIMIT', message: 'GPS update rate exceeded' },
  },
});
