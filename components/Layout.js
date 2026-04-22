import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-grid">
      <Header />
      <main className="flex-1" style={{ paddingTop: '72px' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
