import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import rateLimit from "express-rate-limit";
import globalErrorHandler from "./app/middleWares/globalErrorHandler";
import requestLogger from "./app/middleWares/requestLogger";
import router from "./app/routes";
import cookieParser from "cookie-parser";
import notFound from "./app/middleWares/notFound";
import passport from "./app/config/passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import config from "./app/config";
import path from "path";
import { requestTimeout } from "./app/middleWares/timeout";

const app: Application = express();

// ============================================
// 📝 REQUEST LOGGING (before other middleware)
// ============================================
app.use(requestLogger);

// ============================================
// 🛡️ SECURITY MIDDLEWARE
// ============================================

// Helmet - Sets various HTTP headers for security
app.use(helmet({
  contentSecurityPolicy: config.env === 'production',
  crossOriginEmbedderPolicy: false,
}));

// Rate limiting - Prevent brute force & DDoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.env === 'production' ? 100 : 1000, // Limit each IP
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => {
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/';
  },
});
app.use('/api', limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts per hour
  message: {
    success: false,
    message: 'Too many login attempts, please try again after an hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/v1/auth/login', authLimiter);

// HPP - Prevent HTTP Parameter Pollution
app.use(hpp({
  whitelist: ['sort', 'page', 'limit', 'fields', 'filter'], // Allow these query params to have multiple values
}));

// Custom NoSQL Injection Prevention (Express 5 compatible)
const sanitizeInput = (obj: Record<string, unknown>): void => {
  if (!obj || typeof obj !== 'object') return;
  
  for (const key of Object.keys(obj)) {
    // Remove keys that start with $ or contain .
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeInput(obj[key] as Record<string, unknown>);
    }
  }
};

app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === 'object') {
    sanitizeInput(req.body as Record<string, unknown>);
  }
  next();
});

// ============================================
// ⏱️ REQUEST TIMEOUT
// ============================================
// Prevent slow requests from blocking the server (30 seconds default)
app.use(requestTimeout(30000));

// ============================================
// 📦 COMPRESSION & PARSING
// ============================================

// Compression - Reduce response size
app.use(compression());

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ============================================
// 🌐 CORS CONFIGURATION
// ============================================

const allowedOrigins = [
  config.client_url,
  'https://kalrtext.vercel.app',
  'http://localhost:3001',
  'http://localhost:5000', // Vite default
  'https://sandbox.sslcommerz.com', // SSLCommerz Sandbox
  'https://securepay.sslcommerz.com', // SSLCommerz Live
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (config.env !== 'production') {
      // In development, allow all origins
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24 hours - browsers cache preflight response
}));

// ============================================
// 🔐 SESSION & AUTHENTICATION
// ============================================

// Session configuration with MongoDB store for production persistence
// This ensures sessions survive server restarts and work across PM2 cluster instances
app.use(session({
  secret: config.jwt.secret as string,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: config.database_url as string,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60, // Session TTL in seconds (24 hours)
    autoRemove: 'native', // Use MongoDB TTL index for cleanup
    touchAfter: 24 * 3600, // Only update session once per 24 hours unless data changes
  }),
  cookie: {
    secure: config.env === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: config.env === 'production' ? 'strict' : 'lax',
  },
}));

// Initialize Passport for Google OAuth
app.use(passport.initialize());
app.use(passport.session());

// ============================================
// 📁 STATIC FILES & ROUTES
// ============================================

// Serve static audio files
app.use('/audio', express.static(path.join(process.cwd(), 'public/audio')));

// Health check endpoint (before auth middleware)
app.get('/health', async (_req: Request, res: Response) => {
  // Dynamic import to avoid circular dependency
  const { getDatabaseStatus } = await import('./app/config/database');
  const dbStatus = getDatabaseStatus();
  
  res.status(200).json({
    success: true,
    message: 'KlarText API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
    database: {
      status: dbStatus.state,
      name: dbStatus.name,
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
    },
  });
});

// API routes
app.use('/api/v1', router);

// Error handling
app.use(globalErrorHandler);
app.use(notFound);

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'KlarText API is running',
    version: '1.0.0',
    docs: '/api/v1',
  });
})


export default app;