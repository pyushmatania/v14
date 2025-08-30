import { motion } from 'framer-motion';
import { ArrowRight, Film, TrendingUp, Users, DollarSign, Sparkles, Globe, Calendar, Coins } from 'lucide-react';
import { useState, useMemo, useCallback, memo } from 'react';
import * as React from 'react';

import AnimatedNumber from './AnimatedNumber';
import { useTheme } from './ThemeContext';
import Typewriter from './Typewriter';

// 🛡️ Type definitions for better type safety
interface HeroProps {
  setCurrentView?: (view: 'home' | 'browse' | 'community' | 'about' | 'contact' | 'login' | 'register' | 'dashboard' | 'profile' | 'settings' | 'admin' | 'waitlist' | 'projects') => void; // eslint-disable-line no-unused-vars
}

interface StatData {
  key: string;
  label: string;
  value: number;
  prefix?: string;
  unit?: string;
  description: string;
  growth: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface SupportingStatData {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  description: string;
  color: string;
}

// 🚀 Optimized stat data with memoization
const mainStats: StatData[] = [
  {
    key: 'projects',
    label: 'Active Projects',
    value: 20,
    description: 'Films, Music & Series',
    growth: '+45%',
    icon: Film as React.ComponentType<{ className?: string }>,
    color: 'text-purple-400'
  },
  {
    key: 'raised',
    label: 'Total Raised',
    value: 30,
    prefix: '₹',
    unit: 'Cr+',
    description: 'Across all projects',
    growth: '+127%',
    icon: DollarSign as React.ComponentType<{ className?: string }>,
    color: 'text-green-400'
  },
  {
    key: 'investors',
    label: 'Total Investors',
    value: 40000,
    unit: '+',
    description: 'Active community',
    growth: '+89%',
    icon: Users as React.ComponentType<{ className?: string }>,
    color: 'text-blue-400'
  },
  {
    key: 'returns',
    label: 'Avg Returns',
    value: 230,
    unit: '%',
    description: 'Quarterly average',
    growth: '+23%',
    icon: TrendingUp as React.ComponentType<{ className?: string }>,
    color: 'text-yellow-400'
  }
];

// 🚀 Simplified supporting stats
const supportingStats: SupportingStatData[] = [
  {
    icon: Globe as React.ComponentType<{ className?: string }>,
    title: 'Global Reach',
    value: '15 Countries',
    description: 'Investors from around the world',
    color: 'text-emerald-400'
  },
  {
    icon: Calendar as React.ComponentType<{ className?: string }>,
    title: 'Success Rate',
    value: '87%',
    description: 'Projects meeting funding goals',
    color: 'text-green-400'
  },
  {
    icon: Coins as React.ComponentType<{ className?: string }>,
    title: 'Avg Investment',
    value: '₹25,000',
    description: 'Per investor per project',
    color: 'text-yellow-400'
  }
];

// 🎯 Gradient theme names for better UX
const gradientThemeNames = [
  'Aurora Borealis', 
  'Sunset Dreams', 
  'Ocean Depths', 
  'Mystic Forest', 
  'Royal Purple', 
  'Solar Flare'
];

/**
 * 🎯 Hero - Main landing page hero section with optimized performance
 * @description Displays animated hero content with gradient themes and statistics
 */
const Hero: React.FC<HeroProps> = memo(({ setCurrentView }) => {
  const { theme, currentGradient } = useTheme();
  const [coinDrop, setCoinDrop] = useState(false);
  const [statsInView, setStatsInView] = useState<{ [key: number]: boolean }>({});

  // 🚀 Memoized gradient classes to prevent recalculation
  const gradientClasses = useMemo(() => {
    const gradients = [
      'from-green-500 to-blue-500',
      'from-orange-500 to-red-500', 
      'from-blue-500 to-cyan-500',
      'from-emerald-500 to-green-500',
      'from-purple-500 to-fuchsia-500'
    ];
    return gradients[currentGradient] || gradients[0];
  }, [currentGradient]);

  // 🚀 Memoized gradient configurations for better performance
  const gradientConfigs = useMemo(() => ({
    light: {
      0: {
        primary: 'bg-gradient-to-br from-green-400 via-emerald-400 to-cyan-400',
        secondary: 'bg-gradient-to-br from-blue-400 via-purple-400 to-violet-400',
        tertiary: 'bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-400',
        quaternary: 'bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-400',
        center: 'bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400',
        floating1: 'bg-gradient-to-br from-lime-400 via-green-400 to-emerald-400',
        floating2: 'bg-gradient-to-br from-indigo-400 via-purple-400 to-violet-400',
        badge: 'bg-green-50/60 border-green-300/50 text-green-700 shadow-lg shadow-green-200/50',
        button: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-green-500/25',
        secondaryButton: 'border-green-300 text-green-700 bg-green-50/60 hover:bg-green-50/80 shadow-lg hover:shadow-xl',
        scrollIndicator: 'border-green-400',
        scrollDot: 'bg-green-500',
        statCard: 'bg-green-50/40 border-green-300/60 shadow-lg hover:shadow-xl',
        statIcon: 'text-green-400'
      },
      1: {
        primary: 'bg-gradient-to-br from-orange-400 via-red-400 to-pink-400',
        secondary: 'bg-gradient-to-br from-red-400 via-orange-400 to-yellow-400',
        tertiary: 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400',
        quaternary: 'bg-gradient-to-br from-pink-400 via-rose-400 to-red-400',
        center: 'bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400',
        floating1: 'bg-gradient-to-br from-amber-400 via-orange-400 to-red-400',
        floating2: 'bg-gradient-to-br from-rose-400 via-pink-400 to-purple-400',
        badge: 'bg-orange-50/60 border-orange-300/50 text-orange-700 shadow-lg shadow-orange-200/50',
        button: 'bg-gradient-to-r from-orange-600 to-red-600 hover:shadow-orange-500/25',
        secondaryButton: 'border-orange-300 text-orange-700 bg-orange-50/60 hover:bg-orange-50/80 shadow-lg hover:shadow-xl',
        scrollIndicator: 'border-orange-400',
        scrollDot: 'bg-orange-500',
        statCard: 'bg-orange-50/40 border-orange-300/60 shadow-lg hover:shadow-xl',
        statIcon: 'text-orange-400'
      },
      2: {
        primary: 'bg-gradient-to-br from-blue-400 via-cyan-400 to-indigo-400',
        secondary: 'bg-gradient-to-br from-indigo-400 via-blue-400 to-cyan-400',
        tertiary: 'bg-gradient-to-br from-sky-400 via-blue-400 to-indigo-400',
        quaternary: 'bg-gradient-to-br from-indigo-400 via-purple-400 to-violet-400',
        center: 'bg-gradient-to-br from-blue-400 via-sky-400 to-cyan-400',
        floating1: 'bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-400',
        floating2: 'bg-gradient-to-br from-sky-400 via-blue-400 to-indigo-400',
        badge: 'bg-blue-50/60 border-blue-300/50 text-blue-700 shadow-lg shadow-blue-200/50',
        button: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-blue-500/25',
        secondaryButton: 'border-blue-300 text-blue-700 bg-blue-50/60 hover:bg-blue-50/80 shadow-lg hover:shadow-xl',
        scrollIndicator: 'border-blue-400',
        scrollDot: 'bg-blue-500',
        statCard: 'bg-blue-50/40 border-blue-300/60 shadow-lg hover:shadow-xl',
        statIcon: 'text-blue-400'
      },
      3: {
        primary: 'bg-gradient-to-br from-emerald-400 via-green-400 to-lime-400',
        secondary: 'bg-gradient-to-br from-lime-400 via-green-400 to-emerald-400',
        tertiary: 'bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-400',
        quaternary: 'bg-gradient-to-br from-lime-400 via-green-400 to-emerald-400',
        center: 'bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400',
        floating1: 'bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400',
        floating2: 'bg-gradient-to-br from-lime-400 via-green-400 to-emerald-400',
        badge: 'bg-emerald-50/60 border-emerald-300/50 text-emerald-700 shadow-lg shadow-emerald-200/50',
        button: 'bg-gradient-to-r from-emerald-600 to-green-600 hover:shadow-emerald-500/25',
        secondaryButton: 'border-emerald-300 text-emerald-700 bg-emerald-50/60 hover:bg-emerald-50/80 shadow-lg hover:shadow-xl',
        scrollIndicator: 'border-emerald-400',
        scrollDot: 'bg-emerald-500',
        statCard: 'bg-emerald-50/40 border-emerald-300/60 shadow-lg hover:shadow-xl',
        statIcon: 'text-emerald-400'
      },
      4: {
        primary: 'bg-gradient-to-br from-purple-400 via-fuchsia-400 to-pink-400',
        secondary: 'bg-gradient-to-br from-pink-400 via-purple-400 to-violet-400',
        tertiary: 'bg-gradient-to-br from-violet-400 via-purple-400 to-fuchsia-400',
        quaternary: 'bg-gradient-to-br from-fuchsia-400 via-pink-400 to-rose-400',
        center: 'bg-gradient-to-br from-purple-400 via-violet-400 to-indigo-400',
        floating1: 'bg-gradient-to-br from-violet-400 via-purple-400 to-fuchsia-400',
        floating2: 'bg-gradient-to-br from-pink-400 via-rose-400 to-red-400',
        badge: 'bg-purple-50/60 border-purple-300/50 text-purple-700 shadow-lg shadow-purple-200/50',
        button: 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:shadow-purple-500/25',
        secondaryButton: 'border-purple-300 text-purple-700 bg-purple-50/60 hover:bg-purple-50/80 shadow-lg hover:shadow-xl',
        scrollIndicator: 'border-purple-400',
        scrollDot: 'bg-purple-500',
        statCard: 'bg-purple-50/40 border-purple-300/60 shadow-lg hover:shadow-xl',
        statIcon: 'text-purple-400'
      }
    },
    dark: {
      primary: 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500',
      secondary: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500',
      tertiary: 'bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500',
      quaternary: 'bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500',
      center: 'bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600',
      floating1: 'bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500',
      floating2: 'bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500',
      badge: 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 text-purple-300',
      button: 'bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-purple-500/25',
      secondaryButton: 'border-white/20 text-white bg-white/5 hover:bg-white/10',
      scrollIndicator: 'border-white/30',
      scrollDot: 'bg-white/50',
      statCard: 'bg-green-500/10 border-green-400/30 hover:border-green-400/50',
      statIcon: 'text-green-400'
    }
  }), []);

  // 🚀 Get current gradient configuration
  const currentGradientConfig = useMemo(() => {
    if (theme === 'light') {
      const configs = gradientConfigs.light;
      return configs[currentGradient as keyof typeof configs] || configs[0];
    } else {
      return gradientConfigs.dark;
    }
  }, [theme, currentGradient, gradientConfigs]);

  // 🚀 Optimized coin component
  const Coin = useMemo(() => () => (
    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-800 font-bold text-sm">
      ₹
    </div>
  ), []);

  // 🚀 Optimized button click handlers
  const handleStartInvestingClick = useCallback(() => {
    setCoinDrop(true);
    setTimeout(() => {
      setCurrentView?.('projects');
      setTimeout(() => setCoinDrop(false), 900);
    }, 600);
  }, [setCurrentView]);

  const handleExploreProjectsClick = useCallback(() => {
    setCurrentView?.('projects');
  }, [setCurrentView]);

  // 🚀 Optimized stats viewport handler
  const handleStatViewportEnter = useCallback((idx: number) => {
    setStatsInView(prev => ({ ...prev, [idx]: true }));
  }, []);

  // 🚀 Memoized particle dots for better performance - Fixed to prevent infinite re-renders
  const particleDots = useMemo(() => {
    // Use a fixed seed to ensure consistent particle positions
    const seed = 42; // Fixed seed for consistent behavior
    const particles = [];
    
    for (let i = 0; i < 25; i++) {
      // Use deterministic pseudo-random based on index and seed
      const left = ((i * 7 + seed) % 100) + (i % 3);
      const top = ((i * 11 + seed) % 100) + (i % 5);
      const delay = (i * 0.2) % 5;
      const duration = 3 + (i % 3);
      
      particles.push({
        id: i,
        left: `${left}%`,
        top: `${top}%`,
        delay,
        duration
      });
    }
    
    return particles;
  }, []); // Empty dependency array ensures it only runs once

  return (
    <section 
      className={`relative min-h-screen flex items-center justify-center overflow-hidden pt-12 md:pt-16 transform-gpu ${
        theme === 'light' ? 'animated-gradient-light' : 'animated-gradient-dark'
      }`}
      style={{ 
        willChange: 'transform',
        contain: 'layout style paint'
      }}
    >
      
      {/* 🎯 Gradient Theme Indicator */}
      {theme === 'light' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="gradient-indicator animate-gradient-pulse flex items-center gap-1"
        >
          <Sparkles className="w-4 h-4 animate-pulse" /> 
          {gradientThemeNames[currentGradient]}
        </motion.div>
      )}
      
      {/* 🚀 Simplified Multi-Color Burst Orbs - Just 3-4 orbs */}
      <div className="absolute inset-0 overflow-hidden transform-gpu will-change-transform">
        {/* Primary Burst Orb */}
        <div 
          className={`absolute top-1/4 left-1/4 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-50 transition-all duration-[3000ms] ${currentGradientConfig.primary}`}
          style={{
            animation: 'float 20s ease-in-out infinite',
            willChange: 'transform'
          }}
        />
        
        {/* Secondary Burst Orb */}
        <div 
          className={`absolute bottom-1/4 right-1/4 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-45 transition-all duration-[3000ms] ${currentGradientConfig.secondary}`}
          style={{
            animation: 'float 25s ease-in-out infinite 5s',
            willChange: 'transform'
          }}
        />

        {/* Center Burst Orb */}
        <div 
          className={`absolute top-1/2 left-1/2 w-[36rem] h-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl opacity-50 ${currentGradientConfig.center}`}
          style={{
            animation: 'pulse 30s ease-in-out infinite',
            willChange: 'transform'
          }}
        />

        {/* Fourth Orb - Smaller accent */}
        <div 
          className={`absolute top-1/3 right-1/3 w-[16rem] h-[16rem] rounded-full blur-2xl opacity-35 transition-all duration-[3000ms] ${currentGradientConfig.tertiary}`}
          style={{
            animation: 'float 22s ease-in-out infinite 7s',
            willChange: 'transform'
          }}
        />
      </div>

      {/* ⭐ Simple Stars - Just 2-3 stars */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Star 1 */}
        <motion.div
          className="absolute top-1/6 left-1/6 text-yellow-300 opacity-60"
          style={{
            fontSize: '2rem',
            filter: 'drop-shadow(0 0 10px rgba(253, 224, 71, 0.5))'
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.6, 1, 0.6],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ⭐
        </motion.div>

        {/* Star 2 */}
        <motion.div
          className="absolute bottom-1/6 right-1/6 text-yellow-200 opacity-70"
          style={{
            fontSize: '1.5rem',
            filter: 'drop-shadow(0 0 8px rgba(253, 224, 71, 0.4))'
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.7, 1, 0.7],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          ⭐
        </motion.div>

        {/* Star 3 */}
        <motion.div
          className="absolute top-1/2 right-1/4 text-yellow-100 opacity-50"
          style={{
            fontSize: '1.8rem',
            filter: 'drop-shadow(0 0 12px rgba(253, 224, 71, 0.3))'
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.5, 0.8, 0.5],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        >
          ⭐
        </motion.div>
      </div>

      {/* 🚀 Optimized Particle Dots */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {particleDots.map((dot) => (
          <motion.div
            key={dot.id}
            className={`absolute w-2 h-2 rounded-full transition-all duration-[3000ms] ${
              theme === 'light' 
                ? currentGradient === 0 ? 'bg-green-400' :
                  currentGradient === 1 ? 'bg-orange-400' :
                  currentGradient === 2 ? 'bg-blue-400' :
                  currentGradient === 3 ? 'bg-emerald-400' :
                  'bg-purple-400'
                : 'bg-white'
            }`}
            style={{
              left: dot.left,
              top: dot.top,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: dot.duration,
              repeat: Infinity,
              delay: dot.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* 🚀 Optimized CSS Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(100px, -80px) scale(1.2); }
            50% { transform: translate(-50px, 60px) scale(0.8); }
            75% { transform: translate(60px, -60px) scale(1.1); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
            50% { transform: translate(-50%, -50%) scale(1.1) rotate(15deg); }
          }
          
          /* Optimize scroll performance */
          * {
            scroll-behavior: smooth;
          }
          
          /* Reduce motion for users who prefer it */
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
          style={{ willChange: 'transform' }}
        >
          {/* 🎯 Enhanced Floating Badge with Gradient Awareness */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full border font-medium mt-10 mb-6 sm:mb-8 backdrop-blur-md transition-all duration-[3000ms] text-sm sm:text-base ${currentGradientConfig.badge}`}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.div>
            <span className="hidden sm:inline">The Future of Entertainment Investment</span>
            <span className="sm:hidden">Future of Entertainment</span>
          </motion.div>

          <h1 className={`text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            <Typewriter
              text="Own the stories you love"
              className={`bg-gradient-to-r bg-clip-text text-transparent ${
                theme === 'light'
                  ? 'from-purple-600 via-pink-500 to-blue-600'
                  : 'from-purple-400 via-pink-500 to-cyan-500'
              }`}
            />
          </h1>
          
          <p className={`text-xl sm:text-2xl max-w-3xl mx-auto mb-8 leading-relaxed ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Transform from passive viewer to co-producer. Invest in movies, music, and series. 
            Earn returns, unlock exclusive perks, and shape the future of entertainment.
          </p>

          {/* 🚀 Enhanced CTA Buttons with Optimized Handlers */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4">
            <motion.button
              onClick={handleStartInvestingClick}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`group relative px-8 py-4 rounded-full text-white font-semibold text-xl overflow-hidden transition-all duration-300 hover:shadow-2xl w-full sm:w-auto flex items-center justify-center ${currentGradientConfig.button}`}
            >
              {/* Coin drop animation */}
              <motion.div
                initial={false}
                animate={coinDrop ? { y: [ -60, 0, 8, 0 ], opacity: [1, 1, 1, 0] } : { y: -60, opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0.8, 0.2, 1] }}
                style={{ position: 'absolute', left: '50%', top: '-2.5rem', zIndex: 20, transform: 'translateX(-50%)', pointerEvents: 'none' }}
              >
                <Coin />
              </motion.div>
              
              {/* Enhanced Animated Background - Glowing Orb */}
              <motion.div
                className={`absolute inset-0 rounded-full transition-all duration-[3000ms] ${currentGradientConfig.button}`}
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0, 0.3, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Enhanced Shimmer Effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Button Content - Centered within the glowing orb */}
              <span className="relative z-10 flex items-center gap-3 justify-center">
                Start Investing
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center justify-center"
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </span>
            </motion.button>

            <motion.button
              onClick={() => setCurrentView?.('waitlist')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 rounded-full text-white font-semibold text-xl overflow-hidden transition-all duration-300 hover:shadow-2xl w-full sm:w-auto flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:shadow-purple-500/25"
            >
              {/* Enhanced Animated Background - Glowing Orb */}
              <motion.div
                className="absolute inset-0 rounded-full transition-all duration-[3000ms] bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0, 0.3, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Enhanced Shimmer Effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Button Content */}
              <span className="relative z-10 flex items-center gap-3 justify-center">
                <Sparkles className="w-6 h-6" />
                Join Waitlist
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center justify-center"
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </span>
            </motion.button>

            <motion.button
              onClick={handleExploreProjectsClick}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`group flex items-center gap-3 px-8 py-4 border rounded-full font-semibold text-xl backdrop-blur-md transition-all duration-[3000ms] w-full sm:w-auto justify-center ${currentGradientConfig.secondaryButton}`}
            >
                <TrendingUp className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Explore Projects
            </motion.button>
          </div>

          {/* 🎯 Scroll Indicator - perfectly centered below CTA buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mx-auto mt-8 z-20 flex justify-center"
            style={{ width: 'fit-content' }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-5 h-8 sm:w-6 sm:h-10 border-2 rounded-full flex justify-center items-start transition-all duration-[3000ms] bg-black/10 backdrop-blur-md ${currentGradientConfig.scrollIndicator}`}
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-1 h-2 sm:h-3 rounded-full mt-2 transition-all duration-[3000ms] ${currentGradientConfig.scrollDot}`}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* 🚀 Platform Impact Section - Optimized */}
        <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-6 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border font-medium mt-32 mb-4 text-sm bg-white/10 backdrop-blur-sm border-white/20 text-white">
              Platform Impact
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white">
              Transforming Entertainment{' '}
              <span className={`bg-gradient-to-r bg-clip-text text-transparent ${gradientClasses}`}>
                Investment
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-300">
              Sample data showcasing our platform's potential impact
            </p>
          </motion.div>

          {/* 🚀 Main Stats - Responsive Grid with Optimized Performance */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {mainStats.map((stat, idx) => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                onViewportEnter={() => handleStatViewportEnter(idx)}
                style={{ willChange: 'transform' }}
                className={`group relative p-6 sm:p-8 py-8 sm:py-10 rounded-2xl backdrop-blur-xl border transition-all duration-500 ${idx === 0 || idx === 3 ? '' : 'hover:scale-105'} ${currentGradientConfig.statCard}`}
              >
                <div className={`relative z-10 text-center flex flex-col justify-center h-full`}>
                  <div className={`mb-3 sm:mb-4 ${idx === 0 || idx === 3 ? '' : 'group-hover:scale-110'} transition-transform duration-300 ${currentGradientConfig.statIcon}`}>
                    <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />
                  </div>
                  <div className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white">{stat.label}</div>
                  <div className="text-2xl sm:text-3xl font-extrabold mb-2 text-white">
                    <AnimatedNumber 
                      value={stat.value} 
                      format={(v: number) => `${stat.prefix || ''}${v.toLocaleString()}${stat.unit || ''}`}
                      inView={!!statsInView[idx]}
                    />
                  </div>
                  <div className="text-xs text-gray-300 mb-2">{stat.description}</div>
                  <div className="text-center">
                    <span className="text-green-400 font-medium">
                      {stat.growth}
                    </span>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-red-400 text-xs font-medium">
                      (not real data)
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 🚀 Supporting Stats - Responsive Grid with Optimized Performance */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {supportingStats.map((metric, idx) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (mainStats.length + idx) * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                style={{ willChange: 'transform' }}
                className={`group relative p-6 sm:p-8 py-8 sm:py-10 rounded-2xl backdrop-blur-xl border transition-all duration-500 hover:scale-105 ${
                  theme === 'light'
                    ? 'bg-white/40 border-white/60 shadow-lg hover:shadow-xl'
                    : `${metric.color} border-white/20 hover:border-white/40`
                }`}
              >
                <div className={`relative z-10 text-center`}>
                  <div className={`mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 ${
                    metric.color.includes('green') ? 'text-green-400' :
                    metric.color.includes('blue') ? 'text-blue-400' :
                    metric.color.includes('purple') ? 'text-purple-400' :
                    metric.color.includes('orange') ? 'text-orange-400' :
                    'text-gray-400'
                  }`}>
                    <metric.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />
                  </div>
                  <div className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white">{metric.title}</div>
                  <div className="text-xl sm:text-2xl font-extrabold mb-2 text-white">{metric.value}</div>
                  <div className="text-xs text-white/60">{metric.description}</div>
                  <div className="text-center mt-2">
                    <span className="text-red-400 text-xs font-medium">
                      (not real data)
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;