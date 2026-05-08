import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, ArrowRight, Loader2, ScanLine, ShieldCheck,
  Chrome, AlertCircle, User, KeyRound, Eye, EyeOff, CheckCircle2
} from 'lucide-react';

const BACKEND_URL = 'https://rfid-scan-psjd.onrender.com';
console.log(BACKEND_URL);

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState('login'); // 'login' | 'register' | 'forgot'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [googleConfigured, setGoogleConfigured] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [forgotForm, setForgotForm] = useState({ email: '' });
  const [resetToken, setResetToken] = useState('');
  const [resetForm, setResetForm] = useState({ token: '', newPassword: '', confirmPassword: '' });

  const { login, loginWithToken, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
    const err = searchParams.get('error');
    const expired = searchParams.get('expired');
    if (err === 'oauth_failed') setError('Google Sign-In failed. Please try again.');
    if (err === 'oauth_not_configured') setError('Google OAuth is not configured on this server.');
    if (expired === 'true') setError('Your session expired. Please login again.');

    fetch(`${BACKEND_URL}/api/auth/oauth-status`)
      .then(r => r.json())
      .then(d => setGoogleConfigured(d?.data?.googleConfigured === true))
      .catch(() => setGoogleConfigured(false));
  }, []);

  const clearMessages = () => { setError(''); setSuccess(''); };

  // ─── Login ────────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); clearMessages();
    try {
      await login(loginForm.email, loginForm.password);
      navigate('/dashboard');
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  // ─── Register ─────────────────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    clearMessages();
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: registerForm.name, email: registerForm.email, password: registerForm.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      const { user, accessToken } = data.data;
      loginWithToken(accessToken, user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  // ─── Forgot Password ──────────────────────────────────────────────────────────
  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true); clearMessages();
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotForm.email }),
      });
      const data = await res.json();
      if (data.data?.resetToken) {
        setResetToken(data.data.resetToken);
        setResetForm(prev => ({ ...prev, token: data.data.resetToken }));
        setSuccess('Reset token generated! Copy it below and use it to set a new password.');
      } else {
        setSuccess('If that email exists, a reset token has been generated.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  // ─── Reset Password ───────────────────────────────────────────────────────────
  const handleReset = async (e) => {
    e.preventDefault();
    clearMessages();
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetForm.token, newPassword: resetForm.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reset failed');
      setSuccess('Password reset! You can now login with your new password.');
      setTimeout(() => { setTab('login'); clearMessages(); setResetToken(''); }, 2500);
    } catch (err) {
      setError(err.message || 'Reset failed');
    } finally { setLoading(false); }
  };

  const handleGoogleLogin = () => {
    if (!googleConfigured) {
      setError('Google OAuth is not configured. Set GOOGLE_CLIENT_ID in backend .env to enable.');
      return;
    }
    window.location.href = `${BACKEND_URL}/api/auth/google`;
  };

  const switchTab = (t) => { setTab(t); clearMessages(); setResetToken(''); };

  return (
    <div className="auth-page">
      <div className="auth-split">

        {/* ── Brand Panel ── */}
        <div className="auth-brand">
          <div className="brand-top">
            <ScanLine size={44} />
            <h1>RFID<span>Track</span></h1>
          </div>
          <p>Enterprise-grade asset tracking powered by intelligent RFID technology.</p>
          <ul className="feature-list">
            {['Secure JWT Authentication', 'Account Lockout Protection', 'Forgot Password Recovery', 'Role-Based Access Control', 'Google OAuth 2.0 Ready'].map(f => (
              <li key={f}><ShieldCheck size={15} /><span>{f}</span></li>
            ))}
          </ul>
        </div>

        {/* ── Form Panel ── */}
        <div className="auth-form-panel">
          <motion.div className="auth-card card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>

            {/* Tabs */}
            <div className="auth-tabs">
              <button className={tab === 'login' ? 'active' : ''} onClick={() => switchTab('login')}>Sign In</button>
              <button className={tab === 'register' ? 'active' : ''} onClick={() => switchTab('register')}>Create Account</button>
              <button className={tab === 'forgot' ? 'active' : ''} onClick={() => switchTab('forgot')}>Forgot Password</button>
            </div>

            {/* Google Button (login + register only) */}
            {tab !== 'forgot' && googleConfigured && (
              <>
                <button
                  className="google-btn"
                  onClick={handleGoogleLogin}
                  title="Continue with Google"
                >
                  <Chrome size={20} />
                  Continue with Google
                </button>
                <div className="divider"><span>or continue with email</span></div>
              </>
            )}

            {/* Error / Success Messages */}
            {error && <div className="msg error"><AlertCircle size={16} />{error}</div>}
            {success && <div className="msg success-msg"><CheckCircle2 size={16} />{success}</div>}

            <AnimatePresence mode="wait">

              {/* ── LOGIN FORM ── */}
              {tab === 'login' && (
                <motion.form key="login" onSubmit={handleLogin} className="auth-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Field label="Email" icon={<Mail size={17} />}>
                    <input type="email" placeholder="you@company.com" required value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} />
                  </Field>
                  <Field label="Password" icon={<Lock size={17} />} right={
                    <button type="button" className="toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }>
                    <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" required value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} />
                  </Field>
                  <SubmitBtn loading={loading} label="Sign In" />
                  <p className="switch-hint">Don't have an account? <button type="button" onClick={() => switchTab('register')}>Create one</button></p>
                </motion.form>
              )}

              {/* ── REGISTER FORM ── */}
              {tab === 'register' && (
                <motion.form key="register" onSubmit={handleRegister} className="auth-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Field label="Full Name" icon={<User size={17} />}>
                    <input type="text" placeholder="John Doe" required minLength={2} value={registerForm.name} onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })} />
                  </Field>
                  <Field label="Email" icon={<Mail size={17} />}>
                    <input type="email" placeholder="you@company.com" required value={registerForm.email} onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })} />
                  </Field>
                  <Field label="Password" icon={<Lock size={17} />} right={
                    <button type="button" className="toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }>
                    <input type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" required value={registerForm.password} onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })} />
                  </Field>
                  <Field label="Confirm Password" icon={<Lock size={17} />}>
                    <input type="password" placeholder="Repeat password" required value={registerForm.confirmPassword} onChange={e => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })} />
                  </Field>
                  <SubmitBtn loading={loading} label="Create Account" />
                  <p className="switch-hint">Already have an account? <button type="button" onClick={() => switchTab('login')}>Sign in</button></p>
                </motion.form>
              )}

              {/* ── FORGOT PASSWORD ── */}
              {tab === 'forgot' && !resetToken && (
                <motion.form key="forgot" onSubmit={handleForgot} className="auth-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p className="forgot-hint">Enter your registered email and we will generate a password reset token.</p>
                  <Field label="Email Address" icon={<Mail size={17} />}>
                    <input type="email" placeholder="you@company.com" required value={forgotForm.email} onChange={e => setForgotForm({ email: e.target.value })} />
                  </Field>
                  <SubmitBtn loading={loading} label="Generate Reset Token" />
                  <p className="switch-hint"><button type="button" onClick={() => switchTab('login')}>← Back to Sign In</button></p>
                </motion.form>
              )}

              {/* ── RESET PASSWORD (after token is shown) ── */}
              {tab === 'forgot' && resetToken && (
                <motion.form key="reset" onSubmit={handleReset} className="auth-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="token-display">
                    <label>Your Reset Token</label>
                    <code>{resetToken}</code>
                    <small>Paste this token below and set your new password.</small>
                  </div>
                  <Field label="Reset Token" icon={<KeyRound size={17} />}>
                    <input type="text" placeholder="Paste token here" required value={resetForm.token} onChange={e => setResetForm({ ...resetForm, token: e.target.value })} />
                  </Field>
                  <Field label="New Password" icon={<Lock size={17} />}>
                    <input type="password" placeholder="Min. 6 characters" required value={resetForm.newPassword} onChange={e => setResetForm({ ...resetForm, newPassword: e.target.value })} />
                  </Field>
                  <Field label="Confirm New Password" icon={<Lock size={17} />}>
                    <input type="password" placeholder="Repeat new password" required value={resetForm.confirmPassword} onChange={e => setResetForm({ ...resetForm, confirmPassword: e.target.value })} />
                  </Field>
                  <SubmitBtn loading={loading} label="Reset Password" />
                </motion.form>
              )}

            </AnimatePresence>

            {/* Security note */}
            <div className="auth-note">
              <ShieldCheck size={14} />
              <span>Accounts are locked after 5 failed login attempts for 30 minutes.</span>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .auth-page { min-height: calc(100vh - var(--header-height)); display: flex; }
        .auth-split { display: grid; grid-template-columns: 1fr 1fr; width: 100%; }

        /* Brand */
        .auth-brand {
          background: linear-gradient(150deg, #003ea5, #0077e6);
          color: white;
          padding: 4rem 3.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1.75rem;
        }
        .brand-top { display: flex; align-items: center; gap: 1rem; }
        .auth-brand h1 { font-size: 2.4rem; color: white; margin: 0; }
        .auth-brand h1 span { opacity: 0.6; }
        .auth-brand > p { font-size: 1.05rem; opacity: 0.85; line-height: 1.7; max-width: 360px; margin: 0; }
        .feature-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; }
        .feature-list li { display: flex; align-items: center; gap: 0.7rem; font-size: 0.9rem; opacity: 0.9; }

        /* Form panel */
        .auth-form-panel { background: var(--bg-soft); display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .auth-card { width: 100%; max-width: 440px; padding: 2rem 2.25rem; background: white; }

        /* Tabs */
        .auth-tabs {
          display: flex;
          background: var(--bg-soft);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 1.5rem;
          gap: 2px;
        }
        .auth-tabs button {
          flex: 1;
          padding: 0.55rem 0.25rem;
          border-radius: 9px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          background: transparent;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .auth-tabs button.active { background: white; color: var(--primary); box-shadow: 0 2px 8px rgba(0,0,0,0.06); }

        /* Google */
        .google-btn {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          padding: 0.8rem; border-radius: 12px; border: 1.5px solid var(--border);
          background: white; font-weight: 600; font-size: 0.9rem;
          cursor: pointer; transition: all 0.2s; position: relative;
        }
        .google-btn:not(.google-disabled):hover { border-color: var(--primary); background: var(--primary-light); transform: translateY(-1px); }
        .google-disabled { opacity: 0.55; cursor: not-allowed; background: var(--bg-soft); }
        .badge-nc {
          position: absolute; right: 10px; font-size: 0.6rem;
          background: #FEF3C7; color: #92400E; padding: 0.15rem 0.45rem;
          border-radius: 4px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
        }

        /* Divider */
        .divider { display: flex; align-items: center; gap: 0.75rem; margin: 1.25rem 0; color: var(--text-muted); font-size: 0.8rem; }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

        /* Messages */
        .msg { display: flex; align-items: flex-start; gap: 0.6rem; padding: 0.8rem; border-radius: 10px; font-size: 0.85rem; margin-bottom: 1rem; line-height: 1.5; }
        .msg svg { flex-shrink: 0; margin-top: 1px; }
        .msg.error { background: #FEE2E2; color: #991B1B; border: 1px solid #FCA5A5; }
        .msg.success-msg { background: #DCFCE7; color: #166534; border: 1px solid #86EFAC; }

        /* Form */
        .auth-form { display: flex; flex-direction: column; gap: 1.1rem; }
        .field-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .field-group label { font-size: 0.8375rem; font-weight: 500; }
        .field-wrap { position: relative; display: flex; align-items: center; }
        .field-wrap .fi { position: absolute; left: 11px; color: var(--text-muted); pointer-events: none; }
        .field-wrap input {
          width: 100%; padding: 0.7rem 0.9rem 0.7rem 2.35rem;
          border-radius: 10px; border: 1px solid var(--border); background: var(--bg-soft);
          font-size: 0.9rem; transition: all 0.2s;
        }
        .field-wrap input:focus { border-color: var(--primary); background: white; box-shadow: 0 0 0 3px var(--primary-light); outline: none; }
        .toggle-pw { position: absolute; right: 10px; background: none; color: var(--text-muted); cursor: pointer; display: flex; }

        /* Submit button */
        .submit-btn {
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          width: 100%; padding: 0.8rem; border-radius: 12px;
          background: var(--primary); color: white;
          font-weight: 700; font-size: 0.95rem;
          cursor: pointer; transition: all 0.2s; margin-top: 0.25rem;
        }
        .submit-btn:hover:not(:disabled) { background: #0052CC; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Switch hint */
        .switch-hint { font-size: 0.8125rem; color: var(--text-muted); text-align: center; margin-top: 0.25rem; }
        .switch-hint button { color: var(--primary); font-weight: 600; background: none; cursor: pointer; }

        /* Forgot hint */
        .forgot-hint { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem; line-height: 1.6; }

        /* Token display */
        .token-display {
          background: var(--bg-soft); border: 1px solid var(--border);
          border-radius: 12px; padding: 1rem; margin-bottom: 0.25rem;
        }
        .token-display label { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
        .token-display code {
          display: block; font-size: 0.78rem; word-break: break-all;
          color: var(--primary); background: white; border: 1px solid var(--border);
          border-radius: 8px; padding: 0.6rem; margin: 0.5rem 0;
          font-family: monospace;
        }
        .token-display small { font-size: 0.78rem; color: var(--text-muted); }

        /* Auth note */
        .auth-note {
          display: flex; align-items: flex-start; gap: 0.5rem;
          margin-top: 1.25rem; padding: 0.75rem;
          background: var(--primary-light); border-radius: 10px;
          font-size: 0.78rem; color: #0052CC;
          border: 1px solid rgba(0,102,255,0.12); line-height: 1.5;
        }
        .auth-note svg { flex-shrink: 0; margin-top: 1px; }

        @media (max-width: 768px) {
          .auth-split { grid-template-columns: 1fr; }
          .auth-brand { display: none; }
        }
      `}</style>
    </div>
  );
};

// ── Reusable Field component ──────────────────────────────────────────────────
const Field = ({ label, icon, children, right }) => (
  <div className="field-group">
    <label>{label}</label>
    <div className="field-wrap">
      <span className="fi">{icon}</span>
      {children}
      {right}
    </div>
  </div>
);

// ── Reusable Submit Button ────────────────────────────────────────────────────
const SubmitBtn = ({ loading, label }) => (
  <button type="submit" className="submit-btn" disabled={loading}>
    {loading ? <Loader2 size={20} className="spin" /> : <><span>{label}</span><ArrowRight size={17} /></>}
  </button>
);

export default LoginPage;
