import React from 'react';
import { Repeat, ShieldCheck, GraduationCap, HeartHandshake, Sparkles } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer
      style={{
        backgroundColor: '#0c2820',
        color: '#e8f5ef',
        borderTop: '1px solid rgba(184, 222, 208, 0.18)',
        padding: '3.5rem 0 2.5rem',
        marginTop: '5rem',
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* brand summary */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                marginBottom: '1rem',
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
                <Repeat size={18} strokeWidth={2.5} />
              </div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  fontFamily: 'var(--font-display)',
                  color: '#ffffff',
                }}
              >
                Campus<span style={{ color: '#fde68a' }}>Share</span>
              </span>
            </div>
            <p
              style={{
                fontSize: '0.865rem',
                color: '#a3c2b8',
                lineHeight: 1.6,
                maxWidth: '300px',
                marginBottom: '1.25rem',
              }}
            >
              The student-run localized equipment network. Share textbooks, graphing tools, lab gear, and coursework hardware safely across campuses.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.735rem',
                fontFamily: 'var(--font-mono)',
                color: '#6ee7b7',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 8px #10b981',
                }}
              />
              <span>100% Peer-to-Peer Verified</span>
            </div>
          </div>

          {/* quick categories */}
          <div>
            <h5
              style={{
                fontSize: '0.9rem',
                fontWeight: 750,
                color: '#ffffff',
                marginBottom: '1rem',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}
            >
              Gear Categories
            </h5>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                fontSize: '0.865rem',
                color: '#a3c2b8',
              }}
            >
              <li>
                <button
                  onClick={() => onNavigate('browse', { category: 'Books' })}
                  style={{ color: 'inherit', textAlign: 'left', transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#a3c2b8')}
                >
                  Textbooks &amp; Lab Manuals
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('browse', { category: 'Calculators' })}
                  style={{ color: 'inherit', textAlign: 'left', transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#a3c2b8')}
                >
                  Graphing &amp; Sci Calculators
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('browse', { category: 'Lab Equipment' })}
                  style={{ color: 'inherit', textAlign: 'left', transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#a3c2b8')}
                >
                  Lab Coats, Goggles &amp; Kits
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('browse', { category: 'Electronics' })}
                  style={{ color: 'inherit', textAlign: 'left', transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#a3c2b8')}
                >
                  Arduino, Raspberry Pi &amp; Adapters
                </button>
              </li>
            </ul>
          </div>

          {/* community principles */}
          <div>
            <h5
              style={{
                fontSize: '0.9rem',
                fontWeight: 750,
                color: '#ffffff',
                marginBottom: '1rem',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}
            >
              Community Standards
            </h5>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontSize: '0.85rem',
                color: '#a3c2b8',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} style={{ color: '#fde68a', flexShrink: 0 }} />
                <span>On-campus verified student pickups</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HeartHandshake size={16} style={{ color: '#6ee7b7', flexShrink: 0 }} />
                <span>No hidden fees &bull; Respect borrowed gear</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GraduationCap size={16} style={{ color: '#fde68a', flexShrink: 0 }} />
                <span>Supports university sustainability goals</span>
              </div>
            </div>
          </div>
        </div>

        {/* footer bottom bar */}
        <div
          style={{
            paddingTop: '1.75rem',
            borderTop: '1px solid rgba(184, 222, 208, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.785rem',
            fontFamily: 'var(--font-mono)',
            color: '#70978b',
          }}
        >
          <div>
            CampusShare Exchange Node &bull; {new Date().getFullYear()} Student Open Initiative
          </div>
          <div>
            React &bull; Node Express &bull; SQLite Verified
          </div>
        </div>
      </div>
    </footer>
  );
}
