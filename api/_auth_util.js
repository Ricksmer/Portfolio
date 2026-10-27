import crypto from 'crypto';

const SIGNING_SECRET = process.env.SESSION_SIGNING_SECRET || 'portfolio-admin-secure-session-key-2026';
const MAX_SESSION_AGE_MS = 4 * 60 * 60 * 1000; // 4 hours

export function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    let [name, ...rest] = cookie.split('=');
    name = name?.trim();
    if (!name) return;
    const value = rest.join('=').trim();
    list[name] = decodeURIComponent(value);
  });
  return list;
}

export function verifySession(req) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.portfolio_admin_session;
  if (!token) return false;

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return false;

    const [ip, timestampStr, signature] = parts;
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) return false;

    // Check expiration
    if (Date.now() - timestamp > MAX_SESSION_AGE_MS) {
      return false;
    }

    // Verify HMAC signature
    const expectedSig = crypto.createHmac('sha256', SIGNING_SECRET).update(`${ip}:${timestamp}`).digest('hex');
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSig);

    if (sigBuffer.length !== expectedBuffer.length) return false;
    return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
  } catch (err) {
    return false;
  }
}
