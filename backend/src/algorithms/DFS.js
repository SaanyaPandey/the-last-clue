/**
 * THE LAST CLUE — Procedurally Generated Mystery Investigation Game
 * Phase 3: Depth-First Search (DFS) Engine, Connectivity & Cycle Detection
 *
 * Design Decisions:
 * 1. Recursive DFS:
 *    - Uses the JavaScript call stack for clean, elegant pre-order exploration.
 *    - Visited Set prevents infinite loops in bidirectional (undirected) or cyclic graphs.
 * 2. Connectivity:
 *    - An undirected graph is connected if a traversal from an arbitrary seed node visits
 *      all nodes in the graph.
 *    - `findConnectedComponents` performs repeated traversals on unvisited nodes to isolate
 *      disjoint investigation clusters.
 * 3. Cycle Detection in Undirected Graph:
 *    - In an undirected graph, an edge (u, v) is bi-directional. When inspecting v's neighbors,
 *      u is naturally encountered.
 *    - To avoid falsely reporting the reverse edge as a cycle, `parent` tracking is used.
 *    - If an adjacent node v is already visited AND v !== parent, a true cycle exists!
 */

/**
 * Performs Depth-First Search on a Graph starting from `startNodeId`.
 *
 * @param {import('./Graph')} graph - The Graph instance.
 * @param {string} startNodeId - The starting node ID.
 * @returns {{ order: string[], visited: string[] }}
 * @throws {TypeError} If graph or startNodeId is invalid.
 * @throws {Error} If startNodeId does not exist in the graph.
 */
function dfs(graph, startNodeId) {
  if (!graph || typeof graph.hasNode !== 'function') {
    throw new TypeError('Invalid graph instance passed to dfs().');
  }
  if (typeof startNodeId !== 'string' || startNodeId.trim() === '') {
    throw new TypeError('startNodeId must be a non-empty string.');
  }
  if (!graph.hasNode(startNodeId)) {
    throw new Error(`NotFoundError: Start node "${startNodeId}" does not exist in the graph.`);
  }

  const order = [];
  const visited = new Set();

  function traverse(currentNodeId) {
    visited.add(currentNodeId);
    order.push(currentNodeId);

    const neighbors = graph.getNeighbors(currentNodeId);
    for (let i = 0; i < neighbors.length; i++) {
      const neighborId = neighbors[i];
      if (!visited.has(neighborId)) {
        traverse(neighborId);
      }
    }
  }

  traverse(startNodeId);

  return {
    order,
    visited: Array.from(visited)
  };
}

/**
 * Checks whether an undirected graph is fully connected (all nodes in 1 component).
 *
 * @param {import('./Graph')} graph - The Graph instance.
 * @returns {boolean} True if the graph is connected.
 */
function isConnected(graph) {
  if (!graph || typeof graph.getNodeCount !== 'function') {
    throw new TypeError('Invalid graph instance passed to isConnected().');
  }

  const totalNodes = graph.getNodeCount();

  // Graphs with 0 or 1 node are vacuously connected
  if (totalNodes <= 1) {
    return true;
  }

  const nodes = graph.getNodes();
  const startNodeId = nodes[0].id;

  const result = dfs(graph, startNodeId);

  return result.visited.length === totalNodes;
}

/**
 * Finds all connected components in an undirected graph.
 *
 * @param {import('./Graph')} graph - The Graph instance.
 * @returns {string[][]} Array of components, where each component is an array of node IDs.
 */
function findConnectedComponents(graph) {
  if (!graph || typeof graph.getNodes !== 'function') {
    throw new TypeError('Invalid graph instance passed to findConnectedComponents().');
  }

  const components = [];
  const globalVisited = new Set();
  const nodes = graph.getNodes();

  for (let i = 0; i < nodes.length; i++) {
    const nodeId = nodes[i].id;

    if (!globalVisited.has(nodeId)) {
      const component = [];

      // Local component traversal
      function traverseComponent(currId) {
        globalVisited.add(currId);
        component.push(currId);

        const neighbors = graph.getNeighbors(currId);
        for (let j = 0; j < neighbors.length; j++) {
          const neighborId = neighbors[j];
          if (!globalVisited.has(neighborId)) {
            traverseComponent(neighborId);
          }
        }
      }

      traverseComponent(nodeId);
      components.push(component);
    }
  }

  return components;
}

/**
 * Checks whether an undirected graph contains at least one cycle.
 * Uses DFS with parent tracking.
 *
 * Logic:
 * When moving from node `u` to neighbor `v`, we track `u` as `parent`.
 * If we encounter any visited neighbor `w` where `w !== parent`,
 * an alternative back-edge exists, indicating a cycle.
 *
 * @param {import('./Graph')} graph - The Graph instance.
 * @returns {boolean} True if the graph contains a cycle.
 */
function hasCycle(graph) {
  if (!graph || typeof graph.getNodes !== 'function') {
    throw new TypeError('Invalid graph instance passed to hasCycle().');
  }

  const visited = new Set();
  const nodes = graph.getNodes();

  // Helper DFS with parent tracking
  function dfsCycleHelper(currentNodeId, parentId) {
    visited.add(currentNodeId);

    const neighbors = graph.getNeighbors(currentNodeId);
    for (let i = 0; i < neighbors.length; i++) {
      const neighborId = neighbors[i];

      if (!visited.has(neighborId)) {
        if (dfsCycleHelper(neighborId, currentNodeId)) {
          return true;
        }
      } else if (neighborId !== parentId) {
        // Discovered an already visited node that is NOT our parent -> back-edge (cycle)!
        return true;
      }
    }

    return false;
  }

  // Iterate over all nodes to detect cycles across all connected components
  for (let i = 0; i < nodes.length; i++) {
    const nodeId = nodes[i].id;
    if (!visited.has(nodeId)) {
      if (dfsCycleHelper(nodeId, null)) {
        return true;
      }
    }
  }

  return false;
}

module.exports = {
  dfs,
  isConnected,
  findConnectedComponents,
  hasCycle
};
