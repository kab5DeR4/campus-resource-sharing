import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Repeat,
  Mail,
  Lock,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

const DEMO_STUDENTS = [
  { name: 'Aarav (Lender/Borrower)', email: 'aarav@campus.edu' },
  { name: 'Priya (Student Requester)', email: 'priya@campus.edu' },
  { name: 'Rohan (Health Science)', email: 'rohan@campus.edu' },
  { name: 'Sneha (Applied Math)', email: 'sneha@campus.edu' },
];

export default function LoginPage({ onNavigate }) {
  const { login } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your university email and password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      addToast('Welcome back to CampusShare!', 'success');
      onNavigate('dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      addToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('demo123');
    setError(null);
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 68px - 100px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '920px',
          padding: 0,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* left banner: collegiate philosophy */}
        <div
          style={{
            backgroundColor: '#0c2820',
            color: '#e8f5ef',
            padding: '3rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                marginBottom: '2rem',
              }}
            >
              <div
                style={{
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                }}
              >
                <Repeat size={18} strokeWidth={2.4} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#ffffff', fontFamily: 'var(--font-display)' }}>
                Campus<span style={{ color: '#fde68a' }}>Share</span>
              </span>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.725rem',
                color: '#6ee7b7',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: '0.5rem',
              }}
            >
              AUTHENTICATED CAMPUS NODE
            </div>

            <h2
              style={{
                fontSize: '1.85rem',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.25,
                marginBottom: '1rem',
              }}
            >
              Keep learning gear accessible for all students.
            </h2>

            <p style={{ fontSize: '0.9rem', color: '#a3c2b8', lineHeight: 1.6 }}>
              Borrow lab coats, scientific calculators, and textbooks directly from classmates at your university without unnecessary expenses.
            </p>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8rem',
                color: '#8cb1a6',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <ShieldCheck size={16} style={{ color: '#10b981' }} />
              <span>Campus Verified Peer Network</span>
            </div>
          </div>
        </div>

        {/* right form */}
        <div style={{ padding: '3rem 2.5rem', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '0.35rem',
              }}
            >
              Log in to your account
            </h3>
            <p style={{ fontSize: '0.865rem', color: 'var(--text-secondary)' }}>
              Enter your student credentials to manage loans and listings
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: 'var(--status-danger-bg)',
                border: '1px solid var(--status-danger-border)',
                color: 'var(--status-danger-text)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.845rem',
                marginBottom: '1.25rem',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <Mail size={14} />
                <span>University Email</span>
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="name@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">
                <Lock size={14} />
                <span>Password</span>
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', gap: '0.45rem' }}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* quick test login persona chips */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div
              style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: 'var(--text-tertiary)',
                marginBottom: '0.65rem',
                textTransform: 'uppercase',
              }}
            >
              Quick Test Autofill (Password: demo123):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {DEMO_STUDENTS.map((demo) => (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() => handleQuickFill(demo.email)}
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.725rem',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.color = 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  {demo.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.865rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('register')}
              style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}
            >
              Create student account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
