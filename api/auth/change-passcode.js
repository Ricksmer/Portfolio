import crypto from 'crypto';
import { verifySession } from '../_auth_util.js';

const DEFAULT_HASH = '24efb5cf3758522bd85f5567d4e4ae604a55043a6cd68b821859428995cd5edf';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Must have active authenticated session
  if (!verifySession(req)) {
    return res.status(401).json({ error: 'Unauthorized: Valid session required.' });
  }

  const { currentPasscode, newPasscode } = req.body || {};
  if (!currentPasscode || !newPasscode) {
    return res.status(400).json({ error: 'Current passcode and new passcode are required.' });
  }

  const currentHash = crypto.createHash('sha256').update(currentPasscode.trim()).digest('hex');
  const targetHash = process.env.ADMIN_PASSCODE_HASH || DEFAULT_HASH;

  const inputBuffer = Buffer.from(currentHash);
  const targetBuffer = Buffer.from(targetHash);

  let isMatch = false;
  if (inputBuffer.length === targetBuffer.length) {
    isMatch = crypto.timingSafeEqual(inputBuffer, targetBuffer);
  }

  if (!isMatch) {
    return res.status(401).json({ error: 'Current passcode is incorrect.' });
  }

  const newHash = crypto.createHash('sha256').update(newPasscode.trim()).digest('hex');

  return res.status(200).json({
    success: true,
    message: 'Passcode verified. To complete update on Vercel, set ADMIN_PASSCODE_HASH to this new hash in project settings.',
    newHash
  });
}
