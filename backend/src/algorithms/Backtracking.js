/**
 * THE LAST CLUE — Procedurally Generated Mystery Investigation Game
 * Phase 4: Backtracking Constraint Satisfaction Engine
 *
 * Design Decisions:
 * 1. Pure DSA Constraint Satisfaction Problem (CSP) Solver:
 *    - Operates on generic variables, discrete domains, and predicate constraints.
 *    - Independent of React, Express, MongoDB, or game-specific logic.
 * 2. Partial Assignment Pruning:
 *    - Evaluates constraints as soon as relevant variables are bound.
 *    - Rejects invalid partial assignments early, pruning entire subtrees.
 * 3. Systematic Backtracking:
 *    - Explicitly undoes assignments (`delete assignment[variable]`) when dead ends are hit.
 * 4. Variable Selection:
 *    - Supports sequential ordering or Minimum Remaining Values (MRV) heuristic.
 * 5. Trace & Observability:
 *    - Optional trace mode records step-by-step decision/backtrack logs for viva demonstration.
 */

/**
 * Checks whether the current (partial or complete) assignment satisfies all constraints.
 *
 * @param {Object} assignment - Current variable-value mapping.
 * @param {Function[]} constraints - Array of constraint functions: `(assignment, isComplete) => boolean`.
 * @param {boolean} isComplete - Whether all variables have been assigned.
 * @returns {boolean} True if all constraints pass.
 */
function checkConstraints(assignment, constraints, isComplete = false) {
  for (let i = 0; i < constraints.length; i++) {
    const constraintFn = constraints[i];
    if (typeof constraintFn === 'function') {
      try {
        const isValid = constraintFn(assignment, isComplete);
        if (isValid === false) {
          return false;
        }
      } catch (err) {
        // If a constraint throws an error, treat assignment as invalid
        return false;
      }
    }
  }
  return true;
}

/**
 * Selects the next unassigned variable.
 * Uses Minimum Remaining Values (MRV) if enabled, otherwise returns the first unassigned variable.
 *
 * @param {string[]} variables - List of all variable names.
 * @param {Object} assignment - Current variable assignments.
 * @param {Object.<string, Array>} domains - Domain of values for each variable.
 * @param {Function[]} constraints - Constraint functions.
 * @param {boolean} useMRV - Whether to apply Minimum Remaining Values heuristic.
 * @returns {string|null} Next variable to assign, or null if all are assigned.
 */
function selectUnassignedVariable(variables, assignment, domains, constraints, useMRV) {
  const unassigned = variables.filter(v => assignment[v] === undefined);

  if (unassigned.length === 0) {
    return null;
  }

  if (!useMRV) {
    return unassigned[0];
  }

  // MRV: Choose the unassigned variable with the fewest valid remaining candidate values
  let bestVar = unassigned[0];
  let minValidCount = Infinity;

  for (let i = 0; i < unassigned.length; i++) {
    const variable = unassigned[i];
    const domain = domains[variable] || [];

    // Count how many values in the domain satisfy current partial constraints
    let validCount = 0;
    for (let j = 0; j < domain.length; j++) {
      assignment[variable] = domain[j];
      if (checkConstraints(assignment, constraints, false)) {
        validCount++;
      }
      delete assignment[variable];
    }

    if (validCount < minValidCount) {
      minValidCount = validCount;
      bestVar = variable;
    }
  }

  return bestVar;
}

/**
 * Solves a Constraint Satisfaction Problem using recursive Backtracking.
 *
 * @param {string[]} variables - Array of variable identifiers (e.g., ["culprit", "motive", "weapon"]).
 * @param {Object.<string, Array>} domains - Map of variable to array of candidate values.
 * @param {Function[]} constraints - Array of constraint functions: `(assignment, isComplete) => boolean`.
 * @param {Object} [options={}] - Solver options.
 * @param {boolean} [options.trace=false] - Whether to capture detailed execution trace logs.
 * @param {boolean} [options.useMRV=false] - Whether to use the Minimum Remaining Values variable selection heuristic.
 * @returns {{ solved: boolean, assignment: Object|null, backtracks: number, assignmentsTried: number, trace: string[] }}
 */
function solveWithBacktracking(variables, domains, constraints = [], options = {}) {
  // Input Validation
  if (!Array.isArray(variables)) {
    throw new TypeError('Variables must be an array of strings.');
  }
  if (!domains || typeof domains !== 'object' || Array.isArray(domains)) {
    throw new TypeError('Domains must be an object mapping variable names to arrays.');
  }
  if (!Array.isArray(constraints)) {
    throw new TypeError('Constraints must be an array of functions.');
  }

  const traceEnabled = Boolean(options.trace);
  const useMRV = Boolean(options.useMRV);
  const trace = [];

  let backtracks = 0;
  let assignmentsTried = 0;

  // Base edge case: No variables to assign
  if (variables.length === 0) {
    if (traceEnabled) trace.push('[Depth 0] No variables provided. Trivial complete solution.');
    return {
      solved: true,
      assignment: {},
      backtracks: 0,
      assignmentsTried: 0,
      trace
    };
  }

  // Validate that every variable has a valid domain array
  for (let i = 0; i < variables.length; i++) {
    const v = variables[i];
    if (!Array.isArray(domains[v])) {
      throw new Error(`Domain for variable "${v}" is missing or not an array.`);
    }
  }

  const assignment = {};

  /**
   * Internal recursive backtracking procedure.
   *
   * @param {number} depth - Current search tree depth.
   * @returns {boolean} True if a complete valid assignment was found.
   */
  function backtrack(depth) {
    const variable = selectUnassignedVariable(variables, assignment, domains, constraints, useMRV);

    // If all variables are assigned, verify complete constraints
    if (variable === null) {
      const isCompletelyValid = checkConstraints(assignment, constraints, true);
      if (isCompletelyValid) {
        if (traceEnabled) {
          trace.push(`[Depth ${depth}] All variables assigned successfully: ${JSON.stringify(assignment)}`);
        }
        return true;
      }
      return false;
    }

    const domain = domains[variable];

    for (let i = 0; i < domain.length; i++) {
      const candidateValue = domain[i];
      assignmentsTried++;

      // STEP 1: ASSIGN (Try candidate)
      assignment[variable] = candidateValue;

      if (traceEnabled) {
        trace.push(`[Depth ${depth}] Trying ${variable} = ${JSON.stringify(candidateValue)}`);
      }

      // STEP 2: CHECK CONSTRAINTS on partial assignment
      const isValidPartial = checkConstraints(assignment, constraints, false);

      if (isValidPartial) {
        if (traceEnabled) {
          trace.push(`[Depth ${depth}]   -> Partial assignment valid. Continuing to Depth ${depth + 1}...`);
        }

        // STEP 3: RECURSE
        const success = backtrack(depth + 1);
        if (success) {
          return true; // Propagate success upwards
        }
      } else {
        if (traceEnabled) {
          trace.push(`[Depth ${depth}]   -> Constraint check FAILED for ${variable} = ${JSON.stringify(candidateValue)}.`);
        }
      }

      // STEP 4: UNDO / BACKTRACK
      backtracks++;
      delete assignment[variable];

      if (traceEnabled) {
        trace.push(`[Depth ${depth}]   <- BACKTRACKING: Undoing ${variable} = ${JSON.stringify(candidateValue)}`);
      }
    }

    // All candidate values for this variable were exhausted without finding a valid solution
    return false;
  }

  const solved = backtrack(0);

  return {
    solved,
    assignment: solved ? { ...assignment } : null,
    backtracks,
    assignmentsTried,
    trace
  };
}

module.exports = {
  solveWithBacktracking,
  checkConstraints
};
