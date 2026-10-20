/**
 * THE LAST CLUE — Procedurally Generated Mystery Investigation Game
 * Phase 3: Breadth-First Search (BFS) Engine & Shortest Path
 *
 * Design Decisions:
 * 1. Queue Mechanism:
 *    - Uses a FIFO queue for level-order exploration.
 *    - To maintain constant O(1) dequeue operations and avoid array re-indexing overhead
 *      from repeated `Array.prototype.shift()`, an index pointer `head` is maintained.
 * 2. Visited Tracking:
 *    - Nodes are marked in `visited` (Set) upon enqueueing to guarantee each vertex enters
 *      the queue at most once.
 * 3. Shortest Path in Unweighted Graph:
 *    - Because edge traversal cost is uniform, BFS guarantees that the first time a node
 *      is reached, the discovery path has minimal edge distance.
 *    - Maintains a `parents` map to reconstruct the exact path from target back to start.
 */

/**
 * Performs Breadth-First Search on a Graph starting from `startNodeId`.
 *
 * @param {import('./Graph')} graph - The Graph instance.
 * @param {string} startNodeId - The starting node ID.
 * @returns {{ order: string[], visited: string[], distances: Object.<string, number>, parents: Object.<string, string|null> }}
 * @throws {TypeError} If graph or startNodeId is invalid.
 * @throws {Error} If startNodeId does not exist in the graph.
 */
function bfs(graph, startNodeId) {
  if (!graph || typeof graph.hasNode !== 'function') {
    throw new TypeError('Invalid graph instance passed to bfs().');
  }
  if (typeof startNodeId !== 'string' || startNodeId.trim() === '') {
    throw new TypeError('startNodeId must be a non-empty string.');
  }
  if (!graph.hasNode(startNodeId)) {
    throw new Error(`NotFoundError: Start node "${startNodeId}" does not exist in the graph.`);
  }

  const order = [];
  const visited = new Set();
  const distances = {};
  const parents = {};

  // FIFO Queue with pointer to guarantee O(1) dequeue
  const queue = [startNodeId];
  let head = 0;

  visited.add(startNodeId);
  distances[startNodeId] = 0;
  parents[startNodeId] = null;

  while (head < queue.length) {
    const currentNodeId = queue[head++];
    order.push(currentNodeId);

    const neighbors = graph.getNeighbors(currentNodeId);
    for (let i = 0; i < neighbors.length; i++) {
      const neighborId = neighbors[i];

      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        distances[neighborId] = distances[currentNodeId] + 1;
        parents[neighborId] = currentNodeId;
        queue.push(neighborId);
      }
    }
  }

  return {
    order,
    visited: Array.from(visited),
    distances,
    parents
  };
}

/**
 * Finds the shortest path between `startNodeId` and `targetNodeId` in an unweighted graph using BFS.
 *
 * @param {import('./Graph')} graph - The Graph instance.
 * @param {string} startNodeId - The starting node ID.
 * @param {string} targetNodeId - The target destination node ID.
 * @returns {{ found: boolean, path: string[], distance: number }}
 * @throws {Error} If start or target node does not exist in the graph.
 */
function findShortestPath(graph, startNodeId, targetNodeId) {
  if (!graph || typeof graph.hasNode !== 'function') {
    throw new TypeError('Invalid graph instance passed to findShortestPath().');
  }
  if (!graph.hasNode(startNodeId)) {
    throw new Error(`NotFoundError: Start node "${startNodeId}" does not exist in the graph.`);
  }
  if (!graph.hasNode(targetNodeId)) {
    throw new Error(`NotFoundError: Target node "${targetNodeId}" does not exist in the graph.`);
  }

  // Trivial base case: start is target
  if (startNodeId === targetNodeId) {
    return {
      found: true,
      path: [startNodeId],
      distance: 0
    };
  }

  const visited = new Set();
  const parents = {};
  const distances = {};

  const queue = [startNodeId];
  let head = 0;

  visited.add(startNodeId);
  distances[startNodeId] = 0;
  parents[startNodeId] = null;

  let reached = false;

  while (head < queue.length) {
    const currentNodeId = queue[head++];

    if (currentNodeId === targetNodeId) {
      reached = true;
      break;
    }

    const neighbors = graph.getNeighbors(currentNodeId);
    for (let i = 0; i < neighbors.length; i++) {
      const neighborId = neighbors[i];

      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        distances[neighborId] = distances[currentNodeId] + 1;
        parents[neighborId] = currentNodeId;

        if (neighborId === targetNodeId) {
          reached = true;
          break;
        }

        queue.push(neighborId);
      }
    }

    if (reached) {
      break;
    }
  }

  if (!reached) {
    return {
      found: false,
      path: [],
      distance: -1
    };
  }

  // Backtrack from target to start using parent pointers
  const path = [];
  let curr = targetNodeId;
  while (curr !== null) {
    path.push(curr);
    curr = parents[curr];
  }
  path.reverse();

  return {
    found: true,
    path,
    distance: distances[targetNodeId]
  };
}

module.exports = {
  bfs,
  findShortestPath
};
