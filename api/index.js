// Vercel Serverless Entry Point
const mongoose = require('mongoose');
const app = require('../dist/app').default;
const { connectDatabase } = require('../dist/app/config/database');

// Database connection cache for serverless
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not defined');
  }

  cachedDb = await connectDatabase(dbUrl);
  return cachedDb;
}

// Vercel serverless function handler
module.exports = async (req, res) => {
  try {
    // Ensure database connection
    await connectToDatabase();
    
    // Handle request with Express app
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

