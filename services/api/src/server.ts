import { createServer } from 'node:http';
import { route } from './index.js';

const port = Number(process.env['PORT'] ?? '3000');
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be an integer from 1 to 65535');
const server = createServer({ requestTimeout: 10_000, headersTimeout: 5_000, maxHeaderSize: 8192 }, (request, response) => {
  const result = route(request.method ?? '', (request.url ?? '').split('?')[0] ?? '');
  response.writeHead(result.status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    connection: 'close',
  });
  response.end(JSON.stringify(result.body));
});
server.listen(port, '127.0.0.1', () => console.log(`VoiceProof API scaffold listening on http://127.0.0.1:${port}`));
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, () => server.close());
