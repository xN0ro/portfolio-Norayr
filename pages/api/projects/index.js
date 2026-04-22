import getDb from '../../../lib/db';
import { authMiddleware } from '../../../lib/auth';

function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = getDb();
    const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();

    // split the comma-separated technologies into an array
    const formatted = projects.map(p => ({
      ...p,
      technologies: p.technologies.split(',').map(t => t.trim()),
    }));

    return res.status(200).json({ projects: formatted });
  } catch (error) {
    console.error('Projects fetch error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

export default authMiddleware(handler);
