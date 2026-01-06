import mongoose from 'mongoose';
import logger from '../utils/logger';

/**
 * MongoDB Connection Options with Connection Pooling
 * Optimized for production workloads
 */
export const mongooseOptions: mongoose.ConnectOptions = {
  // ============================================
  // 🔗 CONNECTION POOL SETTINGS
  // ============================================
  maxPoolSize: 100,        // Maximum connections in the pool
  minPoolSize: 10,         // Minimum connections to maintain
  maxIdleTimeMS: 30000,    // Close idle connections after 30 seconds
  
  // ============================================
  // ⏱️ TIMEOUT SETTINGS
  // ============================================
  serverSelectionTimeoutMS: 5000,   // Timeout for server selection
  socketTimeoutMS: 45000,           // Socket timeout
  connectTimeoutMS: 10000,          // Initial connection timeout
  
  // ============================================
  // 🔄 RETRY SETTINGS
  // ============================================
  retryWrites: true,                // Retry failed writes
  retryReads: true,                 // Retry failed reads
  
  // ============================================
  // 📊 MONITORING
  // ============================================
  heartbeatFrequencyMS: 10000,      // Server heartbeat interval
  
  // ============================================
  // 🗄️ OTHER SETTINGS
  // ============================================
  autoIndex: process.env.ENV !== 'production', // Auto-build indexes in dev only
  autoCreate: true,                 // Auto-create collections
};

/**
 * Setup MongoDB connection event handlers
 */
export const setupMongooseEvents = (): void => {
  const connection = mongoose.connection;

  connection.on('connected', () => {
    logger.info('📦 MongoDB connected successfully');
  });

  connection.on('error', (err) => {
    logger.error('❌ MongoDB connection error:', { error: err.message });
  });

  connection.on('disconnected', () => {
    logger.warn('🔌 MongoDB disconnected');
  });

  connection.on('reconnected', () => {
    logger.info('🔄 MongoDB reconnected');
  });

  // Log when connection pool is ready
  connection.on('open', () => {
    logger.info('✅ MongoDB connection pool ready');
  });

  // Monitor slow queries in development
  if (process.env.ENV === 'development') {
    mongoose.set('debug', (collectionName: string, method: string, query: unknown) => {
      logger.debug(`MongoDB: ${collectionName}.${method}`, { query });
    });
  }
};

/**
 * Create indexes for all collections
 * Run this on startup to ensure indexes exist
 */
export const ensureIndexes = async (): Promise<void> => {
  try {
    logger.info('🔍 Checking database indexes...');

    // Get all registered models
    const modelNames = mongoose.modelNames();
    
    for (const modelName of modelNames) {
      const model = mongoose.model(modelName);
      await model.ensureIndexes();
      logger.debug(`Indexes ensured for: ${modelName}`);
    }

    logger.info(`✅ Database indexes verified (${modelNames.length} collections)`);
  } catch (error) {
    logger.error('Failed to ensure indexes:', { error });
  }
};

/**
 * Get database connection status and statistics
 */
export const getDatabaseStatus = (): Record<string, unknown> => {
  const connection = mongoose.connection;
  
  return {
    state: getConnectionStateName(connection.readyState),
    host: connection.host,
    port: connection.port,
    name: connection.name,
    collections: mongoose.modelNames(),
    poolSize: mongooseOptions.maxPoolSize,
  };
};

/**
 * Get human-readable connection state name
 */
const getConnectionStateName = (state: number): string => {
  const states: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[state] || 'unknown';
};

/**
 * Connect to MongoDB with optimized settings
 */
export const connectDatabase = async (uri: string): Promise<void> => {
  // Setup event handlers before connecting
  setupMongooseEvents();
  
  // Connect with optimized options
  await mongoose.connect(uri, mongooseOptions);
  
  // Ensure indexes exist (non-blocking in production)
  if (process.env.ENV !== 'production') {
    await ensureIndexes();
  } else {
    // Run index check in background for production
    ensureIndexes().catch((err) => {
      logger.error('Background index check failed:', { error: err });
    });
  }
};

/**
 * Gracefully close database connection
 */
export const closeDatabaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connection.close(false);
    logger.info('📦 MongoDB connection closed gracefully');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', { error });
    throw error;
  }
};

export default {
  mongooseOptions,
  setupMongooseEvents,
  ensureIndexes,
  getDatabaseStatus,
  connectDatabase,
  closeDatabaseConnection,
};
