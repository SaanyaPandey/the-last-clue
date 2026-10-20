/**
 * Controller to handle API health check requests
 * @route GET /api/health
 */
const getHealthStatus = (req, res) => {
  return res.status(200).json({
    status: 'OK',
    message: 'THE LAST CLUE Backend API is running successfully',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
};

module.exports = {
  getHealthStatus
};
