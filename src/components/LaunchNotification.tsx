import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Calendar } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { useTheme } from './ThemeContext';

const LaunchNotification: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const { theme } = useTheme();

  useEffect(() => {
    // 🚀 Show notification after component mounts
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [setShowPopup]);

  useEffect(() => {
    // Show banner after popup is closed
    if (!showPopup) {
      setTimeout(() => setShowBanner(true), 500);
    }
  }, [showPopup]);

  // Countdown timer effect
  useEffect(() => {
    if (showPopup && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (showPopup && countdown === 0) {
      handleClosePopup();
    }
    return undefined;
  }, [showPopup, countdown]);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const notificationMessages = [
    "🎬 Platform launching soon with real projects",
    "🚨 Platform is not live yet - Data are not real",
    "📱 Mobile apps for iOS and Android - Coming Soon",
    "🚨 Platform is not live yet - Data are not real",
    "🔒 Bank-grade security & compliance - Coming Soon",
    "🚨 Platform is not live yet - Data are not real",
    "🌍 Global reach & multi-currency - Coming Soon",
    "🚨 Platform is not live yet - Data are not real",
    "💎 Early access for waitlist members",
    "🚨 Platform is not live yet - Data are not real",
    "🎬 Real movies, music & series",
    "🚨 Platform is not live yet - Data are not real",
    "📊 Live market data & analytics",
    "🚨 Platform is not live yet - Data are not real",
    "🎯 AI investment recommendations",
    "🚨 Platform is not live yet - Data are not real"
  ];

  return (
    <>
      {/* Initial Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/30 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className={`relative w-full max-w-sm sm:max-w-2xl lg:max-w-4xl rounded-xl sm:rounded-2xl border overflow-hidden shadow-2xl ${
                theme === 'light'
                  ? 'bg-white/80 backdrop-blur-2xl border-white/30'
                  : 'bg-gray-900/80 backdrop-blur-2xl border-white/10'
              }`}
              style={{
                background: theme === 'light'
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)'
                  : 'linear-gradient(135deg, rgba(17,24,39,0.9) 0%, rgba(17,24,39,0.7) 100%)',
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)'
              }}
            >
              {/* 3D Crime Scene Warning Tape Background */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl sm:rounded-2xl z-10">
                {/* Multiple layers of tape for 3D effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Background shadow layer */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transform: 'rotate(-45deg)',
                      transformOrigin: 'center center',
                      fontSize: 'clamp(1.5rem, 6vw, 5rem)',
                      fontWeight: 'bold',
                      color: 'rgba(0, 0, 0, 0.4)',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      filter: 'blur(2px)',
                      zIndex: 1
                    }}
                  >
                    COMING SOON
                  </div>
                  
                  {/* Main tape layer */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transform: 'rotate(-45deg)',
                      transformOrigin: 'center center',
                      fontSize: 'clamp(1.5rem, 6vw, 5rem)',
                      fontWeight: 'bold',
                      color: '#dc2626',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      zIndex: 2,
                      textShadow: '3px 3px 0px rgba(0,0,0,0.9), 6px 6px 0px rgba(0,0,0,0.7)'
                    }}
                  >
                    COMING SOON
                  </div>
                  
                  {/* Highlight layer for 3D effect */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transform: 'rotate(-45deg)',
                      transformOrigin: 'center center',
                      fontSize: 'clamp(1.5rem, 6vw, 5rem)',
                      fontWeight: 'bold',
                      color: '#fca5a5',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      zIndex: 3,
                      textShadow: '2px 2px 0px rgba(255,255,255,0.9)',
                      filter: 'blur(0.5px)'
                    }}
                  >
                    COMING SOON
                  </div>
                </div>
                
                {/* Second warning line */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transform: 'rotate(-45deg)',
                      transformOrigin: 'center center',
                      fontSize: 'clamp(0.9rem, 4vw, 3rem)',
                      fontWeight: 'bold',
                      color: '#dc2626',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      zIndex: 2,
                      textShadow: '3px 3px 0px rgba(0,0,0,0.9), 6px 6px 0px rgba(0,0,0,0.7)',
                      marginTop: 'clamp(2rem, 8vw, 7rem)'
                    }}
                  >
                    MOCK UP DATA YET
                  </div>
                  
                  {/* Highlight for second line */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transform: 'rotate(-45deg)',
                      transformOrigin: 'center center',
                      fontSize: 'clamp(0.9rem, 4vw, 3rem)',
                      fontWeight: 'bold',
                      color: '#fca5a5',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      zIndex: 3,
                      textShadow: '2px 2px 0px rgba(255,255,255,0.9)',
                      filter: 'blur(0.5px)',
                      marginTop: 'clamp(2rem, 8vw, 7rem)'
                    }}
                  >
                    MOCK UP DATA YET
                  </div>
                </div>
                
                {/* Police tape border effect */}
                <div className="absolute inset-0">
                  {/* Top border */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1.5 sm:h-2 bg-gradient-to-r from-red-600 via-yellow-400 to-red-600"
                    style={{
                      background: 'repeating-linear-gradient(90deg, #dc2626 0px, #dc2626 20px, #fbbf24 20px, #fbbf24 40px)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                    }}
                  ></div>
                  
                  {/* Bottom border */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1.5 sm:h-2 bg-gradient-to-r from-red-600 via-yellow-400 to-red-600"
                    style={{
                      background: 'repeating-linear-gradient(90deg, #dc2626 0px, #dc2626 20px, #fbbf24 20px, #fbbf24 40px)',
                      boxShadow: '0 -2px 4px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(255,255,255,0.3)'
                    }}
                  ></div>
                  
                  {/* Left border */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1.5 sm:w-2 bg-gradient-to-b from-red-600 via-yellow-400 to-red-600"
                    style={{
                      background: 'repeating-linear-gradient(180deg, #dc2626 0px, #dc2626 20px, #fbbf24 20px, #fbbf24 40px)',
                      boxShadow: '2px 0 4px rgba(0,0,0,0.4), inset 1px 0 0 rgba(255,255,255,0.3)'
                    }}
                  ></div>
                  
                  {/* Right border */}
                  <div 
                    className="absolute right-0 top-0 bottom-0 w-1.5 sm:w-2 bg-gradient-to-b from-red-600 via-yellow-400 to-red-600"
                    style={{
                      background: 'repeating-linear-gradient(180deg, #dc2626 0px, #dc2626 20px, #fbbf24 20px, #fbbf24 40px)',
                      boxShadow: '-2px 0 4px rgba(0,0,0,0.4), inset -1px 0 0 rgba(255,255,255,0.3)'
                    }}
                  ></div>
                </div>
                
                {/* Corner police badges */}
                <div className="absolute top-0.5 sm:top-1 left-0.5 sm:left-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">🚔</span>
                </div>
                <div className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">🚔</span>
                </div>
                <div className="absolute bottom-0.5 sm:bottom-1 left-0.5 sm:left-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">🚔</span>
                </div>
                <div className="absolute bottom-0.5 sm:bottom-1 right-0.5 sm:right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">🚔</span>
                </div>
              </div>

              {/* Header */}
              <div className={`p-2 sm:p-3 border-b relative z-20 ${
                theme === 'light' ? 'border-white/30 bg-gradient-to-r from-red-100/30 to-orange-100/30' : 'border-white/10 bg-gradient-to-r from-red-900/20 to-orange-900/20'
              }`}
              style={{
                background: theme === 'light'
                  ? 'linear-gradient(90deg, rgba(239,68,68,0.1) 0%, rgba(249,115,22,0.1) 100%)'
                  : 'linear-gradient(90deg, rgba(239,68,68,0.2) 0%, rgba(249,115,22,0.2) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Circle Logo */}
                    <div className="relative">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 p-1">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                            <span className="text-white text-xs sm:text-sm font-bold">C</span>
                          </div>
                        </div>
                      </div>
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-orange-500 opacity-60 blur-sm animate-pulse"></div>
                    </div>
                    
                    {/* Branding and Title */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Circles</span>
                        <span className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-100 text-red-600 rounded-full font-medium">Beta</span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-red-600 truncate">
                        Important News
                      </h2>
                      <p className={`text-xs ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                      } truncate`}>
                        Platform Launch Update
                      </p>
                    </div>
                  </div>
                  
                  {/* Close Buttons */}
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <button
                      onClick={handleClosePopup}
                      className={`hidden sm:block px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg transition-colors ${
                        theme === 'light' 
                          ? 'bg-red-100 hover:bg-red-200 text-red-600' 
                          : 'bg-red-900/30 hover:bg-red-900/50 text-red-400'
                      }`}
                    >
                      Close
                    </button>
                    <button
                      onClick={handleClosePopup}
                      className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                        theme === 'light' 
                          ? 'hover:bg-gray-100 text-gray-500' 
                          : 'hover:bg-gray-700 text-gray-400'
                      }`}
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content - Responsive Grid Layout */}
              <div className="p-2 sm:p-3 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                  {/* Main Message */}
                  <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${
                    theme === 'light' ? 'bg-red-50/90 border-2 border-red-300/60' : 'bg-red-900/30 border-2 border-red-600/40'
                  }`}
                  style={{
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    boxShadow: theme === 'light' 
                      ? '0 4px 20px rgba(239, 68, 68, 0.15)' 
                      : '0 4px 20px rgba(239, 68, 68, 0.3)'
                  }}>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1 sm:p-1.5 rounded-full bg-red-100 dark:bg-red-900/50 flex-shrink-0">
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-sm sm:text-base mb-1 sm:mb-2 ${
                          theme === 'light' ? 'text-red-800' : 'text-red-200'
                        }`}>
                          🚧 Platform Not Yet Launched
                        </h3>
                        <p className={`text-xs sm:text-sm leading-relaxed ${
                          theme === 'light' ? 'text-red-700' : 'text-red-200'
                        }`}>
                          <strong>Important:</strong> All content is mock data for demonstration only.
                        </p>
                        <div className="mt-1 sm:mt-2 p-1 sm:p-1.5 bg-red-100/50 dark:bg-red-900/20 rounded-lg border border-red-200/50 dark:border-red-700/30">
                          <p className={`text-xs font-medium ${
                            theme === 'light' ? 'text-red-800' : 'text-red-300'
                          }`}>
                            ⚠️ Demo version - No real transactions
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* What's Coming */}
                  <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${
                    theme === 'light' ? 'bg-gradient-to-r from-green-50/90 to-emerald-50/90 border-2 border-green-300/60' : 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-2 border-green-600/40'
                  }`}
                  style={{
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    boxShadow: theme === 'light' 
                      ? '0 4px 20px rgba(34, 197, 94, 0.15)' 
                      : '0 4px 20px rgba(34, 197, 94, 0.3)'
                  }}>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1 sm:p-1.5 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 flex-shrink-0">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-sm sm:text-base mb-1 sm:mb-2 ${
                          theme === 'light' ? 'text-green-800' : 'text-green-200'
                        }`}>
                          🚀 Coming Soon
                        </h3>
                        <div className="space-y-0.5 sm:space-y-1 text-xs">
                          <div className="flex items-center gap-1 sm:gap-1.5">
                            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full"></span>
                            <span className={`${
                              theme === 'light' ? 'text-green-700' : 'text-green-200'
                            }`}>
                              Real Bollywood Projects
                            </span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-1.5">
                            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full"></span>
                            <span className={`${
                              theme === 'light' ? 'text-green-700' : 'text-green-200'
                            }`}>
                              Live Investments
                            </span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-1.5">
                            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full"></span>
                            <span className={`${
                              theme === 'light' ? 'text-green-700' : 'text-green-200'
                            }`}>
                              Verified Community
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${
                    theme === 'light' ? 'bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border-2 border-blue-300/60' : 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-2 border-blue-600/40'
                  }`}
                  style={{
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    boxShadow: theme === 'light' 
                      ? '0 4px 20px rgba(59, 130, 246, 0.15)' 
                      : '0 4px 20px rgba(59, 130, 246, 0.3)'
                  }}>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                        <div className="p-1 sm:p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/50">
                          <span className="text-lg sm:text-xl">💌</span>
                        </div>
                        <h4 className={`text-sm sm:text-base font-bold ${
                          theme === 'light' ? 'text-blue-800' : 'text-blue-200'
                        }`}>
                          Join Waitlist!
                        </h4>
                      </div>
                      <p className={`text-xs sm:text-sm font-medium ${
                        theme === 'light' ? 'text-blue-700' : 'text-blue-300'
                      }`}>
                        Get early access & exclusive updates!
                      </p>
                      <div className="mt-1 sm:mt-2 p-1 sm:p-1.5 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-700/30">
                        <p className={`text-xs font-medium ${
                          theme === 'light' ? 'text-blue-800' : 'text-blue-300'
                        }`}>
                          🎯 Limited spots available!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className={`p-2 border-t relative z-20 ${
                theme === 'light' ? 'border-white/30 bg-blue-100/30' : 'border-white/10 bg-blue-900/20'
              }`}
              style={{
                background: theme === 'light'
                  ? 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(147,51,234,0.2) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                    <span className={`text-xs sm:text-sm font-medium ${
                      theme === 'light' ? 'text-blue-700' : 'text-blue-300'
                    }`}>
                      Auto-closes in: <span className="font-bold text-base sm:text-lg">{countdown}</span>s
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={`p-2 sm:p-3 border-t relative z-20 ${
                theme === 'light' ? 'border-white/30 bg-gray-100/30' : 'border-white/10 bg-gray-800/30'
              }`}
              style={{
                background: theme === 'light'
                  ? 'linear-gradient(135deg, rgba(156,163,175,0.1) 0%, rgba(107,114,128,0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(31,41,55,0.3) 0%, rgba(17,24,39,0.3) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}>
                <button
                  onClick={handleClosePopup}
                  className={`w-full py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg sm:rounded-xl font-medium transition-all duration-300 ${
                    theme === 'light'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                  }`}
                >
                  Got it - Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`fixed bottom-0 left-0 right-0 z-40 ${
              theme === 'light' 
                ? 'bg-white/20 backdrop-blur-2xl border-t border-white/30 shadow-2xl' 
                : 'bg-black/20 backdrop-blur-2xl border-t border-white/10 shadow-2xl'
            }`}
            style={{
              background: theme === 'light'
                ? 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
                : 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)'
            }}
          >
            <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
              {/* Scrolling Message - Infinite Loop */}
              <div className="flex-1 overflow-hidden">
                <div className="flex animate-scroll-infinite">
                  {/* First set of messages */}
                  {notificationMessages.map((message, index) => (
                    <div
                      key={`first-${index}`}
                      className={`flex items-center gap-1.5 sm:gap-2 mx-3 sm:mx-4 md:mx-8 whitespace-nowrap text-xs sm:text-sm ${
                        message.includes('🚨') 
                          ? 'text-red-600 font-semibold' 
                          : theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}
                    >
                      <span className={message.includes('🚨') ? 'text-red-600' : 'text-red-500'}>•</span>
                      {message}
                    </div>
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {notificationMessages.map((message, index) => (
                    <div
                      key={`second-${index}`}
                      className={`flex items-center gap-1.5 sm:gap-2 mx-3 sm:mx-4 md:mx-8 whitespace-nowrap text-xs sm:text-sm ${
                        message.includes('🚨') 
                          ? 'text-red-600 font-semibold' 
                          : theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}
                    >
                      <span className={message.includes('🚨') ? 'text-red-600' : 'text-red-500'}>•</span>
                      {message}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2 ml-2 sm:ml-3 md:ml-4 flex-shrink-0">
                <button
                  onClick={() => setShowBanner(false)}
                  className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                    theme === 'light' 
                      ? 'hover:bg-gray-100 text-gray-500' 
                      : 'hover:bg-gray-700 text-gray-400'
                  }`}
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom CSS for infinite scroll animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll-infinite {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          .animate-scroll-infinite {
            animation: scroll-infinite 60s linear infinite;
          }
          
          .animate-scroll-infinite:hover {
            animation-play-state: paused;
          }
          
          /* Mobile optimizations */
          @media (max-width: 640px) {
            .animate-scroll-infinite {
              animation-duration: 45s;
            }
          }
        `
      }} />
    </>
  );
};

export default LaunchNotification;
