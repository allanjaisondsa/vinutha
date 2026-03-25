import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import './styles/Auth.css';

export default function Register() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card card">
          <h2 className="auth-title">Invalid Link</h2>
          <p className="auth-sub">This registration link is missing or invalid. Please ask the owner for a new invite.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password must be at least 6 characters');

    setLoading(true);
    try {
      // Server sets HTTP-only cookie automatically. Just refresh user state.
      await api.post('/auth/register', { token, password });
      await refreshUser();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-logo">
          <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="The Resartz Studio" />
        </div>
        <h2 className="auth-title">Set Your Password</h2>
        <p className="auth-sub">Create a password to activate your account</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 characters" required />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat your password" required />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Activate My Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
