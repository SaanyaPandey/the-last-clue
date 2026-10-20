/**
 * THE LAST CLUE — Phase 8 Authoritative Accusation & Lifecycle Tests
 * Validates server-side verdict validation, secrecy protection,
 * duplicate handling, input validation, and post-game reveal.
 */

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../../app');
const { defaultCaseStore } = require('../../services/activeCaseStore');

describe('Server-Side Accusation Validation & Case Lifecycle (Phase 8)', () => {
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

  it('1. should authoritatively validate a CORRECT accusation without leaking internal solver traces', async () => {
    // Generate a case
    const genRes = await request('/api/cases/generate', {
      method: 'POST',
      body: { difficulty: 'medium', seed: 4242 }
    });
    assert.strictEqual(genRes.status, 200);
    const caseData = genRes.body.data;
    const caseInstanceId = caseData.caseInstanceId;
    assert.ok(caseInstanceId, 'Response should contain caseInstanceId');

    // Retrieve internal server-side secret directly from store to simulate true culprit
    const internalRecord = defaultCaseStore.getCase(caseInstanceId);
    assert.ok(internalRecord);
    const trueCulprit = internalRecord.culpritId;
    assert.ok(trueCulprit);

    // Submit correct accusation
    const accuseRes = await request('/api/cases/accuse', {
      method: 'POST',
      body: {
        caseInstanceId,
        suspectId: trueCulprit,
        rationale: 'Forensic evidence places the suspect with the murder weapon'
      }
    });

    assert.strictEqual(accuseRes.status, 200);
    assert.strictEqual(accuseRes.body.success, true);
    assert.strictEqual(accuseRes.body.data.isCorrect, true);
    assert.strictEqual(accuseRes.body.data.status, 'solved');
    assert.strictEqual(accuseRes.body.data.accusedSuspectId, trueCulprit);
    assert.ok(accuseRes.body.data.feedback.includes('Case Solved'));
  });

  it('2. should authoritatively validate an INCORRECT accusation and NEVER reveal the real culprit', async () => {
    // Generate a new distinct case
    const genRes = await request('/api/cases/generate', {
      method: 'POST',
      body: { difficulty: 'medium', seed: 77777 }
    });
    const caseData = genRes.body.data;
    const caseInstanceId = caseData.caseInstanceId;

    const internalRecord = defaultCaseStore.getCase(caseInstanceId);
    const trueCulprit = internalRecord.culpritId;

    // Pick an innocent suspect from the case
    const innocentSuspect = caseData.suspects.find((s) => s.id !== trueCulprit);
    assert.ok(innocentSuspect, 'Case must have an innocent suspect');

    const accuseRes = await request('/api/cases/accuse', {
      method: 'POST',
      body: {
        caseInstanceId,
        suspectId: innocentSuspect.id,
        rationale: 'Suspicious demeanor during interview'
      }
    });

    assert.strictEqual(accuseRes.status, 200);
    assert.strictEqual(accuseRes.body.success, true);
    assert.strictEqual(accuseRes.body.data.isCorrect, false);
    assert.strictEqual(accuseRes.body.data.status, 'closed');
    assert.strictEqual(accuseRes.body.data.accusedSuspectId, innocentSuspect.id);

    // SECRECY CHECK: The response must NOT contain the real culprit or solution fields
    const responseJson = JSON.stringify(accuseRes.body);
    assert.strictEqual(responseJson.includes(trueCulprit), false, 'Real culprit ID must never leak in incorrect verdict!');
    assert.strictEqual(accuseRes.body.data.solution, undefined);
    assert.strictEqual(accuseRes.body.data.culprit, undefined);
  });

  it('3. should reject an accusation with a suspect who does not belong to the case (HTTP 400)', async () => {
    const genRes = await request('/api/cases/generate', {
      method: 'POST',
      body: { difficulty: 'easy', seed: 11111 }
    });
    const caseInstanceId = genRes.body.data.caseInstanceId;

    const accuseRes = await request('/api/cases/accuse', {
      method: 'POST',
      body: {
        caseInstanceId,
        suspectId: 'suspect_fictional_intruder'
      }
    });

    assert.strictEqual(accuseRes.status, 400);
    assert.strictEqual(accuseRes.body.success, false);
    assert.strictEqual(accuseRes.body.error.code, 'INVALID_INPUT');
    assert.ok(accuseRes.body.error.message.includes('does not belong'));
  });

  it('4. should reject an accusation for an unknown or nonexistent case (HTTP 404)', async () => {
    const accuseRes = await request('/api/cases/accuse', {
      method: 'POST',
      body: {
        caseInstanceId: 'nonexistent-uuid-000000',
        suspectId: 'suspect_lord_harrington'
      }
    });

    assert.strictEqual(accuseRes.status, 404);
    assert.strictEqual(accuseRes.body.success, false);
    assert.strictEqual(accuseRes.body.error.code, 'CASE_NOT_FOUND');
  });

  it('5. should reject duplicate accusations once a case is closed (HTTP 409)', async () => {
    const genRes = await request('/api/cases/generate', {
      method: 'POST',
      body: { difficulty: 'easy', seed: 22222 }
    });
    const caseData = genRes.body.data;
    const caseInstanceId = caseData.caseInstanceId;
    const suspectId = caseData.suspects[0].id;

    // First submission
    const firstAccuse = await request('/api/cases/accuse', {
      method: 'POST',
      body: { caseInstanceId, suspectId }
    });
    assert.strictEqual(firstAccuse.status, 200);

    // Duplicate submission
    const secondAccuse = await request('/api/cases/accuse', {
      method: 'POST',
      body: { caseInstanceId, suspectId }
    });
    assert.strictEqual(secondAccuse.status, 409);
    assert.strictEqual(secondAccuse.body.success, false);
    assert.strictEqual(secondAccuse.body.error.code, 'CASE_ALREADY_CLOSED');
  });

  it('6. should reject malformed accusation requests missing required parameters (HTTP 400)', async () => {
    // Missing suspectId
    const res1 = await request('/api/cases/accuse', {
      method: 'POST',
      body: { caseInstanceId: 'valid-id' }
    });
    assert.strictEqual(res1.status, 400);

    // Missing caseInstanceId
    const res2 = await request('/api/cases/accuse', {
      method: 'POST',
      body: { suspectId: 'suspect_a' }
    });
    assert.strictEqual(res2.status, 400);
  });

  it('7. should forbid solution reveal for an active unsolved case (HTTP 403)', async () => {
    const genRes = await request('/api/cases/generate', {
      method: 'POST',
      body: { difficulty: 'medium', seed: 33333 }
    });
    const caseInstanceId = genRes.body.data.caseInstanceId;

    const revealRes = await request('/api/cases/reveal', {
      method: 'POST',
      body: { caseInstanceId }
    });

    assert.strictEqual(revealRes.status, 403);
    assert.strictEqual(revealRes.body.success, false);
    assert.strictEqual(revealRes.body.error.code, 'FORBIDDEN');
  });

  it('8. should permit solution reveal AFTER case has concluded (POST /api/cases/reveal)', async () => {
    const genRes = await request('/api/cases/generate', {
      method: 'POST',
      body: { difficulty: 'medium', seed: 44444 }
    });
    const caseData = genRes.body.data;
    const caseInstanceId = caseData.caseInstanceId;

    // Conclude the case with an accusation
    await request('/api/cases/accuse', {
      method: 'POST',
      body: {
        caseInstanceId,
        suspectId: caseData.suspects[0].id
      }
    });

    // Request post-game reveal
    const revealRes = await request('/api/cases/reveal', {
      method: 'POST',
      body: { caseInstanceId }
    });

    assert.strictEqual(revealRes.status, 200);
    assert.ok(revealRes.body.data.unsealedFindings);
    assert.ok(revealRes.body.data.unsealedFindings.perpetrator);
    assert.ok(revealRes.body.data.unsealedFindings.crimeScene);
    assert.ok(revealRes.body.data.unsealedFindings.weaponUsed);
    assert.ok(revealRes.body.data.unsealedFindings.motiveDeduction);
  });
});
