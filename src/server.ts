import mongoose from "mongoose";
import config from "./app/config";
import app from "./app";
import logger from "./app/utils/logger";
import { connectDatabase, closeDatabaseConnection, getDatabaseStatus } from "./app/config/database";

async function main() {
  try {
    // Connect to MongoDB with optimized settings
    await connectDatabase(config.database_url as string);

    const server = app.listen(config.port, () => {
      logger.info(`🚀 Server is running on port ${config.port}`);
      logger.info(`📍 Environment: ${config.env}`);
      logger.info(`🔢 Process ID: ${process.pid}`);
      
      // Log database status
      const dbStatus = getDatabaseStatus();
      logger.info(`🗄️ Database: ${dbStatus.name} (${dbStatus.state})`);
      
      // Tell PM2 that the app is ready (for wait_ready option)
      if (process.send) {
        process.send('ready');
      }
    });

    // Graceful shutdown handling
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        // Close MongoDB connection
        await closeDatabaseConnection();
        
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // PM2 sends 'SIGINT' for graceful shutdown
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    
    // PM2 cluster mode message handling
    process.on('message', (msg) => {
      if (msg === 'shutdown') {
        shutdown('PM2 shutdown');
      }
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
      process.exit(1);
    });

    process.on('unhandledRejection', (reason: unknown) => {
      logger.error('Unhandled Rejection:', { reason });
      process.exit(1);
    });

  } catch (err) {
    logger.error('Failed to start server', { error: err });
    process.exit(1);
  }
}

main();
