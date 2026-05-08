import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import OAuthCallback from './pages/OAuthCallback';
import Dashboard from './pages/Dashboard';
import ToolManagement from './pages/ToolManagement';
import IssueReturn from './pages/IssueReturn';
import RFIDScanner from './pages/RFIDScanner';
import TransactionHistory from './pages/TransactionHistory';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const { loading } = useAuth();
  const location = useLocation();
  if (loading) return null;

  return (
    <div className="app-container">
      <Navbar />
      <main className={location.pathname === '/' ? '' : 'main-content'}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/tools" element={<ProtectedRoute><ToolManagement /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><IssueReturn /></ProtectedRoute>} />
          <Route path="/scanner" element={<ProtectedRoute><RFIDScanner /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
        </Routes>
      </main>

      {location.pathname === '/' && (
        <footer className="landing-footer">
          <div className="footer-content">
            <p>&copy; 2024 RFIDTrack Enterprise. All rights reserved.</p>
          </div>
        </footer>
      )}

      <style>{`
        .landing-footer {
          background: var(--text-main);
          color: white;
          padding: 3rem 0;
          text-align: center;
          font-size: 0.875rem;
        }
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}

export default App;
