import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Repeat,
  Mail,
  Lock,
  User,
  GraduationCap,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const CAMPUSES = ['Main Tech Campus', 'North Health & Science', 'South Arts & Design'];

export default function RegisterPage({ onNavigate }) {
  const { register } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [campus, setCampus] = useState(CAMPUSES[0]);
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill out all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        campus,
        department: department.trim(),
      });
      addToast('Student account created successfully!', 'success');
      onNavigate('dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
      addToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
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
          maxWidth: '960px',
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
              JOIN YOUR UNIVERSITY NODE
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
              Your campus peer borrowing network awaits.
            </h2>

            <p style={{ fontSize: '0.9rem', color: '#a3c2b8', lineHeight: 1.6 }}>
              Connect with verified students across your academic departments. List equipment you don't need this term or borrow required course tools for free.
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
              <span>Instant Verification for Campus Emails</span>
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
              Create Student Account
            </h3>
            <p style={{ fontSize: '0.865rem', color: 'var(--text-secondary)' }}>
              Sign up with your college email to unlock resource sharing
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
                <User size={14} />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Maya Chen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail size={14} />
                <span>University Email *</span>
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="maya.chen@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <MapPin size={14} />
                  <span>Campus Node *</span>
                </label>
                <select
                  className="form-select"
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                >
                  {CAMPUSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <GraduationCap size={14} />
                  <span>Department / Major</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Physics, CS"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label">
                <Lock size={14} />
                <span>Password *</span>
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', gap: '0.45rem' }}
            >
              <span>{loading ? 'Registering...' : 'Create Account'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.865rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}
            >
              Sign in here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
