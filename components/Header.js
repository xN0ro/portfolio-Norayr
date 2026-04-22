import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push('/login');
  };

  // show different nav links depending on if user is logged in or not
  const navLinks = isAuthenticated
    ? [
        { href: '/', label: 'Home' },
        { href: '/projects', label: 'Projects' },
        { href: '/testimonials', label: 'Testimonials' },
      ]
    : [
        { href: '/login', label: 'Login' },
        { href: '/register', label: 'Register' },
      ];

  const isActive = (href) => router.pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{
      background: 'rgba(10, 10, 15, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-heading font-bold text-sm"
            style={{ background: 'var(--gradient-accent)', color: 'var(--dark-900)' }}>
            NP
          </div>
          <span className="font-heading font-semibold text-base hidden sm:block" style={{ color: 'var(--text-primary)' }}>
            Norayr<span style={{ color: 'var(--accent)' }}>.</span>
          </span>
        </Link>

        {/* desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: isActive(link.href) ? 'var(--accent)' : 'var(--text-secondary)',
                background: isActive(link.href) ? 'rgba(0,212,170,0.08)' : 'transparent',
              }}>
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <button onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ml-2"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: 'var(--text-muted)',
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'transparent',
                cursor: 'pointer',
              }}>
              Logout
            </button>
          )}
        </nav>

        {/* hamburger menu for mobile */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-0.5 rounded transition-all duration-200"
            style={{
              background: 'var(--text-secondary)',
              transform: mobileOpen ? 'rotate(45deg) translate(2.5px, 4px)' : 'none',
            }} />
          <span className="block w-5 h-0.5 rounded transition-all duration-200"
            style={{
              background: 'var(--text-secondary)',
              opacity: mobileOpen ? 0 : 1,
            }} />
          <span className="block w-5 h-0.5 rounded transition-all duration-200"
            style={{
              background: 'var(--text-secondary)',
              transform: mobileOpen ? 'rotate(-45deg) translate(2.5px, -4px)' : 'none',
            }} />
        </button>
      </div>

      {/* mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <nav className="flex flex-col gap-1 pt-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium"
                style={{
                  color: isActive(link.href) ? 'var(--accent)' : 'var(--text-secondary)',
                  background: isActive(link.href) ? 'rgba(0,212,170,0.08)' : 'transparent',
                }}>
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="px-4 py-3 rounded-lg text-sm font-medium text-left"
                style={{ color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
