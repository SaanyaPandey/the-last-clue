/**
 * THE LAST CLUE — Procedurally Generated Mystery Investigation Game
 * HTTP Server Entry Point
 */

const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[THE LAST CLUE Server] Running on http://localhost:${PORT}`);
  console.log(`[THE LAST CLUE Server] Health Check at http://localhost:${PORT}/api/health`);
  console.log(`[THE LAST CLUE Server] Case Generation API at http://localhost:${PORT}/api/cases/generate`);
});

module.exports = server;
