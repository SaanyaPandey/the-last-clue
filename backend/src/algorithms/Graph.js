/**
 * THE LAST CLUE — Procedurally Generated Mystery Investigation Game
 * Phase 2: Core Graph Data Structure (Manual DSA Implementation)
 *
 * Design Decisions:
 * 1. Adjacency List via ES6 Map:
 *    - `this.nodes`: Map<string, NodeObject>
 *      Provides O(1) average lookup/insert/delete without prototype pollution risks of plain objects.
 *    - `this.adjacencyList`: Map<string, Map<string, EdgeObject>>
 *      Outer Map keys are source node IDs.
 *      Inner Map keys are neighbor node IDs mapped to EdgeObjects.
 *      Using a nested Map instead of an Array allows O(1) edge existence checks (`hasEdge`),
 *      O(1) duplicate edge prevention, and O(1) edge removal (`removeEdge`), while still allowing
 *      O(deg(u)) iteration over neighbors for BFS/DFS traversal.
 *
 * 2. Pure DSA & Decoupled:
 *    - No third-party graph libraries (NetworkX, graphlib, etc.) are used.
 *    - Entity types (suspect, clue, location, etc.) and relationship types (knows, owns, etc.)
 *      are supported via generic metadata without hardcoding game rules into the data structure.
 *
 * 3. Undirected by Default:
 *    - In undirected mode, adding edge (A, B) creates symmetric references (A -> B) and (B -> A).
 *    - Supports directed mode by passing `{ isDirected: true }` in the constructor.
 */

class Graph {
  /**
   * Initializes a new Graph instance.
   * @param {Object} [options={}] - Graph configuration options.
   * @param {boolean} [options.isDirected=false] - Whether the graph is directed.
   */
  constructor({ isDirected = false } = {}) {
    this.isDirected = Boolean(isDirected);

    // Map<string, { id: string, type: string, label: string, metadata: Object }>
    this.nodes = new Map();

    // Map<string, Map<string, { from: string, to: string, type: string, metadata: Object }>>
    this.adjacencyList = new Map();
  }

  /**
   * Adds a node to the graph.
   *
   * @param {string|Object} nodeOrId - The node identifier string or a node object containing { id, type, label, metadata }.
   * @param {Object} [options={}] - Additional options when nodeOrId is a string.
   * @param {string} [options.type='generic'] - Category of node (e.g., 'suspect', 'clue', 'location', 'evidence', 'motive', 'event').
   * @param {string} [options.label] - Display name (defaults to id).
   * @param {Object} [options.metadata={}] - Arbitrary metadata payload.
   * @returns {Object} The created node object.
   * @throws {TypeError} If node ID is invalid or empty.
   * @throws {Error} If a node with the same ID already exists.
   */
  addNode(nodeOrId, options = {}) {
    let id, type, label, metadata;

    if (typeof nodeOrId === 'object' && nodeOrId !== null) {
      id = nodeOrId.id;
      type = nodeOrId.type || options.type || 'generic';
      label = nodeOrId.label || options.label || id;
      metadata = { ...(nodeOrId.metadata || {}), ...(options.metadata || {}) };
    } else if (typeof nodeOrId === 'string') {
      id = nodeOrId;
      type = options.type || 'generic';
      label = options.label || id;
      metadata = options.metadata || {};
    } else {
      throw new TypeError(`Node ID must be a non-empty string. Received: ${typeof nodeOrId}`);
    }

    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new TypeError('Node ID must be a non-empty string.');
    }

    if (this.nodes.has(id)) {
      throw new Error(`DuplicateNodeError: Node with ID "${id}" already exists in the graph.`);
    }

    const node = {
      id,
      type,
      label,
      metadata
    };

    this.nodes.set(id, node);
    this.adjacencyList.set(id, new Map());

    return node;
  }

  /**
   * Removes a node and all of its incident edges from the graph.
   *
   * @param {string} id - The ID of the node to remove.
   * @returns {boolean} True if the node was successfully removed.
   * @throws {Error} If the node does not exist in the graph.
   */
  removeNode(id) {
    if (!this.hasNode(id)) {
      throw new Error(`NotFoundError: Cannot remove non-existing node "${id}".`);
    }

    // Step 1: Remove incident edges from all adjacent neighbors
    const neighbors = this.adjacencyList.get(id);
    for (const neighborId of neighbors.keys()) {
      const neighborAdjacency = this.adjacencyList.get(neighborId);
      if (neighborAdjacency) {
        neighborAdjacency.delete(id);
      }
    }

    // Step 2: If directed, search for any incoming edges from non-neighbors
    if (this.isDirected) {
      for (const [otherId, edgeMap] of this.adjacencyList.entries()) {
        if (otherId !== id) {
          edgeMap.delete(id);
        }
      }
    }

    // Step 3: Remove the node from adjacency list and nodes map
    this.adjacencyList.delete(id);
    this.nodes.delete(id);

    return true;
  }

  /**
   * Adds an edge between two existing nodes.
   *
   * @param {string} from - Source node ID.
   * @param {string} to - Destination node ID.
   * @param {string|Object} [typeOrOptions='connected_to'] - Relationship type string or options object { type, metadata }.
   * @param {Object} [metadata={}] - Optional metadata if type was passed as a string.
   * @returns {Object} The created edge object.
   * @throws {Error} If either node does not exist, if self-loops are attempted, or if the edge already exists.
   */
  addEdge(from, to, typeOrOptions = 'connected_to', metadata = {}) {
    if (!this.hasNode(from)) {
      throw new Error(`NotFoundError: Source node "${from}" does not exist in the graph.`);
    }
    if (!this.hasNode(to)) {
      throw new Error(`NotFoundError: Target node "${to}" does not exist in the graph.`);
    }
    if (from === to) {
      throw new Error(`ValidationError: Self-loops are not permitted between "${from}" and itself.`);
    }

    let type = 'connected_to';
    let edgeMetadata = {};

    if (typeof typeOrOptions === 'object' && typeOrOptions !== null) {
      type = typeOrOptions.type || 'connected_to';
      edgeMetadata = typeOrOptions.metadata || {};
    } else if (typeof typeOrOptions === 'string') {
      type = typeOrOptions;
      edgeMetadata = metadata || {};
    }

    // Check if edge already exists
    if (this.adjacencyList.get(from).has(to)) {
      throw new Error(`DuplicateEdgeError: Edge from "${from}" to "${to}" already exists.`);
    }

    const forwardEdge = {
      from,
      to,
      type,
      metadata: edgeMetadata
    };

    // Store forward edge in adjacency list
    this.adjacencyList.get(from).set(to, forwardEdge);

    // If undirected, store symmetric reverse edge
    if (!this.isDirected) {
      const reverseEdge = {
        from: to,
        to: from,
        type,
        metadata: edgeMetadata
      };
      this.adjacencyList.get(to).set(from, reverseEdge);
    }

    return forwardEdge;
  }

  /**
   * Removes an edge between two nodes.
   *
   * @param {string} from - Source node ID.
   * @param {string} to - Destination node ID.
   * @returns {boolean} True if the edge was successfully removed.
   * @throws {Error} If either node does not exist or if the edge does not exist.
   */
  removeEdge(from, to) {
    if (!this.hasNode(from)) {
      throw new Error(`NotFoundError: Source node "${from}" does not exist in the graph.`);
    }
    if (!this.hasNode(to)) {
      throw new Error(`NotFoundError: Target node "${to}" does not exist in the graph.`);
    }
    if (!this.adjacencyList.get(from).has(to)) {
      throw new Error(`NotFoundError: Edge between "${from}" and "${to}" does not exist.`);
    }

    // Remove forward edge
    this.adjacencyList.get(from).delete(to);

    // If undirected, remove reverse edge
    if (!this.isDirected) {
      this.adjacencyList.get(to).delete(from);
    }

    return true;
  }

  /**
   * Checks whether a node exists in the graph.
   *
   * @param {string} id - Node ID.
   * @returns {boolean} True if the node exists.
   */
  hasNode(id) {
    return typeof id === 'string' && this.nodes.has(id);
  }

  /**
   * Checks whether an edge exists between two nodes.
   *
   * @param {string} from - Source node ID.
   * @param {string} to - Destination node ID.
   * @returns {boolean} True if the edge exists.
   */
  hasEdge(from, to) {
    if (!this.hasNode(from) || !this.hasNode(to)) {
      return false;
    }
    return this.adjacencyList.get(from).has(to);
  }

  /**
   * Retrieves a node object by ID.
   *
   * @param {string} id - Node ID.
   * @returns {Object|null} Node object or null if not found.
   */
  getNode(id) {
    return this.nodes.get(id) || null;
  }

  /**
   * Retrieves an edge object between two nodes.
   *
   * @param {string} from - Source node ID.
   * @param {string} to - Destination node ID.
   * @returns {Object|null} Edge object or null if not found.
   */
  getEdge(from, to) {
    if (!this.hasEdge(from, to)) {
      return null;
    }
    return this.adjacencyList.get(from).get(to);
  }

  /**
   * Retrieves an array of neighbor IDs adjacent to the specified node.
   *
   * @param {string} id - Node ID.
   * @returns {string[]} Array of neighbor node IDs.
   * @throws {Error} If the node does not exist in the graph.
   */
  getNeighbors(id) {
    if (!this.hasNode(id)) {
      throw new Error(`NotFoundError: Cannot get neighbors for non-existing node "${id}".`);
    }
    return Array.from(this.adjacencyList.get(id).keys());
  }

  /**
   * Retrieves detailed neighbor information (neighbor node object + connecting edge).
   *
   * @param {string} id - Node ID.
   * @returns {Array<{ node: Object, edge: Object }>} Array of neighbor details.
   * @throws {Error} If the node does not exist.
   */
  getNeighborDetails(id) {
    if (!this.hasNode(id)) {
      throw new Error(`NotFoundError: Cannot get neighbor details for non-existing node "${id}".`);
    }

    const details = [];
    const neighborMap = this.adjacencyList.get(id);

    for (const [neighborId, edge] of neighborMap.entries()) {
      details.push({
        node: this.nodes.get(neighborId),
        edge
      });
    }

    return details;
  }

  /**
   * Retrieves all nodes in the graph.
   *
   * @returns {Object[]} Array of all node objects.
   */
  getNodes() {
    return Array.from(this.nodes.values());
  }

  /**
   * Retrieves all unique edges in the graph.
   * For undirected graphs, each edge is returned once (from -> to).
   *
   * @returns {Object[]} Array of edge objects.
   */
  getEdges() {
    const edges = [];
    const visitedPairs = new Set();

    for (const [from, neighborMap] of this.adjacencyList.entries()) {
      for (const [to, edge] of neighborMap.entries()) {
        if (!this.isDirected) {
          // Normalize undirected edge representation to prevent duplicate entries
          const edgeKey = from < to ? `${from}--${to}` : `${to}--${from}`;
          if (!visitedPairs.has(edgeKey)) {
            visitedPairs.add(edgeKey);
            edges.push(edge);
          }
        } else {
          edges.push(edge);
        }
      }
    }

    return edges;
  }

  /**
   * Returns the degree (number of incident edges) of a node.
   *
   * @param {string} id - Node ID.
   * @returns {number} Degree of the node.
   * @throws {Error} If the node does not exist.
   */
  getDegree(id) {
    if (!this.hasNode(id)) {
      throw new Error(`NotFoundError: Node "${id}" does not exist.`);
    }
    return this.adjacencyList.get(id).size;
  }

  /**
   * Returns the total number of nodes in the graph.
   *
   * @returns {number} Node count.
   */
  getNodeCount() {
    return this.nodes.size;
  }

  /**
   * Returns the total number of edges in the graph.
   *
   * @returns {number} Edge count.
   */
  getEdgeCount() {
    return this.getEdges().length;
  }

  /**
   * Returns a clean JSON-serializable representation of the adjacency list.
   * Useful for debugging, testing, and inspection.
   *
   * @returns {Object.<string, string[]>} Key-value map of node IDs to arrays of neighbor IDs.
   */
  toAdjacencyListObject() {
    const result = {};
    for (const [nodeId, neighborMap] of this.adjacencyList.entries()) {
      result[nodeId] = Array.from(neighborMap.keys());
    }
    return result;
  }

  /**
   * Clears all nodes and edges from the graph.
   */
  clear() {
    this.nodes.clear();
    this.adjacencyList.clear();
  }

  /**
   * Generates a readable string representation of the graph for terminal inspection.
   *
   * @returns {string} Formatted string.
   */
  toString() {
    const lines = [`Graph (${this.isDirected ? 'Directed' : 'Undirected'}, Nodes: ${this.getNodeCount()}, Edges: ${this.getEdgeCount()}):`];
    for (const [nodeId, neighborMap] of this.adjacencyList.entries()) {
      const node = this.nodes.get(nodeId);
      const connections = Array.from(neighborMap.entries())
        .map(([neighborId, edge]) => `${neighborId} [${edge.type}]`)
        .join(', ');
      lines.push(`  (${node.type}) ${nodeId} (${node.label}) -> [${connections}]`);
    }
    return lines.join('\n');
  }
}

module.exports = Graph;
