import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  ArrowLeft,
  Save,
  BookOpen,
  Calculator,
  FlaskConical,
  Cpu,
  PenTool,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';

const CATEGORY_OPTIONS = [
  { name: 'Books', icon: BookOpen, desc: 'Textbooks & study notes' },
  { name: 'Calculators', icon: Calculator, desc: 'Graphic & scientific devices' },
  { name: 'Lab Equipment', icon: FlaskConical, desc: 'Coats, goggles & kits' },
  { name: 'Electronics', icon: Cpu, desc: 'Arduino, hardware & sensors' },
  { name: 'Stationery', icon: PenTool, desc: 'Drafting pens & tools' },
  { name: 'Other', icon: Layers, desc: 'Miscellaneous academic gear' },
];

const CONDITIONS = ['New', 'Good', 'Fair', 'Used'];
const CAMPUSES = ['Main Tech Campus', 'North Health & Science', 'South Arts & Design'];

export default function EditListingPage({ resourceId, onNavigate }) {
  const { addToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Books');
  const [condition, setCondition] = useState('Good');
  const [campus, setCampus] = useState(CAMPUSES[0]);
  const [status, setStatus] = useState('AVAILABLE');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchResource = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.resources.get(resourceId);
      const res = data.resource;
      setTitle(res.title);
      setDescription(res.description || '');
      setCategory(res.category);
      setCondition(res.condition);
      setCampus(res.campus);
      setStatus(res.status);
      setImageUrl(res.image_url || '');
    } catch (err) {
      setError(err.message || 'Failed to load item details');
      addToast('Failed to load item details', 'error');
    } finally {
      setLoading(false);
    }
  }, [resourceId, addToast]);

  useEffect(() => {
    fetchResource();
  }, [fetchResource]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.resources.update(resourceId, {
        title: title.trim(),
        description: description.trim(),
        category,
        condition,
        campus,
        status,
        image_url: imageUrl.trim() || undefined,
      });
      addToast('Listing updated successfully!', 'success');
      onNavigate('resource-detail', { id: resourceId });
    } catch (err) {
      setError(err.message || 'Failed to update resource listing');
      addToast(err.message || 'Failed to update listing', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
        <div className="font-mono">Loading listing editor...</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem', maxWidth: '780px' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <button
          onClick={() => onNavigate('resource-detail', { id: resourceId })}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: 'var(--text-secondary)',
            fontSize: '0.885rem',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Item Details</span>
        </button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
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
          Catalog Maintenance
        </div>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            marginBottom: '0.35rem',
          }}
        >
          Edit Equipment Listing
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          Update availability status, description, condition, or pickup location.
        </p>
      </div>

      {error && (
        <div
          className="card"
          style={{
            backgroundColor: 'var(--status-danger-bg)',
            borderColor: 'var(--status-danger-border)',
            color: 'var(--status-danger-text)',
            padding: '0.9rem 1.25rem',
            marginBottom: '1.5rem',
            fontSize: '0.885rem',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem', backgroundColor: 'var(--bg-surface)' }}>
        {/* title */}
        <div className="form-group">
          <label className="form-label">Item Title *</label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* category picker */}
        <div className="form-group">
          <label className="form-label">Category</label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem',
              marginTop: '0.25rem',
            }}
          >
            {CATEGORY_OPTIONS.map((cat) => {
              const isSelected = category === cat.name;
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  role="button"
                  tabIndex={0}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-subtle)',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.865rem', color: 'var(--text-primary)' }}>
                      {cat.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* condition, campus & status */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.25rem',
          }}
        >
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Condition</label>
            <select
              className="form-select"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Campus Node</label>
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
            <label className="form-label">Current Status</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="AVAILABLE">AVAILABLE (Open for borrow)</option>
              <option value="UNAVAILABLE">UNAVAILABLE (Borrowed / Paused)</option>
            </select>
          </div>
        </div>

        {/* description */}
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* image url */}
        <div className="form-group">
          <label className="form-label">
            <ImageIcon size={14} />
            <span>Image URL</span>
          </label>
          <input
            type="url"
            className="form-input"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        {/* submit buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.85rem',
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => onNavigate('resource-detail', { id: resourceId })}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-lg"
            style={{ gap: '0.45rem' }}
          >
            <Save size={16} />
            <span>{submitting ? 'Saving Changes...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
