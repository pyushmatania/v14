import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { useTheme } from './ThemeContext';

const InfoBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    // Show banner after a short delay
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const notificationMessages = [
    "🎬 Platform launching soon with real projects",
    "🚀 Early access available - Join the waitlist",
    "💡 This is a demo version - Data is for demonstration",
    "🔒 Secure platform with blockchain technology",
    "📱 Mobile app coming soon",
    "🌟 Be among the first to invest in entertainment",
    "🎯 Fractional investment in movies, music & web series",
    "🚨 Platform is not live yet - Data are not real"
  ];

  return (
    <>
      {/* Bottom Info Banner - Full Width Glassmorphism */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-40"
          >
            <div className={`relative w-full border-t overflow-hidden shadow-2xl ${
              theme === 'light'
                ? 'bg-white/20 backdrop-blur-2xl border-white/20'
                : 'bg-black/20 backdrop-blur-2xl border-white/10'
            }`}
            style={{
              background: theme === 'light'
                ? 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)'
                : 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}>
              
              {/* Glassmorphism Overlay Effects */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Top gradient line */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                {/* Bottom gradient line */}
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                {/* Warning accent lines */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500/40 via-yellow-500/40 to-red-500/40" />
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500/40 via-yellow-500/40 to-red-500/40" />
              </div>

              <div className="relative flex items-center justify-between px-4 py-2 sm:px-6 sm:py-3">
                {/* Left side - Icon and main message */}
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className={`p-1.5 sm:p-2 rounded-full backdrop-blur-sm ${
                    theme === 'light' 
                      ? 'bg-yellow-500/20 text-yellow-600 border border-yellow-400/30' 
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30'
                  }`}
                  style={{
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)'
                  }}>
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs sm:text-sm font-medium truncate ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}
                    style={{
                      textShadow: theme === 'light' 
                        ? '0 1px 2px rgba(0,0,0,0.1)' 
                        : '0 1px 2px rgba(0,0,0,0.3)'
                    }}>
                      🚨 Platform is not live yet - Data are not real
                    </p>
                  </div>
                </div>

                {/* Right side - Scrolling messages */}
                <div className="hidden sm:flex items-center gap-4 flex-1 min-w-0 ml-6">
                  <div className="flex-1 overflow-hidden">
                    <div className="flex animate-scroll-infinite">
                      {[...notificationMessages, ...notificationMessages].map((message, index) => (
                        <span
                          key={index}
                          className={`text-sm font-medium whitespace-nowrap px-4 ${
                            theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                          }`}
                          style={{
                            textShadow: theme === 'light' 
                              ? '0 1px 2px rgba(0,0,0,0.1)' 
                              : '0 1px 2px rgba(0,0,0,0.3)'
                          }}
                        >
                          {message}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Close button */}
                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                  <button
                    onClick={() => setShowBanner(false)}
                    className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 backdrop-blur-sm ${
                      theme === 'light' 
                        ? 'hover:bg-white/20 text-gray-600 border border-gray-300/30' 
                        : 'hover:bg-white/10 text-gray-300 border border-white/20'
                    }`}
                    style={{
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)'
                    }}
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
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

export default InfoBanner;
