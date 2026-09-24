import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import {
  Layers,
  Inbox,
  Send,
  BookmarkCheck,
  Clock,
  Activity,
  Check,
  X,
  CheckCircle2,
  Trash2,
  Edit3,
  Plus,
  ArrowUpRight,
  Calendar,
  User,
  ShieldCheck,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage({ onNavigate, initialTab = 'incoming' }) {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState(initialTab || 'incoming');
  const [dashboardData, setDashboardData] = useState(null);
  const [borrowingsData, setBorrowingsData] = useState({ borrowed: [], lent: [] });
  const [loading, setLoading] = useState(true);

  // action modal states
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responseAction, setResponseAction] = useState(null); // 'approve' | 'reject'
  const [actionLoading, setActionLoading] = useState(false);

  const [returnBorrowing, setReturnBorrowing] = useState(null);
  const [returnLoading, setReturnLoading] = useState(false);

  const [deleteResource, setDeleteResource] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [dash, borrows] = await Promise.all([
        api.dashboard.get(),
        api.borrowings.list(),
      ]);
      setDashboardData(dash);
      setBorrowingsData(borrows);
    } catch (err) {
      addToast(err.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, fetchDashboardData]);

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '480px', margin: '0 auto', padding: '3rem 2rem' }}>
          <h2 style={{ marginBottom: '0.75rem' }}>Login required</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Please log in to access your student lending &amp; borrowing command center.
          </p>
          <button onClick={() => onNavigate('login')} className="btn btn-primary btn-lg">
            Log In Now
          </button>
        </div>
      </div>
    );
  }

  // respond to request (approve or reject)
  const handleRespondRequest = async () => {
    if (!selectedRequest || !responseAction) return;
    setActionLoading(true);
    try {
      const res = await api.requests.respond(selectedRequest.id, responseAction);
      addToast(res.message || `Request ${responseAction}d successfully`, 'success');
      setSelectedRequest(null);
      setResponseAction(null);
      fetchDashboardData();
    } catch (err) {
      addToast(err.message || `Failed to ${responseAction} request`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // cancel user's own pending request
  const handleCancelRequest = async (requestId) => {
    try {
      await api.requests.cancel(requestId);
      addToast('Borrow request cancelled', 'info');
      fetchDashboardData();
    } catch (err) {
      addToast(err.message || 'Failed to cancel request', 'error');
    }
  };

  // confirm return of borrowed gear
  const handleConfirmReturn = async () => {
    if (!returnBorrowing) return;
    setReturnLoading(true);
    try {
      const res = await api.borrowings.confirmReturn(returnBorrowing.id);
      addToast(res.message || 'Item marked as returned successfully', 'success');
      setReturnBorrowing(null);
      fetchDashboardData();
    } catch (err) {
      addToast(err.message || 'Failed to process return', 'error');
    } finally {
      setReturnLoading(false);
    }
  };

  // delete owned resource
  const handleDeleteResource = async () => {
    if (!deleteResource) return;
    setDeleteLoading(true);
    try {
      await api.resources.delete(deleteResource.id);
      addToast('Listing deleted successfully', 'success');
      setDeleteResource(null);
      fetchDashboardData();
    } catch (err) {
      addToast(err.message || 'Failed to delete listing', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const incomingRequests = dashboardData?.incomingRequests || [];
  const myRequests = dashboardData?.myRequests || [];
  const myListings = dashboardData?.myListings || [];
  const activeLoansCount = borrowingsData?.borrowed?.length || 0;
  const activeLendingsCount = borrowingsData?.lent?.length || 0;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* dashboard hero header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--accent-amber)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '0.35rem',
            }}
          >
            Student Command Hub
          </div>
          <h1
            style={{
              fontSize: '2.1rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              marginBottom: '0.35rem',
            }}
          >
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            {user?.campus} &bull; Manage your active borrows, gear requests, and shared equipment
          </p>
        </div>

        <button
          onClick={() => onNavigate('create-listing')}
          className="btn btn-primary"
          style={{ gap: '0.45rem' }}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Share New Item</span>
        </button>
      </div>

      {/* stat summary cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1.2rem',
          marginBottom: '2.5rem',
        }}
      >
        <div
          className="card"
          style={{
            padding: '1.35rem',
            backgroundColor: 'var(--bg-surface)',
            borderLeft: '4px solid var(--accent-amber)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 650, color: 'var(--text-secondary)' }}>
              Incoming Requests
            </span>
            <Inbox size={18} style={{ color: 'var(--accent-amber)' }} />
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.85rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.1,
            }}
          >
            {incomingRequests.filter((r) => r.status === 'PENDING').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
            Awaiting your approval
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: '1.35rem',
            backgroundColor: 'var(--bg-surface)',
            borderLeft: '4px solid var(--primary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 650, color: 'var(--text-secondary)' }}>
              Active Borrows
            </span>
            <BookmarkCheck size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.85rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.1,
            }}
          >
            {activeLoansCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
            Items in your possession
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: '1.35rem',
            backgroundColor: 'var(--bg-surface)',
            borderLeft: '4px solid #0284c7',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 650, color: 'var(--text-secondary)' }}>
              Currently Lent Out
            </span>
            <Activity size={18} style={{ color: '#0284c7' }} />
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.85rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.1,
            }}
          >
            {activeLendingsCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
            Your gear in circulation
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: '1.35rem',
            backgroundColor: 'var(--bg-surface)',
            borderLeft: '4px solid #7c3aed',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 650, color: 'var(--text-secondary)' }}>
              Shared Catalog Items
            </span>
            <Layers size={18} style={{ color: '#7c3aed' }} />
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.85rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.1,
            }}
          >
            {myListings.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
            Active on campus exchange
          </div>
        </div>
      </div>

      {/* tab navigation pills */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.75rem',
          marginBottom: '2rem',
          overflowX: 'auto',
        }}
      >
        {[
          { id: 'incoming', label: 'Incoming Requests', count: incomingRequests.length, icon: Inbox },
          { id: 'my-requests', label: 'My Sent Requests', count: myRequests.length, icon: Send },
          { id: 'borrowed', label: 'Borrowed Gear', count: activeLoansCount, icon: BookmarkCheck },
          { id: 'lent', label: 'Lent Out Items', count: activeLendingsCount, icon: Activity },
          { id: 'my-listings', label: 'My Listings', count: myListings.length, icon: Layers },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.865rem',
                fontWeight: isActive ? 700 : 550,
                backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-surface)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                whiteSpace: 'nowrap',
                transition: 'var(--transition-fast)',
                boxShadow: isActive ? '0 2px 8px var(--primary-glow)' : 'var(--shadow-sm)',
              }}
            >
              <TabIcon size={15} />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  style={{
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-subtle)',
                    color: isActive ? '#ffffff' : 'var(--text-primary)',
                    padding: '0.1rem 0.45rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.725rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* tab contents */}
      {loading ? (
        <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          <div className="font-mono">Syncing student exchange status...</div>
        </div>
      ) : (
        <div>
          {/* 1. INCOMING REQUESTS */}
          {activeTab === 'incoming' && (
            <div>
              {incomingRequests.length === 0 ? (
                <EmptyState
                  title="No incoming borrow requests"
                  description="When other students request your shared equipment, you will receive and review their requests here."
                  actionLabel="Share New Equipment"
                  onAction={() => onNavigate('create-listing')}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {incomingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="card"
                      style={{
                        padding: '1.35rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        backgroundColor: 'var(--bg-surface)',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '260px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <span style={{ fontWeight: 750, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                            {req.resource_title}
                          </span>
                          <StatusBadge status={req.status} size="sm" />
                        </div>

                        <div style={{ fontSize: '0.845rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                          Requested by <strong>{req.requester_name}</strong> ({req.requester_campus}) for{' '}
                          <strong>{req.expected_days} days</strong> &bull;{' '}
                          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                            {new Date(req.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        {req.message && (
                          <div
                            style={{
                              backgroundColor: 'var(--bg-subtle)',
                              padding: '0.6rem 0.85rem',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.825rem',
                              color: 'var(--text-secondary)',
                              fontStyle: 'italic',
                              maxWidth: '550px',
                            }}
                          >
                            "{req.message}"
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {req.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedRequest(req);
                                setResponseAction('approve');
                              }}
                              className="btn btn-primary btn-sm"
                              style={{ gap: '0.35rem' }}
                            >
                              <Check size={14} />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRequest(req);
                                setResponseAction('reject');
                              }}
                              className="btn btn-danger btn-sm"
                              style={{ gap: '0.35rem' }}
                            >
                              <X size={14} />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. MY SENT REQUESTS */}
          {activeTab === 'my-requests' && (
            <div>
              {myRequests.length === 0 ? (
                <EmptyState
                  title="You haven't requested any items"
                  description="Explore available textbooks, calculators, and lab tools on campus to request what you need."
                  actionLabel="Browse Available Items"
                  onAction={() => onNavigate('browse')}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {myRequests.map((req) => (
                    <div
                      key={req.id}
                      className="card"
                      style={{
                        padding: '1.35rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        backgroundColor: 'var(--bg-surface)',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '260px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <span style={{ fontWeight: 750, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                            {req.resource_title}
                          </span>
                          <StatusBadge status={req.status} size="sm" />
                        </div>

                        <div style={{ fontSize: '0.845rem', color: 'var(--text-secondary)' }}>
                          Owner: <strong>{req.owner_name}</strong> &bull; Requested for {req.expected_days} days &bull;{' '}
                          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                            {new Date(req.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {req.status === 'PENDING' && (
                          <button
                            onClick={() => handleCancelRequest(req.id)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--status-danger-text)' }}
                          >
                            Cancel Request
                          </button>
                        )}
                        <button
                          onClick={() => onNavigate('resource-detail', { id: req.resource_id })}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '0.35rem' }}
                        >
                          <span>View Item</span>
                          <ArrowUpRight size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. BORROWED GEAR */}
          {activeTab === 'borrowed' && (
            <div>
              {borrowingsData.borrowed.length === 0 ? (
                <EmptyState
                  title="No active borrowed gear"
                  description="You are not currently borrowing any items from other students."
                  actionLabel="Browse Catalog"
                  onAction={() => onNavigate('browse')}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {borrowingsData.borrowed.map((item) => (
                    <div
                      key={item.id}
                      className="card"
                      style={{
                        padding: '1.35rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        backgroundColor: 'var(--bg-surface)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <span style={{ fontWeight: 750, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                            {item.resource_title}
                          </span>
                          <StatusBadge status="ACTIVE" size="sm" />
                        </div>
                        <div style={{ fontSize: '0.845rem', color: 'var(--text-secondary)' }}>
                          Owner: <strong>{item.owner_name}</strong> &bull; Borrowed on{' '}
                          {new Date(item.borrow_date).toLocaleDateString()} &bull;{' '}
                          <span style={{ color: 'var(--accent-rust)', fontWeight: 650 }}>
                            Due: {new Date(item.due_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => setReturnBorrowing(item)}
                          className="btn btn-primary btn-sm"
                          style={{ gap: '0.35rem' }}
                        >
                          <CheckCircle2 size={14} />
                          <span>Hand Back / Return</span>
                        </button>
                        <button
                          onClick={() => onNavigate('resource-detail', { id: item.resource_id })}
                          className="btn btn-secondary btn-sm"
                        >
                          View Item
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. LENT OUT ITEMS */}
          {activeTab === 'lent' && (
            <div>
              {borrowingsData.lent.length === 0 ? (
                <EmptyState
                  title="No items currently lent out"
                  description="Your shared equipment is either available or not in an active loan period right now."
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {borrowingsData.lent.map((item) => (
                    <div
                      key={item.id}
                      className="card"
                      style={{
                        padding: '1.35rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        backgroundColor: 'var(--bg-surface)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <span style={{ fontWeight: 750, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                            {item.resource_title}
                          </span>
                          <StatusBadge status="ACTIVE" size="sm" />
                        </div>
                        <div style={{ fontSize: '0.845rem', color: 'var(--text-secondary)' }}>
                          Borrowed by: <strong>{item.borrower_name}</strong> &bull; Loaned on{' '}
                          {new Date(item.borrow_date).toLocaleDateString()} &bull;{' '}
                          <span style={{ color: 'var(--primary)', fontWeight: 650 }}>
                            Expected Back: {new Date(item.due_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => setReturnBorrowing(item)}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '0.35rem' }}
                        >
                          <CheckCircle2 size={14} />
                          <span>Confirm Return Receipt</span>
                        </button>
                        <button
                          onClick={() => onNavigate('resource-detail', { id: item.resource_id })}
                          className="btn btn-secondary btn-sm"
                        >
                          View Item
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. MY LISTINGS */}
          {activeTab === 'my-listings' && (
            <div>
              {myListings.length === 0 ? (
                <EmptyState
                  title="You haven't listed any equipment yet"
                  description="Share your textbooks, calculators, or lab coats to earn trust points in your campus network."
                  actionLabel="Share New Item"
                  onAction={() => onNavigate('create-listing')}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {myListings.map((item) => (
                    <div
                      key={item.id}
                      className="card"
                      style={{
                        padding: '1.35rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        backgroundColor: 'var(--bg-surface)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <span style={{ fontWeight: 750, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                            {item.title}
                          </span>
                          <StatusBadge status={item.status} size="sm" />
                        </div>
                        <div style={{ fontSize: '0.845rem', color: 'var(--text-secondary)' }}>
                          Category: <strong>{item.category}</strong> &bull; Condition: {item.condition} &bull; Campus:{' '}
                          {item.campus}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => onNavigate('edit-listing', { id: item.id })}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '0.35rem' }}
                        >
                          <Edit3 size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteResource(item)}
                          className="btn btn-danger btn-sm"
                          style={{ gap: '0.35rem' }}
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                        <button
                          onClick={() => onNavigate('resource-detail', { id: item.id })}
                          className="btn btn-secondary btn-sm"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* respond modal */}
      <Modal
        isOpen={Boolean(selectedRequest && responseAction)}
        onClose={() => {
          setSelectedRequest(null);
          setResponseAction(null);
        }}
        title={`${responseAction === 'approve' ? 'Approve' : 'Reject'} Borrow Request`}
      >
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          Are you sure you want to <strong>{responseAction}</strong> the borrow request from{' '}
          <strong>{selectedRequest?.requester_name}</strong> for "{selectedRequest?.resource_title}"?
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              setSelectedRequest(null);
              setResponseAction(null);
            }}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleRespondRequest}
            disabled={actionLoading}
            className={responseAction === 'approve' ? 'btn btn-primary' : 'btn btn-danger'}
          >
            {actionLoading ? 'Processing...' : `Confirm ${responseAction === 'approve' ? 'Approval' : 'Rejection'}`}
          </button>
        </div>
      </Modal>

      {/* confirm return modal */}
      <Modal
        isOpen={Boolean(returnBorrowing)}
        onClose={() => setReturnBorrowing(null)}
        title="Confirm Equipment Return"
      >
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          Confirm that <strong>"{returnBorrowing?.resource_title}"</strong> has been safely handed back in good working condition. This marks the listing as available again on campus.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={() => setReturnBorrowing(null)} className="btn btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleConfirmReturn}
            disabled={returnLoading}
            className="btn btn-primary"
          >
            {returnLoading ? 'Updating status...' : 'Confirm Return'}
          </button>
        </div>
      </Modal>

      {/* delete resource modal */}
      <Modal
        isOpen={Boolean(deleteResource)}
        onClose={() => setDeleteResource(null)}
        title="Delete Listing"
      >
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          Are you sure you want to delete <strong>"{deleteResource?.title}"</strong>?
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={() => setDeleteResource(null)} className="btn btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleDeleteResource}
            disabled={deleteLoading}
            className="btn btn-danger"
          >
            {deleteLoading ? 'Deleting...' : 'Delete Listing'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
