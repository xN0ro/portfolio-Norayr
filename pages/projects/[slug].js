import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Head from 'next/head';
import { fetchProjectBySlug, clearCurrentProject } from '../../store/projectsSlice';
import ProtectedRoute from '../../components/ProtectedRoute';

function ProjectDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const dispatch = useDispatch();
  const { current: project, loading, error } = useSelector((state) => state.projects);

  useEffect(() => {
    if (slug) dispatch(fetchProjectBySlug(slug));
    return () => dispatch(clearCurrentProject());
  }, [slug, dispatch]);

  return (
    <>
      <Head>
        <title>{project ? `${project.title} — ` : ''}Norayr Petrosyan</title>
      </Head>

      <section className="py-20 relative overflow-hidden">
        <div className="glow-orb" style={{ width: 400, height: 400, background: 'var(--accent)', top: '5%', right: '5%' }} />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link href="/projects"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors duration-200 animate-fade-in"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Projects
          </Link>

          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-lg" style={{ color: 'var(--danger)' }}>{error}</p>
              <Link href="/projects" className="btn-secondary mt-4 inline-flex">Back to Projects</Link>
            </div>
          )}

          {!loading && project && (
            <div className="animate-slide-up">
              {/* project banner */}
              <div className="rounded-2xl overflow-hidden mb-10 h-64 sm:h-80"
                style={{
                  background: 'linear-gradient(135deg, var(--dark-600), var(--dark-700))',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}>
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-heading font-bold text-5xl" style={{
                    background: 'var(--gradient-accent)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    opacity: 0.3,
                  }}>
                    {project.title.split(' ').map(w => w[0]).join('')}
                  </span>
                </div>
              </div>

              <div className="section-label">Project</div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-4">{project.title}</h1>
              <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
                {project.description}
              </p>

              {/* tech stack */}
              <div className="mb-10">
                <h3 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4"
                  style={{ color: 'var(--text-muted)' }}>
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="tech-badge">{tech}</span>
                  ))}
                </div>
              </div>

              <div className="divider" />

              {/* full description */}
              <div>
                <h3 className="font-heading font-semibold text-xl mb-4" style={{ color: 'var(--accent)' }}>
                  Project Details
                </h3>
                <div className="space-y-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  {project.long_description?.split('. ').reduce((acc, sentence, i, arr) => {
                    const groupIdx = Math.floor(i / 3);
                    if (!acc[groupIdx]) acc[groupIdx] = '';
                    acc[groupIdx] += sentence + (i < arr.length - 1 ? '. ' : '');
                    return acc;
                  }, []).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              {/* links to github / live site */}
              {(project.github_url || project.live_url) && (
                <>
                  <div className="divider" />
                  <div className="flex flex-wrap gap-4">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        View on GitHub
                      </a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                        </svg>
                        Live Demo
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function ProjectDetail() {
  return (
    <ProtectedRoute>
      <ProjectDetailPage />
    </ProtectedRoute>
  );
}
