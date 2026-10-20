/**
 * THE LAST CLUE — Procedurally Generated Mystery Investigation Game
 * Verification Script for Case Generation API (Phase 6)
 *
 * Runs verification steps:
 * 1. Generate a medium case with seed 12345.
 * 2. Generate it again.
 * 3. Verify identical caseId and deterministic output.
 * 4. Verify public response does NOT contain hidden solution fields.
 * 5. Verify graph node and edge counts and JSON structure.
 * 6. Generate with a different seed and show variation.
 */

const { CaseService } = require('./services/caseService');

function runVerification() {
  console.log('=== THE LAST CLUE — Phase 6 API Verification ===\n');

  // STEP 1: Generate a medium case with seed 12345
  console.log('1. Generating medium case with seed 12345...');
  const case1 = CaseService.generateCase({ difficulty: 'medium', seed: 12345 });
  console.log(`   Case 1 ID: ${case1.caseId}`);
  console.log(`   Starting Clue ID: ${case1.startingClueId}`);
  console.log(`   Suspect Count: ${case1.suspects.length}`);
  console.log(`   Location Count: ${case1.locations.length}`);
  console.log(`   Weapon Count: ${case1.weapons.length}`);
  console.log(`   Clue Count: ${case1.clues.length}`);

  // STEP 2 & 3: Generate again with same seed & verify determinism
  console.log('\n2. Generating medium case again with seed 12345...');
  const case1Repeat = CaseService.generateCase({ difficulty: 'medium', seed: 12345 });
  console.log(`   Case 1 Repeat ID: ${case1Repeat.caseId}`);

  const isIdentical = JSON.stringify(case1) === JSON.stringify(case1Repeat);
  console.log(`   3. Determinism Check: ${isIdentical ? 'PASS (100% Identical Output)' : 'FAIL (Outputs Differ)'}`);
  if (!isIdentical) {
    throw new Error('Verification Error: Same seed did not produce identical public output!');
  }

  // STEP 4: Show public response does NOT contain solution
  console.log('\n4. Solution Secrecy Check:');
  console.log(`   Has "solution" property? ${case1.solution !== undefined}`);
  console.log(`   Has "solution.culprit"? ${case1.solution?.culprit !== undefined}`);
  console.log(`   Has "solution.motive"? ${case1.solution?.motive !== undefined}`);
  console.log(`   Has "solution.weapon"? ${case1.solution?.weapon !== undefined}`);
  console.log(`   Has "solution.location"? ${case1.solution?.location !== undefined}`);
  
  const leakedInJson = JSON.stringify(case1).includes('"solution"');
  console.log(`   Solution Secrecy Result: ${!leakedInJson ? 'PASS (Zero solution leakage)' : 'FAIL (Solution leaked!)'}`);
  if (leakedInJson) {
    throw new Error('Verification Error: Solution leaked in public case payload!');
  }

  // STEP 5: Show graph node/edge counts & JSON structure
  console.log('\n5. Graph Serialization Check:');
  console.log(`   Graph Node Count: ${case1.graph.nodes.length}`);
  console.log(`   Graph Edge Count: ${case1.graph.edges.length}`);
  console.log(`   Is Nodes array? ${Array.isArray(case1.graph.nodes)}`);
  console.log(`   Is Edges array? ${Array.isArray(case1.graph.edges)}`);
  console.log(`   Sample Node: ${JSON.stringify(case1.graph.nodes[0])}`);
  console.log(`   Sample Edge: ${JSON.stringify(case1.graph.edges[0])}`);

  // STEP 6: Generate a different seed and show variation
  console.log('\n6. Generating medium case with different seed (99999)...');
  const case2 = CaseService.generateCase({ difficulty: 'medium', seed: 99999 });
  console.log(`   Case 2 ID: ${case2.caseId}`);
  console.log(`   Starting Clue ID: ${case2.startingClueId}`);

  const isDifferent = case1.caseId !== case2.caseId;
  console.log(`   Seed Variation Check: ${isDifferent ? 'PASS (Different seed produced different case)' : 'FAIL (Cases identical)'}`);
  if (!isDifferent) {
    throw new Error('Verification Error: Different seed produced duplicate case!');
  }

  console.log('\n=== ALL API VERIFICATION CHECKS PASSED SUCCESSFULLY ===');
}

if (require.main === module) {
  runVerification();
}

module.exports = runVerification;
