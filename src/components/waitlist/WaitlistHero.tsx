import * as React from 'react';
import { useState, useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Film, 
  Crown,
  Star,
  Rocket,
  Eye
} from 'lucide-react';
import Typewriter from '../Typewriter';
import { useTheme } from '../ThemeContext';
import SignupForm from './SignupForm';

// 🛡️ Type definitions for better type safety
interface WaitlistHeroProps {
  setCurrentView?: (view: 'home' | 'dashboard' | 'projects' | 'community') => void;
}



// 🚀 Benefits data for the waitlist
const waitlistBenefits = [
  {
    icon: Film,
    title: 'Exclusive Film Projects',
    description: 'Early access to curated entertainment investments',
    color: 'text-purple-400'
  },
  {
    icon: Star,
    title: 'High Return Potential',
    description: 'Across Bollywood, Tollywood & Hollywood',
    color: 'text-green-400'
  },
  {
    icon: Crown,
    title: 'VIP Experiences',
    description: 'Set visits, meet & greets with creators',
    color: 'text-yellow-400'
  },
  {
    icon: Sparkles,
    title: 'Founding Member Perks',
    description: 'Exclusive perks, voting rights & early access',
    color: 'text-pink-400'
  }
];

/**
 * 🎯 WaitlistHero - Futuristic AI-powered waitlist hero section
 * @description Displays animated hero content with live counters and signup form
 */
const WaitlistHero: React.FC<WaitlistHeroProps> = memo(({ setCurrentView }) => {
  const { theme } = useTheme();
  const [showForm, setShowForm] = useState(false);

  // 🚀 Memoized gradient configurations for cyberpunk theme
  const cyberpunkGradients = useMemo(() => ({
    primary: 'bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-600',
    secondary: 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600',
    tertiary: 'bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600',
    accent: 'bg-gradient-to-br from-pink-600 via-purple-600 to-blue-600',
    glow: 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500',
    button: 'bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:shadow-purple-500/25',
    card: 'bg-white/10 backdrop-blur-xl border-white/20',
    text: 'bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-500 bg-clip-text text-transparent'
  }), []);



  // 🚀 Memoized particle dots for enhanced cyberpunk effect
  const cyberpunkParticles = useMemo(() => 
    [...Array(40)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 8,
      duration: 4 + Math.random() * 3,
      size: Math.random() * 3 + 1,
      color: ['purple', 'pink', 'cyan', 'blue'][Math.floor(Math.random() * 4)]
    })), []
  );

  // 🚀 Optimized CTA click handler
  const handleJoinWaitlistClick = useCallback(() => {
    setShowForm(true);
    // Smooth scroll to form
    setTimeout(() => {
      const formElement = document.getElementById('waitlist-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }, []);

  return (
    <section 
      className={`relative min-h-screen flex items-center justify-center overflow-hidden pt-12 md:pt-16 transform-gpu ${
        theme === 'light' ? 'bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50' : 'bg-gradient-to-br from-gray-900 via-purple-900 to-black'
      }`}
      style={{ 
        willChange: 'transform',
        contain: 'layout style paint'
      }}
    >
      {/* 🎯 Cyberpunk Burst Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary Cyberpunk Orb */}
        <div 
          className={`absolute top-1/4 left-1/4 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-60 transition-all duration-[3000ms] ${cyberpunkGradients.primary}`}
          style={{
            animation: 'cyberpunkFloat 25s ease-in-out infinite',
            willChange: 'transform'
          }}
        />
        
        {/* Secondary Cyberpunk Orb */}
        <div 
          className={`absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-50 transition-all duration-[3000ms] ${cyberpunkGradients.secondary}`}
          style={{
            animation: 'cyberpunkFloat 30s ease-in-out infinite 5s',
            willChange: 'transform'
          }}
        />

        {/* Tertiary Cyberpunk Orb */}
        <div 
          className={`absolute top-1/2 right-1/3 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-40 transition-all duration-[3000ms] ${cyberpunkGradients.tertiary}`}
          style={{
            animation: 'cyberpunkFloat 28s ease-in-out infinite 10s',
            willChange: 'transform'
          }}
        />

        {/* Center Cyberpunk Orb */}
        <div 
          className={`absolute top-1/2 left-1/2 w-[40rem] h-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl opacity-60 ${cyberpunkGradients.accent}`}
          style={{
            animation: 'cyberpunkPulse 35s ease-in-out infinite',
            willChange: 'transform'
          }}
        />
      </div>

      {/* 🚀 Enhanced Cyberpunk Particle System */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {cyberpunkParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute rounded-full transition-all duration-[3000ms] ${
              particle.color === 'purple' ? 'bg-purple-400' :
              particle.color === 'pink' ? 'bg-pink-400' :
              particle.color === 'cyan' ? 'bg-cyan-400' :
              'bg-blue-400'
            }`}
            style={{
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* 🚀 Optimized CSS Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes cyberpunkFloat {
            0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
            25% { transform: translate(120px, -100px) scale(1.3) rotate(90deg); }
            50% { transform: translate(-60px, 80px) scale(0.9) rotate(180deg); }
            75% { transform: translate(80px, -80px) scale(1.2) rotate(270deg); }
          }
          
          @keyframes cyberpunkPulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 0.6; }
            50% { transform: translate(-50%, -50%) scale(1.2) rotate(15deg); opacity: 0.8; }
          }
          
          @keyframes cyberpunkGlow {
            0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
            50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
          }
        `
      }} />

      {/* 🎯 Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
          style={{ willChange: 'transform' }}
        >
          {/* 🎯 Enhanced Floating Badge with Cyberpunk Theme */}
          <motion.div
            animate={{ 
              y: [0, -12, 0],
              rotate: [0, 3, -3, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border font-medium mt-10 mb-8 backdrop-blur-md transition-all duration-[3000ms] text-sm sm:text-base ${cyberpunkGradients.card} border-purple-400/30`}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Crown className="w-5 h-5 text-purple-400" />
            </motion.div>
            <span className="text-white font-semibold">Exclusive Waitlist</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-4 h-4 text-cyan-400" />
            </motion.div>
          </motion.div>



          {/* 🎯 3D Animated Characters */}
          <div className="relative mb-8">
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotateY: [0, 15, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute left-10 top-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-80"
              style={{ transformStyle: 'preserve-3d' }}
            />
            <motion.div
              animate={{ 
                y: [0, 20, 0],
                rotateY: [0, -15, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute right-10 top-10 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full opacity-80"
              style={{ transformStyle: 'preserve-3d' }}
            />
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotateY: [0, 20, 0]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute left-1/4 bottom-0 w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-full opacity-80"
              style={{ transformStyle: 'preserve-3d' }}
            />
          </div>

          {/* 🎯 Main Headline */}
          <h1 className={`text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 sm:mb-8 leading-tight ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            <span className={cyberpunkGradients.text}>
              <Typewriter
                text="JOIN THE WAITLIST"
                className="block mb-2 sm:mb-4"
              />
            </span>
            <span className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium">
              Be part of entertainment's future
            </span>
          </h1>
          
          {/* 🎯 Subtitle */}
          <p className={`text-base sm:text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-4 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            <span className={cyberpunkGradients.text}>Exclusive access to curated entertainment investments.</span>
            <br className="hidden sm:block" />
            <span className="text-white/80">Get VIP perks, early access & founding member benefits.</span>
          </p>

          {/* 🚀 Enhanced CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4">
            <motion.button
              onClick={handleJoinWaitlistClick}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className={`group relative px-6 sm:px-10 py-4 sm:py-5 rounded-full text-white font-bold text-lg sm:text-xl md:text-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl w-full sm:w-auto flex items-center justify-center ${cyberpunkGradients.button} animate-cyberpunkGlow`}
            >
              {/* Enhanced Animated Background */}
              <motion.div
                className={`absolute inset-0 rounded-full transition-all duration-[3000ms] ${cyberpunkGradients.glow}`}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0, 0.4, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Enhanced Shimmer Effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Button Content */}
              <span className="relative z-10 flex items-center gap-4 justify-center">
                <Rocket className="w-7 h-7" />
                Join Waitlist
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-7 h-7" />
                </motion.div>
              </span>
            </motion.button>

            <motion.button
              onClick={() => setCurrentView?.('projects')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`group flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 border rounded-full font-semibold text-base sm:text-lg md:text-xl backdrop-blur-md transition-all duration-[3000ms] w-full sm:w-auto justify-center ${cyberpunkGradients.card} border-purple-400/30 text-white hover:border-purple-400/50`}
            >
              <Eye className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
              Explore Projects
            </motion.button>
          </div>



          {/* 🎯 Benefits Grid */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-white px-4">
              Get early access to:
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto px-4">
              {waitlistBenefits.map((benefit, idx) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  style={{ willChange: 'transform' }}
                  className={`group relative p-4 sm:p-6 rounded-2xl backdrop-blur-xl border transition-all duration-500 hover:scale-105 ${cyberpunkGradients.card} border-purple-400/30 hover:border-purple-400/50`}
                >
                  <div className="relative z-10 text-center">
                    <div className={`mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 ${benefit.color}`}>
                      <benefit.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />
                    </div>
                    <div className="text-base sm:text-lg font-bold mb-2 text-white">{benefit.title}</div>
                    <div className="text-xs sm:text-sm text-white/70">{benefit.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 🎯 Urgency Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-full border font-medium mb-6 sm:mb-8 ${cyberpunkGradients.card} border-red-400/30 text-red-300 text-sm sm:text-base`}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-red-400" />
            </motion.div>
            <span className="font-semibold">⏳ Limited spots available!</span>
          </motion.div>
        </motion.div>

        {/* 🎯 Signup Form Section */}
        {showForm && (
          <motion.div
            id="waitlist-form"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <SignupForm />
          </motion.div>
        )}
      </div>
    </section>
  );
});

WaitlistHero.displayName = 'WaitlistHero';

export default WaitlistHero; 