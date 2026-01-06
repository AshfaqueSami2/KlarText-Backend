/**
 * PM2 Ecosystem Configuration
 * 
 * This file configures PM2 for production deployment with:
 * - Cluster mode for load balancing across CPU cores
 * - Auto-restart on failure
 * - Memory limits
 * - Log management
 * 
 * Usage:
 *   Development: npm run dev
 *   Production:  npm run build && pm2 start ecosystem.config.js
 *   
 * PM2 Commands:
 *   pm2 start ecosystem.config.js    # Start all apps
 *   pm2 stop all                     # Stop all apps
 *   pm2 restart all                  # Restart all apps
 *   pm2 reload all                   # Zero-downtime reload
 *   pm2 delete all                   # Remove all apps
 *   pm2 logs                         # View logs
 *   pm2 monit                        # Monitor dashboard
 *   pm2 status                       # Check status
 */

module.exports = {
  apps: [
    {
      // ============================================
      // 🚀 PRODUCTION CONFIGURATION
      // ============================================
      name: 'klartext-api',
      script: './dist/server.js',
      
      // Cluster mode - use all available CPU cores
      instances: 'max', // Or set specific number: 4
      exec_mode: 'cluster',
      
      // Auto-restart settings
      autorestart: true,
      watch: false, // Don't watch files in production
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000,
      
      // Memory management
      max_memory_restart: '500M',
      
      // Environment variables
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 5001,
      },
      
      // Logging
      log_file: './logs/pm2-combined.log',
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Graceful shutdown
      kill_timeout: 10000, // 10 seconds to gracefully shutdown
      listen_timeout: 10000,
      shutdown_with_message: true,
      
      // Health check
      wait_ready: true,
      
      // Source maps for error tracking
      source_map_support: true,
      
      // Node.js arguments
      node_args: [
        '--max-old-space-size=512', // Limit heap size
      ],
    },
    
    // ============================================
    // 🔧 DEVELOPMENT CONFIGURATION (Optional)
    // ============================================
    {
      name: 'klartext-dev',
      script: './src/server.ts',
      interpreter: './node_modules/.bin/ts-node-dev',
      interpreter_args: '--respawn --transpile-only',
      
      instances: 1,
      exec_mode: 'fork',
      
      autorestart: true,
      watch: ['src'],
      watch_delay: 1000,
      ignore_watch: ['node_modules', 'logs', 'dist', 'public'],
      
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
      },
      
      // Only run this in dev
      env_production: null,
    },
  ],
  
  // ============================================
  // 📦 DEPLOYMENT CONFIGURATION
  // ============================================
  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server.com'],
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/klartext.git',
      path: '/var/www/klartext',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      env: {
        NODE_ENV: 'production',
      },
    },
    staging: {
      user: 'deploy',
      host: ['staging.your-server.com'],
      ref: 'origin/develop',
      repo: 'git@github.com:yourusername/klartext.git',
      path: '/var/www/klartext-staging',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging',
      env: {
        NODE_ENV: 'staging',
      },
    },
  },
};
