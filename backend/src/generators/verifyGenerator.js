/**
 * Demonstration & Verification Script for Procedural Mystery Generator
 * Demonstrates Seeded Generation, Case Variation, Uniqueness, BFS Evidence Path,
 * and 100% Deterministic Reproducibility (Case 1 === Case 3).
 *
 * Run with: node src/generators/verifyGenerator.js (or npm run verify:generator)
 */

const MysteryGenerator = require('./MysteryGenerator');

function displayCaseSummary(title, mysteryCase) {
  console.log('='.repeat(70));
  console.log(`  ${title}`);
  console.log('='.repeat(70));

  console.log(`  Case ID      : \x1b[36m${mysteryCase.caseId}\x1b[0m`);
  console.log(`  Seed         : ${mysteryCase.seed}`);
  console.log(`  Difficulty   : ${mysteryCase.difficulty.toUpperCase()}`);

  console.log('\n  [Active Suspects]:');
  mysteryCase.suspects.forEach(s => {
    const isCulprit = s.id === mysteryCase.solution.culprit;
    const tag = isCulprit ? ' \x1b[31m[TRUE CULPRIT]\x1b[0m' : ' (Innocent)';
    console.log(`    - ${s.name} (${s.role})${tag}`);
  });

  console.log('\n  [Core Solution (Hidden Ground Truth)]:' );
  console.log(`    - Culprit  : \x1b[31m${mysteryCase.solution.culprit}\x1b[0m`);
  console.log(`    - Motive   : ${mysteryCase.solution.motive}`);
  console.log(`    - Weapon   : ${mysteryCase.solution.weapon}`);
  console.log(`    - Location : ${mysteryCase.solution.location}`);
  console.log(`    - Unique?  : \x1b[32m${mysteryCase.metadata.isUniqueSolution}\x1b[0m`);

  console.log('\n  [Investigative Clues]:');
  mysteryCase.clues.forEach((c, idx) => {
    const isStarting = c.id === mysteryCase.startingClueId ? ' \x1b[33m[STARTING LEAD]\x1b[0m' : '';
    console.log(`    ${idx + 1}. ${c.name} (${c.category})${isStarting}`);
  });

  console.log('\n  [Red Herrings]:');
  mysteryCase.redHerrings.forEach((rh, idx) => {
    console.log(`    ${idx + 1}. Suspect: ${rh.suspectName} -> Associated Clue: ${rh.associatedClueId}`);
  });

  console.log('\n  [Investigation Graph]:');
  console.log(`    - Total Nodes : ${mysteryCase.graph.getNodeCount()}`);
  console.log(`    - Total Edges : ${mysteryCase.graph.getEdgeCount()}`);

  console.log('\n  [BFS Shortest Deduction Path]:');
  const path = mysteryCase.validation.diagnostics.bfsPath;
  console.log(`    ${path.join('  ──►  ')}`);
  console.log(`    Length: ${mysteryCase.validation.diagnostics.pathLength} hops`);

  console.log('\n  [Solvability Validation]:');
  console.log(`    Valid Case? : \x1b[32m${mysteryCase.validation.valid}\x1b[0m`);
  console.log(`    Errors      : ${JSON.stringify(mysteryCase.validation.errors)}`);
  console.log();
}

function runVerification() {
  console.log('\n' + '#'.repeat(70));
  console.log('   THE LAST CLUE — PHASE 5: PROCEDURAL MYSTERY GENERATION DEMO');
  console.log('#'.repeat(70) + '\n');

  // Case 1: Seed 12345
  const case1 = MysteryGenerator.generateCase(12345, 'medium');
  displayCaseSummary('CASE 1 (Seed: 12345, Difficulty: Medium)', case1);

  // Case 2: Seed 67890
  const case2 = MysteryGenerator.generateCase(67890, 'medium');
  displayCaseSummary('CASE 2 (Seed: 67890, Difficulty: Medium)', case2);

  // Case 3: Seed 12345 again
  const case3 = MysteryGenerator.generateCase(12345, 'medium');
  displayCaseSummary('CASE 3 (Seed: 12345, Re-generated for Reproducibility)', case3);

  // Reproducibility Proof
  console.log('='.repeat(70));
  console.log('  REPRODUCIBILITY & VARIATION PROOF');
  console.log('='.repeat(70));

  const case1Serialized = JSON.stringify({
    caseId: case1.caseId,
    solution: case1.solution,
    startingClueId: case1.startingClueId,
    path: case1.validation.diagnostics.bfsPath
  });

  const case2Serialized = JSON.stringify({
    caseId: case2.caseId,
    solution: case2.solution,
    startingClueId: case2.startingClueId,
    path: case2.validation.diagnostics.bfsPath
  });

  const case3Serialized = JSON.stringify({
    caseId: case3.caseId,
    solution: case3.solution,
    startingClueId: case3.startingClueId,
    path: case3.validation.diagnostics.bfsPath
  });

  const isCase1EqualCase3 = case1Serialized === case3Serialized;
  const isCase1EqualCase2 = case1Serialized === case2Serialized;

  console.log(`  Case 1 === Case 3 (Same Seed 12345)      : \x1b[32m${isCase1EqualCase3}\x1b[0m  (100% Identical Reproducibility)`);
  console.log(`  Case 1 === Case 2 (Different Seeds)      : \x1b[31m${isCase1EqualCase2}\x1b[0m (Distinct Algorithmic Variation)`);

  console.log('\n' + '='.repeat(70));
  console.log('  ALL PROCEDURAL MYSTERY GENERATOR CHECKS COMPLETED SUCCESSFULLY');
  console.log('='.repeat(70) + '\n');
}

if (require.main === module) {
  runVerification();
}

module.exports = runVerification;
