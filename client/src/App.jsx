import React, { useState, useEffect, useCallback } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import DemoSwitcher from './components/DemoSwitcher';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// pages
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import ResourceDetailPage from './pages/ResourceDetailPage';
import CreateListingPage from './pages/CreateListingPage';
import EditListingPage from './pages/EditListingPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function AppContent() {
  const [currentView, setCurrentView] = useState('home');
  const [viewParams, setViewParams] = useState({});

  // sync url hash so reload and browser back button work smoothly
  const parseHash = useCallback(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash) {
      setCurrentView('home');
      setViewParams({});
      return;
    }

    const [route, queryString] = hash.split('?');
    const query = new URLSearchParams(queryString || '');
    const params = {};
    for (const [k, v] of query.entries()) {
      params[k] = v;
    }

    if (route.startsWith('resources/')) {
      const id = route.split('/')[1];
      setCurrentView('resource-detail');
      setViewParams({ id, ...params });
    } else if (route.startsWith('edit-listing/')) {
      const id = route.split('/')[1];
      setCurrentView('edit-listing');
      setViewParams({ id, ...params });
    } else if (route.startsWith('profile/')) {
      const id = route.split('/')[1];
      setCurrentView('profile');
      setViewParams({ id, ...params });
    } else {
      setCurrentView(route || 'home');
      setViewParams(params);
    }
  }, []);

  useEffect(() => {
    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, [parseHash]);

  // programmatic navigation helper
  const navigate = (view, params = {}) => {
    let hash = `#/${view}`;
    if (view === 'resource-detail' && params.id) {
      hash = `#/resources/${params.id}`;
    } else if (view === 'edit-listing' && params.id) {
      hash = `#/edit-listing/${params.id}`;
    } else if (view === 'profile' && params.id) {
      hash = `#/profile/${params.id}`;
    } else if (Object.keys(params).length > 0) {
      const q = new URLSearchParams(params).toString();
      hash = `#/${view}?${q}`;
    }

    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 1-click test student switcher bar */}
      <DemoSwitcher />

      {/* main sticky navigation */}
      <Navbar currentView={currentView} onNavigate={navigate} />

      {/* active page view */}
      <main>
        {currentView === 'home' && <HomePage onNavigate={navigate} />}
        {currentView === 'browse' && <BrowsePage onNavigate={navigate} initialCategory={viewParams.category} />}
        {currentView === 'resource-detail' && <ResourceDetailPage resourceId={viewParams.id} onNavigate={navigate} />}
        {currentView === 'create-listing' && <CreateListingPage onNavigate={navigate} />}
        {currentView === 'edit-listing' && <EditListingPage resourceId={viewParams.id} onNavigate={navigate} />}
        {currentView === 'dashboard' && <DashboardPage onNavigate={navigate} initialTab={viewParams.tab} />}
        {currentView === 'profile' && <ProfilePage profileId={viewParams.id} onNavigate={navigate} />}
        {currentView === 'login' && <LoginPage onNavigate={navigate} />}
        {currentView === 'register' && <RegisterPage onNavigate={navigate} />}
      </main>

      {/* footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
