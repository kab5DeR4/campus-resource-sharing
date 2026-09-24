import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import ResourceCard from '../components/ResourceCard';
import {
  ArrowRight,
  Search,
  BookOpen,
  Calculator,
  FlaskConical,
  Cpu,
  Layers,
  ShieldCheck,
  Sparkles,
  GraduationCap,
  HeartHandshake,
  ArrowUpRight,
  Zap,
  Check,
  MapPin,
  Clock,
} from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Books',
    icon: BookOpen,
    desc: 'Textbooks, lab manuals & study guides',
    accent: '#0f4c3a',
    bg: '#edf5f1',
    count: '42+ items',
  },
  {
    name: 'Calculators',
    icon: Calculator,
    desc: 'TI-84, Casio & scientific graphic tools',
    accent: '#d97706',
    bg: '#fef3c7',
    count: '18+ items',
  },
  {
    name: 'Lab Equipment',
    icon: FlaskConical,
    desc: 'Lab coats, safety goggles & dissection kits',
    accent: '#0284c7',
    bg: '#e0f2fe',
    count: '25+ items',
  },
  {
    name: 'Electronics',
    icon: Cpu,
    desc: 'Arduino kits, Raspberry Pi, breadboards & cables',
    accent: '#7c3aed',
    bg: '#f3e8ff',
    count: '31+ items',
  },
];

const RECENT_ACTIVITY = [
  { student: 'Alex P.', action: 'borrowed', item: 'TI-84 Plus CE', time: '12m ago', place: 'Science Library' },
  { student: 'Sneha R.', action: 'listed', item: 'Microbiology Lab Coat (Size M)', time: '28m ago', place: 'Health Sciences' },
  { student: 'Dev M.', action: 'returned', item: 'Arduino Starter Kit', time: '1h ago', place: 'Engineering Hub' },
];

export default function HomePage({ onNavigate }) {
  const [featuredResources, setFeaturedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState('');

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await api.resources.list({ status: 'AVAILABLE' });
        setFeaturedResources(data.resources.slice(0, 6));
      } catch (err) {
        console.error('Failed to load featured resources', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      onNavigate('browse', { search: heroSearch.trim() });
    } else {
      onNavigate('browse');
    }
  };

  return (
    <div>
      {/* =========================================================================
          HERO SECTION: Collegiate craft canvas with live campus pulse
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          padding: '4.5rem 0 3.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          overflow: 'hidden',
        }}
      >
        {/* ambient background mesh & subtle glows */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(15, 76, 58, 0.08) 0%, rgba(217, 119, 6, 0.04) 40%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '920px', textAlign: 'center' }}>
          {/* live campus activity pill */}
          <div
            className="animate-entrance"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              border: '1px solid var(--primary-border)',
              padding: '0.3rem 0.95rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.785rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              marginBottom: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                animation: 'livePulse 2s infinite',
              }}
            />
            <span>CAMPUS NODE ACTIVE &bull; ZERO-COST STUDENT RESOURCE POOL</span>
          </div>

          {/* flagship headline */}
          <h1
            className="animate-entrance stagger-1"
            style={{
              fontSize: 'clamp(2.35rem, 5.5vw, 3.85rem)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              color: 'var(--text-primary)',
              lineHeight: 1.12,
              marginBottom: '1.35rem',
            }}
          >
            Share what you have.{' '}
            <span
              className="font-serif"
              style={{
                fontStyle: 'italic',
                fontWeight: 500,
                color: 'var(--accent-amber)',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(217, 119, 6, 0.35)',
                textUnderlineOffset: '6px',
              }}
            >
              Borrow
            </span>{' '}
            what you need.
          </h1>

          <p
            className="animate-entrance stagger-2"
            style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 2.25rem auto',
            }}
          >
            The trusted campus marketplace for textbooks, scientific calculators, lab gear, and coursework electronics. Keep gear in circulation without draining student budgets.
          </p>

          {/* quick interactive search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="animate-entrance stagger-3"
            style={{
              maxWidth: '640px',
              margin: '0 auto 2rem auto',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              padding: '0.4rem 0.5rem 0.4rem 1.1rem',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px solid var(--border-strong)',
              boxShadow: 'var(--shadow-md)',
              transition: 'var(--transition-fast)',
            }}
          >
            <Search size={19} style={{ color: 'var(--text-tertiary)', marginRight: '0.65rem', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search by book title, course code (e.g. CS101), TI-84, lab coat..."
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '0.94rem',
                color: 'var(--text-primary)',
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
              Search Gear
            </button>
          </form>

          {/* quick category filter shortcuts */}
          <div
            className="animate-entrance stagger-4"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
              fontSize: '0.825rem',
            }}
          >
            <span style={{ color: 'var(--text-tertiary)', fontWeight: 600 }}>Quick jumps:</span>
            {['Books', 'Calculators', 'Lab Equipment', 'Electronics'].map((cat) => (
              <button
                key={cat}
                onClick={() => onNavigate('browse', { category: cat })}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  padding: '0.22rem 0.7rem',
                  borderRadius: 'var(--radius-pill)',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.785rem',
                  transition: 'var(--transition-fast)',
                  boxShadow: 'var(--shadow-sm)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          CAMPUS LIVE TICKER: Real-time community handovers & confidence ribbon
          ========================================================================= */}
      <section
        style={{
          backgroundColor: '#0c2820',
          color: '#e8f5ef',
          padding: '1.25rem 0',
          borderBottom: '1px solid rgba(184, 222, 208, 0.15)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  backgroundColor: 'rgba(217, 119, 6, 0.25)',
                  color: '#fde68a',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.725rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Zap size={12} />
                <span>LIVE FEED</span>
              </div>
              <div style={{ fontSize: '0.84rem', color: '#a3c2b8' }}>
                <span style={{ fontWeight: 700, color: '#ffffff' }}>{RECENT_ACTIVITY[0].student}</span>{' '}
                {RECENT_ACTIVITY[0].action} <span style={{ color: '#fde68a' }}>{RECENT_ACTIVITY[0].item}</span> at{' '}
                {RECENT_ACTIVITY[0].place} &bull; <span style={{ fontFamily: 'var(--font-mono)' }}>{RECENT_ACTIVITY[0].time}</span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                color: '#8cb1a6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={14} style={{ color: '#10b981' }} />
                <span>100% Student Verified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <HeartHandshake size={14} style={{ color: '#f59e0b' }} />
                <span>Safe Campus Handover</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CAMPUS STATS SCOREBOARD: High-impact credibility numbers
          ========================================================================= */}
      <section style={{ padding: '3.5rem 0 2rem' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {[
              { number: '500+', label: 'Items In Active Rotation', detail: 'Textbooks, lab kits & electronics' },
              { number: '100%', label: 'Peer Verified Exchange', detail: 'Protected with student campus credentials' },
              { number: '₹60,000+', label: 'Estimated Student Savings', detail: 'Saved from avoiding single-use purchases' },
              { number: '< 2 hrs', label: 'Average Pickup Time', detail: 'Coordinated easily at campus library hubs' },
            ].map((stat, i) => (
              <div
                key={i}
                className="card"
                style={{
                  padding: '1.4rem',
                  borderLeft: '4px solid var(--primary)',
                  backgroundColor: 'var(--bg-surface)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: 'var(--primary)',
                    lineHeight: 1.1,
                    marginBottom: '0.35rem',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {stat.number}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '0.785rem', color: 'var(--text-tertiary)' }}>
                  {stat.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          CATEGORIES DIRECTORY: Bespoke visual cards
          ========================================================================= */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--accent-amber)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '0.3rem',
                }}
              >
                Curated Collections
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Popular Academic Equipment
              </h2>
            </div>
            <button
              onClick={() => onNavigate('browse')}
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.4rem' }}
            >
              <span>View All Categories</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.35rem',
            }}
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  onClick={() => onNavigate('browse', { category: cat.name })}
                  role="button"
                  tabIndex={0}
                  className="card card-interactive"
                  style={{
                    padding: '1.5rem',
                    backgroundColor: 'var(--bg-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '1.25rem',
                      }}
                    >
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '12px',
                          backgroundColor: cat.bg,
                          color: cat.accent,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <Icon size={22} strokeWidth={2.2} />
                      </div>
                      <span
                        style={{
                          fontSize: '0.735rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text-tertiary)',
                          backgroundColor: 'var(--bg-subtle)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        {cat.count}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 750,
                        color: 'var(--text-primary)',
                        marginBottom: '0.45rem',
                      }}
                    >
                      {cat.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.845rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.45,
                        marginBottom: '1.25rem',
                      }}
                    >
                      {cat.desc}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      color: cat.accent,
                    }}
                  >
                    <span>Browse inventory</span>
                    <ArrowUpRight size={15} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED ITEMS INVENTORY: Direct cards with instant action
          ========================================================================= */}
      <section
        style={{
          padding: '4rem 0',
          backgroundColor: 'var(--bg-subtle)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '0.3rem',
                }}
              >
                Live Campus Catalog
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Recently Listed &amp; Available Now
              </h2>
            </div>
            <button
              onClick={() => onNavigate('browse')}
              className="btn btn-primary btn-sm"
              style={{ gap: '0.45rem' }}
            >
              <span>Explore All Listings</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <div className="font-mono" style={{ fontSize: '0.9rem' }}>
                Connecting to campus resource index...
              </div>
            </div>
          ) : featuredResources.length === 0 ? (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '3.5rem 1.5rem',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              <h3 style={{ marginBottom: '0.5rem' }}>No listings available at this moment</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Be the first student to list textbooks or gear on your campus node!
              </p>
              <button onClick={() => onNavigate('create-listing')} className="btn btn-primary">
                List An Item
              </button>
            </div>
          ) : (
            <div className="grid-cards">
              {featuredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onSelect={() => onNavigate('resource-detail', { id: resource.id })}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          HOW IT WORKS: 3-Step Collegiate Exchange Process
          ========================================================================= */}
      <section id="how-it-works" style={{ padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--accent-amber)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '0.35rem',
              }}
            >
              Peer-to-Peer Protocol
            </div>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              How Campus Sharing Works
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
              Simple, transparent, and built entirely around trusted campus community handovers.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              position: 'relative',
            }}
          >
            {[
              {
                step: '01',
                title: 'Browse or Share',
                desc: 'Find the textbook or calculator you need for class, or list your underused gear to help fellow students.',
                icon: Search,
              },
              {
                step: '02',
                title: 'Request & Meetup',
                desc: 'Send a request specifying your borrow duration. Once approved, arrange a safe handover at the library or student center.',
                icon: MapPin,
              },
              {
                step: '03',
                title: 'Return & Build Trust',
                desc: 'Return the equipment on time and in good shape. Boost your campus karma and unlock higher borrowing limits.',
                icon: ShieldCheck,
              },
            ].map((item, i) => {
              const StepIcon = item.icon;
              return (
                <div
                  key={i}
                  className="card"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    padding: '1.75rem',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.75rem',
                      fontWeight: 800,
                      color: 'var(--accent-amber)',
                      lineHeight: 1,
                      marginBottom: '1rem',
                    }}
                  >
                    {item.step}
                  </div>

                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem',
                    }}
                  >
                    <StepIcon size={20} strokeWidth={2.2} />
                  </div>

                  <h3
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 750,
                      color: 'var(--text-primary)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {item.title}
                  </h3>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          CAMPUS TRUST CALLOUT BANNER
          ========================================================================= */}
      <section style={{ padding: '0 0 3rem' }}>
        <div className="container">
          <div
            style={{
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: '3rem 2.5rem',
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '2rem',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ maxWidth: '600px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '1rem',
                  color: '#6ee7b7',
                }}
              >
                <GraduationCap size={14} />
                <span>STUDENT TO STUDENT INITIATIVE</span>
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.2,
                  marginBottom: '0.75rem',
                }}
              >
                Have course items sitting on your shelf?
              </h2>
              <p style={{ color: '#d1fae5', fontSize: '1rem', lineHeight: 1.55 }}>
                Help another student pass their semester without buying $100+ gear they only need for 4 weeks. List it in less than 60 seconds.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('create-listing')}
                className="btn btn-accent btn-lg"
                style={{ gap: '0.45rem' }}
              >
                <span>List Your Gear</span>
                <ArrowRight size={17} />
              </button>
              <button
                onClick={() => onNavigate('browse')}
                className="btn btn-secondary btn-lg"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.25)' }}
              >
                Browse Catalog
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
