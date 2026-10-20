/**
 * Test Suite for Depth-First Search (DFS) Engine, Connectivity & Cycle Detection
 * Built using Node.js native test runner (node:test and node:assert/strict).
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const Graph = require('../Graph');
const {
  dfs,
  isConnected,
  findConnectedComponents,
  hasCycle
} = require('../DFS');

describe('DFS, Connectivity & Cycle Detection Engine', () => {
  let graph;

  beforeEach(() => {
    graph = new Graph({ isDirected: false });
  });

  // 1. DFS Traversal on Mystery Investigation Graph
  it('1. should perform deep recursive traversal on investigation chain', () => {
    /*
     * Suspect_A - Clue_1 - Location_1 - Evidence_1 - Suspect_B
     */
    graph.addNode('Suspect_A');
    graph.addNode('Clue_1');
    graph.addNode('Location_1');
    graph.addNode('Evidence_1');
    graph.addNode('Suspect_B');

    graph.addEdge('Suspect_A', 'Clue_1');
    graph.addEdge('Clue_1', 'Location_1');
    graph.addEdge('Location_1', 'Evidence_1');
    graph.addEdge('Evidence_1', 'Suspect_B');

    const result = dfs(graph, 'Suspect_A');

    assert.equal(result.order.length, 5);
    assert.deepEqual(result.order, [
      'Suspect_A',
      'Clue_1',
      'Location_1',
      'Evidence_1',
      'Suspect_B'
    ]);
    assert.deepEqual(result.visited, [
      'Suspect_A',
      'Clue_1',
      'Location_1',
      'Evidence_1',
      'Suspect_B'
    ]);
  });

  // 2. Different Starting Nodes
  it('2. should traverse all reachable nodes when starting from middle node', () => {
    graph.addNode('A');
    graph.addNode('B');
    graph.addNode('C');
    graph.addNode('D');

    // B is central: A - B - C - D
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('C', 'D');

    const result = dfs(graph, 'B');

    assert.equal(result.order[0], 'B');
    assert.equal(result.order.length, 4);
    assert.equal(result.visited.length, 4);
    assert.equal(new Set(result.visited).size, 4);
  });

  // 3. Unknown Start Node Handling
  it('3. should throw clear error on invalid or missing start node', () => {
    graph.addNode('A');

    assert.throws(
      () => dfs(graph, 'unknown_node'),
      /NotFoundError: Start node "unknown_node" does not exist in the graph/
    );
    assert.throws(() => dfs(null, 'A'), /Invalid graph instance/);
    assert.throws(() => dfs(graph, ''), /startNodeId must be a non-empty string/);
    assert.throws(() => dfs(graph, 123), /startNodeId must be a non-empty string/);
  });

  // 4. Connectivity Check (isConnected)
  it('4. should correctly evaluate graph connectivity for connected and disconnected graphs', () => {
    // 4a. Empty graph is connected
    const emptyGraph = new Graph();
    assert.equal(isConnected(emptyGraph), true);

    // 4b. Single node graph is connected
    const singleNodeGraph = new Graph();
    singleNodeGraph.addNode('Solo');
    assert.equal(isConnected(singleNodeGraph), true);

    // 4c. Fully connected chain
    graph.addNode('A');
    graph.addNode('B');
    graph.addNode('C');
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    assert.equal(isConnected(graph), true);

    // 4d. Add isolated node -> graph becomes disconnected
    graph.addNode('D');
    assert.equal(isConnected(graph), false);
  });

  // 5. Connected Components (findConnectedComponents)
  it('5. should identify disconnected components as separate clusters', () => {
    /*
     * Component 1: A -- B -- C
     * Component 2: D -- E
     */
    graph.addNode('A');
    graph.addNode('B');
    graph.addNode('C');
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');

    graph.addNode('D');
    graph.addNode('E');
    graph.addEdge('D', 'E');

    const components = findConnectedComponents(graph);

    assert.equal(components.length, 2);

    // Normalize component sorting for deterministic assertion
    const sortedComponents = components
      .map(comp => comp.sort())
      .sort((a, b) => a[0].localeCompare(b[0]));

    assert.deepEqual(sortedComponents, [
      ['A', 'B', 'C'],
      ['D', 'E']
    ]);
  });

  it('5b. should handle isolated nodes as single-element components', () => {
    graph.addNode('A');
    graph.addNode('B');
    graph.addNode('C');

    const components = findConnectedComponents(graph);
    assert.equal(components.length, 3);
  });

  // 6. Cycle Detection: Acyclic vs Cyclic
  it('6. should detect absence of cycle in linear acyclic graph', () => {
    // A -- B -- C (linear chain has no cycle)
    graph.addNode('A');
    graph.addNode('B');
    graph.addNode('C');
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');

    assert.equal(hasCycle(graph), false);
  });

  it('6b. should detect cycle in a 4-node ring (A-B-C-D-A)', () => {
    /*
     * A -- B
     * |    |
     * D -- C
     */
    graph.addNode('A');
    graph.addNode('B');
    graph.addNode('C');
    graph.addNode('D');

    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('C', 'D');
    graph.addEdge('D', 'A');

    assert.equal(hasCycle(graph), true);
  });

  it('6c. should detect cycle in a triangle (A-B-C-A)', () => {
    /*
     *   A -- B
     *    \  /
     *     C
     */
    graph.addNode('A');
    graph.addNode('B');
    graph.addNode('C');

    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('C', 'A');

    assert.equal(hasCycle(graph), true);
  });

  // 7. Cycle Detection with Disconnected and Edge-Case Graphs
  it('7. should detect cycle even if located in a secondary disconnected component', () => {
    // Component 1: Acyclic line (A -- B)
    graph.addNode('A');
    graph.addNode('B');
    graph.addEdge('A', 'B');

    // Component 2: Cyclic triangle (C -- D -- E -- C)
    graph.addNode('C');
    graph.addNode('D');
    graph.addNode('E');
    graph.addEdge('C', 'D');
    graph.addEdge('D', 'E');
    graph.addEdge('E', 'C');

    assert.equal(hasCycle(graph), true);
  });

  it('7b. should return false for empty, single node, or tree graphs', () => {
    const emptyGraph = new Graph();
    assert.equal(hasCycle(emptyGraph), false);

    const singleNodeGraph = new Graph();
    singleNodeGraph.addNode('Solo');
    assert.equal(hasCycle(singleNodeGraph), false);

    /*
     * Tree graph (branching, acyclic):
     *       Root
     *      /    \
     *    Left   Right
     *    /  \
     *  L1   L2
     */
    const treeGraph = new Graph();
    treeGraph.addNode('Root');
    treeGraph.addNode('Left');
    treeGraph.addNode('Right');
    treeGraph.addNode('L1');
    treeGraph.addNode('L2');

    treeGraph.addEdge('Root', 'Left');
    treeGraph.addEdge('Root', 'Right');
    treeGraph.addEdge('Left', 'L1');
    treeGraph.addEdge('Left', 'L2');

    assert.equal(hasCycle(treeGraph), false);
  });
});
