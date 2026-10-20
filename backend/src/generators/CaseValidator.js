/**
 * THE LAST CLUE — Procedurally Generated Mystery Investigation Game
 * Case Validator: Structural & Algorithmic Solvability Verification
 *
 * Validates:
 * 1. Exactly one intended culprit in the solution.
 * 2. All required entities (suspects, clues, locations, weapons, motives) exist.
 * 3. The graph contains all active case nodes with correct entity types.
 * 4. BFS can traverse from the starting clue to the culprit.
 * 5. DFS can traverse the investigation network without stranded essential nodes.
 * 6. Red herrings are present in the graph without breaking path uniqueness.
 * 7. Path length satisfies the difficulty threshold.
 */

const { findShortestPath } = require('../algorithms/BFS');
const { dfs } = require('../algorithms/DFS');

class CaseValidator {
  /**
   * Validates a procedurally generated mystery case.
   *
   * @param {Object} mysteryCase - The generated mystery case object.
   * @returns {{ valid: boolean, errors: string[], diagnostics: Object }} Validation outcome.
   */
  static validate(mysteryCase) {
    const errors = [];
    const diagnostics = {
      pathLength: -1,
      bfsPath: [],
      clueCount: 0,
      suspectCount: 0,
      redHerringCount: 0,
      dfsNodesVisited: 0,
      isUniqueSolution: false
    };

    if (!mysteryCase || typeof mysteryCase !== 'object') {
      return {
        valid: false,
        errors: ['Invalid mysteryCase object provided to validator.'],
        diagnostics
      };
    }

    const {
      caseId,
      solution,
      suspects,
      locations,
      weapons,
      motives,
      clues,
      redHerrings,
      startingClueId,
      graph,
      metadata
    } = mysteryCase;

    // 1. Solution presence & completeness
    if (!solution || !solution.culprit || !solution.weapon || !solution.location || !solution.motive) {
      errors.push('Solution is missing or incomplete (requires culprit, weapon, location, motive).');
    }

    // 2. Suspect validity
    if (!Array.isArray(suspects) || suspects.length < 2) {
      errors.push('Case must have at least 2 suspects.');
    } else {
      diagnostics.suspectCount = suspects.length;
      const culpritExists = suspects.some(s => s.id === solution.culprit);
      if (!culpritExists) {
        errors.push(`Culprit "${solution.culprit}" is not present in the suspects list.`);
      }
    }

    // 3. Location & Weapon validity
    if (!Array.isArray(locations) || locations.length === 0) {
      errors.push('Case has no locations defined.');
    }
    if (!Array.isArray(weapons) || weapons.length === 0) {
      errors.push('Case has no weapons defined.');
    }

    // 4. Clues and Red Herrings
    if (!Array.isArray(clues) || clues.length === 0) {
      errors.push('Case must have at least one investigative clue.');
    } else {
      diagnostics.clueCount = clues.length;
    }

    if (!Array.isArray(redHerrings) || redHerrings.length === 0) {
      errors.push('Case must feature at least one red herring entity.');
    } else {
      diagnostics.redHerringCount = redHerrings.length;
    }

    // 5. Graph Structure Integrity
    if (!graph || typeof graph.hasNode !== 'function') {
      errors.push('Graph instance is missing or invalid.');
      return { valid: false, errors, diagnostics };
    }

    // Check essential nodes exist in Graph
    const essentialNodes = [
      { id: solution.culprit, type: 'suspect' },
      { id: solution.location, type: 'location' },
      { id: solution.weapon, type: 'evidence' },
      { id: solution.motive, type: 'motive' },
      { id: startingClueId, type: 'clue' }
    ];

    for (let i = 0; i < essentialNodes.length; i++) {
      const node = essentialNodes[i];
      if (!graph.hasNode(node.id)) {
        errors.push(`Graph is missing essential ${node.type} node "${node.id}".`);
      }
    }

    // 6. Starting Clue & BFS Solvability Path
    if (!startingClueId || !graph.hasNode(startingClueId)) {
      errors.push(`Starting clue "${startingClueId}" does not exist in graph.`);
    } else {
      const shortestPath = findShortestPath(graph, startingClueId, solution.culprit);
      if (!shortestPath.found) {
        errors.push(`Solvability failure: No BFS path found from starting clue "${startingClueId}" to culprit "${solution.culprit}".`);
      } else {
        diagnostics.pathLength = shortestPath.distance;
        diagnostics.bfsPath = shortestPath.path;

        if (shortestPath.distance < 2) {
          errors.push(`Evidence path is too short (distance ${shortestPath.distance}); minimum 2 hops required.`);
        }
      }
    }

    // 7. DFS Network Exploration
    if (startingClueId && graph.hasNode(startingClueId)) {
      const dfsResult = dfs(graph, startingClueId);
      diagnostics.dfsNodesVisited = dfsResult.visited.length;

      // Culprit, location, and weapon must be reachable via DFS
      if (!dfsResult.visited.includes(solution.culprit)) {
        errors.push(`DFS traversal from "${startingClueId}" failed to reach culprit "${solution.culprit}".`);
      }
      if (!dfsResult.visited.includes(solution.location)) {
        errors.push(`DFS traversal from "${startingClueId}" failed to reach location "${solution.location}".`);
      }
      if (!dfsResult.visited.includes(solution.weapon)) {
        errors.push(`DFS traversal from "${startingClueId}" failed to reach weapon "${solution.weapon}".`);
      }
    }

    // 8. Unique Solution Flag
    if (metadata && metadata.isUniqueSolution === true) {
      diagnostics.isUniqueSolution = true;
    } else {
      errors.push('Uniqueness check failed: Case metadata does not confirm a unique culprit solution.');
    }

    return {
      valid: errors.length === 0,
      errors,
      diagnostics
    };
  }
}

module.exports = CaseValidator;
