import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { createTestimonial, clearTestimonialErrors, clearTestimonialSuccess } from '../../store/testimonialsSlice';
import { validateTestimonial } from '../../lib/validators';
import ProtectedRoute from '../../components/ProtectedRoute';

function NewTestimonialPage() {
  const [message, setMessage] = useState('');
  const [clientError, setClientError] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, fieldErrors, error, successMessage } = useSelector((state) => state.testimonials);

  useEffect(() => {
    return () => {
      dispatch(clearTestimonialErrors());
      dispatch(clearTestimonialSuccess());
    };
  }, [dispatch]);

  // redirect to list after creating
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => router.push('/testimonials'), 1500);
      return () => clearTimeout(timer);
    }
  }, [successMessage, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateTestimonial({ message });
    if (errors) {
      setClientError(errors.message);
      return;
    }
    setClientError(null);
    dispatch(createTestimonial({ message }));
  };

  const getError = () => clientError || fieldErrors?.message;

  return (
    <>
      <Head>
        <title>Leave a Testimonial — Norayr Petrosyan</title>
      </Head>

      <section className="py-20 relative overflow-hidden">
        <div className="glow-orb" style={{ width: 350, height: 350, background: 'var(--accent)', top: '10%', right: '10%' }} />

        <div className="max-w-2xl mx-auto px-6 relative z-10">
          <Link href="/testimonials"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors duration-200 animate-fade-in"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Testimonials
          </Link>

          <div className="animate-slide-up">
            <div className="section-label">New Message</div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-3">
              Leave a <span style={{ color: 'var(--accent)' }}>Testimonial</span>
            </h1>
            <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
              Share your thoughts, feedback, or a kind word. Your message will be publicly visible.
            </p>

            {successMessage && (
              <div className="mb-6 p-4 rounded-lg text-sm animate-fade-in" style={{
                background: 'rgba(0,212,170,0.08)',
                border: '1px solid rgba(0,212,170,0.2)',
                color: 'var(--accent)',
              }}>
                {successMessage} Redirecting...
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-lg text-sm" style={{
                background: 'rgba(255,68,102,0.08)',
                border: '1px solid rgba(255,68,102,0.2)',
                color: 'var(--danger)',
              }}>
                {error}
              </div>
            )}

            <div className="glass-card p-8">
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-6">
                  <label className="form-label" htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => { setMessage(e.target.value); setClientError(null); }}
                    placeholder="Write your testimonial here... (min. 10 characters)"
                    className={`form-input ${getError() ? 'error' : ''}`}
                    rows={5}
                  />
                  <div className="flex justify-between items-start mt-2">
                    <div>{getError() && <p className="form-error">⚠ {getError()}</p>}</div>
                    <span className="text-xs" style={{
                      color: message.length > 1000 ? 'var(--danger)' : 'var(--text-muted)',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {message.length}/1000
                    </span>
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full justify-center" disabled={loading || !!successMessage}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                        style={{ borderColor: 'var(--dark-900)', borderTopColor: 'transparent' }} />
                      Submitting...
                    </span>
                  ) : 'Submit Testimonial'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function NewTestimonial() {
  return (
    <ProtectedRoute>
      <NewTestimonialPage />
    </ProtectedRoute>
  );
}
