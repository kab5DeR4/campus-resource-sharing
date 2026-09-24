import React from 'react';
import { CheckCircle2, Clock, MinusCircle, Check, XCircle, BookmarkCheck, CheckCheck } from 'lucide-react';

// status badge with micro glowing indicator and monospace tag
export default function StatusBadge({ status, size = 'normal', showDot = true }) {
  if (!status) return null;

  const upper = status.toUpperCase();

  let config = {
    className: 'badge-unavailable',
    label: upper,
    icon: MinusCircle,
  };

  switch (upper) {
    case 'AVAILABLE':
      config = {
        className: 'badge-available',
        label: 'AVAILABLE',
        icon: CheckCircle2,
      };
      break;
    case 'REQUESTED':
      config = {
        className: 'badge-requested',
        label: 'REQ PENDING',
        icon: Clock,
      };
      break;
    case 'UNAVAILABLE':
      config = {
        className: 'badge-unavailable',
        label: 'BORROWED',
        icon: MinusCircle,
      };
      break;
    case 'PENDING':
      config = {
        className: 'badge-pending',
        label: 'PENDING',
        icon: Clock,
      };
      break;
    case 'APPROVED':
      config = {
        className: 'badge-approved',
        label: 'APPROVED',
        icon: Check,
      };
      break;
    case 'REJECTED':
      config = {
        className: 'badge-rejected',
        label: 'REJECTED',
        icon: XCircle,
      };
      break;
    case 'CANCELLED':
      config = {
        className: 'badge-cancelled',
        label: 'CANCELLED',
        icon: XCircle,
      };
      break;
    case 'ACTIVE':
      config = {
        className: 'badge-active',
        label: 'ACTIVE LOAN',
        icon: BookmarkCheck,
      };
      break;
    case 'RETURNED':
      config = {
        className: 'badge-returned',
        label: 'RETURNED',
        icon: CheckCheck,
      };
      break;
    default:
      config = {
        className: 'badge-unavailable',
        label: upper,
        icon: MinusCircle,
      };
  }

  const Icon = config.icon;
  const isSmall = size === 'sm';

  return (
    <span
      className={`badge ${config.className}`}
      style={{
        padding: isSmall ? '0.15rem 0.5rem' : '0.22rem 0.65rem',
        fontSize: isSmall ? '0.675rem' : '0.725rem',
      }}
    >
      {showDot && <span className="badge-dot" />}
      <Icon size={isSmall ? 11 : 12} />
      <span>{config.label}</span>
    </span>
  );
}
