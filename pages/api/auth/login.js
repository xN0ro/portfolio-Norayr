import getDb from '../../../lib/db';
import bcrypt from 'bcryptjs';
import { signToken, setTokenCookie } from '../../../lib/auth';
import { validateLogin } from '../../../lib/validators';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  const errors = validateLogin({ email, password });
  if (errors) {
    return res.status(400).json({ errors });
  }

  try {
    const db = getDb();

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({ errors: { email: 'No account found with this email.' } });
    }

    // compare passwords
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ errors: { password: 'Incorrect password.' } });
    }

    const token = signToken({ id: user.id, name: user.name, email: user.email });
    setTokenCookie(res, token);

    return res.status(200).json({
      message: 'Login successful!',
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
