import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const host = process.env.HOST ?? '0.0.0.0';
const port = Number(process.env.PORT ?? 8080);
const distDir = join(process.cwd(), 'dist');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

const server = createServer((req, res) => {
  const requestPath = req.url?.split('?')[0] ?? '/';
  const safePath = normalize(requestPath).replace(/^([.]{2}[\\/])+/, '');
  const filePath = safePath === '/' ? join(distDir, 'index.html') : join(distDir, safePath);

  const targetPath = existsSync(filePath) && statSync(filePath).isFile() ? filePath : join(distDir, 'index.html');

  const ext = extname(targetPath);
  const contentType = mimeTypes[ext] ?? 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': targetPath.endsWith('index.html') ? 'no-cache' : 'public, max-age=31536000, immutable',
  });

  createReadStream(targetPath).pipe(res).on('error', () => {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Failed to read file');
  });
});

server.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`Serving dist at http://${host}:${port}`);
});
