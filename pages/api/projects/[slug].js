import getDb from '../../../lib/db';
import { authMiddleware } from '../../../lib/auth';

function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.query;

  try {
    const db = getDb();
    const project = db.prepare('SELECT * FROM projects WHERE slug = ?').get(slug);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const formatted = {
      ...project,
      technologies: project.technologies.split(',').map(t => t.trim()),
    };

    return res.status(200).json({ project: formatted });
  } catch (error) {
    console.error('Project fetch error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

export default authMiddleware(handler);
