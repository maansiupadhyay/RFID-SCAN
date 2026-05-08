import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * This page handles the Google OAuth callback.
 * After Google auth, the server redirects here with:
 *   /auth/callback?token=ACCESS_TOKEN&name=User+Name&role=OPERATOR
 */
const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const name = searchParams.get('name');
    const role = searchParams.get('role');
    const error = searchParams.get('error');

    if (error) {
      navigate('/login?error=oauth_failed');
      return;
    }

    if (token && name) {
      loginWithToken(token, { name: decodeURIComponent(name), role: role || 'OPERATOR', email: '' });
      navigate('/dashboard');
    } else {
      navigate('/login?error=missing_token');
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
      <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
      <p style={{ color: 'var(--text-muted)' }}>Completing sign-in...</p>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default OAuthCallback;
