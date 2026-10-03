import assert from 'node:assert/strict';
import test from 'node:test';
import { route } from '../dist/index.js';

test('liveness does not imply authorization readiness', () => {
  assert.equal(route('GET', '/health/live').status, 200);
  const result = route('GET', '/health/ready');
  assert.equal(result.status, 503);
  assert.equal(result.body.ready, false);
});

test('all sensitive operations fail closed before consuming biometric input', () => {
  for (const path of ['/v1/enrollments', '/v1/challenges', '/v1/authorizations', '/v1/generations', '/v1/revocations']) {
    assert.deepEqual(route('POST', path), { status: 501, body: {
      error: 'NOT_IMPLEMENTED', message: 'Voice authorization is not implemented.', ready: false,
    } });
    assert.equal(route('GET', path).status, 404);
  }
  assert.equal(route('POST', '/unknown').status, 404);
});
