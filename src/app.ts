import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import rateLimit from "express-rate-limit";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import config from "./app/config";
import passport from "./app/config/passport";
import requestLogger from "./app/middleWares/requestLogger";
import { requestTimeout } from "./app/middleWares/timeout";
import router from "./app/routes";
import globalErrorHandler from "./app/middleWares/globalErrorHandler";
import notFound from "./app/middleWares/notFound";

const app: Application = express();

// Request logging
app.use(requestLogger);

// Security
app.use(helmet({ contentSecurityPolicy: config.env === 'production', crossOriginEmbedderPolicy: false }));
app.use(hpp({ whitelist: ['sort', 'page', 'limit', 'fields', 'filter'] }));

// Rate limiting
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.env === 'production' ? 100 : 1000,
  skip: (req) => req.path === '/health' || req.path === '/',
}));

app.use('/api/v1/auth/login', rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
}));

// NoSQL Injection Prevention
const sanitizeInput = (obj: Record<string, unknown>): void => {
  if (!obj || typeof obj !== 'object') return;
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeInput(obj[key] as Record<string, unknown>);
    }
  }
};

app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === 'object') sanitizeInput(req.body as Record<string, unknown>);
  next();
});

// Timeout
app.use(requestTimeout(config.env === 'production' ? 50000 : 30000));

// Parsing & Compression
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CORS
const allowedOrigins = [
  'https://klartext-wine.vercel.app',
  'https://www.klartext.tech',
  'https://klartext.tech',
  'http://localhost:3001',
  'http://localhost:5000',
  'https://sandbox.sslcommerz.com',
  'https://securepay.sslcommerz.com',
  config.client_url,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(allowed => allowed?.replace(/\/$/, '') === origin?.replace(/\/$/, ''))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

// Session & Passport
app.use(session({
  secret: config.jwt.secret as string,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: config.database_url as string,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60,
  }),
  cookie: {
    secure: config.env === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: config.env === 'production' ? 'strict' : 'lax',
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// Health check
app.get('/health', async (_req: Request, res: Response) => {
  const { getDatabaseStatus } = await import('./app/config/database');
  const dbStatus = getDatabaseStatus();
  res.json({
    success: true,
    message: 'KlarText API is healthy',
    environment: config.env,
    database: dbStatus.state,
    uptime: Math.floor(process.uptime()),
  });
});

// Root
app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'KlarText API',
    version: '1.0.0',
  });
});

// API routes
app.use('/api/v1', router);

// Error handling
app.use(globalErrorHandler);
app.use(notFound);

export default app;


