import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import ResourceCard from '../components/ResourceCard';
import EmptyState from '../components/EmptyState';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  PackageOpen,
  X,
  Filter,
  MapPin,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Books',
  'Calculators',
  'Lab Equipment',
  'Stationery',
  'Electronics',
  'Academic Accessories',
  'Other',
];

const CONDITIONS = ['All', 'New', 'Good', 'Fair', 'Used'];
const CAMPUSES = ['All', 'Main Tech Campus', 'North Health & Science', 'South Arts & Design'];

export default function BrowsePage({ onNavigate, initialCategory = 'All' }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(initialCategory || 'All');
  const [condition, setCondition] = useState('All');
  const [campus, setCampus] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sort, setSort] = useState('relevant');

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (category !== 'All') params.category = category;
      if (condition !== 'All') params.condition = condition;
      if (campus !== 'All') params.campus = campus;
      if (statusFilter !== 'All') params.status = statusFilter;
      if (sort !== 'relevant') params.sort = sort;

      const data = await api.resources.list(params);
      setResources(data.resources || []);
    } catch (err) {
      setError(err.message || 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, category, condition, campus, statusFilter, sort]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setCondition('All');
    setCampus('All');
    setStatusFilter('All');
    setSort('relevant');
  };

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    category !== 'All' ||
    condition !== 'All' ||
    campus !== 'All' ||
    statusFilter !== 'All' ||
    sort !== 'relevant';

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* page header */}
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
          Campus Gear Directory
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
          Browse Verified Campus Equipment
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Discover available textbooks, lab kits, calculators, and electronics currently shared by students
        </p>
      </div>

      {/* category pills horizontal filter */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.75rem',
          marginBottom: '1.5rem',
        }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = category === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-surface)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                padding: '0.38rem 0.95rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.825rem',
                fontWeight: isActive ? 700 : 550,
                whiteSpace: 'nowrap',
                transition: 'var(--transition-fast)',
                boxShadow: isActive ? '0 2px 8px var(--primary-glow)' : 'var(--shadow-sm)',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* search and multi-facet filter bar */}
      <div
        className="card"
        style={{
          marginBottom: '2rem',
          padding: '1.35rem',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        {/* search input with clear button */}
        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)',
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{
              paddingLeft: '2.5rem',
              paddingRight: searchTerm ? '2.5rem' : '1rem',
              fontSize: '0.94rem',
            }}
            placeholder="Search keywords, book title, author, edition, or course number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)',
                padding: '4px',
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* dropdown filters grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '1rem',
            alignItems: 'flex-end',
          }}
        >
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.785rem' }}>
              Condition
            </label>
            <select
              className="form-select"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.865rem' }}
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Conditions' : c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.785rem' }}>
              Campus Node
            </label>
            <select
              className="form-select"
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.865rem' }}
            >
              {CAMPUSES.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Campuses' : c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.785rem' }}>
              Availability Status
            </label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.865rem' }}
            >
              <option value="All">All Statuses</option>
              <option value="AVAILABLE">Available Now</option>
              <option value="REQUESTED">Request Pending</option>
              <option value="UNAVAILABLE">Currently Borrowed</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.785rem' }}>
              Sort By
            </label>
            <select
              className="form-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.865rem' }}
            >
              <option value="relevant">Most Relevant</option>
              <option value="newest">Recently Listed</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="btn btn-secondary"
              style={{
                padding: '0.5rem 0.85rem',
                fontSize: '0.825rem',
                gap: '0.35rem',
                color: 'var(--accent-amber)',
              }}
            >
              <RotateCcw size={14} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* active filter summary badges */}
      {hasActiveFilters && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '1.5rem',
            fontSize: '0.825rem',
          }}
        >
          <span style={{ color: 'var(--text-tertiary)', fontWeight: 600 }}>Active filters:</span>
          {searchTerm && (
            <span
              className="badge"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              Search: "{searchTerm}"
              <button onClick={() => setSearchTerm('')} style={{ marginLeft: '4px' }}>
                <X size={12} />
              </button>
            </span>
          )}
          {category !== 'All' && (
            <span
              className="badge"
              style={{
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                border: '1px solid var(--primary-border)',
              }}
            >
              Category: {category}
              <button onClick={() => setCategory('All')} style={{ marginLeft: '4px' }}>
                <X size={12} />
              </button>
            </span>
          )}
          {condition !== 'All' && (
            <span
              className="badge"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              Condition: {condition}
              <button onClick={() => setCondition('All')} style={{ marginLeft: '4px' }}>
                <X size={12} />
              </button>
            </span>
          )}
          {campus !== 'All' && (
            <span
              className="badge"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              Campus: {campus}
              <button onClick={() => setCampus('All')} style={{ marginLeft: '4px' }}>
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* results summary count */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          fontSize: '0.865rem',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <div>
          Showing <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{resources.length}</span> items
        </div>
      </div>

      {/* content area */}
      {loading ? (
        <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          <div className="font-mono" style={{ fontSize: '0.9rem' }}>
            Fetching verified campus inventory...
          </div>
        </div>
      ) : error ? (
        <EmptyState
          title="Error loading items"
          description={error}
          actionLabel="Retry query"
          onAction={fetchResources}
        />
      ) : resources.length === 0 ? (
        <EmptyState
          title="No resources matched your criteria"
          description="Try broadening your keywords or removing condition and campus filters."
          actionLabel="Clear All Filters"
          onAction={handleResetFilters}
          icon={PackageOpen}
        />
      ) : (
        <div className="grid-cards">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onSelect={() => onNavigate('resource-detail', { id: resource.id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
