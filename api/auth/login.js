import crypto from 'crypto';

// In-memory rate limiting map for transient serverless invocations (IP -> { count, lastAttempt })
const rateLimitMap = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const DEFAULT_HASH = '24efb5cf3758522bd85f5567d4e4ae604a55043a6cd68b821859428995cd5edf'; // '123456777'
const SIGNING_SECRET = process.env.SESSION_SIGNING_SECRET || 'portfolio-admin-secure-session-key-2026';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract client IP
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = (typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress) || '127.0.0.1';

  // Check rate limiting
  const now = Date.now();
  const rateRecord = rateLimitMap.get(clientIp);

  if (rateRecord) {
    if (rateRecord.count >= MAX_ATTEMPTS) {
      const remainingTime = Math.ceil((rateRecord.lastAttempt + LOCKOUT_WINDOW_MS - now) / 1000);
      if (remainingTime > 0) {
        return res.status(429).json({
          error: `Too many failed attempts. Account locked. Please wait ${remainingTime} seconds before retrying.`
        });
      } else {
        rateLimitMap.delete(clientIp); // Window expired, reset
      }
    }
  }

  const { passcode } = req.body || {};
  if (!passcode || typeof passcode !== 'string') {
    return res.status(400).json({ error: 'Passcode is required.' });
  }

  // Compute SHA-256 of entered passcode
  const inputHash = crypto.createHash('sha256').update(passcode.trim()).digest('hex');
  const targetHash = process.env.ADMIN_PASSCODE_HASH || DEFAULT_HASH;

  // Timing-safe comparison to prevent side-channel timing attacks
  const inputBuffer = Buffer.from(inputHash);
  const targetBuffer = Buffer.from(targetHash);

  let isMatch = false;
  if (inputBuffer.length === targetBuffer.length) {
    isMatch = crypto.timingSafeEqual(inputBuffer, targetBuffer);
  }

  if (!isMatch) {
    const current = rateLimitMap.get(clientIp) || { count: 0, lastAttempt: now };
    current.count += 1;
    current.lastAttempt = now;
    rateLimitMap.set(clientIp, current);

    const attemptsLeft = MAX_ATTEMPTS - current.count;
    return res.status(401).json({
      error: `Authentication failed. Invalid passcode. ${attemptsLeft > 0 ? `(${attemptsLeft} attempts remaining before lockout)` : 'Account is now temporarily locked.'}`
    });
  }

  // Reset rate limiting on successful login
  rateLimitMap.delete(clientIp);

  // Generate signed HMAC session token: [timestamp].[signature]
  const timestamp = Date.now();
  const sessionPayload = `${clientIp}:${timestamp}`;
  const signature = crypto.createHmac('sha256', SIGNING_SECRET).update(sessionPayload).digest('hex');
  const token = Buffer.from(`${sessionPayload}:${signature}`).toString('base64');

  // Set httpOnly Secure SameSite=Strict cookie
  const isProd = process.env.NODE_ENV === 'production';
  const cookieHeader = `portfolio_admin_session=${token}; HttpOnly; ${isProd ? 'Secure; ' : ''}SameSite=Strict; Path=/; Max-Age=14400`;

  res.setHeader('Set-Cookie', cookieHeader);
  return res.status(200).json({
    success: true,
    message: 'Authentication successful. Admin session granted.'
  });
}
