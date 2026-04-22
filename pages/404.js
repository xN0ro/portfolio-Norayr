import Link from 'next/link';
import Head from 'next/head';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 — Page Not Found</title>
      </Head>
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center animate-slide-up">
          <h1 className="font-heading font-bold text-8xl mb-4" style={{
            background: 'var(--gradient-accent)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            404
          </h1>
          <p className="text-xl mb-2 font-heading font-semibold">Page Not Found</p>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/" className="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
