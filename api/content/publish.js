import { verifySession } from '../_auth_util.js';

let publishedCache = null;
let versionHistory = [];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Publishing strictly requires active authenticated admin session
  if (!verifySession(req)) {
    return res.status(401).json({ error: 'Unauthorized: Admin session required to publish.' });
  }

  const payload = req.body;
  if (!payload || !payload.sections) {
    return res.status(400).json({ error: 'Invalid content schema: sections array required.' });
  }

  // Archive previous version to history
  if (publishedCache) {
    versionHistory.unshift({
      timestamp: new Date().toISOString(),
      version: publishedCache.version || 1,
      data: publishedCache
    });
    if (versionHistory.length > 10) versionHistory.pop();
  }

  payload.lastPublishedAt = new Date().toISOString();
  payload.version = (payload.version || 1) + 1;
  publishedCache = payload;

  return res.status(200).json({
    success: true,
    message: 'Content published live successfully.',
    version: payload.version,
    publishedAt: payload.lastPublishedAt
  });
}
