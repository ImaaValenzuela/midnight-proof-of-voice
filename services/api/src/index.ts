import type { ServiceStatus } from '@voiceproof/protocol';

export const serviceStatus: ServiceStatus = Object.freeze({
  service: 'voiceproof-api',
  stage: 'scaffold',
  ready: false,
  missing: Object.freeze(['holder-authentication', 'voice-verifier', 'midnight-authorization', 'generation-consumption']),
});

/** No request body is accepted or logged until authentication and retention exist. */
export function route(method: string, path: string): { status: number; body: object } {
  if (method === 'GET' && path === '/health/live') {
    return { status: 200, body: { service: serviceStatus.service, live: true } };
  }
  if (method === 'GET' && path === '/health/ready') {
    return { status: 503, body: serviceStatus };
  }
  const operations = ['/v1/enrollments', '/v1/challenges', '/v1/authorizations', '/v1/generations', '/v1/revocations'];
  if (method === 'POST' && operations.includes(path)) {
    return { status: 501, body: { error: 'NOT_IMPLEMENTED', message: 'Voice authorization is not implemented.', ready: false } };
  }
  return { status: 404, body: { error: 'NOT_FOUND' } };
}
