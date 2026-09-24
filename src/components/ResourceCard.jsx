import React from 'react';
import StatusBadge from './StatusBadge';
import {
  MapPin,
  BookOpen,
  Calculator,
  FlaskConical,
  PenTool,
  Cpu,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

function getCategoryMeta(category) {
  switch (category) {
    case 'Books':
      return { icon: BookOpen, accent: '#0f4c3a', bg: '#edf5f1' };
    case 'Calculators':
      return { icon: Calculator, accent: '#d97706', bg: '#fef3c7' };
    case 'Lab Equipment':
      return { icon: FlaskConical, accent: '#0284c7', bg: '#e0f2fe' };
    case 'Stationery':
      return { icon: PenTool, accent: '#c2410c', bg: '#ffedd5' };
    case 'Electronics':
      return { icon: Cpu, accent: '#7c3aed', bg: '#f3e8ff' };
    default:
      return { icon: Layers, accent: '#0f4c3a', bg: '#f4f3ec' };
  }
}

export default function ResourceCard({ resource, onSelect }) {
  const meta = getCategoryMeta(resource.category);
  const CategoryIcon = meta.icon;

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.();
        }
      }}
      className="card card-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        padding: 0,
        overflow: 'hidden',
        position: 'relative',
        height: '100%',
      }}
    >
      {/* thumbnail or craft collegiate fallback pattern */}
      <div
        style={{
          height: '168px',
          width: '100%',
          backgroundColor: meta.bg,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundImage: 'radial-gradient(rgba(17, 26, 23, 0.06) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      >
        {resource.image_url ? (
          <img
            src={resource.image_url}
            alt={resource.title}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div
            style={{
              color: meta.accent,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CategoryIcon size={26} strokeWidth={2.2} />
            </div>
          </div>
        )}

        {/* top left: category capsule */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(17, 26, 23, 0.08)',
            padding: '0.22rem 0.6rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.735rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <CategoryIcon size={12} style={{ color: meta.accent }} />
          <span>{resource.category}</span>
        </div>

        {/* top right: condition stamp */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            padding: '0.18rem 0.55rem',
            borderRadius: 'var(--radius-xs)',
            fontSize: '0.675rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            boxShadow: '0 2px 6px rgba(15, 76, 58, 0.3)',
          }}
        >
          {resource.condition}
        </div>
      </div>

      {/* card body */}
      <div
        style={{
          padding: '1.2rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '0.5rem',
              marginBottom: '0.45rem',
            }}
          >
            <h4
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1.35,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {resource.title}
            </h4>
          </div>

          <p
            style={{
              fontSize: '0.835rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.45,
              marginBottom: '1rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {resource.description}
          </p>
        </div>

        {/* card footer with campus & status badge */}
        <div
          style={{
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            fontSize: '0.79rem',
            color: 'var(--text-tertiary)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              overflow: 'hidden',
              maxWidth: '60%',
            }}
          >
            <MapPin size={13} style={{ flexShrink: 0, color: 'var(--primary)' }} />
            <span
              style={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                fontWeight: 500,
                color: 'var(--text-secondary)',
              }}
            >
              {resource.campus}
            </span>
          </div>

          <StatusBadge status={resource.status} size="sm" />
        </div>
      </div>
    </div>
  );
}
