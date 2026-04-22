import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { loginUser, clearAuthErrors } from '../store/authSlice';
import { validateLogin } from '../lib/validators';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [clientErrors, setClientErrors] = useState({});
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, loading, fieldErrors, error } = useSelector((state) => state.auth);

  // if already logged in, go to home
  useEffect(() => {
    if (isAuthenticated) router.replace('/');
  }, [isAuthenticated, router]);

  // cleanup errors when leaving the page
  useEffect(() => {
    return () => dispatch(clearAuthErrors());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setClientErrors({ ...clientErrors, [e.target.name]: null });
    if (fieldErrors) dispatch(clearAuthErrors());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate on client side first
    const errors = validateLogin(form);
    if (errors) {
      setClientErrors(errors);
      return;
    }
    setClientErrors({});
    dispatch(loginUser(form));
  };

  // shows either client-side or server-side error for a field
  const getError = (field) => clientErrors[field] || fieldErrors?.[field];

  return (
    <>
      <Head>
        <title>Login — Norayr Petrosyan</title>
      </Head>
      <div className="min-h-[85vh] flex items-center justify-center px-6 py-20 relative overflow-hidden">
        <div className="glow-orb" style={{ width: 400, height: 400, background: 'var(--accent)', top: '10%', right: '10%' }} />
        <div className="glow-orb" style={{ width: 300, height: 300, background: 'var(--secondary)', bottom: '10%', left: '10%' }} />

        <div className="w-full max-w-md relative z-10 animate-slide-up">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center font-heading font-bold text-lg"
              style={{ background: 'var(--gradient-accent)', color: 'var(--dark-900)' }}>
              NP
            </div>
            <h1 className="font-heading text-3xl font-bold mb-2">Welcome Back</h1>
            <p style={{ color: 'var(--text-muted)' }}>Sign in to access the portfolio</p>
          </div>

          <div className="glass-card p-8">
            {error && (
              <div className="mb-6 p-4 rounded-lg text-sm" style={{
                background: 'rgba(255,68,102,0.08)',
                border: '1px solid rgba(255,68,102,0.2)',
                color: 'var(--danger)',
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-5">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`form-input ${getError('email') ? 'error' : ''}`}
                  autoComplete="email"
                />
                {getError('email') && <p className="form-error">⚠ {getError('email')}</p>}
              </div>

              <div className="mb-6">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`form-input ${getError('password') ? 'error' : ''}`}
                  autoComplete="current-password"
                />
                {getError('password') && <p className="form-error">⚠ {getError('password')}</p>}
              </div>

              <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: 'var(--dark-900)', borderTopColor: 'transparent' }} />
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
