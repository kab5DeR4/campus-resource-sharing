import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import {
  MapPin,
  User,
  Calendar,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit3,
  Send,
  Layers,
  BookmarkCheck,
  ShieldCheck,
  BookOpen,
  Calculator,
  FlaskConical,
  Cpu,
  PenTool,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

function getCategoryIcon(category) {
  switch (category) {
    case 'Books':
      return BookOpen;
    case 'Calculators':
      return Calculator;
    case 'Lab Equipment':
      return FlaskConical;
    case 'Stationery':
      return PenTool;
    case 'Electronics':
      return Cpu;
    default:
      return Layers;
  }
}

export default function ResourceDetailPage({ resourceId, onNavigate }) {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [resourceData, setResourceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // request modal state
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [expectedDays, setExpectedDays] = useState(7);
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.resources.get(resourceId);
      setResourceData(data);
    } catch (err) {
      setError(err.message || 'Failed to load item details');
    } finally {
      setLoading(false);
    }
  }, [resourceId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  // submit borrow request
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setSubmittingRequest(true);
    try {
      await api.resources.requestBorrow(resourceId, {
        message: requestMessage,
        expected_days: Number(expectedDays),
      });
      addToast('Request sent to owner successfully!', 'success');
      setRequestModalOpen(false);
      fetchDetails();
    } catch (err) {
      addToast(err.message || 'Failed to send request', 'error');
    } finally {
      setSubmittingRequest(false);
    }
  };

  // cancel pending request
  const handleCancelRequest = async () => {
    if (!resourceData?.userActiveRequest) return;
    try {
      await api.requests.cancel(resourceData.userActiveRequest.id);
      addToast('Your request has been cancelled', 'info');
      fetchDetails();
    } catch (err) {
      addToast(err.message || 'Failed to cancel request', 'error');
    }
  };

  // delete listing (owner)
  const handleDeleteListing = async () => {
    setDeleting(true);
    try {
      await api.resources.delete(resourceId);
      addToast('Listing deleted successfully', 'success');
      setDeleteModalOpen(false);
      onNavigate('browse');
    } catch (err) {
      addToast(err.message || 'Failed to delete listing', 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
        <div className="font-mono">Loading campus resource specifications...</div>
      </div>
    );
  }

  if (error || !resourceData?.resource) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div
          className="card"
          style={{ maxWidth: '500px', margin: '0 auto', padding: '2.5rem 1.5rem' }}
        >
          <AlertCircle size={36} style={{ color: 'var(--status-danger-text)', margin: '0 auto 1rem auto' }} />
          <h2 style={{ marginBottom: '0.5rem' }}>Resource Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {error || 'The requested item could not be retrieved from the campus database.'}
          </p>
          <button onClick={() => onNavigate('browse')} className="btn btn-primary">
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  const { resource, isOwner, userActiveRequest, activeBorrowing } = resourceData;
  const isAvailable = resource.status === 'AVAILABLE';
  const CategoryIcon = getCategoryIcon(resource.category);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* breadcrumb back navigation */}
      <div style={{ marginBottom: '1.75rem' }}>
        <button
          onClick={() => onNavigate('browse')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: 'var(--text-secondary)',
            fontSize: '0.885rem',
            fontWeight: 600,
            transition: 'var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </button>
      </div>

      {/* active request / loan banner */}
      {userActiveRequest && (
        <div
          className="card"
          style={{
            backgroundColor: 'var(--status-pending-bg)',
            borderColor: 'var(--status-pending-border)',
            marginBottom: '1.75rem',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Clock size={20} style={{ color: 'var(--status-pending-dot)' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--status-pending-text)' }}>
                You have a pending borrow request for this item
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--status-pending-text)' }}>
                Requested on {new Date(userActiveRequest.created_at).toLocaleDateString()} for {userActiveRequest.expected_days} days
              </div>
            </div>
          </div>
          <button
            onClick={handleCancelRequest}
            className="btn btn-secondary btn-sm"
            style={{ borderColor: 'var(--status-pending-border)', color: 'var(--status-pending-text)' }}
          >
            Cancel Request
          </button>
        </div>
      )}

      {activeBorrowing && activeBorrowing.borrower_id === user?.id && (
        <div
          className="card"
          style={{
            backgroundColor: 'var(--status-active-bg)',
            borderColor: 'var(--status-active-border)',
            marginBottom: '1.75rem',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
          }}
        >
          <BookmarkCheck size={20} style={{ color: 'var(--status-active-dot)' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--status-active-text)' }}>
              You are currently borrowing this item
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--status-active-text)' }}>
              Due for return on {new Date(activeBorrowing.due_date).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      {/* main detail grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* left column: photo / icon visual showcase */}
        <div>
          <div
            className="card"
            style={{
              padding: 0,
              overflow: 'hidden',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.5rem',
              backgroundImage: 'radial-gradient(rgba(17, 26, 23, 0.06) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          >
            <div
              style={{
                height: '360px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {resource.image_url ? (
                <img
                  src={resource.image_url}
                  alt={resource.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    color: 'var(--primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '20px',
                      backgroundColor: '#ffffff',
                      boxShadow: 'var(--shadow-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CategoryIcon size={42} strokeWidth={2} />
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {resource.category}
                  </span>
                </div>
              )}

              {/* condition stamp */}
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                {resource.condition} CONDITION
              </div>
            </div>
          </div>

          {/* owner credentials card */}
          <div
            className="card"
            style={{
              padding: '1.35rem',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.735rem',
                fontWeight: 700,
                color: 'var(--text-tertiary)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '0.85rem',
              }}
            >
              Resource Custodian / Owner
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  fontFamily: 'var(--font-display)',
                  border: '1px solid var(--primary-border)',
                }}
              >
                {resource.owner_name?.charAt(0) || 'U'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 750, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  {resource.owner_name}
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  {resource.campus} &bull; Verified Student
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  padding: '0.25rem 0.55rem',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.725rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <ShieldCheck size={13} />
                <span>100% Trust</span>
              </div>
            </div>
          </div>
        </div>

        {/* right column: specs, details & action */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
            <span
              style={{
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.785rem',
                fontWeight: 650,
              }}
            >
              {resource.category}
            </span>
            <StatusBadge status={resource.status} />
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}
          >
            {resource.title}
          </h1>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              color: 'var(--text-tertiary)',
              fontSize: '0.865rem',
              marginBottom: '1.5rem',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={15} style={{ color: 'var(--primary)' }} />
              <span style={{ color: 'var(--text-secondary)', fontWeight: 550 }}>{resource.campus}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={15} />
              <span>Listed {new Date(resource.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4
              style={{
                fontSize: '0.92rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '0.5rem',
              }}
            >
              Description &amp; Condition Details
            </h4>
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
                whiteSpace: 'pre-line',
              }}
            >
              {resource.description}
            </p>
          </div>

          {/* safety & deposit notice */}
          <div
            className="card"
            style={{
              backgroundColor: 'var(--primary-light)',
              borderColor: 'var(--primary-border)',
              padding: '1.2rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <ShieldCheck size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.885rem', color: 'var(--primary)', marginBottom: '0.2rem' }}>
                  Zero-Fee Campus Protection
                </div>
                <div style={{ fontSize: '0.815rem', color: 'var(--primary-hover)', lineHeight: 1.5 }}>
                  This resource is loaned under the university student honor code. Prompt return on the agreed date keeps the campus library score active for everyone.
                </div>
              </div>
            </div>
          </div>

          {/* action buttons */}
          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            {isOwner ? (
              <>
                <button
                  onClick={() => onNavigate('edit-listing', { id: resource.id })}
                  className="btn btn-secondary"
                  style={{ gap: '0.45rem' }}
                >
                  <Edit3 size={16} />
                  <span>Edit Listing</span>
                </button>
                <button
                  onClick={() => setDeleteModalOpen(true)}
                  className="btn btn-danger"
                  style={{ gap: '0.45rem' }}
                >
                  <Trash2 size={16} />
                  <span>Delete Listing</span>
                </button>
              </>
            ) : isAvailable ? (
              isAuthenticated ? (
                userActiveRequest ? (
                  <button disabled className="btn btn-secondary" style={{ flex: 1 }}>
                    Request Already Sent
                  </button>
                ) : (
                  <button
                    onClick={() => setRequestModalOpen(true)}
                    className="btn btn-primary btn-lg"
                    style={{ flex: 1, gap: '0.5rem' }}
                  >
                    <Send size={18} />
                    <span>Request to Borrow This Item</span>
                  </button>
                )
              ) : (
                <button
                  onClick={() => onNavigate('login')}
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1 }}
                >
                  Log In to Request Borrow
                </button>
              )
            ) : (
              <button disabled className="btn btn-secondary" style={{ flex: 1 }}>
                Currently Unavailable (In Active Loan)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* request borrow modal */}
      <Modal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        title="Request Item Borrow"
      >
        <form onSubmit={handleRequestSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">
              <Clock size={14} />
              <span>How many days do you need this item?</span>
            </label>
            <select
              className="form-select"
              value={expectedDays}
              onChange={(e) => setExpectedDays(Number(e.target.value))}
            >
              <option value={3}>3 Days (Quick quiz or lab review)</option>
              <option value={7}>7 Days (1 Week study block)</option>
              <option value={14}>14 Days (2 Weeks exam period)</option>
              <option value={30}>30 Days (Monthly course project)</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">
              <User size={14} />
              <span>Message to {resource.owner_name} (optional)</span>
            </label>
            <textarea
              className="form-textarea"
              placeholder="Hi! I need this for my upcoming midterm exam. Can we meet at the campus library?"
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setRequestModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingRequest}
              className="btn btn-primary"
            >
              {submittingRequest ? 'Submitting...' : 'Send Borrow Request'}
            </button>
          </div>
        </form>
      </Modal>

      {/* delete confirmation modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Resource Listing"
      >
        <div style={{ paddingBottom: '1.25rem' }}>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Are you sure you want to remove <strong>"{resource.title}"</strong> from the campus resource sharing catalog? This action cannot be undone.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteListing}
            disabled={deleting}
            className="btn btn-danger"
          >
            {deleting ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
