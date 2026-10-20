/**
 * Test Suite for Procedural Mystery Generator
 * Built using Node.js native test runner (node:test and node:assert/strict).
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const MysteryGenerator = require('../MysteryGenerator');
const CaseValidator = require('../CaseValidator');
const { findShortestPath } = require('../../algorithms/BFS');
const { dfs } = require('../../algorithms/DFS');

describe('Procedural Mystery Generator Engine', () => {

  // TEST 1: Same seed -> same case (Reproducibility)
  it('TEST 1: should generate the exact same mystery case when given the same seed', () => {
    const seed = 12345;
    const caseA = MysteryGenerator.generateCase(seed, 'medium');
    const caseB = MysteryGenerator.generateCase(seed, 'medium');

    assert.equal(caseA.caseId, caseB.caseId);
    assert.deepEqual(caseA.solution, caseB.solution);
    assert.equal(caseA.suspects.length, caseB.suspects.length);
    assert.deepEqual(
      caseA.suspects.map(s => s.id),
      caseB.suspects.map(s => s.id)
    );
    assert.equal(caseA.startingClueId, caseB.startingClueId);
    assert.equal(caseA.graph.getNodeCount(), caseB.graph.getNodeCount());
    assert.equal(caseA.graph.getEdgeCount(), caseB.graph.getEdgeCount());
  });

  // TEST 2: Different seeds -> different cases (Variation)
  it('TEST 2: should produce distinct mysteries when given different seeds', () => {
    const case1 = MysteryGenerator.generateCase(12345, 'medium');
    const case2 = MysteryGenerator.generateCase(67890, 'medium');

    assert.notEqual(case1.caseId, case2.caseId);
    // At least one core attribute (culprit, weapon, location, motive, or starting clue) should vary
    const isDifferent =
      case1.solution.culprit !== case2.solution.culprit ||
      case1.solution.weapon !== case2.solution.weapon ||
      case1.solution.location !== case2.solution.location ||
      case1.solution.motive !== case2.solution.motive ||
      case1.startingClueId !== case2.startingClueId;

    assert.equal(isDifferent, true);
  });

  // TEST 3: Generated case is structurally and algorithmically valid
  it('TEST 3: should pass all CaseValidator solvability and structural requirements', () => {
    const mysteryCase = MysteryGenerator.generateCase(481729, 'medium');
    const validation = CaseValidator.validate(mysteryCase);

    assert.equal(validation.valid, true);
    assert.deepEqual(validation.errors, []);
    assert.ok(validation.diagnostics.pathLength >= 3);
  });

  // TEST 4: Unique solution guarantee
  it('TEST 4: should verify that the culprit is mathematically unique under the constraints', () => {
    const mysteryCase = MysteryGenerator.generateCase(481729, 'medium');

    assert.equal(mysteryCase.metadata.isUniqueSolution, true);
    assert.equal(mysteryCase.validation.diagnostics.isUniqueSolution, true);
  });

  // TEST 5: Graph contains expected entity types
  it('TEST 5: should populate the investigation graph with correct entity node types', () => {
    const mysteryCase = MysteryGenerator.generateCase(999, 'medium');
    const graph = mysteryCase.graph;

    const nodeTypes = new Set(graph.getNodes().map(n => n.type));

    assert.ok(nodeTypes.has('suspect'), 'Must contain suspect nodes');
    assert.ok(nodeTypes.has('location'), 'Must contain location nodes');
    assert.ok(nodeTypes.has('evidence'), 'Must contain evidence nodes');
    assert.ok(nodeTypes.has('motive'), 'Must contain motive node');
    assert.ok(nodeTypes.has('clue'), 'Must contain clue nodes');
  });

  // TEST 6: BFS finds the intended evidence path
  it('TEST 6: should enable BFS to find the shortest evidence path from starting clue to culprit', () => {
    const mysteryCase = MysteryGenerator.generateCase(481729, 'medium');
    const { graph, startingClueId, solution } = mysteryCase;

    const shortestPath = findShortestPath(graph, startingClueId, solution.culprit);

    assert.equal(shortestPath.found, true);
    assert.equal(shortestPath.path[0], startingClueId);
    assert.equal(shortestPath.path[shortestPath.path.length - 1], solution.culprit);
    assert.ok(shortestPath.distance >= 3, `Expected at least 3 hops, got ${shortestPath.distance}`);
  });

  // TEST 7: DFS traverses the relevant investigation network
  it('TEST 7: should allow DFS to reach all essential crime entities from the starting clue', () => {
    const mysteryCase = MysteryGenerator.generateCase(481729, 'medium');
    const { graph, startingClueId, solution } = mysteryCase;

    const dfsResult = dfs(graph, startingClueId);

    assert.ok(dfsResult.visited.includes(solution.culprit));
    assert.ok(dfsResult.visited.includes(solution.location));
    assert.ok(dfsResult.visited.includes(solution.weapon));
    assert.ok(dfsResult.visited.includes(solution.motive));
  });

  // TEST 8: Red herrings exist and are properly integrated
  it('TEST 8: should integrate plausible red herrings without breaking solution uniqueness', () => {
    const mysteryCase = MysteryGenerator.generateCase(481729, 'medium');

    assert.ok(Array.isArray(mysteryCase.redHerrings));
    assert.ok(mysteryCase.redHerrings.length >= 1);

    // Each red herring suspect must be in the graph
    mysteryCase.redHerrings.forEach(rh => {
      assert.equal(mysteryCase.graph.hasNode(rh.suspectId), true);
      assert.notEqual(rh.suspectId, mysteryCase.solution.culprit);
    });
  });

  // TEST 9: Repeated generation across multiple seeds does not produce invalid cases
  it('TEST 9: should generate valid and uniquely solvable cases across a large spectrum of seeds', () => {
    const seeds = [101, 202, 303, 404, 505, 606, 707, 808, 909, 1001];

    for (const seed of seeds) {
      const generatedCase = MysteryGenerator.generateCase(seed, 'medium');
      const validation = CaseValidator.validate(generatedCase);

      assert.equal(
        validation.valid,
        true,
        `Case with seed ${seed} failed validation: ${validation.errors.join(', ')}`
      );
      assert.equal(generatedCase.metadata.isUniqueSolution, true);
    }
  });

  // TEST 10: Difficulty scaling
  it('TEST 10: should scale suspect count, clue count, and red herrings according to difficulty', () => {
    const seed = 54321;
    const easyCase = MysteryGenerator.generateCase(seed, 'easy');
    const hardCase = MysteryGenerator.generateCase(seed, 'hard');

    assert.equal(easyCase.difficulty, 'easy');
    assert.equal(hardCase.difficulty, 'hard');

    assert.ok(easyCase.suspects.length <= hardCase.suspects.length);
    assert.ok(easyCase.clues.length <= hardCase.clues.length);
    assert.ok(easyCase.redHerrings.length <= hardCase.redHerrings.length);
  });

  // TEST 11: Deterministic case ID
  it('TEST 11: should construct deterministic case ID from seed and difficulty', () => {
    const caseObj = MysteryGenerator.generateCase(481729, 'hard');
    assert.equal(caseObj.caseId, 'CASE-481729-HAR');
  });
});
