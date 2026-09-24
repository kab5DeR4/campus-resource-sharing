import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Repeat,
  Plus,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  Search,
  BookOpen,
  Sparkles,
} from 'lucide-react';

export default function Navbar({ currentView, onNavigate }) {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view, param) => {
    setMobileMenuOpen(false);
    onNavigate(view, param);
  };

  return (
    <header
      style={{
        backgroundColor: 'rgba(251, 251, 248, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 500,
        transition: 'background-color 0.2s ease',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '68px',
        }}
      >
        {/* collegiate brand logo */}
        <button
          onClick={() => handleNav('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(15, 76, 58, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Repeat size={19} strokeWidth={2.4} />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.15rem',
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}
            >
              Campus<span style={{ color: 'var(--accent-amber)' }}>Share</span>
            </div>
            <div
              style={{
                fontSize: '0.685rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-tertiary)',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Student Exchange
            </div>
          </div>
        </button>

        {/* desktop navigation links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
          className="desktop-nav"
        >
          <button
            onClick={() => handleNav('browse')}
            style={{
              fontSize: '0.885rem',
              fontWeight: currentView === 'browse' ? 700 : 550,
              color: currentView === 'browse' ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: currentView === 'browse' ? 'var(--primary-light)' : 'transparent',
              border: currentView === 'browse' ? '1px solid var(--primary-border)' : '1px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              transition: 'var(--transition-fast)',
            }}
          >
            <Search size={15} />
            <span>Browse Items</span>
          </button>

          <button
            onClick={() => handleNav('home', 'how-it-works')}
            style={{
              fontSize: '0.885rem',
              fontWeight: 550,
              color: 'var(--text-secondary)',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              transition: 'var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            How It Works
          </button>

          {isAuthenticated ? (
            <>
              <button
                onClick={() => handleNav('dashboard')}
                style={{
                  fontSize: '0.885rem',
                  fontWeight: currentView === 'dashboard' ? 700 : 550,
                  color: currentView === 'dashboard' ? 'var(--primary)' : 'var(--text-secondary)',
                  backgroundColor: currentView === 'dashboard' ? 'var(--primary-light)' : 'transparent',
                  border: currentView === 'dashboard' ? '1px solid var(--primary-border)' : '1px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  transition: 'var(--transition-fast)',
                }}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => handleNav('create-listing')}
                className="btn btn-primary btn-sm"
                style={{
                  gap: '0.4rem',
                  padding: '0.45rem 0.95rem',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <Plus size={15} strokeWidth={2.5} />
                <span>Share Item</span>
              </button>

              <div
                style={{
                  height: '24px',
                  width: '1px',
                  backgroundColor: 'var(--border-subtle)',
                  margin: '0 0.25rem',
                }}
              />

              {/* student profile chip */}
              <button
                onClick={() => handleNav('profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.35rem 0.75rem 0.35rem 0.4rem',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: currentView === 'profile' ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'var(--transition-fast)',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 750,
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                  <div
                    style={{
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {user?.name?.split(' ')[0]}
                  </div>
                  <div
                    style={{
                      fontSize: '0.675rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {user?.campus?.split(' ')[0]}
                  </div>
                </div>
              </button>

              <button
                onClick={logout}
                title="Log out"
                aria-label="Log out"
                style={{
                  color: 'var(--text-tertiary)',
                  padding: '0.45rem',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--status-danger-text)';
                  e.currentTarget.style.backgroundColor = 'var(--status-danger-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-tertiary)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <button
                onClick={() => handleNav('login')}
                className="btn btn-secondary btn-sm"
              >
                Log In
              </button>
              <button
                onClick={() => handleNav('register')}
                className="btn btn-primary btn-sm"
              >
                Sign Up
              </button>
            </div>
          )}
        </nav>

        {/* mobile menu button */}
        <div className="mobile-toggle">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            style={{
              padding: '0.5rem',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-subtle)',
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* mobile drawer menu */}
      {mobileMenuOpen && (
        <div
          className="animate-entrance"
          style={{
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <button
            onClick={() => handleNav('browse')}
            style={{
              padding: '0.65rem 0',
              textAlign: 'left',
              fontWeight: 650,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              color: 'var(--text-primary)',
            }}
          >
            <Search size={18} style={{ color: 'var(--primary)' }} />
            <span>Browse All Items</span>
          </button>

          <button
            onClick={() => handleNav('home', 'how-it-works')}
            style={{
              padding: '0.65rem 0',
              textAlign: 'left',
              fontWeight: 550,
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
            }}
          >
            How It Works
          </button>

          {isAuthenticated ? (
            <>
              <button
                onClick={() => handleNav('dashboard')}
                style={{
                  padding: '0.65rem 0',
                  textAlign: 'left',
                  fontWeight: 650,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  color: 'var(--text-primary)',
                }}
              >
                <LayoutDashboard size={18} style={{ color: 'var(--primary)' }} />
                <span>My Dashboard</span>
              </button>

              <button
                onClick={() => handleNav('create-listing')}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', margin: '0.4rem 0' }}
              >
                <Plus size={16} />
                <span>Share An Item</span>
              </button>

              <button
                onClick={() => handleNav('profile')}
                style={{
                  padding: '0.65rem 0',
                  textAlign: 'left',
                  fontWeight: 550,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  color: 'var(--text-primary)',
                }}
              >
                <User size={18} style={{ color: 'var(--text-tertiary)' }} />
                <span>My Profile ({user?.name})</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                style={{
                  padding: '0.65rem 0',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: 'var(--status-danger-text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                }}
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingTop: '0.6rem' }}>
              <button
                onClick={() => handleNav('login')}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Log In
              </button>
              <button
                onClick={() => handleNav('register')}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
