import * as React from 'react';
import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Brain, Zap } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface FloatingWaitlistButtonProps {
  setCurrentView?: (view: 'home' | 'dashboard' | 'projects' | 'community' | 'waitlist') => void;
}

/**
 * 🎯 FloatingWaitlistButton - Floating action button for AI waitlist
 * @description Appears on all pages to promote the AI waitlist with animations
 */
const FloatingWaitlistButton: React.FC<FloatingWaitlistButtonProps> = memo(({ setCurrentView }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { theme } = useTheme();

  // 🚀 Handle button click
  const handleClick = useCallback(() => {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      // Navigate to waitlist page
      setCurrentView?.('waitlist');
      // Close the expanded state
      setIsExpanded(false);
    }
  }, [isExpanded, setCurrentView]);

  // 🚀 Handle close
  const handleClose = useCallback(() => {
    setIsVisible(false);
    // Reappear after 30 seconds
    setTimeout(() => setIsVisible(true), 30000);
  }, []);

  // 🚀 Handle expand
  const handleExpand = useCallback(() => {
    setIsExpanded(true);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`absolute bottom-16 right-0 w-80 p-4 rounded-2xl backdrop-blur-xl border shadow-2xl ${
              theme === 'light'
                ? 'bg-white/90 border-white/60 shadow-lg'
                : 'bg-gray-900/90 border-white/20 shadow-xl'
            }`}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${
                theme === 'light'
                  ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <h3 className={`font-bold text-lg ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Join Waitlist
                </h3>
              </div>
              
              <p className={`text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>
                Join the exclusive waitlist for early access to curated entertainment investments. 
                Get VIP perks, set visits & exclusive benefits.
              </p>

              <div className="flex items-center gap-2 text-xs text-purple-400">
                <Zap className="w-3 h-3" />
                <span>Limited spots available</span>
              </div>

              <motion.button
                onClick={handleClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-lg text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
              >
                Join Waitlist
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating button */}
      <motion.button
        onClick={isExpanded ? handleClick : handleExpand}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`relative p-4 rounded-full shadow-2xl transition-all duration-300 ${
          isExpanded
            ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
        }`}
      >
        {/* Animated background */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
        />

        {/* Icon */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="sparkles"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pulse effect */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
          }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
        />
      </motion.button>
    </div>
  );
});

FloatingWaitlistButton.displayName = 'FloatingWaitlistButton';

export default FloatingWaitlistButton; 