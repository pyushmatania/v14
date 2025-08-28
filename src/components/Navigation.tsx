import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Film, 
  BarChart3, 
  Users, 
  ShoppingBag, 
  BarChart, 
  GitCompareArrows as ArrowsCompare, 
  Newspaper, 
  LayoutDashboard,
  User,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Sparkles
} from 'lucide-react';
import { useState, useCallback, useEffect, useMemo, memo } from 'react';
import * as React from 'react';

import useIsMobile from '../hooks/useIsMobile';

// Import logo image

import { Project } from '../types';
import { circlesLogo, getUserAvatar } from '../utils/imageUtils';

import { useAuth } from './auth/useAuth';
import MobileBottomBar from './MobileBottomBar';
import NotificationDropdown from './NotificationDropdown';
import SearchBar from './SearchBar';
import { useTheme } from './ThemeContext';

// 🛡️ Type definitions for better type safety
type ViewType = 'home' | 'dashboard' | 'projects' | 'community' | 'merch' | 'profile' | 'admin' | 'portfolio' | 'compare' | 'news' | 'notifications' | 'search' | 'project-detail' | 'waitlist' | 'analytics';
type ProjectDetailTab = 'overview' | 'invest';
type AuthMode = 'login' | 'register';

interface NavigationProps {
  currentView: ViewType;
  setCurrentView: (_view: ViewType) => void;
  onAuthRequired: (_mode?: AuthMode) => boolean;
  onProjectSelect?: (_project: Project, _tab?: ProjectDetailTab) => void;
  onSearchViewAll?: (_term: string) => void;
  previousView?: ViewType;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
}

/**
 * 🎯 Navigation - Main navigation component with optimized performance
 * @description Handles desktop and mobile navigation with animations and responsive design
 */
const Navigation: React.FC<NavigationProps> = memo(({ 
  currentView, 
  setCurrentView, 
  onAuthRequired, 
  onProjectSelect,
  onSearchViewAll,
  previousView
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [logoAnimation, setLogoAnimation] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const { isMobile } = useIsMobile();

  // 🚀 Memoized navigation items for better performance
  const mainNavItems = useMemo<NavItem[]>(() => [
    { id: 'home', label: 'Home', icon: Home, requiresAuth: false },
    { id: 'projects', label: 'Browse', icon: Film, requiresAuth: false },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, requiresAuth: false },
    { id: 'community', label: 'Enter Circles', icon: Users, requiresAuth: false },
    { id: 'waitlist', label: 'Join Waitlist', icon: Sparkles, requiresAuth: false }
  ], []);

  const moreNavItems = useMemo<NavItem[]>(() => [
    { id: 'merch', label: 'Merch', icon: ShoppingBag },
    { id: 'portfolio', label: 'Portfolio', icon: BarChart, requiresAuth: true },
    { id: 'compare', label: 'Compare', icon: ArrowsCompare },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'admin', label: 'Admin', icon: LayoutDashboard }
  ], []);

  // 🚀 Optimized scroll event listener with rAF throttle
  useEffect(() => {
    let ticking = false;
    const update = () => {
      const currentScrollY = window.scrollY;
      const shouldBeScrolled = currentScrollY > 50;
      setIsScrolled(shouldBeScrolled);
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 🚀 Logo animation effect with optimized cleanup
  useEffect(() => {
    const timeoutRef = { current: 0 as number | undefined };
    const intervalId = window.setInterval(() => {
      setLogoAnimation(true);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => setLogoAnimation(false), 5000);
    }, 15000);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      clearInterval(intervalId);
      setLogoAnimation(false);
    };
  }, []);

  // 🚀 Optimized item click handler
  const handleItemClick = useCallback((itemId: string) => {
    if (itemId === 'theme') {
      toggleTheme();
    } else if (['home', 'projects', 'dashboard', 'community', 'merch', 'profile', 'admin', 'portfolio', 'compare', 'news', 'notifications', 'search', 'waitlist', 'analytics'].includes(itemId)) {
      const item = [...mainNavItems, ...moreNavItems].find(nav => nav.id === itemId);
      if (item?.requiresAuth && !isAuthenticated) {
        onAuthRequired('login');
        return;
      }
      setCurrentView(itemId as ViewType);
      setShowMoreMenu(false);
    }
  }, [toggleTheme, mainNavItems, moreNavItems, isAuthenticated, onAuthRequired, setCurrentView]);

  // 🚀 Optimized project selection handler
  const handleProjectSelect = useCallback((project: Project, tab: ProjectDetailTab = 'overview') => {
    if (onProjectSelect) {
      onProjectSelect(project, tab);
    }
  }, [onProjectSelect]);

  // 🚀 Optimized profile click handler
  const handleProfileClick = useCallback(() => {
    if (!isAuthenticated) {
      onAuthRequired('login');
    } else {
      setCurrentView('profile');
    }
  }, [isAuthenticated, onAuthRequired, setCurrentView]);

  // 🚀 Optimized search view handler
  const handleSearchViewAll = useCallback((term: string) => {
    if (onSearchViewAll) {
      onSearchViewAll(term);
    } else {
      setCurrentView('search');
    }
  }, [setCurrentView, onSearchViewAll]);

  // 🚀 Optimized notification view handler - Toggle notifications view
  const handleNotificationViewAll = useCallback(() => {
    // If already on notifications page, go back to previous view
    if (currentView === 'notifications') {
      setCurrentView(previousView || 'home');
    } else {
      setCurrentView('notifications');
    }
  }, [setCurrentView, currentView, previousView]);

  // 🚀 Memoized theme toggle button
  const ThemeToggleButton = useMemo(() => (
    <motion.button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-all duration-300 ${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.3 }}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 drop-shadow-lg" />
      ) : (
        <Sun className="w-5 h-5 drop-shadow-lg" />
      )}
    </motion.button>
  ), [theme, toggleTheme]);

  // 🚀 Memoized profile button
  const ProfileButton = useMemo(() => (
    <motion.button
      onClick={handleProfileClick}
      className={`flex items-center justify-center transition-all duration-300 ${
        theme === 'light'
          ? 'text-gray-600 hover:text-purple-600'
          : 'text-gray-300 hover:text-cyan-400'
      }`}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isAuthenticated ? "Profile" : "Sign In"}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.3 }}
    >
      {isAuthenticated ? (
        <img 
          src={user?.avatar || getUserAvatar('You')} 
          alt={user?.name || 'Profile'}
          className="w-6 h-6 rounded-full object-cover"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.src = getUserAvatar('You');
          }}
        />
      ) : (
        <User className="w-6 h-6 drop-shadow-lg" />
      )}
    </motion.button>
  ), [isAuthenticated, user?.avatar, user?.name, theme, handleProfileClick]);

  // 🚀 Memoized logo component
  const LogoComponent = useMemo(() => (
    <motion.button 
      onClick={() => setCurrentView('home')}
      className="hidden md:flex items-center gap-2 cursor-pointer relative"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0, duration: 0.3 }}
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={logoAnimation ? {
          background: [
            'radial-gradient(circle, rgba(147,51,234,0.1) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(147,51,234,0.3) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(147,51,234,0.1) 0%, transparent 70%)'
          ],
          scale: [1, 1.2, 1.1, 1.3, 1],
          opacity: [0, 0.8, 0.6, 0.9, 0]
        } : {}}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      
      {/* Animated sparkles */}
      {logoAnimation && (
        <>
          <motion.div
            className="absolute -top-2 -left-2 w-3 h-3 bg-yellow-400 rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: [0, -10, -20],
              y: [0, -10, -20]
            }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          <motion.div
            className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: [0, 10, 20],
              y: [0, -5, -15]
            }}
            transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
          />
          <motion.div
            className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-pink-400 rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: [0, -8, -16],
              y: [0, 8, 16]
            }}
            transition={{ duration: 2, delay: 0.6, ease: "easeOut" }}
          />
        </>
      )}
      
      <motion.div 
        className="w-12 h-12 flex items-center justify-center relative overflow-hidden"
        animate={logoAnimation ? {
          rotate: [0, 360],
          scale: [1, 1.1, 1],
          filter: [
            'brightness(1) drop-shadow(0 0 10px rgba(147,51,234,0.3))',
            'brightness(1.3) drop-shadow(0 0 25px rgba(59,130,246,0.6))',
            'brightness(1) drop-shadow(0 0 10px rgba(147,51,234,0.3))'
          ]
        } : {}}
        transition={{ 
          duration: 5, 
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        <img 
          src={circlesLogo} 
          alt="Circles Logo" 
          className="w-12 h-12 object-contain drop-shadow-lg"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'block';
          }}
        />
        <span className={`font-bold text-2xl hidden drop-shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
          C
        </span>
      </motion.div>
      
      <span className="font-bold text-xl lg:text-2xl drop-shadow-lg transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Circles
      </span>
    </motion.button>
  ), [logoAnimation, theme, setCurrentView]);

  // 🚀 Memoized mobile logo component
  const MobileLogoComponent = useMemo(() => (
    <motion.button 
      onClick={() => setCurrentView('home')}
      className="flex items-center justify-center cursor-pointer flex-shrink-0 relative p-1"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label="Go to home"
    >
      {/* Mobile logo animation */}
      <motion.div 
        className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center overflow-hidden"
        animate={logoAnimation ? {
          rotate: [0, 360],
          scale: [1, 1.05, 1],
        } : {}}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <img 
          src={circlesLogo} 
          alt="Circles Logo" 
          className="w-6 h-6 sm:w-8 sm:h-8 object-contain drop-shadow-lg"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </motion.div>
    </motion.button>
  ), [logoAnimation, setCurrentView]);

  // Prefetch heavy routes on intent (hover/focus/touch)
  const prefetchHeavy = useCallback((id: string) => {
    const prefetch = () => {
      if (id === 'community') import('./Community').catch(() => {});
      if (id === 'projects') import('./ProjectCatalog').catch(() => {});
    };
    prefetch();
    const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number };
    if (w.requestIdleCallback) {
      w.requestIdleCallback(() => prefetch());
    } else {
      setTimeout(prefetch, 300);
    }
  }, []);

  return (
    <>
      {/* 🚀 Top Navigation Bar - Only shown when not scrolled */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.nav
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50"
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
              <div className="relative flex items-center justify-between">
                {/* Logo - Left Side */}
                <div className="flex-shrink-0">
                  {LogoComponent}
                </div>

                {/* 🚀 Navigation Items - Center */}
                <div className="hidden md:flex items-center justify-center gap-4 lg:gap-6 flex-1 max-w-3xl mx-4">
                  {mainNavItems.map((item, index) => {
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        onMouseEnter={() => prefetchHeavy(item.id)}
                        onTouchStart={() => prefetchHeavy(item.id)}
                        onFocus={() => prefetchHeavy(item.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-300 relative whitespace-nowrap ${
                          currentView === item.id
                            ? `${theme === 'light' 
                                ? 'text-purple-600' 
                                : 'text-cyan-400'
                              }`
                            : `${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'}`
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <item.icon className={`w-4 h-4 drop-shadow-lg ${
                          item.id === 'community'
                            ? 'text-orange-400 [filter:drop-shadow(0_0_8px_rgba(251,146,60,0.8))_drop-shadow(0_0_16px_rgba(236,72,153,0.6))_drop-shadow(0_0_24px_rgba(251,146,60,0.4))]'
                            : ''
                        }`} />
                        <span className={`font-medium text-xs lg:text-sm drop-shadow-lg ${
                          item.id === 'community'
                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-pink-500 [filter:drop-shadow(0_0_8px_rgba(251,146,60,0.8))_drop-shadow(0_0_16px_rgba(236,72,153,0.6))]'
                            : ''
                        }`}>
                          {item.label}
                        </span>
                        {item.requiresAuth && !isAuthenticated && (
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
                        )}
                      </motion.button>
                    );
                  })}
                  
                  {/* 🚀 More Menu Dropdown */}
                  <div className="relative hidden md:block">
                    <motion.button
                      onClick={() => setShowMoreMenu(!showMoreMenu)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-300 whitespace-nowrap ${
                        moreNavItems.some(item => item.id === currentView)
                          ? `${theme === 'light' 
                              ? 'text-purple-600' 
                              : 'text-cyan-400'
                            }`
                          : `${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'}`
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <MoreHorizontal className="w-4 h-4 drop-shadow-lg" />
                      <span className="font-medium text-xs lg:text-sm drop-shadow-lg">
                        More
                      </span>
                      {showMoreMenu ? 
                        <ChevronUp className="w-3 h-3" /> : 
                        <ChevronDown className="w-3 h-3" />
                      }
                    </motion.button>
                    
                    <AnimatePresence>
                      {showMoreMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className={`absolute right-0 mt-2 w-48 rounded-xl border overflow-hidden z-[55] ${
                            theme === 'light'
                              ? 'bg-white border-gray-200 shadow-lg'
                              : 'bg-gray-900 border-white/20 shadow-lg shadow-black/20'
                          }`}
                        >
                          <div className="py-2">
                            {moreNavItems.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => handleItemClick(item.id)}
                                onMouseEnter={() => prefetchHeavy(item.id)}
                                onTouchStart={() => prefetchHeavy(item.id)}
                                onFocus={() => prefetchHeavy(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2 transition-colors ${
                                  currentView === item.id
                                    ? theme === 'light'
                                      ? 'bg-purple-50 text-purple-600'
                                      : 'bg-purple-900/20 text-purple-400'
                                    : theme === 'light'
                                      ? 'text-gray-700 hover:bg-gray-100'
                                      : 'text-gray-300 hover:bg-gray-800'
                                }`}
                              >
                                <item.icon className="w-4 h-4" />
                                <span className="text-sm">{item.label}</span>
                                {item.requiresAuth && !isAuthenticated && (
                                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse ml-auto" />
                                )}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* 🚀 Right Side Actions */}
                <div className="hidden md:flex items-center gap-3 lg:gap-4">
                  {/* Search Button */}
                  <motion.div 
                    className="relative"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.3 }}
                  >
                    <SearchBar
                      onSelectProject={handleProjectSelect}
                      onViewAllResults={handleSearchViewAll}
                    />
                  </motion.div>
                  
                  <motion.div
                    className="flex-shrink-0"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <NotificationDropdown
                      onViewAll={handleNotificationViewAll}
                      disableDropdown={currentView === 'notifications'}
                    />
                  </motion.div>

                  {/* Profile Icon */}
                  <div className="relative flex-shrink-0">
                    {ProfileButton}
                  </div>

                  {/* Theme Toggle Button */}
                  <div className="flex-shrink-0">
                    {ThemeToggleButton}
                  </div>
                </div>

                {/* 🚀 Mobile Navigation */}
                <div className="md:hidden flex items-center justify-between w-full px-2 sm:px-4">
                  {/* Left: Logo Only */}
                  <div className="flex-shrink-0">
                    {MobileLogoComponent}
                  </div>
                  
                  {/* Center: Main Nav Items */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {mainNavItems.map((item, index) => {
                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => handleItemClick(item.id)}
                          onMouseEnter={() => prefetchHeavy(item.id)}
                          onTouchStart={() => prefetchHeavy(item.id)}
                          onFocus={() => prefetchHeavy(item.id)}
                          className={`p-1 rounded-lg transition-all duration-300 relative ${
                            currentView === item.id
                              ? 'text-cyan-400'
                              : `${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'}`
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                        >
                          <item.icon className={`w-4 h-4 drop-shadow-lg ${
                            item.id === 'community'
                              ? 'text-orange-400 [filter:drop-shadow(0_0_8px_rgba(251,146,60,0.8))_drop-shadow(0_0_16px_rgba(236,72,153,0.6))_drop-shadow(0_0_24px_rgba(251,146,60,0.4))]'
                              : ''
                          }`} />
                          {item.requiresAuth && !isAuthenticated && (
                            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
                          )}
                        </motion.button>
                      );
                    })}

                    {/* More button */}
                    <div className="relative">
                      <motion.button
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        className={`p-1 rounded-lg transition-all duration-300 ${
                          moreNavItems.some(item => item.id === currentView)
                            ? 'text-cyan-400'
                            : `${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'}`
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="More"
                      >
                        <MoreHorizontal className="w-4 h-4 drop-shadow-lg" />
                      </motion.button>

                      {/* More tabs dropdown */}
                      <AnimatePresence>
                        {showMoreMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            transition={{ duration: 0.18 }}
                            className={`absolute top-full right-0 mt-2 rounded-xl border shadow-2xl z-50 min-w-[140px] ${
                              theme === 'light' ? 'bg-white border-black/10' : 'bg-black/90 border-white/10'
                            }`}
                          >
                            <div className="py-2">
                              {moreNavItems.map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => {
                                    handleItemClick(item.id);
                                    setShowMoreMenu(false);
                                  }}
                                  className={`w-full flex items-center gap-3 px-4 py-2 transition-colors ${
                                    currentView === item.id
                                      ? theme === 'light'
                                        ? 'text-purple-600 bg-purple-50'
                                        : 'text-cyan-400 bg-white/5'
                                      : theme === 'light'
                                        ? 'text-gray-700 hover:bg-gray-100'
                                        : 'text-gray-300 hover:bg-white/10'
                                  }`}
                                >
                                  <item.icon className="w-5 h-5" />
                                  <span className="text-sm font-medium">{item.label}</span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  {/* Right: Theme, Notification & Profile Buttons */}
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <motion.button
                      onClick={toggleTheme}
                      className={`p-1.5 sm:p-2 rounded-lg transition-all duration-300 ${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Toggle theme"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      {theme === 'light' ? (
                        <Moon className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-lg" />
                      ) : (
                        <Sun className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-lg" />
                      )}
                    </motion.button>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.25, duration: 0.3 }}
                    >
                      <NotificationDropdown
                        onViewAll={handleNotificationViewAll}
                        disableDropdown={currentView === 'notifications'}
                      />
                    </motion.div>
                    
                    <motion.button
                      onClick={handleProfileClick}
                      className={`p-1.5 sm:p-2 rounded-lg transition-all duration-300 relative ${
                        currentView === 'profile'
                          ? `${theme === 'light' 
                              ? 'text-purple-600' 
                              : 'text-cyan-400'
                            }`
                          : `${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'}`
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={isAuthenticated ? "Profile" : "Sign In"}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35, duration: 0.3 }}
                    >
                      {isAuthenticated ? (
                        <img 
                          src={user?.avatar || getUserAvatar('You')} 
                          alt={user?.name || 'Profile'}
                          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.src = getUserAvatar('You');
                          }}
                        />
                      ) : (
                        <User className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-lg" />
                      )}
                      {!isAuthenticated && (
                        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {isMobile && (
        <MobileBottomBar
          currentView={currentView}
          setCurrentView={setCurrentView}
          onAuthRequired={onAuthRequired}
        />
      )}

      {/* 🚀 Scroll-Triggered Sidebar - Only shown when scrolled */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="hidden md:flex fixed left-6 top-0 bottom-0 z-50 items-center"
          >
            {/* Sidebar Container - Clean icon column only */}
            <div className="flex flex-col items-center space-y-6 w-16 py-8 group">
              {/* Main Navigation Icons */}
              <div className="flex flex-col items-center space-y-3">
                {mainNavItems.map((item, index) => {
                  return (
                    <div key={item.id} className="relative">
                      <motion.button
                        onClick={() => handleItemClick(item.id)}
                        onMouseEnter={() => prefetchHeavy(item.id)}
                        onTouchStart={() => prefetchHeavy(item.id)}
                        onFocus={() => prefetchHeavy(item.id)}
                        className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                          currentView === item.id
                            ? `${theme === 'light' 
                                ? 'text-purple-600 bg-purple-100/50 shadow-lg shadow-purple-400/25' 
                                : 'text-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/25'
                              }`
                            : `${theme === 'light' 
                                ? 'text-gray-700 hover:text-gray-900 hover:bg-white/50' 
                                : 'text-gray-400 hover:text-white hover:bg-white/10'
                              }`
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <item.icon className={`w-6 h-6 ${
                          item.id === 'community'
                            ? 'text-orange-400 [filter:drop-shadow(0_0_6px_rgba(251,146,60,0.8))_drop-shadow(0_0_12px_rgba(236,72,153,0.6))_drop-shadow(0_0_18px_rgba(251,146,60,0.4))]'
                            : ''
                        }`} />
                        {item.requiresAuth && !isAuthenticated && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                        )}
                        {/* Active Indicator */}
                        {currentView === item.id && (
                          <motion.div
                            layoutId="activeIndicator"
                            className={`absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-8 rounded-r-full transition-all duration-300 ${
                              theme === 'light' 
                                ? 'bg-gradient-to-b from-purple-400 to-purple-500'
                                : 'bg-gradient-to-b from-cyan-400 to-blue-500'
                            }`}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </motion.button>
                      
                      {/* Hover Text */}
                      <span className={`absolute left-16 top-1/2 transform -translate-y-1/2 whitespace-nowrap px-2 py-1 text-sm font-light opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none select-none group-hover:translate-x-0 translate-x-[-10px] ${
                        item.id === 'community'
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-pink-500 [filter:drop-shadow(0_0_4px_rgba(251,146,60,0.8))_drop-shadow(0_0_8px_rgba(236,72,153,0.6))]'
                          : currentView === item.id
                            ? theme === 'light'
                              ? 'text-purple-600'
                              : 'text-cyan-400'
                            : theme === 'light'
                              ? 'text-gray-700'
                              : 'text-gray-400'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}

                {/* More Menu Button */}
                <div className="relative">
                  <motion.button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    onMouseEnter={() => prefetchHeavy('merch')}
                    onTouchStart={() => prefetchHeavy('merch')}
                    onFocus={() => prefetchHeavy('merch')}
                    className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                      moreNavItems.some(item => item.id === currentView)
                        ? `${theme === 'light' 
                            ? 'text-purple-600 bg-purple-100/50 shadow-lg shadow-purple-400/25' 
                            : 'text-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/25'
                          }`
                        : `${theme === 'light' 
                            ? 'text-gray-700 hover:text-gray-900 hover:bg-white/50' 
                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                          }`
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <MoreHorizontal className="w-6 h-6" />
                  </motion.button>
                  
                  {/* More Menu Dropdown */}
                  <AnimatePresence>
                    {showMoreMenu && (
                      <motion.div
                        initial={{ opacity: 0, x: 10, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute left-16 top-0 w-48 rounded-xl border overflow-hidden z-[55] ${
                          theme === 'light'
                            ? 'bg-white border-gray-200 shadow-lg'
                            : 'bg-gray-900 border-white/20 shadow-lg shadow-black/20'
                        }`}
                      >
                        <div className="py-2">
                          {moreNavItems.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleItemClick(item.id)}
                              onMouseEnter={() => prefetchHeavy(item.id)}
                              onTouchStart={() => prefetchHeavy(item.id)}
                              onFocus={() => prefetchHeavy(item.id)}
                              className={`w-full flex items-center gap-3 px-4 py-2 transition-colors ${
                                currentView === item.id
                                  ? theme === 'light'
                                    ? 'bg-purple-50 text-purple-600'
                                    : 'bg-purple-900/20 text-purple-400'
                                  : theme === 'light'
                                    ? 'text-gray-700 hover:bg-gray-100'
                                    : 'text-gray-300 hover:bg-gray-800'
                              }`}
                            >
                              <item.icon className="w-5 h-5" />
                              <span>{item.label}</span>
                              {item.requiresAuth && !isAuthenticated && (
                                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse ml-auto" />
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Hover Text for More */}
                  <span className={`absolute left-16 top-1/2 transform -translate-y-1/2 whitespace-nowrap px-2 py-1 text-sm font-light opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none select-none group-hover:translate-x-0 translate-x-[-10px] ${
                    moreNavItems.some(item => item.id === currentView)
                      ? theme === 'light'
                        ? 'text-purple-600'
                        : 'text-cyan-400'
                      : theme === 'light'
                        ? 'text-gray-700'
                        : 'text-gray-400'
                  }`}>
                    More
                  </span>
                </div>

                {/* Theme Toggle */}
                <div className="relative">
                  <motion.button
                    onClick={toggleTheme}
                    onMouseEnter={() => prefetchHeavy('merch')}
                    onTouchStart={() => prefetchHeavy('merch')}
                    onFocus={() => prefetchHeavy('merch')}
                    className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                      theme === 'light' 
                        ? 'text-gray-700 hover:text-gray-900 hover:bg-white/50' 
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25, duration: 0.3 }}
                  >
                    {theme === 'light' ? (
                      <Moon className="w-6 h-6" />
                    ) : (
                      <Sun className="w-6 h-6" />
                    )}
                  </motion.button>
                  
                  {/* Hover Text for Theme */}
                  <span className={`absolute left-16 top-1/2 transform -translate-y-1/2 whitespace-nowrap px-2 py-1 text-sm font-light opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none select-none group-hover:translate-x-0 translate-x-[-10px] ${
                    theme === 'light'
                      ? 'text-gray-700'
                      : 'text-gray-400'
                  }`}>
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </div>

                {/* Profile Icon */}
                <div className="relative">
                  <motion.button
                    onClick={handleProfileClick}
                    onMouseEnter={() => prefetchHeavy('merch')}
                    onTouchStart={() => prefetchHeavy('merch')}
                    onFocus={() => prefetchHeavy('merch')}
                    className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                      currentView === 'profile'
                        ? `${theme === 'light' 
                            ? 'text-purple-600 bg-purple-100/50 shadow-lg shadow-purple-400/25' 
                            : 'text-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/25'
                          }`
                        : `${theme === 'light' 
                            ? 'text-gray-700 hover:text-gray-900 hover:bg-white/50' 
                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                          }`
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    {isAuthenticated ? (
                      <img 
                        src={user?.avatar || getUserAvatar('You')} 
                        alt={user?.name || 'Profile'}
                        className="w-6 h-6 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.src = getUserAvatar('You');
                        }}
                      />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                    {!isAuthenticated && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                    )}
                  </motion.button>
                  
                  {/* Hover Text for Profile */}
                  <span className={`absolute left-16 top-1/2 transform -translate-y-1/2 whitespace-nowrap px-2 py-1 text-sm font-light opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none select-none group-hover:translate-x-0 translate-x-[-10px] ${
                    currentView === 'profile'
                      ? theme === 'light'
                        ? 'text-purple-600'
                        : 'text-cyan-400'
                      : theme === 'light'
                        ? 'text-gray-700'
                        : 'text-gray-400'
                  }`}>
                    {isAuthenticated ? 'Profile' : 'Sign In'}
                  </span>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;