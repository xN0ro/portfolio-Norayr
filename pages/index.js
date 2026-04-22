import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import ProtectedRoute from '../components/ProtectedRoute';
import Head from 'next/head';

const skills = [
  'JavaScript', 'HTML', 'CSS', 'React', 'Next.js', 'Node.js', 'Express',
  'SQLite', 'SQL', 'Redux Toolkit', 'REST APIs', 'Authentication Systems',
  'Responsive Web Design', 'Git / GitHub', 'Technical Support',
  'Troubleshooting', 'Microsoft Office', 'Bilingual (FR / EN)',
];

const highlights = [
  { number: '3+', label: 'Years in Sales', icon: '📊' },
  { number: '5+', label: 'Tech Projects', icon: '💻' },
  { number: '2', label: 'Languages', icon: '🌐' },
  { number: '∞', label: 'Curiosity', icon: '🚀' },
];

function HomePage() {
  const { user } = useSelector((state) => state.auth);
  const observerRef = useRef(null);

  // intersection observer for the scroll-in animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>Norayr Petrosyan — Portfolio</title>
        <meta name="description" content="Portfolio of Norayr Petrosyan — Sales professional and developer" />
      </Head>

      {/* hero section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="glow-orb" style={{ width: 500, height: 500, background: 'var(--accent)', top: '-10%', right: '-5%' }} />
        <div className="glow-orb" style={{ width: 400, height: 400, background: 'var(--secondary)', bottom: '0%', left: '-5%' }} />

        <div className="max-w-6xl mx-auto px-6 py-20 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label animate-fade-in">Portfolio</div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up"
                style={{ lineHeight: 1.1 }}>
                Hi{user ? `, ${user.name.split(' ')[0]}` : ''}! I&apos;m{' '}
                <span style={{ background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Norayr
                </span>
              </h1>
              <p className="text-lg mb-8 leading-relaxed animate-slide-up" style={{ color: 'var(--text-secondary)', animationDelay: '0.15s' }}>
                Sales professional at Toyota Gatineau with strong experience in customer service,
                communication, and technology. Computer Programming student at La Cité, building
                practical web apps and tech solutions that solve real business problems.
              </p>
              <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <Link href="/projects" className="btn-primary">
                  View Projects
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
                <Link href="/testimonials" className="btn-secondary">
                  Testimonials
                </Link>
              </div>
            </div>

            {}
            <div className="flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden animate-glow-pulse"
                  style={{
                    background: 'var(--dark-700)',
                    border: '2px solid rgba(0,212,170,0.15)',
                  }}>
                  <div className="w-full h-full flex items-center justify-center"
  style={{
    background: 'linear-gradient(135deg, var(--dark-600), var(--dark-700))',
  }}>
  <img src="/images/project.jpg" alt="Norayr Petrosyan" 
    className="w-full h-full object-cover" />
</div>
                </div>
                {/* decorative corners */}
                <div className="absolute -bottom-3 -right-3 w-20 h-20 rounded-xl"
                  style={{ border: '2px solid rgba(124, 92, 252, 0.2)' }} />
                <div className="absolute -top-3 -left-3 w-12 h-12 rounded-lg"
                  style={{ border: '2px solid rgba(0, 212, 170, 0.2)' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* quick stats */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {highlights.map((item, i) => (
              <div key={i}
                className="glass-card p-6 text-center animate-on-scroll"
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-heading font-bold text-2xl mb-1" style={{ color: 'var(--accent)' }}>
                  {item.number}
                </div>
                <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* about me */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="section-label animate-on-scroll">About Me</div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-6 animate-on-scroll">
              Where <span style={{ color: 'var(--accent)' }}>Business</span> Meets <span style={{ color: 'var(--secondary)' }}>Code</span>
            </h2>
            <div className="space-y-4 animate-on-scroll" style={{ color: 'var(--text-secondary)' }}>
              <p>
                I bring a unique perspective to technology — one shaped by years of face-to-face customer
                interaction in the automotive industry. At Toyota Gatineau, I&apos;ve developed strong skills
                in communication, problem-solving, and understanding client needs.
              </p>
              <p>
                As a Computer Programming student at La Cité, I&apos;m channeling that business experience
                into building practical, user-focused web applications. My projects are driven by real-world
                needs — from dealership queue management systems to internal IT solutions.
              </p>
              <p>
                I&apos;m bilingual (French &amp; English), detail-oriented, and passionate about creating
                technology that makes workflows smoother and businesses more efficient.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* skills */}
      <section className="py-20" style={{ background: 'var(--dark-800)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="section-label justify-center animate-on-scroll">Skills &amp; Tools</div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold animate-on-scroll">
              My <span style={{ color: 'var(--accent)' }}>Toolkit</span>
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {skills.map((skill, i) => (
              <span key={skill}
                className="skill-pill animate-on-scroll"
                style={{ transitionDelay: `${i * 0.03}s` }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* cta at the bottom */}
      <section className="py-24 relative overflow-hidden">
        <div className="glow-orb" style={{ width: 400, height: 400, background: 'var(--accent)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4 animate-on-scroll">
            Want to see what I&apos;ve built?
          </h2>
          <p className="text-lg mb-8 animate-on-scroll" style={{ color: 'var(--text-secondary)' }}>
            Check out my projects or leave a testimonial.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-on-scroll">
            <Link href="/projects" className="btn-primary">Explore Projects</Link>
            <Link href="/testimonials/new" className="btn-secondary">Leave a Testimonial</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}
