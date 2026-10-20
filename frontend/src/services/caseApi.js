/**
 * THE LAST CLUE — Procedurally Generated Mystery Investigation Game
 * Case API Service
 *
 * Centralized service layer for communicating with the Express backend API.
 * Encapsulates all network requests, error handling, and response parsing.
 */

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_API_BASE_URL) ||
  'http://localhost:5000/api';

/**
 * Standardized API response object
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether the request was successful
 * @property {Object|null} [data] - The returned payload on success
 * @property {string|null} [error] - User-friendly error message on failure
 * @property {string|null} [code] - Machine error code if available
 */

/**
 * Checks backend health status
 * @returns {Promise<ApiResponse>}
 */
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`${API_BASE_URL}/health`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        error: `Server responded with status ${response.status} (${response.statusText})`,
        code: `HTTP_${response.status}`
      };
    }

    const json = await response.json();
    return {
      success: true,
      data: json
    };
  } catch (err) {
    const message = err.name === 'AbortError'
      ? 'Health check timed out. Backend server is not responding.'
      : (err.message || 'Unable to connect to backend server. Ensure it is running on http://localhost:5000.');
    return {
      success: false,
      error: message,
      code: 'NETWORK_ERROR'
    };
  }
}

/**
 * Requests generation of a new procedural mystery case from the backend.
 *
 * @param {Object} options
 * @param {'easy'|'medium'|'hard'} options.difficulty - Difficulty level (required)
 * @param {number|string} [options.seed] - Optional numeric seed
 * @returns {Promise<ApiResponse>}
 */
export async function generateMysteryCase({ difficulty = 'medium', seed } = {}) {
  try {
    const payload = {
      difficulty: String(difficulty).toLowerCase()
    };

    if (seed !== undefined && seed !== null && String(seed).trim() !== '') {
      const parsedSeed = Number(seed);
      if (isNaN(parsedSeed) || !Number.isInteger(parsedSeed) || parsedSeed < 0) {
        return {
          success: false,
          error: 'Seed must be a positive integer.',
          code: 'INVALID_INPUT'
        };
      }
      payload.seed = parsedSeed;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(`${API_BASE_URL}/cases/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const json = await response.json();

    if (!response.ok || !json.success) {
      const serverMessage = json.error?.message || `Request failed with status ${response.status}`;
      return {
        success: false,
        error: serverMessage,
        code: json.error?.code || `HTTP_${response.status}`
      };
    }

    // Return the safe public case data
    return {
      success: true,
      data: json.data
    };
  } catch (err) {
    const message = err.name === 'AbortError'
      ? 'Case generation timed out. The server took too long to formulate the mystery.'
      : (err.message || 'Failed to contact investigation dispatch. Check your network or backend server.');
    return {
      success: false,
      error: message,
      code: 'NETWORK_ERROR'
    };
  }
}

/**
 * Submits a formal accusation to the authoritative backend evaluation endpoint.
 *
 * @param {Object} options
 * @param {string} options.caseInstanceId - Opaque case session UUID
 * @param {string} [options.caseId] - Alternative case ID
 * @param {string} options.suspectId - Accused suspect ID
 * @param {string} [options.rationale] - Optional detective rationale notes
 * @returns {Promise<ApiResponse>}
 */
export async function submitAccusation({ caseInstanceId, caseId, suspectId, rationale } = {}) {
  try {
    if (!caseInstanceId && !caseId) {
      return {
        success: false,
        error: 'Case identifier is required to submit an indictment.',
        code: 'INVALID_INPUT'
      };
    }

    if (!suspectId || String(suspectId).trim() === '') {
      return {
        success: false,
        error: 'A suspect must be designated for accusation.',
        code: 'INVALID_INPUT'
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${API_BASE_URL}/cases/accuse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        caseInstanceId,
        caseId,
        suspectId,
        rationale: rationale || ''
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const json = await response.json();

    if (!response.ok || !json.success) {
      const serverMessage = json.error?.message || `Accusation evaluation failed with status ${response.status}`;
      return {
        success: false,
        error: serverMessage,
        code: json.error?.code || `HTTP_${response.status}`
      };
    }

    return {
      success: true,
      data: json.data
    };
  } catch (err) {
    const message = err.name === 'AbortError'
      ? 'Judicial verdict dispatch timed out. Please try again.'
      : (err.message || 'Network error communicating with Scotland Yard dispatch.');
    return {
      success: false,
      error: message,
      code: 'NETWORK_ERROR'
    };
  }
}

/**
 * Requests the unsealed solution reveal for an already concluded case.
 *
 * @param {Object} options
 * @param {string} options.caseInstanceId
 * @param {string} [options.caseId]
 * @returns {Promise<ApiResponse>}
 */
export async function requestCaseSolutionReveal({ caseInstanceId, caseId } = {}) {
  try {
    if (!caseInstanceId && !caseId) {
      return {
        success: false,
        error: 'Case identifier is required.',
        code: 'INVALID_INPUT'
      };
    }

    const response = await fetch(`${API_BASE_URL}/cases/reveal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ caseInstanceId, caseId })
    });

    const json = await response.json();

    if (!response.ok || !json.success) {
      return {
        success: false,
        error: json.error?.message || 'Could not unseal case solution.',
        code: json.error?.code || `HTTP_${response.status}`
      };
    }

    return {
      success: true,
      data: json.data
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Failed to request solution reveal.',
      code: 'NETWORK_ERROR'
    };
  }
}
