import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Wrench, ArrowLeftRight, ScanLine, History, LogOut, ChevronDown, User, Layers } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, desc: 'Overview of all assets' },
    ...(user?.role === 'ADMIN' ? [{ name: 'Inventory', path: '/tools', icon: Wrench, desc: 'Manage your tool list' }] : []),
    { name: 'Issue/Return', path: '/transactions', icon: ArrowLeftRight, desc: 'Track tool movements' },
    { name: 'RFID Scanner', path: '/scanner', icon: ScanLine, desc: 'Run batch inventory scans' },
    { name: 'History', path: '/history', icon: History, desc: 'Full transaction logs' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated && location.pathname === '/') return null;

  const activeItem = navItems.find(item => item.path === location.pathname) || navItems[0];

  return (
    <nav className="minimal-nav">
      <div className="nav-wrapper">
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <div className="logo-box">
              <ScanLine size={20} />
            </div>
            <span>RFID<span className="weight-light">Track</span></span>
          </Link>

          {isAuthenticated && (
            <div className="nav-menu-container" ref={dropdownRef}>
              <button 
                className={`menu-trigger ${isDropdownOpen ? 'active' : ''}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Layers size={18} />
                <span className="trigger-text">Explore System</span>
                <ChevronDown size={14} className={`chevron ${isDropdownOpen ? 'rotate' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    className="nav-dropdown card"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <div className="dropdown-grid">
                      {navItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`dropdown-item ${location.pathname === item.path ? 'active' : ''}`}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="item-icon">
                            <item.icon size={20} />
                          </div>
                          <div className="item-text">
                            <span className="item-name">{item.name}</span>
                            <span className="item-desc">{item.desc}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {isAuthenticated && (
          <div className="nav-right">
            <div className="user-pill">
              <div className="user-avatar">
                <User size={16} />
              </div>
              <div className="user-meta">
                <span className="u-name">{user?.name}</span>
                <span className="u-role">{user?.role}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="exit-btn" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .minimal-nav {
          height: 70px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 2000;
          width: 100%;
        }
        .nav-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
        }
        .nav-left, .nav-right {
          display: flex;
          align-items: center;
          gap: 2.5rem;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          font-weight: 800;
          color: #1e293b;
          text-decoration: none;
        }
        .logo-box {
          width: 36px;
          height: 36px;
          background: var(--primary);
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
        }
        .weight-light { font-weight: 300; color: var(--primary); }

        /* Menu Trigger */
        .nav-menu-container { position: relative; }
        .menu-trigger {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 1.2rem;
          background: #f1f5f9;
          border: 1px solid transparent;
          border-radius: 12px;
          color: #475569;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }
        .menu-trigger:hover, .menu-trigger.active {
          background: white;
          border-color: var(--primary);
          color: var(--primary);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .chevron { transition: transform 0.3s ease; }
        .chevron.rotate { transform: rotate(180deg); }

        /* Dropdown Card */
        .nav-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          left: 0;
          width: 320px;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 20px;
          padding: 1rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          overflow: hidden;
        }
        .dropdown-grid { display: flex; flex-direction: column; gap: 0.5rem; }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem;
          border-radius: 12px;
          text-decoration: none;
          color: #64748b;
          transition: all 0.2s ease;
        }
        .dropdown-item:hover {
          background: #f8fafc;
          color: var(--primary);
        }
        .dropdown-item.active {
          background: var(--primary-light);
          color: var(--primary);
        }
        .item-icon {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        }
        .item-text { display: flex; flex-direction: column; }
        .item-name { font-weight: 700; font-size: 0.95rem; }
        .item-desc { font-size: 0.75rem; opacity: 0.8; }

        /* User Pill */
        .user-pill {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: white;
          padding: 0.4rem 1rem 0.4rem 0.4rem;
          border-radius: 999px;
          border: 1px solid var(--border);
        }
        .user-avatar {
          width: 30px;
          height: 30px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .user-meta { display: flex; flex-direction: column; }
        .u-name { font-size: 0.8rem; font-weight: 700; color: #1e293b; }
        .u-role { font-size: 0.65rem; font-weight: 600; text-transform: uppercase; color: var(--text-muted); }
        .exit-btn { background: transparent; color: #94a3b8; }
        .exit-btn:hover { color: var(--error); }

        @media (max-width: 768px) {
          .trigger-text, .user-meta { display: none; }
          .nav-wrapper { padding: 0 1rem; }
          .nav-dropdown { width: 280px; left: -50px; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
