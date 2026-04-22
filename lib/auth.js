import jwt from 'jsonwebtoken';
import cookie from 'cookie';

// TODO: move this to .env in production
const JWT_SECRET = process.env.JWT_SECRET || 'norayr-portfolio-secret-key-2025';
const TOKEN_EXPIRY = '7d';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// tries to get the token from either the Authorization header or cookies
export function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // fallback to cookie
  if (req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie);
    if (cookies.token) return cookies.token;
  }

  return null;
}

export function setTokenCookie(res, token) {
  res.setHeader('Set-Cookie', cookie.serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  }));
}

export function clearTokenCookie(res) {
  res.setHeader('Set-Cookie', cookie.serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  }));
}

// wraps an api route handler so it checks for valid token first
export function authMiddleware(handler) {
  return async (req, res) => {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
    }

    req.user = decoded;
    return handler(req, res);
  };
}
