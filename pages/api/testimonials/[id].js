import getDb from '../../../lib/db';
import { authMiddleware } from '../../../lib/auth';
import { validateTestimonial } from '../../../lib/validators';

function handler(req, res) {
  const db = getDb();
  const { id } = req.query;

  // get single testimonial
  if (req.method === 'GET') {
    try {
      const testimonial = db.prepare(`
        SELECT t.*, u.name as author_name, u.email as author_email
        FROM testimonials t
        JOIN users u ON t.user_id = u.id
        WHERE t.id = ?
      `).get(id);

      if (!testimonial) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }
      return res.status(200).json({ testimonial });
    } catch (error) {
      console.error('Testimonial fetch error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // update testimonial - only the person who wrote it can edit
  if (req.method === 'PUT') {
    const { message } = req.body;

    const errors = validateTestimonial({ message });
    if (errors) {
      return res.status(400).json({ errors });
    }

    try {
      const existing = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(id);
      if (!existing) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }
      if (existing.user_id !== req.user.id) {
        return res.status(403).json({ error: 'You can only edit your own testimonials.' });
      }

      db.prepare('UPDATE testimonials SET message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(
        message.trim(), id
      );

      const updated = db.prepare(`
        SELECT t.*, u.name as author_name, u.email as author_email
        FROM testimonials t
        JOIN users u ON t.user_id = u.id
        WHERE t.id = ?
      `).get(id);

      return res.status(200).json({ message: 'Testimonial updated!', testimonial: updated });
    } catch (error) {
      console.error('Testimonial update error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // delete - also only by the author
  if (req.method === 'DELETE') {
    try {
      const existing = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(id);
      if (!existing) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }
      if (existing.user_id !== req.user.id) {
        return res.status(403).json({ error: 'You can only delete your own testimonials.' });
      }

      db.prepare('DELETE FROM testimonials WHERE id = ?').run(id);
      return res.status(200).json({ message: 'Testimonial deleted' });
    } catch (error) {
      console.error('Testimonial delete error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default authMiddleware(handler);
