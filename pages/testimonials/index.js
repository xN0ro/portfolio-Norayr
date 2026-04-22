import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Head from 'next/head';
import { fetchTestimonials, deleteTestimonial, clearTestimonialSuccess } from '../../store/testimonialsSlice';
import ProtectedRoute from '../../components/ProtectedRoute';

function TestimonialsPage() {
  const dispatch = useDispatch();
  const { list, loading, error, successMessage } = useSelector((state) => state.testimonials);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  // auto-hide success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => dispatch(clearTestimonialSuccess()), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      dispatch(deleteTestimonial(id));
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-CA', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  return (
    <>
      <Head>
        <title>Testimonials — Norayr Petrosyan</title>
      </Head>

      <section className="py-20 relative overflow-hidden">
        <div className="glow-orb" style={{ width: 400, height: 400, background: 'var(--secondary)', top: '-5%', left: '50%', transform: 'translateX(-50%)' }} />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 animate-slide-up">
            <div>
              <div className="section-label">Feedback</div>
              <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-2">
                <span style={{ color: 'var(--accent)' }}>Testimonials</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>Messages from visitors and colleagues</p>
            </div>
            <Link href="/testimonials/new" className="btn-primary shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Leave a Message
            </Link>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 rounded-lg text-sm animate-fade-in" style={{
              background: 'rgba(0,212,170,0.08)',
              border: '1px solid rgba(0,212,170,0.2)',
              color: 'var(--accent)',
            }}>
              {successMessage}
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-lg" style={{ color: 'var(--danger)' }}>{error}</p>
              <button onClick={() => dispatch(fetchTestimonials())} className="btn-secondary mt-4">Try Again</button>
            </div>
          )}

          {/* empty state when theres no testimonials yet */}
          {!loading && !error && list.length === 0 && (
            <div className="text-center py-20 glass-card p-12">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="font-heading font-bold text-xl mb-2">No testimonials yet</h3>
              <p className="mb-6" style={{ color: 'var(--text-muted)' }}>Be the first to leave a message!</p>
              <Link href="/testimonials/new" className="btn-primary">Write a Testimonial</Link>
            </div>
          )}

          {/* testimonials list */}
          {!loading && !error && list.length > 0 && (
            <div className="space-y-6">
              {list.map((t, i) => (
                <div key={t.id} className="glass-card p-6 sm:p-8 animate-slide-up"
                  style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      {/* avatar with color based on name */}
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm"
                        style={{
                          background: `hsl(${(t.author_name.charCodeAt(0) * 37) % 360}, 50%, 30%)`,
                          color: `hsl(${(t.author_name.charCodeAt(0) * 37) % 360}, 70%, 70%)`,
                        }}>
                        {t.author_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-heading font-semibold text-sm">{t.author_name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                          {formatDate(t.created_at)}
                          {t.updated_at !== t.created_at && ' (edited)'}
                        </p>
                      </div>
                    </div>

                    {/* only show edit/delete if its the users own testimonial */}
                    {user && user.id === t.user_id && (
                      <div className="flex items-center gap-2">
                        <Link href={`/testimonials/edit/${t.id}`}
                          className="p-2 rounded-lg transition-colors duration-200"
                          style={{ color: 'var(--text-muted)' }}
                          onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'rgba(0,212,170,0.08)'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                          title="Edit">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </Link>
                        <button onClick={() => handleDelete(t.id)}
                          className="p-2 rounded-lg transition-colors duration-200"
                          style={{ color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                          onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'rgba(255,68,102,0.08)'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                          title="Delete">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    &ldquo;{t.message}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function Testimonials() {
  return (
    <ProtectedRoute>
      <TestimonialsPage />
    </ProtectedRoute>
  );
}
