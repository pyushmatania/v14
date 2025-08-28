import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'default' | 'premium' | 'entertainment';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...',
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const variants = {
    default: {
      primary: 'from-purple-500 to-pink-500',
      secondary: 'from-cyan-400 to-blue-500',
      accent: 'from-purple-400 to-pink-400'
    },
    premium: {
      primary: 'from-yellow-400 to-orange-500',
      secondary: 'from-amber-500 to-yellow-500',
      accent: 'from-yellow-300 to-orange-400'
    },
    entertainment: {
      primary: 'from-pink-500 to-purple-600',
      secondary: 'from-blue-500 to-cyan-500',
      accent: 'from-purple-400 to-pink-400'
    }
  };

  const currentVariant = variants[variant];

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      {/* 🎬 Main Loading Animation */}
      <div className="relative">
        {/* Outer Ring */}
        <motion.div
          className={`${sizeClasses[size]} rounded-full border-2 border-gray-200/20 relative overflow-hidden`}
          animate={{
            rotate: 360,
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Gradient Border */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${currentVariant.primary} opacity-20`} />
          
          {/* Animated Border */}
          <motion.div
            className={`absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r ${currentVariant.primary} bg-clip-border`}
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              background: `conic-gradient(from 0deg, transparent, ${currentVariant.primary}, transparent)`
            }}
          />
        </motion.div>

        {/* Center Icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {variant === 'premium' ? (
            <motion.div
              className="text-2xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              💎
            </motion.div>
          ) : variant === 'entertainment' ? (
            <motion.div
              className="text-2xl"
              animate={{ 
                y: [0, -2, 0],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              🎬
            </motion.div>
          ) : (
            <motion.div
              className="text-2xl"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ⭐
            </motion.div>
          )}
        </motion.div>

        {/* Floating Particles */}
        {variant === 'premium' && (
          <>
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-1 -left-1 w-2 h-2 bg-orange-400 rounded-full"
              animate={{
                y: [0, 10, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1,
                ease: "easeInOut"
              }}
            />
          </>
        )}

        {variant === 'entertainment' && (
          <>
            <motion.div
              className="absolute -top-2 -right-2 w-3 h-3 bg-pink-400 rounded-full"
              animate={{
                y: [0, -15, 0],
                x: [0, 5, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: 0.5,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full"
              animate={{
                y: [0, 15, 0],
                x: [0, -5, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: 1.5,
                ease: "easeInOut"
              }}
            />
          </>
        )}
      </div>

      {/* Loading Text */}
      <motion.div
        className={`text-center ${textSizes[size]}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex items-center justify-center space-x-2">
          {/* Animated Dots */}
          <motion.span
            className={`font-medium bg-gradient-to-r ${currentVariant.primary} bg-clip-text text-transparent`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          >
            {text}
          </motion.span>
          
          {/* Animated Dots */}
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${currentVariant.secondary}`}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        className="w-32 h-1 bg-gray-200/20 rounded-full overflow-hidden"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <motion.div
          className={`h-full bg-gradient-to-r ${currentVariant.accent} rounded-full`}
          animate={{
            x: [-128, 128],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
