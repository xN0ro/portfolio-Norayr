import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { registerUser, clearAuthErrors } from '../store/authSlice';
import { validateRegister } from '../lib/validators';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [clientErrors, setClientErrors] = useState({});
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, loading, fieldErrors, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) router.replace('/');
  }, [isAuthenticated, router]);

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
    const errors = validateRegister(form);
    if (errors) {
      setClientErrors(errors);
      return;
    }
    setClientErrors({});
    dispatch(registerUser(form));
  };

  const getError = (field) => clientErrors[field] || fieldErrors?.[field];

  return (
    <>
      <Head>
        <title>Register — Norayr Petrosyan</title>
      </Head>
      <div className="min-h-[85vh] flex items-center justify-center px-6 py-20 relative overflow-hidden">
        <div className="glow-orb" style={{ width: 400, height: 400, background: 'var(--secondary)', top: '5%', left: '10%' }} />
        <div className="glow-orb" style={{ width: 300, height: 300, background: 'var(--accent)', bottom: '5%', right: '10%' }} />

        <div className="w-full max-w-md relative z-10 animate-slide-up">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center font-heading font-bold text-lg"
              style={{ background: 'var(--gradient-accent)', color: 'var(--dark-900)' }}>
              NP
            </div>
            <h1 className="font-heading text-3xl font-bold mb-2">Create Account</h1>
            <p style={{ color: 'var(--text-muted)' }}>Register to explore the full portfolio</p>
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
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                  id="name" name="name" type="text"
                  value={form.name} onChange={handleChange}
                  placeholder="Your full name"
                  className={`form-input ${getError('name') ? 'error' : ''}`}
                  autoComplete="name"
                />
                {getError('name') && <p className="form-error">⚠ {getError('name')}</p>}
              </div>

              <div className="mb-5">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input
                  id="email" name="email" type="email"
                  value={form.email} onChange={handleChange}
                  placeholder="you@example.com"
                  className={`form-input ${getError('email') ? 'error' : ''}`}
                  autoComplete="email"
                />
                {getError('email') && <p className="form-error">⚠ {getError('email')}</p>}
              </div>

              <div className="mb-5">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  id="password" name="password" type="password"
                  value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className={`form-input ${getError('password') ? 'error' : ''}`}
                  autoComplete="new-password"
                />
                {getError('password') && <p className="form-error">⚠ {getError('password')}</p>}
              </div>

              <div className="mb-6">
                <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword" name="confirmPassword" type="password"
                  value={form.confirmPassword} onChange={handleChange}
                  placeholder="Repeat your password"
                  className={`form-input ${getError('confirmPassword') ? 'error' : ''}`}
                  autoComplete="new-password"
                />
                {getError('confirmPassword') && <p className="form-error">⚠ {getError('confirmPassword')}</p>}
              </div>

              <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: 'var(--dark-900)', borderTopColor: 'transparent' }} />
                    Creating account...
                  </span>
                ) : 'Create Account'}
              </button>
            </form>
          </div>

          <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
