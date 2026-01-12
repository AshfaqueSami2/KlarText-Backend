"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./app/config"));
const app_1 = __importDefault(require("./app"));
const logger_1 = __importDefault(require("./app/utils/logger"));
const database_1 = require("./app/config/database");
async function main() {
    try {
        await (0, database_1.connectDatabase)(config_1.default.database_url);
        const server = app_1.default.listen(config_1.default.port, () => {
            logger_1.default.info(`🚀 Server is running on port ${config_1.default.port}`);
            logger_1.default.info(`📍 Environment: ${config_1.default.env}`);
            logger_1.default.info(`🔢 Process ID: ${process.pid}`);
            const dbStatus = (0, database_1.getDatabaseStatus)();
            logger_1.default.info(`🗄️ Database: ${dbStatus.name} (${dbStatus.state})`);
            if (process.send) {
                process.send('ready');
            }
        });
        const shutdown = async (signal) => {
            logger_1.default.info(`${signal} received. Shutting down gracefully...`);
            server.close(async () => {
                logger_1.default.info('HTTP server closed');
                await (0, database_1.closeDatabaseConnection)();
                process.exit(0);
            });
            setTimeout(() => {
                logger_1.default.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('message', (msg) => {
            if (msg === 'shutdown') {
                shutdown('PM2 shutdown');
            }
        });
        process.on('uncaughtException', (error) => {
            logger_1.default.error('Uncaught Exception:', { error: error.message, stack: error.stack });
            process.exit(1);
        });
        process.on('unhandledRejection', (reason) => {
            logger_1.default.error('Unhandled Rejection:', { reason });
            process.exit(1);
        });
    }
    catch (err) {
        logger_1.default.error('Failed to start server', { error: err });
        process.exit(1);
    }
}
main();
//# sourceMappingURL=server.js.map