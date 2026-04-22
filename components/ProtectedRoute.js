import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

// this component wraps any page that needs auth
// if user isnt logged in, they get sent to /login
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, authChecked } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (authChecked && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authChecked, isAuthenticated, router]);

  // show spinner while we check the token
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--dark-900)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // dont show anything while redirecting
  }

  return children;
}
