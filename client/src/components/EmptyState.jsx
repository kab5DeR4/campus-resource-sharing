import React from 'react';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({
  title = 'No items found',
  description = 'Try adjusting your search criteria, category or campus filters.',
  actionLabel,
  onAction,
  icon: CustomIcon,
}) {
  const Icon = CustomIcon || PackageOpen;

  return (
    <div
      className="animate-entrance"
      style={{
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        background: 'var(--bg-surface)',
        border: '1.5px dashed var(--border-strong)',
        borderRadius: 'var(--radius-lg)',
        margin: '1.5rem 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'radial-gradient(rgba(15, 76, 58, 0.04) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          border: '1px solid var(--primary-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <Icon size={26} strokeWidth={2} />
      </div>
      <h3
        style={{
          fontSize: '1.15rem',
          fontWeight: 750,
          color: 'var(--text-primary)',
          marginBottom: '0.4rem',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '0.885rem',
          color: 'var(--text-secondary)',
          maxWidth: '420px',
          lineHeight: 1.5,
          marginBottom: actionLabel ? '1.5rem' : 0,
        }}
      >
        {description}
      </p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-secondary btn-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
