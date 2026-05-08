import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ScanLine, ShieldCheck, Database, BarChart3, ArrowRight, Zap, Globe, Cpu } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="container nav-container">
          <div className="nav-brand">
            <ScanLine size={32} className="nav-logo" />
            <span>RFIDTrack</span>
          </div>
          <div className="nav-links">
            <Link to="/login" className="btn btn-ghost">Sign In</Link>
            <Link to="/login?mode=register" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="hero-badge">Smart RFID Solutions</span>
              <h1>Helping Enterprises <span className="text-gradient">Reimagine</span> Their Business</h1>
              <p>
                Professional-grade industrial RFID tracking and inventory management.
                Gain real-time visibility into your tool ecosystem with smart IoT integration.
              </p>
              <div className="hero-btns">
                <Link to="/login?mode=register" className="btn btn-primary btn-large">
                  Start Free Trial <ArrowRight size={20} />
                </Link>
                <Link to="/login" className="btn btn-outline btn-large">
                  Sign In
                </Link>
                <Link to="/login" className="btn btn-outline btn-large">
                  View Demo
                </Link>
              </div>
            </motion.div>
          </div>
          <div className="hero-visual">
            <motion.div
              className="visual-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="scan-animation">
                <ScanLine size={120} className="scanner-icon" />
                <div className="scan-line"></div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Enterprise-Grade Features</h2>
            <p>Designed for scalability and industrial reliability.</p>
          </div>
          <div className="feature-grid">
            {[
              { icon: Database, title: 'Centralized Inventory', desc: 'Manage thousands of tools across multiple zones with ease.' },
              { icon: ShieldCheck, title: 'Secure Auditing', desc: 'Every transaction is logged with precise timestamps and user data.' },
              { icon: ScanLine, title: 'RFID Intelligence', desc: 'Simulate batch scanning and identify missing assets automatically.' },
              { icon: BarChart3, title: 'Real-time Analytics', desc: 'Visual dashboards for immediate insights into inventory health.' },
              { icon: Zap, title: 'Instant Processing', desc: 'High-speed backend architecture designed for low latency.' },
              { icon: Globe, title: 'Multi-Location', desc: 'Track assets across different warehouses and sites globally.' }
            ].map((f, i) => (
              <motion.div
                key={i}
                className="feature-card card"
                whileHover={{ y: -10 }}
              >
                <div className="feature-icon"><f.icon size={28} /></div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .landing-page {
          background: white;
        }
        .landing-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          z-index: 1000;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
        }
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-main);
        }
        .nav-logo { color: var(--primary); }
        .nav-links { display: flex; gap: 1rem; align-items: center; }
        .btn-ghost {
          padding: 0.6rem 1.2rem;
          color: var(--text-main);
          font-weight: 600;
          border-radius: 10px;
          transition: all 0.2s;
        }
        .btn-ghost:hover { background: var(--bg-soft); }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .hero {
          padding: 8rem 0;
          background: radial-gradient(circle at top right, var(--primary-light), transparent);
          overflow: hidden;
        }
        .hero .container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 4rem;
        }
        .hero-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: var(--primary-light);
          color: var(--primary);
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }
        .hero h1 {
          font-size: 4rem;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -1px;
        }
        .text-gradient {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero p {
          font-size: 1.25rem;
          color: var(--text-muted);
          margin-bottom: 2.5rem;
          max-width: 500px;
        }
        .hero-btns {
          display: flex;
          gap: 1rem;
        }
        .btn-large {
          padding: 1rem 2rem;
          font-size: 1.125rem;
        }
        .visual-card {
          background: white;
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
          border: 1px solid var(--border);
          position: relative;
        }
        .scan-animation {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
          position: relative;
        }
        .scanner-icon {
          color: var(--primary);
        }
        .scan-line {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 150px;
          height: 2px;
          background: var(--primary);
          box-shadow: 0 0 15px var(--primary);
          animation: scan 3s infinite ease-in-out;
        }
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
        .visual-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .v-stat {
          display: flex;
          flex-direction: column;
        }
        .v-label {
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .v-value {
          font-size: 1.5rem;
          font-weight: 700;
        }
        .features {
          padding: 8rem 0;
          background: var(--bg-soft);
        }
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .section-header h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .feature-card {
          padding: 2.5rem;
          background: white;
        }
        .feature-icon {
          width: 56px;
          height: 56px;
          background: var(--primary-light);
          color: var(--primary);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .feature-card h3 {
          margin-bottom: 1rem;
        }
        .feature-card p {
          color: var(--text-muted);
          line-height: 1.6;
        }

        @media (max-width: 1024px) {
          .hero .container { grid-template-columns: 1fr; text-align: center; }
          .hero p { margin-left: auto; margin-right: auto; }
          .hero-btns { justify-content: center; }
          .feature-grid { grid-template-columns: repeat(2, 1fr); }
          .hero h1 { font-size: 3rem; }
        }
        @media (max-width: 768px) {
          .feature-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
