import getDb from '../../../lib/db';
import bcrypt from 'bcryptjs';
import { signToken, setTokenCookie } from '../../../lib/auth';
import { validateRegister } from '../../../lib/validators';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, password, confirmPassword } = req.body;

  // run validation
  const errors = validateRegister({ name, email, password, confirmPassword });
  if (errors) {
    return res.status(400).json({ errors });
  }

  try {
    const db = getDb();

    // make sure email isnt already taken
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.trim().toLowerCase());
    if (existing) {
      return res.status(400).json({ errors: { email: 'An account with this email already exists.' } });
    }

    // hash the password and save user
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(
      name.trim(),
      email.trim().toLowerCase(),
      hashedPassword
    );

    // create jwt token and send it back
    const token = signToken({ id: result.lastInsertRowid, name: name.trim(), email: email.trim().toLowerCase() });
    setTokenCookie(res, token);

    return res.status(201).json({
      message: 'Account created successfully!',
      user: { id: result.lastInsertRowid, name: name.trim(), email: email.trim().toLowerCase() },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
