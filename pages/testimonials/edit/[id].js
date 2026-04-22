import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import {
  fetchTestimonialById,
  updateTestimonial,
  clearTestimonialErrors,
  clearTestimonialSuccess,
  clearCurrentTestimonial,
} from '../../../store/testimonialsSlice';
import { validateTestimonial } from '../../../lib/validators';
import ProtectedRoute from '../../../components/ProtectedRoute';

function EditTestimonialPage() {
  const [message, setMessage] = useState('');
  const [clientError, setClientError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { current, loading, fieldErrors, error, successMessage } = useSelector((state) => state.testimonials);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) dispatch(fetchTestimonialById(id));
    return () => {
      dispatch(clearCurrentTestimonial());
      dispatch(clearTestimonialErrors());
      dispatch(clearTestimonialSuccess());
    };
  }, [id, dispatch]);

  // fill in the form with existing data once it loads
  useEffect(() => {
    if (current && !loaded) {
      setMessage(current.message);
      setLoaded(true);
    }
  }, [current, loaded]);

  // dont let users edit someone elses testimonial
  useEffect(() => {
    if (current && user && current.user_id !== user.id) {
      router.replace('/testimonials');
    }
  }, [current, user, router]);

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
    dispatch(updateTestimonial({ id, message }));
  };

  const getError = () => clientError || fieldErrors?.message;

  return (
    <>
      <Head>
        <title>Edit Testimonial — Norayr Petrosyan</title>
      </Head>

      <section className="py-20 relative overflow-hidden">
        <div className="glow-orb" style={{ width: 350, height: 350, background: 'var(--secondary)', top: '10%', left: '10%' }} />

        <div className="max-w-2xl mx-auto px-6 relative z-10">
          <Link href="/testimonials"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors duration-200"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Testimonials
          </Link>

          {loading && !loaded && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
            </div>
          )}

          {loaded && (
            <div className="animate-slide-up">
              <div className="section-label">Edit</div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-3">
                Edit Your <span style={{ color: 'var(--accent)' }}>Testimonial</span>
              </h1>
              <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
                Update your message below.
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

                  <div className="flex gap-4">
                    <button type="submit" className="btn-primary flex-1 justify-center" disabled={loading || !!successMessage}>
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                            style={{ borderColor: 'var(--dark-900)', borderTopColor: 'transparent' }} />
                          Saving...
                        </span>
                      ) : 'Save Changes'}
                    </button>
                    <Link href="/testimonials" className="btn-secondary justify-center">Cancel</Link>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function EditTestimonial() {
  return (
    <ProtectedRoute>
      <EditTestimonialPage />
    </ProtectedRoute>
  );
}
