import * as React from 'react';
import { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Globe, 
  TrendingUp, 
  Film, 
  Music,
  Camera,
  Gift,
  Rocket,
  Sparkles
} from 'lucide-react';

// 🛡️ Type definitions for better type safety
interface BenefitCard {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  gradient: string;
  features: string[];
  priority: 'high' | 'medium' | 'low';
}

// 🚀 Benefits data with cyberpunk theme
const benefitsData: BenefitCard[] = [
  {
    icon: Crown,
    title: 'VIP Founding Member Status',
    description: 'Exclusive access to premium investment opportunities',
    color: 'text-yellow-400',
    gradient: 'from-yellow-500/20 to-amber-500/20',
    features: [
      'Priority access to curated projects',
      'Exclusive founder-only events',
      'Direct communication with creators',
      'Early bird investment discounts'
    ],
    priority: 'high'
  },
  {
    icon: Film,
    title: 'Exclusive Film Projects',
    description: 'Access to handpicked entertainment investments',
    color: 'text-purple-400',
    gradient: 'from-purple-500/20 to-pink-500/20',
    features: [
      'Curated project selection',
      'Risk assessment insights',
      'Market trend analysis',
      'Personalized investment guidance'
    ],
    priority: 'high'
  },
  {
    icon: Film,
    title: 'Hollywood & Bollywood Access',
    description: 'Direct investment in major film productions',
    color: 'text-red-400',
    gradient: 'from-red-500/20 to-pink-500/20',
    features: [
      'Blockbuster movie investments',
      'Set visits with A-list stars',
      'Premiere event invitations',
      'Behind-the-scenes content'
    ],
    priority: 'high'
  },
  {
    icon: Music,
    title: 'Music Industry Ventures',
    description: 'Invest in chart-topping albums and tours',
    color: 'text-green-400',
    gradient: 'from-green-500/20 to-emerald-500/20',
    features: [
      'Album production funding',
      'Concert tour investments',
      'Artist development projects',
      'Music festival partnerships'
    ],
    priority: 'medium'
  },
  {
    icon: Camera,
    title: 'Set Experience Packages',
    description: 'Real-world trips to film and music sets',
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    features: [
      'On-set photography opportunities',
      'Meet & greet with celebrities',
      'Production crew interactions',
      'Exclusive behind-the-scenes access'
    ],
    priority: 'medium'
  },
  {
    icon: Gift,
    title: 'Exclusive Perks & Rewards',
    description: 'Digital assets and real-world rewards',
    color: 'text-pink-400',
    gradient: 'from-pink-500/20 to-purple-500/20',
    features: [
      'Collectibles from projects',
      'Merchandise from productions',
      'Digital voting rights',
      'Exclusive content access'
    ],
    priority: 'medium'
  },
  {
    icon: TrendingUp,
    title: '10x Return Potential',
    description: 'High-growth investment opportunities',
    color: 'text-emerald-400',
    gradient: 'from-emerald-500/20 to-green-500/20',
    features: [
      'Revenue sharing agreements',
      'Profit participation rights',
      'Royalty distribution',
      'Performance bonuses'
    ],
    priority: 'high'
  },
  {
    icon: Globe,
    title: 'Global Investment Network',
    description: 'Access to international entertainment markets',
    color: 'text-cyan-400',
    gradient: 'from-cyan-500/20 to-blue-500/20',
    features: [
      'Hollywood blockbusters',
      'Bollywood megahits',
      'International co-productions',
      'Cross-cultural projects'
    ],
    priority: 'medium'
  }
];

/**
 * 🎯 BenefitsGrid - Showcases exclusive waitlist benefits
 * @description Displays animated benefit cards with cyberpunk styling
 */
const BenefitsGrid: React.FC = () => {
  // 🚀 Memoized gradient configurations
  const cyberpunkGradients = useMemo(() => ({
    card: 'bg-white/10 backdrop-blur-xl border-white/20',
    hover: 'hover:border-purple-400/50 hover:bg-white/15',
    text: 'bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-500 bg-clip-text text-transparent'
  }), []);

  // 🚀 Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
      {/* 🎯 Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* 🎯 Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="mb-6"
          >
            <Sparkles className="w-12 h-12 text-purple-400 mx-auto" />
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            <span className={cyberpunkGradients.text}>
              Exclusive Benefits
            </span>
            <br />
            <span className="text-white">
              for Founding Members
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Unlock unprecedented access to the future of entertainment investment with AI-powered insights and exclusive perks
          </p>
        </motion.div>

        {/* 🎯 Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          {benefitsData.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                transition: { duration: 0.3 }
              }}
              className={`relative p-4 sm:p-6 rounded-2xl transition-all duration-500 ${cyberpunkGradients.card} ${cyberpunkGradients.hover} group`}
            >
              {/* 🎯 Priority Badge */}
              {benefit.priority === 'high' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                >
                  HOT
                </motion.div>
              )}

              {/* 🎯 Background Gradient */}
              <div className={`absolute inset-0 rounded-2xl ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10">
                {/* 🎯 Icon */}
                <motion.div
                  whileHover={{ 
                    scale: 1.2,
                    rotate: 5
                  }}
                  transition={{ duration: 0.3 }}
                  className={`mb-4 ${benefit.color}`}
                >
                  <benefit.icon className="w-8 h-8 sm:w-10 sm:h-10" />
                </motion.div>

                {/* 🎯 Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                  {benefit.title}
                </h3>

                {/* 🎯 Description */}
                <p className="text-gray-300 text-xs sm:text-sm mb-4 leading-relaxed">
                  {benefit.description}
                </p>

                {/* 🎯 Features List */}
                <ul className="space-y-2">
                  {benefit.features.map((feature, featureIndex) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + featureIndex * 0.1 + 0.8 }}
                      className="flex items-start space-x-2 text-xs text-gray-400"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, delay: index * 0.1 + featureIndex * 0.1 + 1 }}
                        className="mt-1"
                      >
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                      </motion.div>
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* 🎯 Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>

        {/* 🎯 Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16"
        >
          <div className={`inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 rounded-full ${cyberpunkGradients.card} border-purple-400/30 text-sm sm:text-base`}>
            <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            <span className="text-white font-semibold">
              Limited Time: Founding Member spots are filling fast!
            </span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(BenefitsGrid); 