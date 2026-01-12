"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const globalErrorHandler_1 = __importDefault(require("./app/middleWares/globalErrorHandler"));
const requestLogger_1 = __importDefault(require("./app/middleWares/requestLogger"));
const routes_1 = __importDefault(require("./app/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const notFound_1 = __importDefault(require("./app/middleWares/notFound"));
const passport_1 = __importDefault(require("./app/config/passport"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const config_1 = __importDefault(require("./app/config"));
const path_1 = __importDefault(require("path"));
const timeout_1 = require("./app/middleWares/timeout");
const app = (0, express_1.default)();
app.use(requestLogger_1.default);
app.use((0, helmet_1.default)({
    contentSecurityPolicy: config_1.default.env === 'production',
    crossOriginEmbedderPolicy: false,
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: config_1.default.env === 'production' ? 100 : 1000,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        return req.path === '/health' || req.path === '/';
    },
});
app.use('/api', limiter);
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Too many login attempts, please try again after an hour',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/v1/auth/login', authLimiter);
app.use((0, hpp_1.default)({
    whitelist: ['sort', 'page', 'limit', 'fields', 'filter'],
}));
const sanitizeInput = (obj) => {
    if (!obj || typeof obj !== 'object')
        return;
    for (const key of Object.keys(obj)) {
        if (key.startsWith('$') || key.includes('.')) {
            delete obj[key];
        }
        else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizeInput(obj[key]);
        }
    }
};
app.use((req, _res, next) => {
    if (req.body && typeof req.body === 'object') {
        sanitizeInput(req.body);
    }
    next();
});
const timeout = config_1.default.env === 'production' ? 50000 : 30000;
app.use((0, timeout_1.requestTimeout)(timeout));
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
const allowedOrigins = [
    'https://klartext-wine.vercel.app',
    'http://localhost:3001',
    'http://localhost:3000',
    'http://localhost:5000',
    'https://sandbox.sslcommerz.com',
    'https://securepay.sslcommerz.com',
];
if (config_1.default.client_url) {
    const normalizedClientUrl = config_1.default.client_url.replace(/\/$/, '');
    if (!allowedOrigins.includes(normalizedClientUrl)) {
        allowedOrigins.push(normalizedClientUrl);
    }
}
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        const normalizedOrigin = origin.replace(/\/$/, '');
        const isAllowed = allowedOrigins.some(allowed => {
            const normalizedAllowed = allowed.replace(/\/$/, '');
            return normalizedAllowed === normalizedOrigin;
        });
        if (isAllowed) {
            callback(null, true);
        }
        else {
            console.error('❌ CORS blocked origin:', origin);
            console.error('Allowed origins:', allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    maxAge: 86400,
}));
app.use((0, express_session_1.default)({
    secret: config_1.default.jwt.secret,
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({
        mongoUrl: config_1.default.database_url,
        collectionName: 'sessions',
        ttl: 24 * 60 * 60,
        autoRemove: 'native',
        touchAfter: 24 * 3600,
    }),
    cookie: {
        secure: config_1.default.env === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: config_1.default.env === 'production' ? 'strict' : 'lax',
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/audio', express_1.default.static(path_1.default.join(process.cwd(), 'public/audio')));
app.get('/health', async (_req, res) => {
    const { getDatabaseStatus } = await Promise.resolve().then(() => __importStar(require('./app/config/database')));
    const dbStatus = getDatabaseStatus();
    res.status(200).json({
        success: true,
        message: 'KlarText API is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config_1.default.env,
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
app.use('/api/v1', routes_1.default);
app.use(globalErrorHandler_1.default);
app.use(notFound_1.default);
app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'KlarText API is running',
        version: '1.0.0',
        docs: '/api/v1',
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map