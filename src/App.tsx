import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { SkeletonHero } from './components/Skeletons';
import InView from './components/InView';
import LaunchNotification from './components/LaunchNotification';
const Hero = React.lazy(() => import('./components/Hero'));
const ProblemSolution = React.lazy(() => import('./components/ProblemSolution'));
const HowItWorks = React.lazy(() => import('./components/HowItWorks'));
const LiveProjects = React.lazy(() => import('./components/LiveProjects'));
const WhyThisMatters = React.lazy(() => import('./components/WhyThisMatters'));
const TechTrust = React.lazy(() => import('./components/TechTrust'));
const Rewards = React.lazy(() => import('./components/Rewards'));
const Testimonials = React.lazy(() => import('./components/Testimonials'));
const AboutUs = React.lazy(() => import('./components/AboutUs'));
const FAQ = React.lazy(() => import('./components/FAQ'));
const CallToAction = React.lazy(() => import('./components/CallToAction'));
import Navigation from './components/Navigation';
import AuthModal from './components/auth/AuthModal';
import ToastContainer from './components/auth/ToastNotification';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './components/auth/AuthProvider';
import { useAuth } from './components/auth/useAuth';
import { useToast } from './hooks/useToast';
import DebugPanel from './components/DebugPanel';
import ErrorBoundary from './components/ErrorBoundary';
import { Project } from './types';

// 🚀 AI Waitlist Components
import WaitlistHero from './components/waitlist/WaitlistHero';
import BenefitsGrid from './components/waitlist/BenefitsGrid';
import AnalyticsDashboard from './components/waitlist/AnalyticsDashboard';
import './components/waitlist/waitlist.css';

// 🚀 Direct imports for instant navigation
import Dashboard from './components/Dashboard';
import Community from './components/Community';
import Merchandise from './components/Merchandise';
import ProfilePage from './components/profile/ProfilePage';
import AdminDashboard from './components/admin/AdminDashboard';
import PortfolioAnalytics from './components/PortfolioAnalytics';
import ProjectComparison from './components/ProjectComparison';
import ProjectDetailPage from './components/ProjectDetailPage';
import NewsAndUpdates from './components/NewsAndUpdates';
import NotificationCenter from './components/NotificationCenter';
import EnhancedSearch from './components/EnhancedSearch';
import ProjectCatalog from './components/ProjectCatalog';


// 🛡️ Type definitions for better type safety
type ViewType = 'home' | 'dashboard' | 'projects' | 'community' | 'merch' | 'profile' | 'admin' | 'portfolio' | 'compare' | 'news' | 'notifications' | 'search' | 'project-detail' | 'waitlist' | 'analytics';
type ProjectDetailTab = 'overview' | 'invest';
type AuthModalMode = 'login' | 'register';

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
    const idle = (cb: () => void) => {
      const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number };
      if (w.requestIdleCallback) {
        w.requestIdleCallback(cb);
      } else {
        setTimeout(cb, 600);
      }
    };
    idle(() => {
      import('./components/ProjectCatalog').catch(() => {});
      import('./components/Community').catch(() => {});
    });
  }, []);


  // 🚀 Memoized constants for performance
  const protectedViews = useMemo(() => ['profile', 'portfolio'] as const, []);
  const isCurrentViewProtected = useMemo(() => 
    protectedViews.includes(currentView as 'profile' | 'portfolio'), 
    [currentView, protectedViews]
  );

  // 🛡️ Handle logout redirect with proper cleanup
  useEffect(() => {
    const logoutTimestamp = localStorage.getItem('logout_timestamp');
    if (logoutTimestamp && !isAuthenticated) {
      // Redirect to home if on protected views
      if (isCurrentViewProtected) {
        setCurrentView('home');
      }
      localStorage.removeItem('logout_timestamp');
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
    const adminView = sessionStorage.getItem('admin_view');
    if (adminView === 'true') {
      setCurrentView('admin');
      sessionStorage.removeItem('admin_view'); // Clear it after use
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
    const currentScrollY = window.scrollY;
    
    setViewScrollPositions(prev => ({
      ...prev,
      [currentView]: currentScrollY
    }));
  }, [currentView]);

  // 🚀 Optimized view change handler for instant navigation
  const handleViewChange = useCallback((view: ViewType) => {
    if (view === currentView) return;

    const enteringHeavy = view === 'projects' || view === 'community';
    if (enteringHeavy) {
      document.documentElement.classList.add('force-dark-bg');
    }

    if (protectedViews.includes(view as 'profile' | 'portfolio')) {
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

    if (view === 'projects' || view === 'community') {
      updates();
    } else {
      requestAnimationFrame(updates);
    }
  }, [handleAuthRequired, toast, currentView, protectedViews, saveCurrentViewState]);

  // Remove force-dark once the heavy views have rendered at least once
  useEffect(() => {
    if (currentView === 'projects' || currentView === 'community') {
      // Allow a frame for Suspense fallback to mount
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('force-dark-bg');
      });
    } else {
      document.documentElement.classList.remove('force-dark-bg');
    }
  }, [currentView]);

  // 🚀 Optimized project selection handler
  const handleProjectSelect = useCallback((project: Project, tab?: ProjectDetailTab) => {
    // Save current view's scroll position and state before opening project detail
    saveCurrentViewState();
    
    setPreviousView(currentView);
    setSelectedProject(project);
    setProjectDetailTab(tab || 'overview');
    setCurrentView('project-detail');
  }, [currentView, saveCurrentViewState]);

  // 🚀 Optimized project detail close handler
  const handleProjectDetailClose = useCallback(() => {
    // Restore previous view
    setCurrentView(previousView);
    
    // Restore scroll position after a short delay to ensure view is rendered
    setTimeout(() => {
      const savedScrollY = viewScrollPositions[previousView];
      if (savedScrollY !== undefined) {
        window.scrollTo({
          top: savedScrollY,
          behavior: 'smooth'
        });
      }
    }, 100);
  }, [previousView, viewScrollPositions]);

  // 🚀 Optimized project selection from navigation
  const handleNavigationProjectSelect = useCallback((project: Project, tab?: ProjectDetailTab) => {
    // Save current view's scroll position and state
    saveCurrentViewState();
    
    setPreviousView(currentView);
    setSelectedProject(project);
    setProjectDetailTab(tab || 'overview');
    setCurrentView('project-detail');
  }, [currentView, saveCurrentViewState]);

  // 🚀 Optimized project selection from comparison
  const handleComparisonProjectSelect = useCallback((project: Project, tab?: ProjectDetailTab) => {
    // Save current view's scroll position and state
    saveCurrentViewState();
    
    setPreviousView(currentView);
    setSelectedProject(project);
    setProjectDetailTab(tab || 'overview');
    setCurrentView('project-detail');
  }, [currentView, saveCurrentViewState]);

  // 🚀 Optimized project selection from live projects
  const handleLiveProjectsSelect = useCallback((project: Project, tab?: ProjectDetailTab) => {
    // Save current view's scroll position and state
    saveCurrentViewState();
    
    setPreviousView(currentView);
    setSelectedProject(project);
    setProjectDetailTab(tab || 'overview');
    setCurrentView('project-detail');
  }, [currentView, saveCurrentViewState]);

  // 🚀 Optimized search view handler
  const handleSearchViewAll = useCallback((term: string) => {
    setSearchTerm(term);
    handleViewChange('search');
  }, [handleViewChange]);



  // 🚀 Memoized current view renderer with optimized component loading
  const renderCurrentView = useMemo(() => {

    const HeroFallback = () => <SkeletonHero />;

    switch (currentView) {
      case 'projects':
        return (
          <ProjectCatalog 
            onProjectSelect={handleProjectSelect}
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
            onProjectSelect={handleComparisonProjectSelect}
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
            <React.Suspense fallback={<HeroFallback />}><Hero setCurrentView={handleViewChange} /></React.Suspense>
            <InView><React.Suspense fallback={null}><ProblemSolution setCurrentView={handleViewChange} /></React.Suspense></InView>
            <InView><React.Suspense fallback={null}><HowItWorks setCurrentView={handleViewChange} /></React.Suspense></InView>
            <InView><React.Suspense fallback={null}><Rewards /></React.Suspense></InView>
            <InView><React.Suspense fallback={null}>
              <LiveProjects onViewAll={() => handleViewChange('projects')} onProjectSelect={handleLiveProjectsSelect} />
            </React.Suspense></InView>
            <InView><React.Suspense fallback={null}><WhyThisMatters onJoin={() => handleAuthRequired('register')} /></React.Suspense></InView>
            <InView><React.Suspense fallback={null}><TechTrust /></React.Suspense></InView>
            <InView><React.Suspense fallback={null}><Testimonials /></React.Suspense></InView>
            <InView><React.Suspense fallback={null}><AboutUs /></React.Suspense></InView>
            <InView><React.Suspense fallback={null}><FAQ /></React.Suspense></InView>
            <InView><React.Suspense fallback={null}><CallToAction setCurrentView={handleViewChange} /></React.Suspense></InView>
          </>
        );
    }
  }, [
    currentView,
    handleViewChange,
    handleProjectSelect,
    handleComparisonProjectSelect,
    handleLiveProjectsSelect,
    handleProjectDetailClose,
    isAuthenticated,
    selectedProject,
    projectDetailTab,
    handleAuthRequired,
    previousView,
    searchTerm
  ]);

  // 🚀 Memoized navigation props
  const navigationProps = useMemo(() => ({
    currentView,
    setCurrentView: handleViewChange,
    onAuthRequired: handleAuthRequired,
    onProjectSelect: handleNavigationProjectSelect,
    onSearchViewAll: handleSearchViewAll,
    previousView
   
  }), [currentView, handleViewChange, handleAuthRequired, handleNavigationProjectSelect, handleSearchViewAll, previousView]);

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
      <LaunchNotification />
      {currentView !== 'admin' && <Navigation {...navigationProps} />}
      {renderCurrentView}
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