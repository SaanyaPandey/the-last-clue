/**
 * THE LAST CLUE — Procedurally Generated Mystery Investigation Game
 * Case Routes Definition
 *
 * Base Route: /api/cases
 */

const express = require('express');
const {
  generateCase,
  validateAccusation,
  revealSolution
} = require('../controllers/caseController');

const router = express.Router();

/**
 * Procedural Mystery Case Generation Endpoint
 * POST /api/cases/generate
 *
 * Request Body:
 * {
 *   "difficulty": "medium", // required: "easy" | "medium" | "hard"
 *   "seed": 12345           // optional: integer
 * }
 */
router.post('/generate', generateCase);

/**
 * Authoritative Accusation Evaluation Endpoint
 * POST /api/cases/accuse
 *
 * Request Body:
 * {
 *   "caseInstanceId": "...", // required string (or caseId)
 *   "suspectId": "...",      // required string
 *   "rationale": "..."       // optional string
 * }
 */
router.post('/accuse', validateAccusation);

/**
 * Post-Game Solution Reveal Endpoint (Concluded Cases Only)
 * POST /api/cases/reveal
 *
 * Request Body:
 * {
 *   "caseInstanceId": "..."  // required string (or caseId)
 * }
 */
router.post('/reveal', revealSolution);

module.exports = router;
