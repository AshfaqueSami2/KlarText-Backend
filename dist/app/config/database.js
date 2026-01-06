"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabaseConnection = exports.connectDatabase = exports.getDatabaseStatus = exports.ensureIndexes = exports.setupMongooseEvents = exports.mongooseOptions = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utils/logger"));
exports.mongooseOptions = {
    maxPoolSize: 100,
    minPoolSize: 10,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    retryWrites: true,
    retryReads: true,
    heartbeatFrequencyMS: 10000,
    autoIndex: process.env.ENV !== 'production',
    autoCreate: true,
};
const setupMongooseEvents = () => {
    const connection = mongoose_1.default.connection;
    connection.on('connected', () => {
        logger_1.default.info('📦 MongoDB connected successfully');
    });
    connection.on('error', (err) => {
        logger_1.default.error('❌ MongoDB connection error:', { error: err.message });
    });
    connection.on('disconnected', () => {
        logger_1.default.warn('🔌 MongoDB disconnected');
    });
    connection.on('reconnected', () => {
        logger_1.default.info('🔄 MongoDB reconnected');
    });
    connection.on('open', () => {
        logger_1.default.info('✅ MongoDB connection pool ready');
    });
    if (process.env.ENV === 'development') {
        mongoose_1.default.set('debug', (collectionName, method, query) => {
            logger_1.default.debug(`MongoDB: ${collectionName}.${method}`, { query });
        });
    }
};
exports.setupMongooseEvents = setupMongooseEvents;
const ensureIndexes = async () => {
    try {
        logger_1.default.info('🔍 Checking database indexes...');
        const modelNames = mongoose_1.default.modelNames();
        for (const modelName of modelNames) {
            const model = mongoose_1.default.model(modelName);
            await model.ensureIndexes();
            logger_1.default.debug(`Indexes ensured for: ${modelName}`);
        }
        logger_1.default.info(`✅ Database indexes verified (${modelNames.length} collections)`);
    }
    catch (error) {
        logger_1.default.error('Failed to ensure indexes:', { error });
    }
};
exports.ensureIndexes = ensureIndexes;
const getDatabaseStatus = () => {
    const connection = mongoose_1.default.connection;
    return {
        state: getConnectionStateName(connection.readyState),
        host: connection.host,
        port: connection.port,
        name: connection.name,
        collections: mongoose_1.default.modelNames(),
        poolSize: exports.mongooseOptions.maxPoolSize,
    };
};
exports.getDatabaseStatus = getDatabaseStatus;
const getConnectionStateName = (state) => {
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
    };
    return states[state] || 'unknown';
};
const connectDatabase = async (uri) => {
    (0, exports.setupMongooseEvents)();
    await mongoose_1.default.connect(uri, exports.mongooseOptions);
    if (process.env.ENV !== 'production') {
        await (0, exports.ensureIndexes)();
    }
    else {
        (0, exports.ensureIndexes)().catch((err) => {
            logger_1.default.error('Background index check failed:', { error: err });
        });
    }
};
exports.connectDatabase = connectDatabase;
const closeDatabaseConnection = async () => {
    try {
        await mongoose_1.default.connection.close(false);
        logger_1.default.info('📦 MongoDB connection closed gracefully');
    }
    catch (error) {
        logger_1.default.error('Error closing MongoDB connection:', { error });
        throw error;
    }
};
exports.closeDatabaseConnection = closeDatabaseConnection;
exports.default = {
    mongooseOptions: exports.mongooseOptions,
    setupMongooseEvents: exports.setupMongooseEvents,
    ensureIndexes: exports.ensureIndexes,
    getDatabaseStatus: exports.getDatabaseStatus,
    connectDatabase: exports.connectDatabase,
    closeDatabaseConnection: exports.closeDatabaseConnection,
};
//# sourceMappingURL=database.js.map