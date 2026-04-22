import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Head from 'next/head';
import { fetchProjects } from '../../store/projectsSlice';
import ProtectedRoute from '../../components/ProtectedRoute';

function ProjectsPage() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>Projects — Norayr Petrosyan</title>
      </Head>

      <section className="py-20 relative overflow-hidden">
        <div className="glow-orb" style={{ width: 400, height: 400, background: 'var(--accent)', top: '-10%', left: '50%', transform: 'translateX(-50%)' }} />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-slide-up">
            <div className="section-label justify-center">Portfolio</div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
              My <span style={{ color: 'var(--accent)' }}>Projects</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Real-world applications built to solve practical business problems, from dealership operations to web development.
            </p>
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-lg" style={{ color: 'var(--danger)' }}>{error}</p>
              <button onClick={() => dispatch(fetchProjects())} className="btn-secondary mt-4">
                Try Again
              </button>
            </div>
          )}

          {/* project cards */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((project, i) => (
                <Link href={`/projects/${project.slug}`} key={project.id}
                  className="glass-card overflow-hidden group animate-slide-up"
                  style={{ animationDelay: `${i * 0.1}s`, textDecoration: 'none' }}>
                  {/* image placeholder */}
                  <div className="h-48 overflow-hidden" style={{
                    background: 'linear-gradient(135deg, var(--dark-600), var(--dark-700))',
                  }}>
                    <div className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                      <span className="font-heading font-bold text-2xl" style={{
                        background: 'var(--gradient-accent)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        opacity: 0.4,
                      }}>
                        {project.title.split(' ').map(w => w[0]).join('')}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-heading font-bold text-lg mb-2 group-hover:text-accent-light transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm mb-4 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="tech-badge">{tech}</span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="tech-badge" style={{ opacity: 0.6 }}>
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function Projects() {
  return (
    <ProtectedRoute>
      <ProjectsPage />
    </ProtectedRoute>
  );
}
