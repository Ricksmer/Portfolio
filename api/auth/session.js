import { verifySession } from '../_auth_util.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const isValid = verifySession(req);
  return res.status(200).json({
    authenticated: isValid
  });
}
