/**
 * THE LAST CLUE — Procedurally Generated Mystery Investigation Game
 * Case Controller
 *
 * Route Handlers:
 * POST /api/cases/generate
 * POST /api/cases/accuse
 * POST /api/cases/reveal
 */

const {
  CaseService,
  ValidationError,
  NotFoundError,
  ConflictError,
  ForbiddenError
} = require('../services/caseService');

/**
 * Handles case generation HTTP POST requests.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const generateCase = (req, res) => {
  try {
    const { difficulty, seed } = req.body || {};

    const caseData = CaseService.generateCase({ difficulty, seed });

    return res.status(200).json({
      success: true,
      data: caseData
    });
  } catch (error) {
    if (error instanceof ValidationError || error.isValidationError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: error.message
        }
      });
    }

    console.error('[CaseController generateCase Error]:', error);

    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected internal error occurred while generating the mystery case.'
      }
    });
  }
};

/**
 * Handles formal accusation validation against the authoritative hidden solution.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const validateAccusation = (req, res) => {
  try {
    const { caseInstanceId, caseId, suspectId, rationale } = req.body || {};

    const verdict = CaseService.validateAccusation({
      caseInstanceId,
      caseId,
      suspectId,
      rationale
    });

    return res.status(200).json({
      success: true,
      data: verdict
    });
  } catch (error) {
    if (error instanceof ValidationError || error.isValidationError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: error.message
        }
      });
    }

    if (error instanceof NotFoundError || error.isNotFoundError) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CASE_NOT_FOUND',
          message: error.message
        }
      });
    }

    if (error instanceof ConflictError || error.isConflictError) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'CASE_ALREADY_CLOSED',
          message: error.message
        }
      });
    }

    console.error('[CaseController validateAccusation Error]:', error);

    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while processing the accusation.'
      }
    });
  }
};

/**
 * Handles post-game solution reveal for concluded cases only.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const revealSolution = (req, res) => {
  try {
    const { caseInstanceId, caseId } = req.body || {};

    const solutionData = CaseService.revealSolution({
      caseInstanceId,
      caseId
    });

    return res.status(200).json({
      success: true,
      data: solutionData
    });
  } catch (error) {
    if (error instanceof ValidationError || error.isValidationError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: error.message
        }
      });
    }

    if (error instanceof NotFoundError || error.isNotFoundError) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CASE_NOT_FOUND',
          message: error.message
        }
      });
    }

    if (error instanceof ForbiddenError || error.isForbiddenError) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: error.message
        }
      });
    }

    console.error('[CaseController revealSolution Error]:', error);

    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while unsealing the solution.'
      }
    });
  }
};

module.exports = {
  generateCase,
  validateAccusation,
  revealSolution
};
