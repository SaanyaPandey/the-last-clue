/**
 * Test Suite for Backtracking Constraint Satisfaction Engine
 * Tests cover all 8 required test cases + edge cases.
 * Built using Node.js native test runner (node:test and node:assert/strict).
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { solveWithBacktracking } = require('../Backtracking');

describe('Backtracking Constraint Engine', () => {

  // TEST 1: Simple valid assignment
  it('TEST 1: should find a valid assignment for simple variables with inequality constraint', () => {
    const variables = ['A', 'B'];
    const domains = {
      A: [1, 2],
      B: [1, 2]
    };
    const constraints = [
      (assignment) => {
        if (assignment.A !== undefined && assignment.B !== undefined) {
          return assignment.A !== assignment.B;
        }
        return true;
      }
    ];

    const result = solveWithBacktracking(variables, domains, constraints);

    assert.equal(result.solved, true);
    assert.notEqual(result.assignment, null);
    assert.notEqual(result.assignment.A, result.assignment.B);
    assert.ok([1, 2].includes(result.assignment.A));
    assert.ok([1, 2].includes(result.assignment.B));
  });

  // TEST 2: Requires actual backtracking
  it('TEST 2: should visibly encounter contradiction, backtrack, undo assignment, and find solution', () => {
    /*
     * Setup designed so the greedy first choice leads to a dead end:
     * Variables: ['suspect', 'motive', 'weapon']
     * Domains:
     *   suspect: ['Lord Harrington', 'Gardener Thomas']
     *   motive:  ['Greed', 'Revenge']
     *   weapon:  ['Poison', 'Shears']
     *
     * Constraint 1: Lord Harrington is fine with Greed at depth 1.
     * Constraint 2: BUT at depth 2, Lord Harrington + Greed cannot use Poison (Lord Harrington has no access to poison).
     * Constraint 3: AND Lord Harrington + Greed cannot use Shears (shears belong to gardener).
     *
     * Result:
     * Lord Harrington + Greed creates a dead end at weapon selection.
     * The solver MUST backtrack out of Greed, choose Revenge, and find the working weapon!
     */
    const variables = ['suspect', 'motive', 'weapon'];
    const domains = {
      suspect: ['Lord Harrington', 'Gardener Thomas'],
      motive: ['Greed', 'Revenge'],
      weapon: ['Poison', 'Shears']
    };

    const constraints = [
      // Dead end constraint: Harrington + Greed has no viable weapon
      (a) => {
        if (a.suspect === 'Lord Harrington' && a.motive === 'Greed' && a.weapon !== undefined) {
          return false; // Neither poison nor shears valid for Harrington under greed
        }
        return true;
      },
      // Harrington + Revenge requires Shears
      (a) => {
        if (a.suspect === 'Lord Harrington' && a.motive === 'Revenge' && a.weapon !== undefined) {
          return a.weapon === 'Shears';
        }
        return true;
      }
    ];

    const result = solveWithBacktracking(variables, domains, constraints, { trace: true });

    assert.equal(result.solved, true);
    // Verified that backtracking actually occurred!
    assert.ok(result.backtracks > 0, 'Backtracking counter must be greater than 0');
    assert.equal(result.assignment.suspect, 'Lord Harrington');
    assert.equal(result.assignment.motive, 'Revenge');
    assert.equal(result.assignment.weapon, 'Shears');

    // Confirm trace captured the undo / backtrack step
    const hasBacktrackEvent = result.trace.some(log => log.includes('BACKTRACKING: Undoing'));
    assert.equal(hasBacktrackEvent, true);
  });

  // TEST 3: No possible solution
  it('TEST 3: should return solved: false and assignment: null when constraints are contradictory', () => {
    const variables = ['X'];
    const domains = {
      X: [1, 2, 3]
    };
    // Impossible constraint
    const constraints = [
      (a) => a.X === 99
    ];

    const result = solveWithBacktracking(variables, domains, constraints);

    assert.equal(result.solved, false);
    assert.equal(result.assignment, null);
    assert.ok(result.backtracks > 0);
  });

  // TEST 4: Multiple simultaneous constraints
  it('TEST 4: should strictly enforce multiple simultaneous constraints across all variables', () => {
    const variables = ['culprit', 'location', 'weapon'];
    const domains = {
      culprit: ['Alex', 'Beth', 'Charles'],
      location: ['Library', 'Kitchen', 'Conservatory'],
      weapon: ['Rope', 'Dagger', 'Wrench']
    };

    const constraints = [
      // 1. Alex cannot be in the Library (alibi)
      (a) => !(a.culprit === 'Alex' && a.location === 'Library'),
      // 2. Kitchen crime must involve the Dagger
      (a) => !(a.location === 'Kitchen' && a.weapon !== undefined && a.weapon !== 'Dagger'),
      // 3. Beth dislikes the Rope
      (a) => !(a.culprit === 'Beth' && a.weapon === 'Rope'),
      // 4. Force specific solution for testing: Charles is innocent
      (a) => a.culprit !== 'Charles'
    ];

    const result = solveWithBacktracking(variables, domains, constraints);

    assert.equal(result.solved, true);
    assert.notEqual(result.assignment.culprit, 'Charles');
    if (result.assignment.culprit === 'Alex') {
      assert.notEqual(result.assignment.location, 'Library');
    }
    if (result.assignment.location === 'Kitchen') {
      assert.equal(result.assignment.weapon, 'Dagger');
    }
    if (result.assignment.culprit === 'Beth') {
      assert.notEqual(result.assignment.weapon, 'Rope');
    }
  });

  // TEST 5: Partial constraint pruning
  it('TEST 5: should prune invalid partial assignments early without assigning remaining variables', () => {
    const variables = ['V1', 'V2', 'V3', 'V4'];
    const domains = {
      V1: ['bad', 'good'],
      V2: [1, 2, 3, 4, 5],
      V3: [10, 20, 30],
      V4: [100, 200]
    };

    let partialCheckCount = 0;

    const constraints = [
      // V1 cannot be 'bad'
      (a) => {
        partialCheckCount++;
        return a.V1 !== 'bad';
      }
    ];

    const result = solveWithBacktracking(variables, domains, constraints);

    assert.equal(result.solved, true);
    assert.equal(result.assignment.V1, 'good');

    /*
     * Because 'bad' is pruned immediately at depth 0,
     * none of the 5 * 3 * 2 = 30 combinations for (V2, V3, V4) under V1='bad'
     * were ever explored!
     */
    assert.ok(result.assignmentsTried < 20);
  });

  // TEST 6: Different variable/domain sizes
  it('TEST 6: should seamlessly handle asymmetrical domains and varying sizes', () => {
    const variables = ['tiny', 'medium', 'large'];
    const domains = {
      tiny: ['only_one'],
      medium: ['A', 'B', 'C'],
      large: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    };

    const constraints = [
      (a) => !(a.medium === 'B' && a.large !== undefined && a.large > 5)
    ];

    const result = solveWithBacktracking(variables, domains, constraints);

    assert.equal(result.solved, true);
    assert.equal(result.assignment.tiny, 'only_one');
  });

  // TEST 7: Empty and edge-case inputs
  it('TEST 7: should safely handle empty inputs and reject invalid parameters', () => {
    // 7a. Empty variables array -> trivially solved with empty assignment
    const emptyResult = solveWithBacktracking([], {});
    assert.equal(emptyResult.solved, true);
    assert.deepEqual(emptyResult.assignment, {});

    // 7b. Missing domain for a variable -> throws clear error
    assert.throws(
      () => solveWithBacktracking(['A'], {}),
      /Domain for variable "A" is missing or not an array/
    );

    // 7c. Invalid parameters
    assert.throws(() => solveWithBacktracking(null, {}), /Variables must be an array/);
    assert.throws(() => solveWithBacktracking(['A'], null), /Domains must be an object/);
    assert.throws(() => solveWithBacktracking(['A'], { A: [] }, null), /Constraints must be an array/);
  });

  // TEST 8: Trace mode
  it('TEST 8: should populate trace log when trace mode is enabled', () => {
    const variables = ['X', 'Y'];
    const domains = {
      X: ['alpha'],
      Y: ['beta']
    };

    const result = solveWithBacktracking(variables, domains, [], { trace: true });

    assert.equal(result.solved, true);
    assert.ok(Array.isArray(result.trace));
    assert.ok(result.trace.length > 0);
    assert.ok(result.trace.some(log => log.includes('Trying X = "alpha"')));
    assert.ok(result.trace.some(log => log.includes('Trying Y = "beta"')));
  });

  // TEST 9: Minimum Remaining Values (MRV) heuristic
  it('TEST 9: should successfully solve problems when MRV heuristic is enabled', () => {
    const variables = ['largeDomain', 'smallDomain'];
    const domains = {
      largeDomain: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      smallDomain: ['X']
    };

    const constraints = [
      (a) => {
        if (a.smallDomain !== undefined) {
          return a.smallDomain === 'X';
        }
        return true;
      }
    ];

    const result = solveWithBacktracking(variables, domains, constraints, { useMRV: true });

    assert.equal(result.solved, true);
    assert.equal(result.assignment.smallDomain, 'X');
  });
});
