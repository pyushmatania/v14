import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SafeMotionProps {
  children: ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  whileHover?: any;
  whileTap?: any;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  onClick?: () => void;
  style?: React.CSSProperties;
  [key: string]: any;
}

const SafeMotion: React.FC<SafeMotionProps> = ({ 
  children, 
  className = "",
  initial,
  animate,
  exit,
  transition,
  whileHover,
  whileTap,
  onHoverStart,
  onHoverEnd,
  onClick,
  style,
  ...props 
}) => {
  // Safe animation values with fallbacks
  const safeInitial = initial || { opacity: 1 };
  const safeAnimate = animate || { opacity: 1 };
  const safeExit = exit || { opacity: 0 };
  const safeTransition = transition || { duration: 0.3 };

  return (
    <motion.div
      className={className}
      initial={safeInitial}
      animate={safeAnimate}
      exit={safeExit}
      transition={safeTransition}
      whileHover={whileHover}
      whileTap={whileTap}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={onClick}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default SafeMotion;
