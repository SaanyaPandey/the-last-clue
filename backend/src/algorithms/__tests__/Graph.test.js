/**
 * Test Suite for Graph Data Structure
 * Tests cover all 10 core requirements + sample investigation graph verification.
 * Built using Node.js native test runner (node:test and node:assert/strict).
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const Graph = require('../Graph');

describe('Graph Data Structure — Manual Adjacency List Implementation', () => {
  let graph;

  beforeEach(() => {
    graph = new Graph();
  });

  // 1. Node Creation
  it('1. should create nodes with default and custom metadata', () => {
    const suspectNode = graph.addNode('suspect_1', {
      type: 'suspect',
      label: 'Alex Rivera',
      metadata: { occupation: 'Butler', alibi: 'Wine cellar' }
    });

    assert.equal(graph.hasNode('suspect_1'), true);
    assert.equal(suspectNode.id, 'suspect_1');
    assert.equal(suspectNode.type, 'suspect');
    assert.equal(suspectNode.label, 'Alex Rivera');
    assert.deepEqual(suspectNode.metadata, { occupation: 'Butler', alibi: 'Wine cellar' });

    // Should also support creating node with just an ID
    const clueNode = graph.addNode('clue_1');
    assert.equal(graph.hasNode('clue_1'), true);
    assert.equal(clueNode.type, 'generic');
    assert.equal(clueNode.label, 'clue_1');

    // Should also support passing a full object
    const locationNode = graph.addNode({
      id: 'loc_1',
      type: 'location',
      label: 'Library',
      metadata: { floor: 2 }
    });
    assert.equal(locationNode.id, 'loc_1');
    assert.equal(locationNode.type, 'location');
    assert.equal(graph.getNodeCount(), 3);
  });

  // 2. Duplicate Node Handling
  it('2. should reject duplicate node addition and invalid node IDs', () => {
    graph.addNode('suspect_1');

    assert.throws(
      () => graph.addNode('suspect_1'),
      /DuplicateNodeError: Node with ID "suspect_1" already exists/
    );

    // Invalid IDs (empty string, whitespace, non-string)
    assert.throws(() => graph.addNode(''), /Node ID must be a non-empty string/);
    assert.throws(() => graph.addNode('   '), /Node ID must be a non-empty string/);
    assert.throws(() => graph.addNode(null), /Node ID must be a non-empty string/);
    assert.throws(() => graph.addNode(undefined), /Node ID must be a non-empty string/);
  });

  // 3. Edge Creation
  it('3. should create undirected edges symmetrically between nodes', () => {
    graph.addNode('suspect_1', { type: 'suspect', label: 'Alex' });
    graph.addNode('clue_1', { type: 'clue', label: 'Broken Pocket Watch' });

    const edge = graph.addEdge('suspect_1', 'clue_1', 'owns');

    assert.equal(edge.from, 'suspect_1');
    assert.equal(edge.to, 'clue_1');
    assert.equal(edge.type, 'owns');

    // Undirected graph must support traversal in both directions
    assert.equal(graph.hasEdge('suspect_1', 'clue_1'), true);
    assert.equal(graph.hasEdge('clue_1', 'suspect_1'), true);

    // Verify reverse edge is also stored
    const reverseEdge = graph.getEdge('clue_1', 'suspect_1');
    assert.notEqual(reverseEdge, null);
    assert.equal(reverseEdge.from, 'clue_1');
    assert.equal(reverseEdge.to, 'suspect_1');
    assert.equal(reverseEdge.type, 'owns');
  });

  // 4. Duplicate Edge Handling
  it('4. should reject duplicate edge creation and self-loops', () => {
    graph.addNode('A');
    graph.addNode('B');

    graph.addEdge('A', 'B', 'connected_to');

    // Adding same edge forward should throw
    assert.throws(
      () => graph.addEdge('A', 'B', 'connected_to'),
      /DuplicateEdgeError: Edge from "A" to "B" already exists/
    );

    // In undirected graph, adding B -> A should also throw since A-B already exists
    assert.throws(
      () => graph.addEdge('B', 'A'),
      /DuplicateEdgeError/
    );

    // Self loops should be rejected
    assert.throws(
      () => graph.addEdge('A', 'A'),
      /ValidationError: Self-loops are not permitted/
    );
  });

  // 5. Neighbor Retrieval
  it('5. should accurately retrieve neighbors for any node', () => {
    graph.addNode('center');
    graph.addNode('n1');
    graph.addNode('n2');
    graph.addNode('n3');

    graph.addEdge('center', 'n1');
    graph.addEdge('center', 'n2');
    graph.addEdge('center', 'n3');

    const neighbors = graph.getNeighbors('center');
    assert.equal(neighbors.length, 3);
    assert.deepEqual(neighbors.sort(), ['n1', 'n2', 'n3'].sort());

    // Check degree
    assert.equal(graph.getDegree('center'), 3);
    assert.equal(graph.getDegree('n1'), 1);

    // Check neighbor details (nodes + edges)
    const details = graph.getNeighborDetails('center');
    assert.equal(details.length, 3);
    assert.equal(details[0].node.id, 'n1');
  });

  // 6. Node Removal
  it('6. should remove node and safely cascade deletion of all incident edges', () => {
    graph.addNode('suspect_1');
    graph.addNode('clue_1');
    graph.addNode('clue_2');

    graph.addEdge('suspect_1', 'clue_1');
    graph.addEdge('suspect_1', 'clue_2');
    graph.addEdge('clue_1', 'clue_2');

    assert.equal(graph.getNodeCount(), 3);
    assert.equal(graph.getEdgeCount(), 3);

    // Remove suspect_1
    const result = graph.removeNode('suspect_1');
    assert.equal(result, true);
    assert.equal(graph.hasNode('suspect_1'), false);
    assert.equal(graph.getNodeCount(), 2);

    // Edges connected to suspect_1 must be gone
    assert.equal(graph.hasEdge('suspect_1', 'clue_1'), false);
    assert.equal(graph.hasEdge('clue_1', 'suspect_1'), false);
    assert.equal(graph.hasEdge('suspect_1', 'clue_2'), false);

    // Clue_1 and Clue_2 should no longer list suspect_1 as neighbor
    assert.deepEqual(graph.getNeighbors('clue_1'), ['clue_2']);
    assert.deepEqual(graph.getNeighbors('clue_2'), ['clue_1']);

    // Clue_1 <-> Clue_2 edge remains intact
    assert.equal(graph.hasEdge('clue_1', 'clue_2'), true);
    assert.equal(graph.getEdgeCount(), 1);
  });

  // 7. Edge Removal
  it('7. should remove edge symmetrically in undirected graph', () => {
    graph.addNode('A');
    graph.addNode('B');
    graph.addEdge('A', 'B');

    assert.equal(graph.hasEdge('A', 'B'), true);
    assert.equal(graph.hasEdge('B', 'A'), true);

    const removed = graph.removeEdge('A', 'B');
    assert.equal(removed, true);

    assert.equal(graph.hasEdge('A', 'B'), false);
    assert.equal(graph.hasEdge('B', 'A'), false);
    assert.deepEqual(graph.getNeighbors('A'), []);
    assert.deepEqual(graph.getNeighbors('B'), []);

    // Trying to remove an edge that does not exist should throw
    assert.throws(
      () => graph.removeEdge('A', 'B'),
      /NotFoundError: Edge between "A" and "B" does not exist/
    );
  });

  // 8. Unknown Node Handling
  it('8. should throw clear errors when operating on unknown nodes', () => {
    graph.addNode('existing_node');

    // addEdge with non-existent source
    assert.throws(
      () => graph.addEdge('missing_source', 'existing_node'),
      /NotFoundError: Source node "missing_source" does not exist/
    );

    // addEdge with non-existent target
    assert.throws(
      () => graph.addEdge('existing_node', 'missing_target'),
      /NotFoundError: Target node "missing_target" does not exist/
    );

    // removeNode for non-existing node
    assert.throws(
      () => graph.removeNode('non_existing'),
      /NotFoundError: Cannot remove non-existing node/
    );

    // getNeighbors for non-existing node
    assert.throws(
      () => graph.getNeighbors('non_existing'),
      /NotFoundError: Cannot get neighbors for non-existing node/
    );

    // hasNode and hasEdge should return false safely
    assert.equal(graph.hasNode('unknown'), false);
    assert.equal(graph.hasEdge('unknown', 'existing_node'), false);
    assert.equal(graph.getNode('unknown'), null);
    assert.equal(graph.getEdge('unknown', 'existing_node'), null);
  });

  // 9. Edge Metadata
  it('9. should correctly store and retrieve rich edge metadata and relationship types', () => {
    graph.addNode('suspect_alex', { type: 'suspect', label: 'Alex' });
    graph.addNode('knife_1', { type: 'evidence', label: 'Hunting Knife' });

    graph.addEdge('suspect_alex', 'knife_1', {
      type: 'owns',
      metadata: {
        condition: 'fingerprinted',
        confidence: 0.95,
        notes: 'Serial number matches suspect registration'
      }
    });

    const edge = graph.getEdge('suspect_alex', 'knife_1');
    assert.equal(edge.type, 'owns');
    assert.equal(edge.metadata.condition, 'fingerprinted');
    assert.equal(edge.metadata.confidence, 0.95);
    assert.equal(edge.metadata.notes, 'Serial number matches suspect registration');

    // In undirected mode, reverse edge should also preserve the same metadata
    const reverseEdge = graph.getEdge('knife_1', 'suspect_alex');
    assert.equal(reverseEdge.type, 'owns');
    assert.deepEqual(reverseEdge.metadata, edge.metadata);
  });

  // 10. Multiple Relationships and Complex Topology
  it('10. should maintain integrity in complex interconnected networks', () => {
    // Build a multi-entity investigative network
    graph.addNode('suspect_1', { type: 'suspect' });
    graph.addNode('suspect_2', { type: 'suspect' });
    graph.addNode('evidence_1', { type: 'evidence' });
    graph.addNode('location_1', { type: 'location' });
    graph.addNode('motive_1', { type: 'motive' });
    graph.addNode('event_1', { type: 'event' });

    graph.addEdge('suspect_1', 'suspect_2', 'knows');
    graph.addEdge('suspect_1', 'motive_1', 'connected_to');
    graph.addEdge('suspect_1', 'evidence_1', 'owns');
    graph.addEdge('evidence_1', 'location_1', 'found_at');
    graph.addEdge('suspect_2', 'event_1', 'witnessed');
    graph.addEdge('event_1', 'location_1', 'occurred_at');

    assert.equal(graph.getNodeCount(), 6);
    assert.equal(graph.getEdgeCount(), 6);

    // Degree checks
    assert.equal(graph.getDegree('suspect_1'), 3); // suspect_2, motive_1, evidence_1
    assert.equal(graph.getDegree('location_1'), 2); // evidence_1, event_1
    assert.equal(graph.getDegree('motive_1'), 1); // suspect_1

    // Verify neighbors of suspect_1
    const s1Neighbors = graph.getNeighbors('suspect_1');
    assert.deepEqual(s1Neighbors.sort(), ['evidence_1', 'motive_1', 'suspect_2'].sort());

    // Verify all nodes retrieved
    const allNodes = graph.getNodes();
    assert.equal(allNodes.length, 6);

    // Verify all unique edges retrieved
    const allEdges = graph.getEdges();
    assert.equal(allEdges.length, 6);
  });

  // 11. Sample Mystery Investigation Graph
  it('11. should correctly represent the sample mystery chain from project specification', () => {
    /*
     * Suspect_A
     *     | (points_to)
     *  Clue_1
     *     | (found_at)
     * Location_1
     *     | (connected_to)
     * Evidence_1
     *     | (belongs_to)
     * Suspect_B
     */

    graph.addNode('Suspect_A', { type: 'suspect', label: 'Lord Harrington' });
    graph.addNode('Clue_1', { type: 'clue', label: 'Torn Letter' });
    graph.addNode('Location_1', { type: 'location', label: 'Greenhouse' });
    graph.addNode('Evidence_1', { type: 'evidence', label: 'Bloody Gardening Shears' });
    graph.addNode('Suspect_B', { type: 'suspect', label: 'Gardener Thomas' });

    graph.addEdge('Suspect_A', 'Clue_1', 'points_to', { note: 'Letter references Lord Harrington' });
    graph.addEdge('Clue_1', 'Location_1', 'found_at', { note: 'Letter discovered in greenhouse flowerpot' });
    graph.addEdge('Location_1', 'Evidence_1', 'connected_to', { note: 'Shears hidden beneath workbench' });
    graph.addEdge('Evidence_1', 'Suspect_B', 'belongs_to', { note: 'Engraved with initials T.G.' });

    // Validate Node Count & Edge Count
    assert.equal(graph.getNodeCount(), 5);
    assert.equal(graph.getEdgeCount(), 4);

    // Verify Exact Adjacency List Relationships
    const adj = graph.toAdjacencyListObject();
    assert.deepEqual(adj['Suspect_A'], ['Clue_1']);
    assert.deepEqual(adj['Clue_1'], ['Suspect_A', 'Location_1']);
    assert.deepEqual(adj['Location_1'], ['Clue_1', 'Evidence_1']);
    assert.deepEqual(adj['Evidence_1'], ['Location_1', 'Suspect_B']);
    assert.deepEqual(adj['Suspect_B'], ['Evidence_1']);

    // Verify Step-by-Step Chain Connectivity
    assert.equal(graph.hasEdge('Suspect_A', 'Clue_1'), true);
    assert.equal(graph.hasEdge('Clue_1', 'Location_1'), true);
    assert.equal(graph.hasEdge('Location_1', 'Evidence_1'), true);
    assert.equal(graph.hasEdge('Evidence_1', 'Suspect_B'), true);

    // Verify no direct edge exists between Suspect_A and Suspect_B (requires graph traversal)
    assert.equal(graph.hasEdge('Suspect_A', 'Suspect_B'), false);
    assert.equal(graph.hasEdge('Suspect_A', 'Location_1'), false);
    assert.equal(graph.hasEdge('Clue_1', 'Evidence_1'), false);

    // Verify edge metadata preservation along the chain
    assert.equal(graph.getEdge('Suspect_A', 'Clue_1').type, 'points_to');
    assert.equal(graph.getEdge('Clue_1', 'Location_1').type, 'found_at');
    assert.equal(graph.getEdge('Location_1', 'Evidence_1').type, 'connected_to');
    assert.equal(graph.getEdge('Evidence_1', 'Suspect_B').type, 'belongs_to');
  });

  // Directed Graph Mode Option
  it('12. should support directed mode when configured', () => {
    const directedGraph = new Graph({ isDirected: true });

    directedGraph.addNode('X');
    directedGraph.addNode('Y');
    directedGraph.addEdge('X', 'Y', 'directed_link');

    assert.equal(directedGraph.hasEdge('X', 'Y'), true);
    assert.equal(directedGraph.hasEdge('Y', 'X'), false); // Only X -> Y
    assert.deepEqual(directedGraph.getNeighbors('X'), ['Y']);
    assert.deepEqual(directedGraph.getNeighbors('Y'), []);
  });
});
