/**
 * THE LAST CLUE — Procedurally Generated Mystery Investigation Game
 * Express Application Configuration
 */

const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/healthRoutes');
const caseRoutes = require('./routes/caseRoutes');

const app = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: [CLIENT_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/cases', caseRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'THE LAST CLUE API',
    description: 'Procedurally Generated Mystery Investigation Game Engine API',
    endpoints: {
      healthCheck: '/api/health',
      generateCase: '/api/cases/generate'
    }
  });
});

// Centralized 404 Handler for undefined API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found.`
    }
  });
});

// Global Error Handling Middleware (prevents leaking stack traces in client responses)
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]:', err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected internal error occurred.'
    }
  });
});

module.exports = app;
