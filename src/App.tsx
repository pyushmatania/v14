import React, { useState, useCallback, useEffect, useMemo } from 'react';

import InfoBanner from './components/InfoBanner';
import { QueryProvider } from './providers/QueryProvider';


// 🚀 Advanced lazy imports with performance monitoring
// 🚀 Route-based lazy loading is handled by RouteLoader component
import Navigation from './components/Navigation';
import AuthModal from './components/auth/AuthModal';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './components/auth/AuthProvider';
import ToastContainer from './components/auth/ToastNotification';
import { useAuth } from './components/auth/useAuth';
import { useToast } from './hooks/useToast';
import DebugPanel from './components/DebugPanel';
import ErrorBoundary from './components/ErrorBoundary';

import { Project } from './types';

// 🚀 Lazy-loaded waitlist components with performance monitoring
const WaitlistHero = React.lazy(() => import('./components/waitlist/WaitlistHero'));
const BenefitsGrid = React.lazy(() => import('./components/waitlist/BenefitsGrid'));
const AnalyticsDashboard = React.lazy(() => import('./components/waitlist/AnalyticsDashboard'));
import './components/waitlist/waitlist.css';

// 🚀 Lazy-loaded navigation components with performance monitoring
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Community = React.lazy(() => import('./components/Community'));
const Merchandise = React.lazy(() => import('./components/Merchandise'));
const ProfilePage = React.lazy(() => import('./components/profile/ProfilePage'));
const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard'));
const PortfolioAnalytics = React.lazy(() => import('./components/PortfolioAnalytics'));
const ProjectComparison = React.lazy(() => import('./components/ProjectComparison'));
const ProjectDetailPage = React.lazy(() => import('./components/ProjectDetailPage'));
const NewsAndUpdates = React.lazy(() => import('./components/NewsAndUpdates'));
const NotificationCenter = React.lazy(() => import('./components/NotificationCenter'));
const EnhancedSearch = React.lazy(() => import('./components/EnhancedSearch'));
const ProjectCatalog = React.lazy(() => import('./components/ProjectCatalog'));
import HomePage from './components/HomePage';
// Removed unused import: EntertainmentLoading


// 🛡️ Type definitions for better type safety
type ViewType = 'home' | 'dashboard' | 'projects' | 'community' | 'merch' | 'profile' | 'admin' | 'portfolio' | 'compare' | 'news' | 'notifications' | 'search' | 'project-detail' | 'waitlist' | 'analytics' | 'about' | 'browse' | 'contact' | 'login' | 'register' | 'settings';
type ProjectDetailTab = 'overview' | 'invest';
type AuthModalMode = 'login' | 'register';

const PROTECTED_VIEWS: ReadonlySet<ViewType> = new Set(['profile', 'portfolio']);

/**
 * 🎯 AppContent - Main application content with optimized state management
 * @description Handles view navigation, authentication, and component rendering
 */
function AppContent() {
  // 🎯 State management with proper typing
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectDetailTab, setProjectDetailTab] = useState<ProjectDetailTab>('overview');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');
  const [previousView, setPreviousView] = useState<ViewType>('home');
  const [viewScrollPositions, setViewScrollPositions] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 🎯 Hooks - Always call hooks at the top level
  const auth = useAuth();
  const toastHook = useToast();
  
  const isAuthenticated = auth.isAuthenticated;
  const toast = toastHook.toast;
  const removeToast = toastHook.removeToast;
  const toasts = toastHook.toasts;
  
  // Warm up initial above-the-fold chunk to avoid blank screen if lazy import stalls
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('./components/Hero').catch(() => {});
    }
  }, []);

  // Enable hash-based navigation for deep links like #waitlist
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const applyHashRoute = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'waitlist') {
        setSelectedProject(null);
        setCurrentView('waitlist');
      }
    };
    // Apply on initial load
    applyHashRoute();
    // Listen for subsequent hash changes
    window.addEventListener('hashchange', applyHashRoute);
    return () => window.removeEventListener('hashchange', applyHashRoute);
  }, []);

  // Smoothly scroll to top when entering the waitlist view for best UX
  useEffect(() => {
    if (currentView === 'waitlist' && typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }, [currentView]);



  // Idle prefetch heavy routes (Browse and Community) for instant navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const idle = () => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          import('./components/ProjectCatalog').catch(() => {});
          import('./components/Community').catch(() => {});
        });
      } else {
        setTimeout(() => {
          import('./components/ProjectCatalog').catch(() => {});
          import('./components/Community').catch(() => {});
        }, 600);
      }
    };
    idle();
  }, []);


  const isCurrentViewProtected = PROTECTED_VIEWS.has(currentView);

  // 🛡️ Handle logout redirect with proper cleanup
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const logoutTimestamp = window.localStorage.getItem('logout_timestamp');
      if (logoutTimestamp && !isAuthenticated) {
        // Redirect to home if on protected views
        if (isCurrentViewProtected) {
          setCurrentView('home');
        }
        window.localStorage.removeItem('logout_timestamp');
      }
    } catch {
      // Ignore storage access issues (e.g., privacy mode)
    }
  }, [isAuthenticated, isCurrentViewProtected]);

  // 🛡️ Additional safety check for protected views
  useEffect(() => {
    if (!isAuthenticated && isCurrentViewProtected) {
      setCurrentView('home');
    }
  }, [isAuthenticated, isCurrentViewProtected]);

  // 🛡️ Check for admin view in sessionStorage after reload
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const adminView = window.sessionStorage.getItem('admin_view');
      if (adminView === 'true') {
        setCurrentView('admin');
        window.sessionStorage.removeItem('admin_view'); // Clear it after use
      }
    } catch {
      // Ignore session storage access issues
    }
  }, []);

  // 🚀 Optimized authentication handler with useCallback
  const handleAuthRequired = useCallback((mode: AuthModalMode = 'login'): boolean => {
    if (!isAuthenticated) {
      setAuthModalMode(mode);
      setAuthModalOpen(true);
      return false;
    }
    return true;
  }, [isAuthenticated]);

  // 🚀 Optimized view state management
  const saveCurrentViewState = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const currentScrollY = window.scrollY ?? window.pageYOffset ?? 0;

    setViewScrollPositions(prev => ({
      ...prev,
      [currentView]: currentScrollY
    }));
  }, [currentView]);

  // 🚀 Optimized view change handler for instant navigation
  const handleViewChange = useCallback((view: ViewType) => {
    if (view === currentView) return;

    const enteringHeavy = view === 'projects' || view === 'community';
    const docElement = typeof document !== 'undefined' ? document.documentElement : null;

    if (enteringHeavy) {
      docElement?.classList.add('force-dark-bg');
    }

    if (PROTECTED_VIEWS.has(view)) {
      if (!handleAuthRequired()) {
        toast.info('Please sign in', 'You need to be logged in to access this page');
        return;
      }
    }

    const updates = () => {
      saveCurrentViewState();
      setPreviousView(currentView);
      setCurrentView(view);
    };

    if (enteringHeavy) {
      updates();
      return;
    }

    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(updates);
    } else {
      updates();
    }
  }, [handleAuthRequired, toast, currentView, saveCurrentViewState]);

  // Remove force-dark once the heavy views have rendered at least once
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const docElement = document.documentElement;
    const removeForceDark = () => {
      docElement.classList.remove('force-dark-bg');
    };

    if (currentView === 'projects' || currentView === 'community') {
      if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(removeForceDark);
      } else {
        removeForceDark();
      }
    } else {
      removeForceDark();
    }
  }, [currentView]);

  // 🚀 Optimized project selection handler
  const openProjectDetail = useCallback((project: Project, tab: ProjectDetailTab = 'overview') => {
    saveCurrentViewState();

    setPreviousView(currentView);
    setSelectedProject(project);
    setProjectDetailTab(tab);
    setCurrentView('project-detail');
  }, [currentView, saveCurrentViewState]);

  // 🚀 Optimized project detail close handler
  const handleProjectDetailClose = useCallback(() => {
    // Restore previous view
    setCurrentView(previousView);

    // Restore scroll position after a short delay to ensure view is rendered
    setTimeout(() => {
      if (typeof window === 'undefined') {
        return;
      }

      const savedScrollY = viewScrollPositions[previousView];
      if (typeof savedScrollY === 'number') {
        window.scrollTo({
          top: savedScrollY,
          behavior: 'smooth'
        });
      }
    }, 100);
  }, [previousView, viewScrollPositions]);

  // 🚀 Optimized search view handler
  const handleSearchViewAll = useCallback((term: string) => {
    setSearchTerm(term);
    handleViewChange('search');
  }, [handleViewChange]);



  // 🚀 Memoized current view renderer with optimized component loading
  const renderCurrentView = useMemo(() => {

    // const _HeroFallback = () => <SkeletonHero />;

    switch (currentView) {
      case 'projects':
        return (
          <ProjectCatalog
            onProjectSelect={openProjectDetail}
          />
        );
      case 'dashboard':
        return <Dashboard setCurrentView={handleViewChange} />;
      case 'community':
        return <Community />;
      case 'merch':
        return <Merchandise />;
      case 'profile':
        return isAuthenticated ? <ProfilePage /> : null;
      case 'portfolio':
        return isAuthenticated ? <PortfolioAnalytics /> : null;
      case 'compare':
        return (
          <ProjectComparison
            onProjectSelect={openProjectDetail}
          />
        );
      case 'news':
        return <NewsAndUpdates />;
      case 'notifications':
        return <NotificationCenter setCurrentView={handleViewChange} onClose={() => handleViewChange(previousView)} />;
      case 'search':
        return <EnhancedSearch initialSearchTerm={searchTerm} onBack={() => handleViewChange(previousView)} />;
      case 'waitlist':
        return (
          <>
            <WaitlistHero setCurrentView={handleViewChange} />
            <BenefitsGrid />
          </>
        );
      case 'analytics':
        return <AnalyticsDashboard isAdmin={true} />;
      case 'admin':
        return <AdminDashboard />;
      case 'project-detail':
        return selectedProject ? (
          <ProjectDetailPage 
            project={selectedProject} 
            onClose={handleProjectDetailClose}
            onInvest={() => handleViewChange('community')}
            initialTab={projectDetailTab}
          />
        ) : null;
      default:
        return (
          <>
            <HomePage
              setCurrentView={handleViewChange}
              onProjectSelect={openProjectDetail}
            />
          </>
        );
    }
  }, [
    currentView,
    handleViewChange,
    openProjectDetail,
    handleProjectDetailClose,
    isAuthenticated,
    selectedProject,
    projectDetailTab,
    previousView,
    searchTerm
  ]);

  // 🚀 Memoized navigation props
  const navigationProps = useMemo(() => ({
    currentView,
    setCurrentView: handleViewChange,
    onAuthRequired: handleAuthRequired,
    onProjectSelect: openProjectDetail,
    onSearchViewAll: handleSearchViewAll,
    previousView

  }), [currentView, handleViewChange, handleAuthRequired, openProjectDetail, handleSearchViewAll, previousView]);

  // 🚀 Memoized auth modal props
  const authModalProps = useMemo(() => ({
    isOpen: authModalOpen,
    onClose: () => setAuthModalOpen(false),
    initialMode: authModalMode
  }), [authModalOpen, authModalMode]);

  // 🚀 Memoized toast container props
  const toastContainerProps = useMemo(() => ({
    toasts,
    onClose: removeToast
  }), [toasts, removeToast]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-colors duration-500">
        <InfoBanner />
        {currentView !== 'admin' && <Navigation {...navigationProps} />}
        <QueryProvider>
          <React.Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          }>
            {renderCurrentView}
          </React.Suspense>
        </QueryProvider>
                <DebugPanel />

        <AuthModal {...authModalProps} />
        <ToastContainer {...toastContainerProps} />
      </div>
    );
  }

/**
 * 🎯 App - Root application component with error boundary and providers
 * @description Wraps the application with necessary providers and error handling
 */
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;