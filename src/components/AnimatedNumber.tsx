import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import React, { useEffect, memo, useCallback } from 'react';

// 🛡️ Type definitions for better type safety
interface AnimatedNumberProps {
  value: number;
  className?: string;
  format?: Function;
  inView?: boolean;
}

/**
 * 🎯 AnimatedNumber - Optimized animated number component with enhanced performance
 * @description Smoothly animates number changes with customizable formatting
 */
const AnimatedNumber: React.FC<AnimatedNumberProps> = memo(({ 
  value, 
  className, 
  format, 
  inView = true 
}) => {
  // 🚀 Memoized motion values for better performance
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { 
    stiffness: 100, 
    damping: 20,
    mass: 0.5
  });
  
  // 🚀 Memoized transform function
  const display = useTransform(spring, useCallback((latest: number) => {
    const v = Math.round(latest);
    return format ? format(v) : v.toLocaleString();
  }, [format]));

  // 🚀 Optimized effect for value updates with performance improvements
  useEffect(() => {
    if (inView) {
      // Use requestAnimationFrame for smoother animations
      requestAnimationFrame(() => {
      motionValue.set(value);
      });
    }
  }, [value, inView, motionValue]);

  return (
    <motion.span 
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {display}
    </motion.span>
  );
});

AnimatedNumber.displayName = 'AnimatedNumber';

export default AnimatedNumber;
