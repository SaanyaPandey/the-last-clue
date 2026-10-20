/**
 * Test Suite for Breadth-First Search (BFS) & Shortest Path Engine
 * Built using Node.js native test runner (node:test and node:assert/strict).
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const Graph = require('../Graph');
const { bfs, findShortestPath } = require('../BFS');

describe('BFS & Shortest Path Traversal Engine', () => {
  let graph;

  beforeEach(() => {
    graph = new Graph({ isDirected: false });
  });

  // 1. BFS Traversal Order on Sample Mystery Graph
  it('1. should traverse sample mystery graph in correct level-by-level BFS order', () => {
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

    const result = bfs(graph, 'Suspect_A');

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

  // 2. Starting from different nodes (middle node)
  it('2. should accurately explore radiating levels when starting from middle node', () => {
    /*
     * Location_1 is in the center:
     * Clue_1 <- Location_1 -> Evidence_1
     *   |                       |
     * Suspect_A               Suspect_B
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

    const result = bfs(graph, 'Location_1');

    // Root is Level 0
    assert.equal(result.order[0], 'Location_1');
    // Immediate neighbors are Level 1 (Clue_1 and Evidence_1)
    const level1 = [result.order[1], result.order[2]].sort();
    assert.deepEqual(level1, ['Clue_1', 'Evidence_1']);
    // Level 2 are Suspect_A and Suspect_B
    const level2 = [result.order[3], result.order[4]].sort();
    assert.deepEqual(level2, ['Evidence_1', 'Suspect_A', 'Suspect_B'].filter(n => n !== 'Evidence_1'));

    // Distances
    assert.equal(result.distances['Location_1'], 0);
    assert.equal(result.distances['Clue_1'], 1);
    assert.equal(result.distances['Evidence_1'], 1);
    assert.equal(result.distances['Suspect_A'], 2);
    assert.equal(result.distances['Suspect_B'], 2);
  });

  // 3. Unknown Start Node Handling
  it('3. should throw clear error when start node does not exist in graph', () => {
    graph.addNode('A');

    assert.throws(
      () => bfs(graph, 'unknown_node'),
      /NotFoundError: Start node "unknown_node" does not exist in the graph/
    );

    // Invalid parameters
    assert.throws(() => bfs(null, 'A'), /Invalid graph instance/);
    assert.throws(() => bfs(graph, ''), /startNodeId must be a non-empty string/);
    assert.throws(() => bfs(graph, 123), /startNodeId must be a non-empty string/);
  });

  // 4. Accurate Distance and Parent Calculation
  it('4. should correctly compute unweighted distances and predecessor tree', () => {
    /*
     *       A (0)
     *      / \
     *  (1)B   C (1)
     *    /     \
     * (2)D     E (2)
     */
    graph.addNode('A');
    graph.addNode('B');
    graph.addNode('C');
    graph.addNode('D');
    graph.addNode('E');

    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    graph.addEdge('B', 'D');
    graph.addEdge('C', 'E');

    const result = bfs(graph, 'A');

    assert.equal(result.distances['A'], 0);
    assert.equal(result.distances['B'], 1);
    assert.equal(result.distances['C'], 1);
    assert.equal(result.distances['D'], 2);
    assert.equal(result.distances['E'], 2);

    assert.equal(result.parents['A'], null);
    assert.equal(result.parents['B'], 'A');
    assert.equal(result.parents['C'], 'A');
    assert.equal(result.parents['D'], 'B');
    assert.equal(result.parents['E'], 'C');
  });

  // 5. Shortest Path in Mystery Investigation Chain
  it('5. should find the exact shortest path between Suspect_A and Suspect_B', () => {
    graph.addNode('Suspect_A');
    graph.addNode('Clue_1');
    graph.addNode('Location_1');
    graph.addNode('Evidence_1');
    graph.addNode('Suspect_B');

    graph.addEdge('Suspect_A', 'Clue_1');
    graph.addEdge('Clue_1', 'Location_1');
    graph.addEdge('Location_1', 'Evidence_1');
    graph.addEdge('Evidence_1', 'Suspect_B');

    const pathResult = findShortestPath(graph, 'Suspect_A', 'Suspect_B');

    assert.equal(pathResult.found, true);
    assert.equal(pathResult.distance, 4);
    assert.deepEqual(pathResult.path, [
      'Suspect_A',
      'Clue_1',
      'Location_1',
      'Evidence_1',
      'Suspect_B'
    ]);
  });

  // Shortest path with alternative routes (shortcut vs long route)
  it('5b. should select the shortest path when multiple routes exist', () => {
    /*
     * Suspect_1 --(direct shortcut)--> Culprit
     *     \                             /
     *   Clue_1 ---> Location_1 ---> Evidence_1
     */
    graph.addNode('Suspect_1');
    graph.addNode('Clue_1');
    graph.addNode('Location_1');
    graph.addNode('Evidence_1');
    graph.addNode('Culprit');

    // Long route (distance 4)
    graph.addEdge('Suspect_1', 'Clue_1');
    graph.addEdge('Clue_1', 'Location_1');
    graph.addEdge('Location_1', 'Evidence_1');
    graph.addEdge('Evidence_1', 'Culprit');

    // Short direct route (distance 1)
    graph.addEdge('Suspect_1', 'Culprit');

    const pathResult = findShortestPath(graph, 'Suspect_1', 'Culprit');

    assert.equal(pathResult.found, true);
    assert.equal(pathResult.distance, 1);
    assert.deepEqual(pathResult.path, ['Suspect_1', 'Culprit']);
  });

  // 6. Unreachable Target in Disconnected Graph
  it('6. should safely report unreachable target when no path exists', () => {
    graph.addNode('Cluster1_A');
    graph.addNode('Cluster1_B');
    graph.addEdge('Cluster1_A', 'Cluster1_B');

    graph.addNode('Isolated_Suspect');

    const pathResult = findShortestPath(graph, 'Cluster1_A', 'Isolated_Suspect');

    assert.equal(pathResult.found, false);
    assert.deepEqual(pathResult.path, []);
    assert.equal(pathResult.distance, -1);
  });

  // 7. Base cases (start === target, single node)
  it('7. should handle start node equal to target node', () => {
    graph.addNode('Suspect_A');

    const pathResult = findShortestPath(graph, 'Suspect_A', 'Suspect_A');

    assert.equal(pathResult.found, true);
    assert.deepEqual(pathResult.path, ['Suspect_A']);
    assert.equal(pathResult.distance, 0);
  });

  it('7b. should throw error if start or target node does not exist in findShortestPath', () => {
    graph.addNode('A');

    assert.throws(
      () => findShortestPath(graph, 'Missing_Start', 'A'),
      /NotFoundError: Start node "Missing_Start" does not exist/
    );
    assert.throws(
      () => findShortestPath(graph, 'A', 'Missing_Target'),
      /NotFoundError: Target node "Missing_Target" does not exist/
    );
  });
});
