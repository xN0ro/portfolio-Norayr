import getDb from '../../../lib/db';
import { authMiddleware } from '../../../lib/auth';
import { validateTestimonial } from '../../../lib/validators';

function handler(req, res) {
  const db = getDb();

  // get all testimonials
  if (req.method === 'GET') {
    try {
      const testimonials = db.prepare(`
        SELECT t.*, u.name as author_name, u.email as author_email
        FROM testimonials t
        JOIN users u ON t.user_id = u.id
        ORDER BY t.created_at DESC
      `).all();

      return res.status(200).json({ testimonials });
    } catch (error) {
      console.error('Testimonials fetch error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // create a new testimonial
  if (req.method === 'POST') {
    const { message } = req.body;

    const errors = validateTestimonial({ message });
    if (errors) {
      return res.status(400).json({ errors });
    }

    try {
      const result = db.prepare(
        'INSERT INTO testimonials (user_id, author_name, message) VALUES (?, ?, ?)'
      ).run(req.user.id, req.user.name, message.trim());

      const testimonial = db.prepare(`
        SELECT t.*, u.name as author_name, u.email as author_email
        FROM testimonials t
        JOIN users u ON t.user_id = u.id
        WHERE t.id = ?
      `).get(result.lastInsertRowid);

      return res.status(201).json({ message: 'Testimonial created!', testimonial });
    } catch (error) {
      console.error('Testimonial create error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default authMiddleware(handler);
