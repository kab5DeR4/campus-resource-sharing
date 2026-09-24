import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Check, GraduationCap } from 'lucide-react';

const DEMO_STUDENTS = [
  { name: 'Aarav (Lender & Borrower)', email: 'aarav@campus.edu', role: 'Has incoming request' },
  { name: 'Priya (Student Requester)', email: 'priya@campus.edu', role: 'Requested math book' },
  { name: 'Rohan (Health Science)', email: 'rohan@campus.edu', role: 'Lab coats & gear' },
  { name: 'Sneha (Applied Math)', email: 'sneha@campus.edu', role: 'Calculators & tech' },
];

export default function DemoSwitcher() {
  const { user, switchDemoUser } = useAuth();

  return (
    <div
      style={{
        backgroundColor: '#0c2820',
        color: '#e8f5ef',
        padding: '0.45rem 1.25rem',
        fontSize: '0.785rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.65rem',
        borderBottom: '1px solid rgba(184, 222, 208, 0.15)',
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: 'rgba(217, 119, 6, 0.25)',
            color: '#fde68a',
          }}
        >
          <GraduationCap size={13} />
        </div>
        <span style={{ fontWeight: 700, color: '#fbfbf8', fontFamily: 'var(--font-display)' }}>
          Campus Node Sandbox:
        </span>
        <span style={{ color: '#a3c2b8', display: 'inline-block' }}>
          Switch student persona to test borrow, lend &amp; handover workflows:
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
        {DEMO_STUDENTS.map((student) => {
          const isActive = user?.email?.toLowerCase() === student.email.toLowerCase();
          return (
            <button
              key={student.email}
              onClick={() => switchDemoUser(student.email)}
              title={`${student.role} • Click to switch session instantly`}
              style={{
                backgroundColor: isActive ? 'var(--primary-light)' : 'rgba(255, 255, 255, 0.08)',
                color: isActive ? 'var(--primary)' : '#e8f5ef',
                border: isActive
                  ? '1px solid #10b981'
                  : '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.2rem 0.65rem',
                fontSize: '0.735rem',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontWeight: isActive ? 700 : 500,
                transition: 'var(--transition-fast)',
                boxShadow: isActive ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none',
              }}
            >
              {isActive ? (
                <Check size={12} strokeWidth={3} style={{ color: '#059669' }} />
              ) : (
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#527c70',
                    display: 'inline-block',
                  }}
                />
              )}
              <span>{student.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
