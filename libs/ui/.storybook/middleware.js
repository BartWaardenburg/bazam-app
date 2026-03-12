const fs = require('node:fs');
const path = require('node:path');

const DATA_FILE = path.join(__dirname, 'review-status.json');

const readData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '{}', 'utf-8');
  }
  return fs.readFileSync(DATA_FILE, 'utf-8');
};

const readBody = (req) =>
  new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => resolve(body));
  });

module.exports = function expressMiddleware(router) {
  router.get('/api/review-status', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(readData());
  });

  router.post('/api/review-status', async (req, res) => {
    const body = await readBody(req);
    fs.writeFileSync(DATA_FILE, body, 'utf-8');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
  });
};
