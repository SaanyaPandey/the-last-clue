/**
 * THE LAST CLUE — Procedurally Generated Mystery Investigation Game
 * Active Case Lifecycle & In-Memory Store
 *
 * Responsibilities:
 * 1. Store server-side active case instances keyed by an opaque identifier.
 * 2. Keep the authoritative solution strictly server-side.
 * 3. Enforce sensible TTL expiry, capacity limits, and automatic cleanup.
 * 4. Handle duplicate submissions, case closures, and lifecycle state.
 */

const crypto = require('crypto');

class ActiveCaseStore {
  /**
   * @param {Object} options
   * @param {number} [options.ttlMs=3600000] - Case TTL in ms (default: 60 minutes)
   * @param {number} [options.maxCapacity=1000] - Maximum concurrent in-memory cases
   */
  constructor({ ttlMs = 60 * 60 * 1000, maxCapacity = 1000 } = {}) {
    this.ttlMs = ttlMs;
    this.maxCapacity = maxCapacity;
    /** @type {Map<string, Object>} */
    this.cases = new Map();
  }

  /**
   * Stores a newly generated case session in memory.
   *
   * @param {Object} rawCase - Full generated case data including hidden solution.
   * @returns {string} The unique, opaque caseInstanceId.
   */
  storeCase(rawCase) {
    this.cleanupExpired();

    // Enforce max capacity by evicting oldest entries if necessary
    if (this.cases.size >= this.maxCapacity) {
      const oldestKey = this.cases.keys().next().value;
      if (oldestKey) {
        this.cases.delete(oldestKey);
      }
    }

    // Generate an opaque, cryptographically derived instance identifier
    // Deterministic for same seed + difficulty, unique across different seeds
    const caseInstanceId = crypto
      .createHash('sha256')
      .update(`instance:${rawCase.caseId}:${rawCase.seed}:${rawCase.difficulty}`)
      .digest('hex')
      .slice(0, 32);

    const now = Date.now();

    const record = {
      caseInstanceId,
      caseId: rawCase.caseId,
      seed: rawCase.seed,
      difficulty: rawCase.difficulty,
      createdAt: now,
      expiresAt: now + this.ttlMs,
      // Store authoritative truth exclusively on the server
      culpritId: rawCase.solution?.culprit,
      solution: {
        culprit: rawCase.solution?.culprit,
        location: rawCase.solution?.location,
        weapon: rawCase.solution?.weapon,
        motive: rawCase.solution?.motive
      },
      // Cache valid suspect IDs to validate accusations belong to this exact case
      suspectIds: new Set((rawCase.suspects || []).map((s) => s.id)),
      // Track lifecycle and submissions
      status: 'active', // 'active' | 'solved' | 'closed'
      attempts: 0,
      verdictHistory: []
    };

    this.cases.set(caseInstanceId, record);
    // Also index by caseId for flexible lookup
    this.cases.set(rawCase.caseId, record);

    return caseInstanceId;
  }

  /**
   * Retrieves an active case record if it exists and has not expired.
   *
   * @param {string} id - Either caseInstanceId or caseId.
   * @returns {Object|null} Active case record or null if missing/expired.
   */
  getCase(id) {
    if (!id || typeof id !== 'string') {
      return null;
    }

    const record = this.cases.get(id);
    if (!record) {
      return null;
    }

    if (Date.now() > record.expiresAt) {
      this.cases.delete(record.caseInstanceId);
      this.cases.delete(record.caseId);
      return null;
    }

    return record;
  }

  /**
   * Evaluates an accusation against the authoritative server-side solution.
   *
   * @param {string} caseIdentifier - Either caseInstanceId or caseId.
   * @param {string} suspectId - Accused suspect's ID.
   * @param {string} [rationale] - Optional detective rationale notes.
   * @returns {{ status: string, isCorrect?: boolean, code?: string, record?: Object }}
   */
  evaluateAccusation(caseIdentifier, suspectId, rationale = '') {
    const record = this.getCase(caseIdentifier);
    if (!record) {
      return { status: 'not_found', code: 'CASE_EXPIRED_OR_NOT_FOUND' };
    }

    // Check if the case is already concluded
    if (record.status !== 'active') {
      return {
        status: 'closed',
        code: 'CASE_ALREADY_CLOSED',
        isCorrect: record.status === 'solved',
        attempts: record.attempts,
        record
      };
    }

    // Validate that the suspect belongs to this specific case
    if (!record.suspectIds.has(suspectId)) {
      return { status: 'invalid_suspect', code: 'SUSPECT_NOT_IN_CASE' };
    }

    record.attempts += 1;
    const isCorrect = suspectId === record.culpritId;

    // Record submission state
    record.status = isCorrect ? 'solved' : 'closed';
    record.verdictHistory.push({
      suspectId,
      isCorrect,
      rationale,
      timestamp: Date.now()
    });

    return {
      status: 'evaluated',
      isCorrect,
      attempts: record.attempts,
      record
    };
  }

  /**
   * Retrieves the post-game solution reveal ONLY if the case is already closed or solved.
   *
   * @param {string} caseIdentifier
   * @returns {{ status: string, solution?: Object, code?: string }}
   */
  revealSolution(caseIdentifier) {
    const record = this.getCase(caseIdentifier);
    if (!record) {
      return { status: 'not_found', code: 'CASE_EXPIRED_OR_NOT_FOUND' };
    }

    if (record.status === 'active') {
      return { status: 'forbidden', code: 'CASE_STILL_ACTIVE' };
    }

    return {
      status: 'revealed',
      caseId: record.caseId,
      unsealedFindings: {
        perpetrator: record.solution?.culprit,
        crimeScene: record.solution?.location,
        weaponUsed: record.solution?.weapon,
        motiveDeduction: record.solution?.motive
      }
    };
  }

  /**
   * Purges expired entries from memory.
   */
  cleanupExpired() {
    const now = Date.now();
    for (const [key, value] of this.cases.entries()) {
      if (now > value.expiresAt) {
        this.cases.delete(key);
      }
    }
  }

  /**
   * Clears all in-memory cases (useful for test resets).
   */
  clear() {
    this.cases.clear();
  }
}

// Export singleton instance and class definition
const defaultCaseStore = new ActiveCaseStore();

module.exports = {
  ActiveCaseStore,
  defaultCaseStore
};
