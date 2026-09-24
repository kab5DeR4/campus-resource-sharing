import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ResourceCard from '../components/ResourceCard';
import StatusBadge from '../components/StatusBadge';
import {
  User,
  MapPin,
  Mail,
  ShieldCheck,
  Edit3,
  Save,
  X,
  GraduationCap,
  Calendar,
  Sparkles,
  Layers,
} from 'lucide-react';

const CAMPUSES = ['Main Tech Campus', 'North Health & Science', 'South Arts & Design'];

export default function ProfilePage({ userId, onNavigate }) {
  const { user: currentUser, refreshUser } = useAuth();
  const { addToast } = useToast();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // edit fields
  const [name, setName] = useState('');
  const [campus, setCampus] = useState(CAMPUSES[0]);
  const [department, setDepartment] = useState('');
  const [bio, setBio] = useState('');

  const isOwnProfile = !userId || (currentUser && currentUser.id === userId);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.profile.get(userId);
      setProfileData(data);
      if (data.user) {
        setName(data.user.name || '');
        setCampus(data.user.campus || CAMPUSES[0]);
        setDepartment(data.user.department || '');
        setBio(data.user.bio || '');
      }
    } catch (err) {
      addToast(err.message || 'Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  }, [userId, addToast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.profile.update({
        name: name.trim(),
        campus,
        department: department.trim(),
        bio: bio.trim(),
      });
      addToast('Profile updated successfully!', 'success');
      setEditing(false);
      await refreshUser();
      fetchProfile();
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
        <div className="font-mono">Loading student credentials...</div>
      </div>
    );
  }

  const user = profileData?.user || currentUser;
  const userResources = profileData?.resources || [];

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem', maxWidth: '960px' }}>
      {/* profile banner & header */}
      <div
        className="card"
        style={{
          padding: '2.5rem 2rem',
          backgroundColor: 'var(--bg-surface)',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'radial-gradient(rgba(15, 76, 58, 0.04) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, var(--primary), var(--accent-amber))',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.85rem',
                fontFamily: 'var(--font-display)',
                boxShadow: 'var(--shadow-md)',
                border: '3px solid #ffffff',
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {user?.name}
                </h1>
                <div
                  style={{
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.725rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <ShieldCheck size={13} />
                  <span>VERIFIED STUDENT</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontSize: '0.865rem',
                  color: 'var(--text-secondary)',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={14} style={{ color: 'var(--primary)' }} />
                  <span>{user?.campus}</span>
                </div>
                {user?.department && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <GraduationCap size={14} style={{ color: 'var(--accent-amber)' }} />
                    <span>{user?.department}</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={14} />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {isOwnProfile && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.4rem' }}
            >
              <Edit3 size={15} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {user?.bio && !editing && (
          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.92rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
            }}
          >
            {user.bio}
          </div>
        )}

        {/* edit profile inline form */}
        {editing && (
          <form
            onSubmit={handleSaveProfile}
            style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.2rem',
                marginBottom: '1.2rem',
              }}
            >
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
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
                <label className="form-label">Department / Major</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Computer Science, Mechanical Eng."
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Short Academic Bio</label>
              <textarea
                className="form-textarea"
                placeholder="Share your coursework interests or study schedule for campus gear pickups."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ minHeight: '80px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
                style={{ gap: '0.4rem' }}
              >
                <Save size={15} />
                <span>{saving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* user's shared catalog items */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {isOwnProfile ? 'Your Active Listings' : `${user?.name?.split(' ')[0]}'s Shared Gear`}
            </h2>
            <p style={{ fontSize: '0.865rem', color: 'var(--text-secondary)' }}>
              Equipment currently offered to students in this campus node
            </p>
          </div>

          {isOwnProfile && (
            <button
              onClick={() => onNavigate('create-listing')}
              className="btn btn-primary btn-sm"
            >
              + List New Item
            </button>
          )}
        </div>

        {userResources.length === 0 ? (
          <div
            className="card"
            style={{
              padding: '3rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            <Layers size={32} style={{ color: 'var(--text-tertiary)', margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>No listings available</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {isOwnProfile
                ? "You haven't added any textbooks or tools yet."
                : 'This student has not published any equipment currently.'}
            </p>
          </div>
        ) : (
          <div className="grid-cards">
            {userResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onSelect={() => onNavigate('resource-detail', { id: resource.id })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
