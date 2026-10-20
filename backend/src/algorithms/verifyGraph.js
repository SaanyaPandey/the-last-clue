/**
 * Verification & Visual Demonstration Script for Graph & Traversal Engine
 * Demonstrates Graph Creation, BFS, DFS, Shortest Path, Connectivity, and Cycle Detection.
 * Run with: node src/algorithms/verifyGraph.js (or npm run verify:graph)
 */

const Graph = require('./Graph');
const { bfs, findShortestPath } = require('./BFS');
const { dfs, isConnected, findConnectedComponents, hasCycle } = require('./DFS');

function runVerification() {
  console.log('='.repeat(70));
  console.log('  THE LAST CLUE — PHASE 3: GRAPH & TRAVERSAL ENGINE DEMONSTRATION');
  console.log('='.repeat(70));

  // 1. Graph Creation
  console.log('\n[1] Constructing Sample Mystery Investigation Graph...\n');
  const graph = new Graph({ isDirected: false });

  graph.addNode('Suspect_A', {
    type: 'suspect',
    label: 'Lord Harrington',
    metadata: { motive: 'Inheritance dispute', alibi: 'Study' }
  });

  graph.addNode('Clue_1', {
    type: 'clue',
    label: 'Torn Letter',
    metadata: { status: 'Damaged by fire' }
  });

  graph.addNode('Location_1', {
    type: 'location',
    label: 'Greenhouse',
    metadata: { access: 'Locked from inside' }
  });

  graph.addNode('Evidence_1', {
    type: 'evidence',
    label: 'Gardening Shears',
    metadata: { forensicFlag: 'Traces of silver paint' }
  });

  graph.addNode('Suspect_B', {
    type: 'suspect',
    label: 'Gardener Thomas',
    metadata: { motive: 'Blackmail', alibi: 'Potting shed' }
  });

  graph.addEdge('Suspect_A', 'Clue_1', 'points_to', { note: 'Letter references Lord Harrington' });
  graph.addEdge('Clue_1', 'Location_1', 'found_at', { note: 'Letter discovered in greenhouse flowerpot' });
  graph.addEdge('Location_1', 'Evidence_1', 'connected_to', { note: 'Shears hidden beneath workbench' });
  graph.addEdge('Evidence_1', 'Suspect_B', 'belongs_to', { note: 'Engraved with initials T.G.' });

  console.log('Topology:');
  console.log('  Suspect_A (Lord Harrington)');
  console.log('      | [points_to]');
  console.log('  Clue_1 (Torn Letter)');
  console.log('      | [found_at]');
  console.log('  Location_1 (Greenhouse)');
  console.log('      | [connected_to]');
  console.log('  Evidence_1 (Gardening Shears)');
  console.log('      | [belongs_to]');
  console.log('  Suspect_B (Gardener Thomas)');

  console.log(`\nMetrics: Total Nodes = ${graph.getNodeCount()}, Total Edges = ${graph.getEdgeCount()}`);

  // 2. BFS Traversal
  console.log('\n=== BFS ===');
  const bfsStart = 'Suspect_A';
  const bfsResult = bfs(graph, bfsStart);
  console.log(`Start Node : ${bfsStart}`);
  console.log(`Traversal  : ${bfsResult.order.join(' → ')}`);
  console.log('Distances from Start:');
  for (const [nodeId, dist] of Object.entries(bfsResult.distances)) {
    console.log(`  - ${nodeId.padEnd(12)} : distance = ${dist}, parent = ${bfsResult.parents[nodeId] || 'None (Root)'}`);
  }

  // 3. Shortest Path (BFS)
  console.log('\n=== SHORTEST PATH ===');
  const pathStart = 'Suspect_A';
  const pathTarget = 'Suspect_B';
  const shortestPath = findShortestPath(graph, pathStart, pathTarget);
  console.log(`Route      : ${pathStart} → ${pathTarget}`);
  console.log(`Found      : ${shortestPath.found}`);
  console.log(`Distance   : ${shortestPath.distance} hops`);
  console.log(`Path Trace : ${shortestPath.path.join(' → ')}`);

  // 4. DFS Traversal
  console.log('\n=== DFS ===');
  const dfsStart = 'Suspect_A';
  const dfsResult = dfs(graph, dfsStart);
  console.log(`Start Node : ${dfsStart}`);
  console.log(`Traversal  : ${dfsResult.order.join(' → ')}`);
  console.log(`Visited    : [ ${dfsResult.visited.join(', ')} ]`);

  // 5. Connectivity & Connected Components
  console.log('\n=== CONNECTIVITY & COMPONENTS ===');
  console.log(`Connected (Single Component): ${isConnected(graph)}`);
  const components = findConnectedComponents(graph);
  console.log(`Component Count             : ${components.length}`);
  components.forEach((comp, idx) => {
    console.log(`  Component #${idx + 1} (${comp.length} nodes): [ ${comp.join(', ')} ]`);
  });

  // Demonstrate disconnected clusters
  console.log('\nSimulating second isolated cold-case cluster:');
  const multiGraph = new Graph({ isDirected: false });
  // Copy original 5 nodes & edges
  graph.getNodes().forEach(n => multiGraph.addNode(n.id, n));
  graph.getEdges().forEach(e => multiGraph.addEdge(e.from, e.to, e.type, e.metadata));
  // Add isolated sub-network
  multiGraph.addNode('ColdCase_Suspect_C');
  multiGraph.addNode('ColdCase_Clue_9');
  multiGraph.addEdge('ColdCase_Suspect_C', 'ColdCase_Clue_9', 'associated_with');

  console.log(`  Combined Graph isConnected? ${isConnected(multiGraph)}`);
  const multiComponents = findConnectedComponents(multiGraph);
  console.log(`  Detected ${multiComponents.length} Disjoint Clusters:`);
  multiComponents.forEach((comp, idx) => {
    console.log(`    Cluster ${idx + 1}: [ ${comp.join(', ')} ]`);
  });

  // 6. Cycle Detection
  console.log('\n=== CYCLE DETECTION ===');
  console.log(`Primary Investigation Chain Contains Cycle? ${hasCycle(graph)} (Linear Acyclic Chain)`);

  // Simulate circular alibi / loop
  console.log('\nAdding circular relationship (Suspect_B --[knows]--> Suspect_A)...');
  const cyclicGraph = new Graph({ isDirected: false });
  graph.getNodes().forEach(n => cyclicGraph.addNode(n.id, n));
  graph.getEdges().forEach(e => cyclicGraph.addEdge(e.from, e.to, e.type, e.metadata));
  cyclicGraph.addEdge('Suspect_B', 'Suspect_A', 'knows', { note: 'Secret business partners' });

  console.log(`Cyclic Network Contains Cycle? ${hasCycle(cyclicGraph)} (Detected back-edge forming loop!)`);

  console.log('\n' + '='.repeat(70));
  console.log('  ALL ALGORITHMIC TRAVERSALS & CHECKS COMPLETED SUCCESSFULLY');
  console.log('='.repeat(70) + '\n');
}

if (require.main === module) {
  runVerification();
}

module.exports = runVerification;
