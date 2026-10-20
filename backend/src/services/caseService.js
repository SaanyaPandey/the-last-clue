/**
 * THE LAST CLUE — Procedurally Generated Mystery Investigation Game
 * Case Service Layer
 *
 * Responsibilities:
 * 1. Validate incoming generation parameters (difficulty, seed).
 * 2. Generate cryptographically secure random seed at API boundary if omitted.
 * 3. Invoke core MysteryGenerator without duplicating DSA logic.
 * 4. Store active cases server-side in ActiveCaseStore with hidden solution.
 * 5. Serialize generated case using safe public whitelist serializer.
 * 6. Authoritatively validate accusations server-side without leaking solution.
 * 7. Provide post-game solution reveal exclusively for concluded cases.
 */

const crypto = require('crypto');
const MysteryGenerator = require('../generators/MysteryGenerator');
const { serializePublicCase } = require('../utils/caseSerializer');
const { defaultCaseStore } = require('./activeCaseStore');

/**
 * Custom Error Classes for Clean HTTP Status Mapping
 */
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.isValidationError = true;
    this.statusCode = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.isNotFoundError = true;
    this.statusCode = 404;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.isConflictError = true;
    this.statusCode = 409;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.isForbiddenError = true;
    this.statusCode = 403;
  }
}

class CaseService {
  /**
   * Validates input, selects/generates seed, executes MysteryGenerator, caches session,
   * and returns public case data.
   *
   * @param {Object} options - Case generation parameters.
   * @param {string} options.difficulty - 'easy' | 'medium' | 'hard' (case-insensitive).
   * @param {number|string} [options.seed] - Optional numeric seed.
   * @returns {Object} Public API-safe case representation.
   * @throws {ValidationError} If input parameters are invalid.
   */
  static generateCase({ difficulty, seed } = {}) {
    // 1. Validate & Normalize Difficulty
    if (difficulty === undefined || difficulty === null || typeof difficulty !== 'string' || difficulty.trim() === '') {
      throw new ValidationError('Difficulty is required. Allowed values: easy, medium, hard.');
    }

    const normalizedDifficulty = difficulty.trim().toLowerCase();
    const ALLOWED_DIFFICULTIES = ['easy', 'medium', 'hard'];

    if (!ALLOWED_DIFFICULTIES.includes(normalizedDifficulty)) {
      throw new ValidationError(`Invalid difficulty "${difficulty}". Allowed values: easy, medium, hard.`);
    }

    // 2. Validate & Process Seed
    let finalSeed;

    if (seed !== undefined && seed !== null) {
      if (typeof seed === 'boolean' || Array.isArray(seed) || (typeof seed === 'object' && seed !== null)) {
        throw new ValidationError('Seed must be a valid numeric integer value.');
      }

      const parsedSeed = Number(seed);

      if (typeof seed === 'string' && seed.trim() === '') {
        throw new ValidationError('Seed cannot be an empty string.');
      }

      if (isNaN(parsedSeed) || !Number.isFinite(parsedSeed) || !Number.isInteger(parsedSeed)) {
        throw new ValidationError(`Invalid seed "${seed}". Seed must be a valid integer.`);
      }

      if (!Number.isSafeInteger(parsedSeed) || parsedSeed < 0 || parsedSeed > 2147483647) {
        throw new ValidationError(`Seed must be a positive integer between 0 and 2147483647.`);
      }

      finalSeed = parsedSeed;
    } else {
      finalSeed = crypto.randomInt(1, 2147483647);
    }

    // 3. Call MysteryGenerator domain engine
    const rawCaseData = MysteryGenerator.generateCase(finalSeed, normalizedDifficulty);

    // 4. Store active case in server-side session store with hidden solution
    const caseInstanceId = defaultCaseStore.storeCase(rawCaseData);

    // 5. Transform into safe public API format (strips solution, culprit, motives, etc.)
    const publicCase = serializePublicCase(rawCaseData, { caseInstanceId });

    return publicCase;
  }

  /**
   * Evaluates an accusation against the authoritative hidden solution.
   *
   * @param {Object} params
   * @param {string} [params.caseInstanceId] - Opaque case session UUID.
   * @param {string} [params.caseId] - Alternative case ID.
   * @param {string} params.suspectId - Accused suspect ID.
   * @param {string} [params.rationale] - Optional detective rationale notes.
   * @returns {Object} Safe verdict summary (never leaks culprit on incorrect).
   */
  static validateAccusation({ caseInstanceId, caseId, suspectId, rationale } = {}) {
    const identifier = caseInstanceId || caseId;

    if (!identifier || typeof identifier !== 'string' || identifier.trim() === '') {
      throw new ValidationError('caseInstanceId or caseId is required.');
    }

    if (!suspectId || typeof suspectId !== 'string' || suspectId.trim() === '') {
      throw new ValidationError('suspectId is required and must be a valid string.');
    }

    const evaluation = defaultCaseStore.evaluateAccusation(
      identifier.trim(),
      suspectId.trim(),
      typeof rationale === 'string' ? rationale.trim() : ''
    );

    if (evaluation.status === 'not_found') {
      throw new NotFoundError('Case session not found or has expired. Please begin a new case.');
    }

    if (evaluation.status === 'closed') {
      throw new ConflictError('This case has already been concluded. Duplicate accusations are not permitted.');
    }

    if (evaluation.status === 'invalid_suspect') {
      throw new ValidationError(`Suspect "${suspectId}" does not belong to this active case.`);
    }

    // Safe, non-revealing feedback
    const feedback = evaluation.isCorrect
      ? 'Case Solved! Indictment confirmed by Scotland Yard. The suspect has confessed under the weight of forensic evidence.'
      : 'Indictment Rejected. Forensic evidence does not support the conviction of this suspect. The true culprit remains at large.';

    return {
      caseInstanceId: evaluation.record.caseInstanceId,
      caseId: evaluation.record.caseId,
      isCorrect: evaluation.isCorrect,
      status: evaluation.record.status,
      feedback,
      accusedSuspectId: suspectId.trim(),
      attempts: evaluation.attempts
    };
  }

  /**
   * Retrieves the post-game solution reveal ONLY if the case has concluded.
   *
   * @param {Object} params
   * @param {string} [params.caseInstanceId]
   * @param {string} [params.caseId]
   * @returns {Object} Unsealed solution summary.
   */
  static revealSolution({ caseInstanceId, caseId } = {}) {
    const identifier = caseInstanceId || caseId;

    if (!identifier || typeof identifier !== 'string' || identifier.trim() === '') {
      throw new ValidationError('caseInstanceId or caseId is required.');
    }

    const result = defaultCaseStore.revealSolution(identifier.trim());

    if (result.status === 'not_found') {
      throw new NotFoundError('Case session not found or has expired.');
    }

    if (result.status === 'forbidden') {
      throw new ForbiddenError('Cannot reveal solution for an active, unsolved case.');
    }

    return {
      caseInstanceId: identifier.trim(),
      caseId: result.caseId,
      unsealedFindings: result.unsealedFindings
    };
  }
}

module.exports = {
  CaseService,
  ValidationError,
  NotFoundError,
  ConflictError,
  ForbiddenError
};
