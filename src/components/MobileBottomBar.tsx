import { motion, PanInfo } from 'framer-motion';
import { Home, BarChart3, Film, Users, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import React from 'react';

import { useAuth } from './auth/useAuth';
import { useTheme } from './ThemeContext';

interface MobileBottomBarProps {
  currentView: 'home' | 'dashboard' | 'projects' | 'community' | 'merch' | 'profile' | 'admin' | 'portfolio' | 'compare' | 'news' | 'notifications' | 'search' | 'project-detail' | 'waitlist' | 'analytics' | 'about' | 'browse' | 'contact' | 'login' | 'register' | 'settings';
  setCurrentView: (view: 'home' | 'dashboard' | 'projects' | 'community' | 'merch' | 'profile' | 'admin' | 'portfolio' | 'compare' | 'news' | 'notifications' | 'search' | 'project-detail' | 'waitlist' | 'analytics' | 'about' | 'browse' | 'contact' | 'login' | 'register' | 'settings') => void; // eslint-disable-line no-unused-vars
  onAuthRequired: (mode?: 'login' | 'register') => boolean; // eslint-disable-line no-unused-vars
}

const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ currentView, setCurrentView, onAuthRequired }) => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [isScrolling, setIsScrolling] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  // Memoized navigation items for better performance
  const mainNavItems = React.useMemo(() => [
    { id: 'home', label: 'Home', icon: Home, requiresAuth: false },
    { id: 'projects', label: 'Browse', icon: Film, requiresAuth: false },
    { id: 'waitlist', label: 'Join Waitlist', icon: Sparkles, requiresAuth: false },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, requiresAuth: false },
    { id: 'community', label: 'Enter Circles', icon: Users, requiresAuth: false }
  ], []);

  // Enhanced scroll detection with better performance
  React.useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDelta = Math.abs(currentScrollY - lastScrollY);
          
          // Only trigger scroll state if there's significant movement
          if (scrollDelta > 5) {
            setIsScrolling(true);
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
              setIsScrolling(false);
            }, 100); // Reduced debounce time
          }
          
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Visibility management to prevent disappearing
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setIsVisible(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Auto-collapse after inactivity
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    let warningTimeout: NodeJS.Timeout;
    
    // Only set timeout when bar is visible (not collapsed)
    if (!isCollapsed) {
      // Show warning after 5.5 seconds (500ms before collapse)
      warningTimeout = setTimeout(() => {
        // Add a subtle visual warning
        const bar = document.querySelector('.mobile-bottom-bar .motion-div');
        if (bar) {
          bar.classList.add('opacity-80');
        }
      }, 5500);
      
      // Auto-collapse after 6 seconds
      timeout = setTimeout(() => {
        setIsCollapsed(true);
      }, 6000);
    }
    
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      if (warningTimeout) {
        clearTimeout(warningTimeout);
      }
      // Remove warning class if component unmounts
      const bar = document.querySelector('.mobile-bottom-bar .motion-div');
      if (bar) {
        bar.classList.remove('opacity-80');
      }
    };
  }, [isCollapsed]);

  // Reset auto-collapse timer when user interacts
  const resetAutoCollapseTimer = React.useCallback(() => {
    // Remove any warning state
    const bar = document.querySelector('.mobile-bottom-bar .motion-div');
    if (bar) {
      bar.classList.remove('opacity-80');
    }
    
    // Force a re-render to trigger the auto-collapse effect
    if (isCollapsed) {
      setIsCollapsed(false);
    } else {
      // If already visible, trigger the effect again by briefly hiding and showing
      setIsCollapsed(true);
      setTimeout(() => setIsCollapsed(false), 50);
    }
  }, [isCollapsed]);

  const handleItemClick = React.useCallback((itemId: string) => {
    if (itemId === 'theme') {
      toggleTheme();
    } else if (['home', 'projects', 'dashboard', 'community', 'merch', 'profile', 'admin', 'portfolio', 'compare', 'news', 'notifications', 'search', 'project-detail', 'waitlist', 'analytics'].includes(itemId)) {
      const item = mainNavItems.find(nav => nav.id === itemId);
      if (item?.requiresAuth && !isAuthenticated) {
        onAuthRequired('login');
        return;
      }
      setCurrentView(itemId as 'home' | 'dashboard' | 'projects' | 'community' | 'merch' | 'profile' | 'admin' | 'portfolio' | 'compare' | 'news' | 'notifications' | 'search' | 'project-detail' | 'waitlist' | 'analytics');
      
      // Reset auto-collapse timer when user clicks navigation
      resetAutoCollapseTimer();
    }
  }, [toggleTheme, mainNavItems, isAuthenticated, onAuthRequired, setCurrentView, resetAutoCollapseTimer]);

  // Gesture handling for show/hide
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 30; // Reduced threshold for easier triggering
    
    if (info.offset.y < -threshold) {
      // Swipe up - show the bar
      setIsCollapsed(false);
      // Reset auto-collapse timer
      resetAutoCollapseTimer();
    } else if (info.offset.y > threshold) {
      // Swipe down - hide the bar
      setIsCollapsed(true);
    }
    
  };

  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y < -5) {
      // setDragDirection('up'); // This line is removed
    } else if (info.offset.y > 5) {
      // setDragDirection('down'); // This line is removed
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] mobile-bottom-bar">
      {/* Bottom spacing for content - dynamic based on collapsed state */}
      <div className={`transition-all duration-300 ease-out ${isCollapsed ? 'h-4' : 'h-16'}`} />
      
      {/* Glass blur background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      
      {/* Main navigation bar - collapsible with gesture support */}
      <motion.div 
        className={`relative mx-3 mb-0 rounded-t-2xl backdrop-blur-2xl border-t border-x ${
          theme === 'light'
            ? 'bg-white/70 border-white/30 shadow-lg shadow-black/5'
            : 'bg-gray-900/60 border-white/10 shadow-xl shadow-black/20'
        }`}
        animate={{
          y: isCollapsed ? 56 : 0, // Hide 56px (full height) down
          opacity: isCollapsed ? 0.3 : 1,
        }}
        transition={{
          type: "tween",
          ease: "easeInOut",
          duration: 0.45
        }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        dragMomentum={false}
      >
        {/* Gesture indicator - visible when collapsed */}
        {isCollapsed && (
          <motion.button
            onClick={() => {
              setIsCollapsed(false);
              resetAutoCollapseTimer();
            }}
            className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-red-500/80 rounded-full cursor-pointer border border-red-400/60 hover:bg-red-500 transition-colors shadow-[0_0_12px_rgba(239,68,68,0.8)]"
            initial={{ opacity: 0, scale: 0.8, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0, boxShadow: [
              '0 0 8px rgba(239,68,68,0.4)',
              '0 0 14px rgba(239,68,68,0.9)',
              '0 0 8px rgba(239,68,68,0.4)'
            ] }}
            transition={{ delay: 0.1, duration: 0.6, repeat: Infinity, repeatType: 'mirror' }}
            whileHover={{ scale: 1.1, opacity: 0.8 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronUp className="w-5 h-5 text-white/80 mx-auto -mt-1.5" />
          </motion.button>
        )}

        {/* Manual collapse arrow - visible when expanded */}
        {!isCollapsed && (
          <motion.button
            onClick={() => {
              setIsCollapsed(true);
            }}
            className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-red-500/80 rounded-full cursor-pointer border border-red-400/60 hover:bg-red-500 transition-colors shadow-[0_0_12px_rgba(239,68,68,0.8)]"
            initial={{ opacity: 0, scale: 0.8, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0, boxShadow: [
              '0 0 8px rgba(239,68,68,0.4)',
              '0 0 14px rgba(239,68,68,0.9)',
              '0 0 8px rgba(239,68,68,0.4)'
            ] }}
            transition={{ delay: 0.1, duration: 0.6, repeat: Infinity, repeatType: 'mirror' }}
            whileHover={{ scale: 1.1, opacity: 0.8 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Collapse bottom bar"
          >
            <ChevronDown className="w-5 h-5 text-white/80 mx-auto -mt-1.5" />
          </motion.button>
        )}
        
        <div className="flex items-center justify-between px-1 py-2">
          {mainNavItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`relative flex flex-col items-center justify-center min-w-0 flex-1 px-0.5 py-1.5 rounded-lg transition-all duration-200 ${
                currentView === item.id
                  ? `${theme === 'light' 
                      ? 'bg-white/80 text-purple-600 shadow-sm' 
                      : 'bg-white/10 text-cyan-400 shadow-lg shadow-cyan-400/20'
                    }`
                  : `${theme === 'light' 
                      ? 'text-gray-500 hover:text-gray-700 hover:bg-white/40' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                    }`
              }`}
              whileHover={!isScrolling ? { scale: 1.02, y: -1 } : {}}
              whileTap={{ scale: 0.98 }}
              initial={false}
              animate={{ 
                opacity: isVisible ? 1 : 0.8, 
                y: 0,
                scale: 1
              }}
              transition={{ 
                duration: 0.15, 
                ease: "easeOut",
                type: "tween"
              }}
            >
              {/* Active indicator - optimized to prevent flickering */}
              {currentView === item.id && (
                <motion.div
                  className={`absolute inset-0 rounded-lg ${
                    theme === 'light' 
                      ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/20' 
                      : 'bg-gradient-to-r from-cyan-500/20 to-cyan-600/20'
                  }`}
                  layoutId="activeTab"
                  transition={{ 
                    type: "spring", 
                    bounce: 0.1, 
                    duration: 0.25,
                    damping: 20,
                    stiffness: 300
                  }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center gap-0.5">
                {item.id === 'profile' && isAuthenticated ? (
                  <div className="relative">
                    {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-4 h-4 rounded-full object-cover ring-1 ring-white/20"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {/* Fallback with user initials */}
                    <div 
                      className={`w-4 h-4 rounded-full ring-1 ring-white/20 flex items-center justify-center text-[8px] font-bold ${
                        user?.avatar ? 'hidden' : 'flex'
                      } ${
                        theme === 'light' 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-cyan-500 text-white'
                      }`}
                      style={{ display: user?.avatar ? 'none' : 'flex' }}
                    >
                      {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full border border-white" />
                  </div>
                ) : (
                  <item.icon className={`w-3.5 h-3.5 transition-all duration-200 ${
                    currentView === item.id ? 'scale-105' : 'scale-100'
                  } ${
                    item.id === 'community'
                      ? 'text-orange-400 filter drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]'
                      : ''
                  }`} />
                )}
                
                <span className={`text-[9px] font-medium leading-none transition-all duration-200 ${
                  currentView === item.id 
                    ? 'opacity-100' 
                    : 'opacity-70'
                } ${
                  item.id === 'community'
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-pink-500 filter drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]'
                    : ''
                }`}>
                  {item.label}
                </span>
              </div>
              
              {/* Auth required indicator - optimized animation */}
              {item.requiresAuth && !isAuthenticated && (
                <motion.div 
                  className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-orange-400 rounded-full"
                  animate={!isScrolling ? { 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  } : { scale: 1, opacity: 0.7 }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MobileBottomBar;