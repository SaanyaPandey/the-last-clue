/**
 * Demonstration & Verification Script for Backtracking Constraint Solver
 * Demonstrates step-by-step search, partial pruning, and actual backtracking.
 * Run with: node src/algorithms/verifyBacktracking.js (or npm run verify:backtracking)
 */

const { solveWithBacktracking } = require('./Backtracking');

function runVerification() {
  console.log('='.repeat(70));
  console.log('  THE LAST CLUE — PHASE 4: BACKTRACKING ENGINE DEMONSTRATION');
  console.log('='.repeat(70));

  console.log('\n[1] Defining Mystery CSP Variables and Candidate Domains:\n');

  const variables = ['culprit', 'motive', 'weapon'];

  const domains = {
    culprit: ['Alice', 'Bob'],
    motive: ['money', 'revenge'],
    weapon: ['poison', 'knife']
  };

  console.log('Variables :', variables);
  console.log('Domains   :', domains);

  console.log('\n[2] Setting Active Mystery Constraints:');
  console.log('  1. Alice cannot have motive "money" (Alice is already independently wealthy).');
  console.log('  2. Motive "revenge" requires weapon "knife" (Revenge crime is personal, not subtle poison).');

  const constraints = [
    // Constraint 1: Alice cannot have motive 'money'
    (assignment) => {
      if (assignment.culprit === 'Alice' && assignment.motive === 'money') {
        return false;
      }
      return true;
    },
    // Constraint 2: If motive is revenge, weapon cannot be poison
    (assignment) => {
      if (assignment.motive === 'revenge' && assignment.weapon === 'poison') {
        return false;
      }
      return true;
    }
  ];

  console.log('\n[3] Executing Backtracking Solver with Live Step Trace:\n');

  const result = solveWithBacktracking(variables, domains, constraints, { trace: true });

  result.trace.forEach(step => {
    if (step.includes('BACKTRACKING: Undoing')) {
      console.log(`  \x1b[33m${step}\x1b[0m`);
    } else if (step.includes('FAILED')) {
      console.log(`  \x1b[31m${step}\x1b[0m`);
    } else if (step.includes('successfully')) {
      console.log(`  \x1b[32m${step}\x1b[0m`);
    } else {
      console.log(`  ${step}`);
    }
  });

  console.log('\n[4] Solver Summary:');
  console.log(`  Solved             : ${result.solved}`);
  console.log(`  Assignments Tried  : ${result.assignmentsTried}`);
  console.log(`  Backtracking Steps : ${result.backtracks}`);
  console.log('  Final Assignment   :');
  console.log(result.assignment);

  console.log('\n' + '='.repeat(70));
  console.log('  BACKTRACKING DEMONSTRATION COMPLETED SUCCESSFULLY');
  console.log('='.repeat(70) + '\n');
}

if (require.main === module) {
  runVerification();
}

module.exports = runVerification;
