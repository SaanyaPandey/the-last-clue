/**
 * THE LAST CLUE — Procedurally Generated Mystery Investigation Game
 * Procedural Mystery Generator
 *
 * Key Architecture:
 * 1. Seeded Randomness (Mulberry32 PRNG):
 *    - Guarantees 100% deterministic reproducibility for any given seed.
 * 2. Constraint-Based Backtracking:
 *    - Solves for a plausible, logically coherent crime (culprit, motive, weapon, location).
 * 3. Uniqueness Verification:
 *    - Runs a secondary backtracking pass to guarantee that only ONE suspect in the case
 *      can be the culprit under the established constraints.
 * 4. Graph Construction:
 *    - Builds an investigation graph with suspects, locations, evidence, clues, and red herrings.
 * 5. BFS/DFS Solvability Validation:
 *    - Uses CaseValidator to ensure starting clue can reach the culprit within the target difficulty depth.
 */

const SeededRandom = require('../utils/SeededRandom');
const Graph = require('../algorithms/Graph');
const { solveWithBacktracking } = require('../algorithms/Backtracking');
const CaseValidator = require('./CaseValidator');

const suspectsPool = require('./data/suspects');
const locationsPool = require('./data/locations');
const weaponsPool = require('./data/weapons');
const motivesPool = require('./data/motives');
const cluesPool = require('./data/clues');

class MysteryGenerator {
  /**
   * Generates a complete, verified, and uniquely solvable procedural mystery case.
   *
   * @param {number|string} seed - The random seed for reproducibility.
   * @param {'easy'|'medium'|'hard'} [difficulty='medium'] - Target difficulty.
   * @returns {Object} Complete case object.
   * @throws {Error} If generation fails after retry attempts.
   */
  static generateCase(seed, difficulty = 'medium') {
    const normalizedDifficulty = ['easy', 'medium', 'hard'].includes(difficulty)
      ? difficulty
      : 'medium';

    const rng = new SeededRandom(seed);
    const caseId = `CASE-${seed}-${normalizedDifficulty.toUpperCase().slice(0, 3)}`;

    // Difficulty settings
    const config = {
      easy: { suspectCount: 3, locationCount: 2, clueCount: 3, redHerringCount: 1, minHops: 3 },
      medium: { suspectCount: 4, locationCount: 2, clueCount: 4, redHerringCount: 2, minHops: 4 },
      hard: { suspectCount: 5, locationCount: 3, clueCount: 6, redHerringCount: 3, minHops: 4 }
    }[normalizedDifficulty];

    // STEP 1: Select Candidate Entities
    const shuffledSuspects = rng.shuffle(suspectsPool);
    const selectedSuspects = shuffledSuspects.slice(0, config.suspectCount);

    const shuffledLocations = rng.shuffle(locationsPool);
    const selectedLocations = shuffledLocations.slice(0, config.locationCount);

    const shuffledWeapons = rng.shuffle(weaponsPool);
    const selectedWeapons = shuffledWeapons.slice(0, Math.min(config.suspectCount, weaponsPool.length));

    const shuffledMotives = rng.shuffle(motivesPool);
    const selectedMotives = shuffledMotives.slice(0, Math.min(config.suspectCount, motivesPool.length));

    const shuffledClues = rng.shuffle(cluesPool);
    const selectedClues = shuffledClues.slice(0, config.clueCount);

    // Maps for fast entity attribute lookup
    const suspectMap = new Map(selectedSuspects.map(s => [s.id, s]));
    const locationMap = new Map(selectedLocations.map(l => [l.id, l]));

    // STEP 2: Formulate CSP and Solve via Backtracking
    const variables = ['culprit', 'location', 'weapon', 'motive'];
    const domains = {
      culprit: selectedSuspects.map(s => s.id),
      location: selectedLocations.map(l => l.id),
      weapon: selectedWeapons.map(w => w.id),
      motive: selectedMotives.map(m => m.id)
    };

    // Narrative consistency constraints
    const constraints = [
      // 1. Culprit must have access to the crime location
      (assignment) => {
        if (assignment.culprit && assignment.location) {
          const suspect = suspectMap.get(assignment.culprit);
          return suspect && suspect.accessLocations.includes(assignment.location);
        }
        return true;
      },
      // 2. Weapon must be compatible with the location
      (assignment) => {
        if (assignment.location && assignment.weapon) {
          const loc = locationMap.get(assignment.location);
          return loc && loc.compatibleWeapons.includes(assignment.weapon);
        }
        return true;
      },
      // 3. Culprit must be capable of/affiliated with the weapon
      (assignment) => {
        if (assignment.culprit && assignment.weapon) {
          const suspect = suspectMap.get(assignment.culprit);
          return suspect && suspect.affiliatedWeapons.includes(assignment.weapon);
        }
        return true;
      },
      // 4. Culprit's profile must support the motive
      (assignment) => {
        if (assignment.culprit && assignment.motive) {
          const suspect = suspectMap.get(assignment.culprit);
          return suspect && suspect.possibleMotives.includes(assignment.motive);
        }
        return true;
      },
      // 5. Uniqueness guarantee: No other suspect in the case must satisfy the same (location, weapon, motive)
      (assignment) => {
        if (assignment.culprit && assignment.location && assignment.weapon && assignment.motive) {
          const others = selectedSuspects.filter(s => s.id !== assignment.culprit);
          const hasAmbiguity = others.some(other =>
            other.accessLocations.includes(assignment.location) &&
            other.affiliatedWeapons.includes(assignment.weapon) &&
            other.possibleMotives.includes(assignment.motive)
          );
          return !hasAmbiguity;
        }
        return true;
      }
    ];

    let primarySolution = solveWithBacktracking(variables, domains, constraints);

    // If initial random slice had no solution, systematically broaden domains deterministically
    if (!primarySolution.solved) {
      domains.location = locationsPool.map(l => l.id);
      domains.weapon = weaponsPool.map(w => w.id);
      domains.motive = motivesPool.map(m => m.id);
      locationsPool.forEach(l => locationMap.set(l.id, l));

      primarySolution = solveWithBacktracking(variables, domains, constraints);

      if (!primarySolution.solved) {
        throw new Error(`GenerationError: Could not solve core mystery CSP for seed ${seed}.`);
      }
    }

    const solution = primarySolution.assignment;

    // STEP 3: Verify Solution Uniqueness (Requirement 10)
    // Run second backtracking check asserting culprit !== solution.culprit under the same crime facts
    const alternativeCheck = solveWithBacktracking(
      ['culprit'],
      { culprit: selectedSuspects.filter(s => s.id !== solution.culprit).map(s => s.id) },
      [
        (a) => {
          if (a.culprit) {
            const s = suspectMap.get(a.culprit);
            return s &&
              s.accessLocations.includes(solution.location) &&
              s.affiliatedWeapons.includes(solution.weapon) &&
              s.possibleMotives.includes(solution.motive);
          }
          return true;
        }
      ]
    );

    const isUniqueSolution = !alternativeCheck.solved;

    // Ensure all entities in the solution exist in case arrays
    if (!selectedLocations.some(l => l.id === solution.location)) {
      selectedLocations.push(locationsPool.find(l => l.id === solution.location));
    }
    if (!selectedWeapons.some(w => w.id === solution.weapon)) {
      selectedWeapons.push(weaponsPool.find(w => w.id === solution.weapon));
    }
    if (!selectedMotives.some(m => m.id === solution.motive)) {
      selectedMotives.push(motivesPool.find(m => m.id === solution.motive));
    }

    // STEP 4: Construct the Investigation Graph
    const graph = new Graph({ isDirected: false });

    // 4a. Add Suspect Nodes
    selectedSuspects.forEach(s => {
      graph.addNode(s.id, {
        type: 'suspect',
        label: s.name,
        metadata: { role: s.role, traits: s.traits }
      });
    });

    // 4b. Add Location Nodes
    selectedLocations.forEach(l => {
      graph.addNode(l.id, {
        type: 'location',
        label: l.name,
        metadata: { description: l.description }
      });
    });

    // 4c. Add Weapon Nodes (as evidence)
    selectedWeapons.forEach(w => {
      graph.addNode(w.id, {
        type: 'evidence',
        label: w.name,
        metadata: { category: w.category, subType: w.subType, isMurderWeapon: w.id === solution.weapon }
      });
    });

    // 4d. Add Motive Node
    const trueMotiveObj = motivesPool.find(m => m.id === solution.motive);
    graph.addNode(solution.motive, {
      type: 'motive',
      label: trueMotiveObj ? trueMotiveObj.name : 'Unknown Motive',
      metadata: { description: trueMotiveObj ? trueMotiveObj.description : '' }
    });

    // 4e. Add Clue Nodes
    selectedClues.forEach(c => {
      graph.addNode(c.id, {
        type: 'clue',
        label: c.name,
        metadata: { category: c.category, reliability: c.reliability, description: c.description }
      });
    });

    // STEP 5: Construct Evidence Chain & Relationships
    const startingClue = selectedClues[0];
    const startingClueId = startingClue.id;

    // 5a. Primary Solvable Chain:
    // Starting Clue -> Crime Scene Location -> Murder Weapon -> Intermediate Evidence -> Culprit -> Motive
    graph.addEdge(startingClueId, solution.location, 'found_at', {
      note: `Discovered at the crime scene (${locationMap.get(solution.location)?.name || 'Scene'}).`
    });

    graph.addEdge(solution.location, solution.weapon, 'connected_to', {
      note: 'Murder weapon hidden on the premises.'
    });

    if (selectedClues.length >= 2) {
      const intermediateClue = selectedClues[1];
      graph.addEdge(solution.weapon, intermediateClue.id, 'points_to', {
        note: 'Weapon markings match physical evidence recovered.'
      });
      graph.addEdge(intermediateClue.id, solution.culprit, 'belongs_to', {
        note: 'Evidence traced directly to suspect.'
      });
    } else {
      graph.addEdge(solution.weapon, solution.culprit, 'belongs_to', {
        note: 'Weapon traced directly to suspect.'
      });
    }

    graph.addEdge(solution.culprit, solution.motive, 'motivated_by', {
      note: 'Underlying motive driving the criminal act.'
    });

    // STEP 6: Integrate Red Herrings (Requirement 8)
    const innocentSuspects = selectedSuspects.filter(s => s.id !== solution.culprit);
    const redHerrings = [];

    for (let i = 0; i < Math.min(config.redHerringCount, innocentSuspects.length); i++) {
      const innocent = innocentSuspects[i];
      const redHerringClueIndex = 2 + i;
      const redHerringClue = selectedClues[redHerringClueIndex] || selectedClues[selectedClues.length - 1];

      // Red Herring: Connect innocent suspect to an intermediate clue or secondary location
      if (redHerringClue && redHerringClue.id !== startingClueId) {
        if (!graph.hasEdge(innocent.id, redHerringClue.id)) {
          graph.addEdge(innocent.id, redHerringClue.id, 'points_to', {
            note: 'Suspicious circumstantial lead pointing toward an innocent suspect.'
          });
        }
      }

      // Add a relationship edge between innocent suspect and culprit (e.g., knows, witnessed)
      if (!graph.hasEdge(innocent.id, solution.culprit)) {
        graph.addEdge(innocent.id, solution.culprit, 'knows', {
          note: 'Acquaintances observed interacting prior to the event.'
        });
      }

      redHerrings.push({
        suspectId: innocent.id,
        suspectName: innocent.name,
        type: 'misleading_lead',
        associatedClueId: redHerringClue ? redHerringClue.id : null
      });
    }

    // Connect any remaining unattached clues or locations to maintain a connected investigative network
    selectedClues.forEach(clue => {
      if (graph.getDegree(clue.id) === 0) {
        graph.addEdge(clue.id, solution.location, 'found_at', { note: 'Found in vicinity.' });
      }
    });

    selectedLocations.forEach(loc => {
      if (graph.getDegree(loc.id) === 0) {
        graph.addEdge(loc.id, solution.location, 'connected_to', { note: 'Adjacent room.' });
      }
    });

    // STEP 7: Assemble Final Case Object
    const caseData = {
      caseId,
      seed,
      difficulty: normalizedDifficulty,
      suspects: selectedSuspects,
      locations: selectedLocations,
      weapons: selectedWeapons,
      motives: selectedMotives,
      clues: selectedClues,
      redHerrings,
      startingClueId,
      solution,
      graph,
      metadata: {
        clueCount: selectedClues.length,
        redHerringCount: redHerrings.length,
        suspectCount: selectedSuspects.length,
        isUniqueSolution,
        generatorVersion: '1.0.0'
      }
    };

    // STEP 8: Validate the Case (Solvability, BFS/DFS path checks)
    const validation = CaseValidator.validate(caseData);
    if (!validation.valid) {
      throw new Error(`GenerationValidationError: Case ${caseId} failed validation: ${validation.errors.join(', ')}`);
    }

    caseData.validation = validation;

    return caseData;
  }
}

module.exports = MysteryGenerator;
