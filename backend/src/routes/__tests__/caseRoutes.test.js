/**
 * THE LAST CLUE — Procedurally Generated Mystery Investigation Game
 * API Route Integration Tests (Phase 6)
 */

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../../app');

describe('REST API Endpoint Tests — Phase 6', () => {
  let server;
  let baseUrl;

  before(async () => {
    return new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    return new Promise((resolve) => {
      if (server) {
        server.close(resolve);
      } else {
        resolve();
      }
    });
  });

  // Helper for JSON HTTP requests
  async function request(path, options = {}) {
    const url = `${baseUrl}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const fetchOptions = {
      method: options.method || 'GET',
      headers
    };

    if (options.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    const res = await fetch(url, fetchOptions);
    const json = await res.json();
    return { status: res.status, body: json };
  }

  it('1. should generate a case with valid medium difficulty (POST /api/cases/generate)', async () => {
    const res = await request('/api/cases/generate', {
      method: 'POST',
      body: { difficulty: 'medium' }
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data);
    assert.strictEqual(res.body.data.difficulty, 'medium');
    assert.ok(res.body.data.caseId.startsWith('CASE-'));
    assert.ok(typeof res.body.data.seed === 'number');
  });

  it('2. should generate identical case on repeated requests with explicit seed', async () => {
    const payload = { difficulty: 'medium', seed: 12345 };

    const res1 = await request('/api/cases/generate', {
      method: 'POST',
      body: payload
    });

    const res2 = await request('/api/cases/generate', {
      method: 'POST',
      body: payload
    });

    assert.strictEqual(res1.status, 200);
    assert.strictEqual(res2.status, 200);
    assert.strictEqual(res1.body.data.caseId, res2.body.data.caseId);
    assert.deepStrictEqual(res1.body.data, res2.body.data);
  });

  it('3. should generate different cases for different seeds', async () => {
    const res1 = await request('/api/cases/generate', {
      method: 'POST',
      body: { difficulty: 'medium', seed: 10001 }
    });

    const res2 = await request('/api/cases/generate', {
      method: 'POST',
      body: { difficulty: 'medium', seed: 20002 }
    });

    assert.strictEqual(res1.status, 200);
    assert.strictEqual(res2.status, 200);
    assert.notStrictEqual(res1.body.data.caseId, res2.body.data.caseId);
    assert.notStrictEqual(res1.body.data.seed, res2.body.data.seed);
  });

  it('4. should return HTTP 400 when difficulty is missing', async () => {
    const res = await request('/api/cases/generate', {
      method: 'POST',
      body: { seed: 12345 }
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, 'INVALID_INPUT');
    assert.ok(res.body.error.message.includes('Difficulty is required'));
  });

  it('5. should return HTTP 400 when difficulty is invalid', async () => {
    const res = await request('/api/cases/generate', {
      method: 'POST',
      body: { difficulty: 'impossible', seed: 12345 }
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, 'INVALID_INPUT');
    assert.ok(res.body.error.message.includes('Invalid difficulty'));
  });

  it('6. should return HTTP 400 when seed is non-numeric', async () => {
    const res = await request('/api/cases/generate', {
      method: 'POST',
      body: { difficulty: 'medium', seed: 'hello' }
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, 'INVALID_INPUT');
    assert.ok(res.body.error.message.includes('Invalid seed'));
  });

  it('7. should verify the public API response does NOT contain hidden solution fields', async () => {
    const res = await request('/api/cases/generate', {
      method: 'POST',
      body: { difficulty: 'easy', seed: 55555 }
    });

    assert.strictEqual(res.status, 200);
    const caseData = res.body.data;

    // Check solution object is not present
    assert.strictEqual(caseData.solution, undefined);
    assert.strictEqual(caseData.culprit, undefined);
    assert.strictEqual(caseData.motive, undefined);
    assert.strictEqual(caseData.weapon, undefined);
    assert.strictEqual(caseData.location, undefined);

    // Verify stringified response has zero references to solution key
    const jsonString = JSON.stringify(caseData);
    assert.strictEqual(jsonString.includes('"solution"'), false);
  });

  it('8. should verify graph JSON contains nodes and edges arrays (no Map objects)', async () => {
    const res = await request('/api/cases/generate', {
      method: 'POST',
      body: { difficulty: 'hard', seed: 77777 }
    });

    assert.strictEqual(res.status, 200);
    const graph = res.body.data.graph;

    assert.ok(graph);
    assert.ok(Array.isArray(graph.nodes));
    assert.ok(Array.isArray(graph.edges));
    assert.ok(graph.nodes.length > 0);
    assert.ok(graph.edges.length > 0);

    // Verify node structure
    const sampleNode = graph.nodes[0];
    assert.ok(sampleNode.id);
    assert.ok(sampleNode.type);
    assert.ok(sampleNode.label);
    assert.ok(sampleNode.metadata);
    assert.strictEqual(sampleNode.metadata.isMurderWeapon, undefined);

    // Verify edge structure
    const sampleEdge = graph.edges[0];
    assert.ok(sampleEdge.source);
    assert.ok(sampleEdge.target);
    assert.ok(sampleEdge.relationship);
  });

  it('9. should verify health endpoint (GET /api/health) still works', async () => {
    const res = await request('/api/health');

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'OK');
    assert.ok(res.body.message.includes('running successfully'));
  });
});
