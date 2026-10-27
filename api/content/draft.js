import { verifySession } from '../_auth_util.js';

// Transient fallback store for session lifecycle
let serverDraftCache = null;

export default async function handler(req, res) {
  // Draft access strictly requires authenticated admin session
  if (!verifySession(req)) {
    return res.status(401).json({ error: 'Unauthorized: Admin session required to access draft.' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(serverDraftCache || { message: 'No server draft active; use local draft' });
  }

  if (req.method === 'PUT') {
    const draftData = req.body;
    if (!draftData || !draftData.sections) {
      return res.status(400).json({ error: 'Invalid draft schema: sections array required.' });
    }
    serverDraftCache = draftData;
    return res.status(200).json({
      success: true,
      message: 'Draft persisted successfully on server.',
      savedAt: new Date().toISOString()
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
