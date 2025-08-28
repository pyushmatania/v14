import { motion } from 'framer-motion';
import { Medal, Box, Gem, Crown, CheckCircle, Star, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import * as React from 'react';


// Import perks images from centralized utils
import { images } from '../utils/imageUtils';

import GlassCard from './GlassCard';
import { useTheme } from './ThemeContext';

// Simple error boundary for Rewards
const RewardsErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);

  if (hasError) {
    return (
      <div className="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 dark:border-white/10">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Rewards Section
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Experience our unique rewards and perks system.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div onError={() => setHasError(true)}>
      {children}
    </div>
  );
};

// Safe wrapper for GlassCard
const SafeGlassCard: React.FC<any> = (props) => {
  return (
    <React.Suspense fallback={
      <div className="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 dark:border-white/10 hover:shadow-xl transition-all duration-300">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Loading Experience...
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Preparing your unique experience
          </p>
        </div>
      </div>
    }>
      <GlassCard {...props} />
    </React.Suspense>
  );
};

const circlesIllustrations = [
  {
    image: images.perk1,
    title: "Creative Collaboration",
    description: "Connect with creators and shape the future of entertainment",
    backTitle: "Name Credit",
    backSubtitle: "Your name on the big screen",
    backDescription: "Get officially credited in the movie your support gets permanent recognition alongside the creators."
  },
  {
    image: images.perk2,
    title: "Investment Growth",
    description: "Watch your investments grow alongside creative success",
    backTitle: "Community Casting",
    backSubtitle: "Help decide who gets the spotlight",
    backDescription: "Vote on cast members, suggest talent, and influence who lands key roles in select indie or experimental projects."
  },
  {
    image: images.perk3,
    title: "Community Building",
    description: "Join exclusive circles of passionate investors and creators",
    backTitle: "Movie Item",
    backSubtitle: "Own a piece of the story",
    backDescription: "Receive exclusive props, costumes, or memorabilia used on set — something no fan can buy off a shelf."
  },
  {
    image: images.perk4,
    title: "Exclusive Access",
    description: "Get behind-the-scenes access to your favorite projects",
    backTitle: "Premiere Access",
    backSubtitle: "Be the first to watch it",
    backDescription: "Get early invites to virtual or real-world premieres and private screenings before the world sees it."
  },
  {
    image: images.perk5,
    title: "Revenue Sharing",
    description: "Earn returns while supporting the arts you love",
    backTitle: "Trip with Movie Stars",
    backSubtitle: "Hang out where the magic happens",
    backDescription: "Win or unlock experiences to travel with the crew or spend a day on set with the stars."
  },
  {
    image: images.perk6,
    title: "Legacy Building",
    description: "Create a lasting impact on the entertainment industry",
    backTitle: "Executive Producer",
    backSubtitle: "Shape the creative vision",
    backDescription: "Get executive producer credits and have a say in major creative decisions for select projects."
  }
];

const RewardsContent: React.FC = () => {
  const { theme } = useTheme();
  const [flippedCards, setFlippedCards] = React.useState<Set<number>>(new Set());

  // Enhanced reward tiers with character illustrations and cool designs
  const rewardTiers = [
    {
      title: "🎬 Supporter",
      subtitle: "The Enthusiast",
      minAmount: "₹10K",
      color: "from-gray-500 to-gray-600",
      gradient: "from-gray-400 via-gray-500 to-gray-600",
      icon: <Medal className="w-6 h-6" />,
      character: "🎭",
      characterBg: "from-gray-400 to-gray-500",
      perks: [
        "Digital certificate of investment",
        "Early access to trailer",
        "Exclusive project updates",
        "Digital poster collection"
      ],
      features: ["Community Access", "Project Updates", "Digital Rewards"],
      status: "Available Now"
    },
    {
      title: "🌟 Backer",
      subtitle: "The Believer",
      minAmount: "₹25K",
      color: "from-blue-500 to-cyan-500",
      gradient: "from-blue-400 via-cyan-500 to-blue-600",
      icon: <Box className="w-6 h-6" />,
      character: "⭐",
      characterBg: "from-blue-400 to-cyan-500",
      perks: [
        "All Supporter benefits",
        "Behind-the-scenes content",
        "Exclusive merchandise",
        "Community access",
        "Early screening invites"
      ],
      features: ["Behind-the-scenes", "Merchandise", "Screening Access"],
      popular: true,
      status: "Most Popular"
    },
    {
      title: "💎 Producer",
      subtitle: "The Creator",
      minAmount: "₹50K",
      color: "from-purple-500 to-pink-500",
      gradient: "from-purple-400 via-pink-500 to-purple-600",
      icon: <Gem className="w-6 h-6" />,
      character: "🎬",
      characterBg: "from-purple-400 to-pink-500",
      perks: [
        "All Backer benefits",
        "Producer credit in film",
        "VIP premiere access",
        "Meet & greet opportunities",
        "Limited edition collectibles"
      ],
      features: ["Producer Credit", "VIP Access", "Meet & Greet"],
      status: "Limited Spots"
    },
    {
      title: "👑 Executive",
      subtitle: "The Visionary",
      minAmount: "₹1L",
      color: "from-orange-500 to-red-500",
      gradient: "from-orange-400 via-red-500 to-orange-600",
      icon: <Crown className="w-6 h-6" />,
      character: "👑",
      characterBg: "from-orange-400 to-red-500",
      perks: [
        "All Producer benefits",
        "Executive producer credit",
        "Set visit opportunities",
        "Exclusive investor events",
        "Personal consultation calls"
      ],
      features: ["Executive Credit", "Set Visits", "Personal Access"],
      status: "Exclusive"
    }
  ];

  return (
    <section className={`py-20 ${theme === 'light' ? 'bg-gradient-to-br from-gray-50 to-white' : 'bg-gradient-to-br from-gray-900 to-black'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className={`text-5xl md:text-6xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            Investment Tiers &
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Unique Perks
            </span>
          </h2>
          <p className={`text-xl ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} max-w-3xl mx-auto leading-relaxed`}>
            Choose your investment level and unlock exclusive benefits that go beyond traditional returns.
            Each tier offers unique experiences and rewards that make your investment journey unforgettable.
          </p>
        </motion.div>

        {/* Enhanced Reward Tiers with Character Illustrations */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {rewardTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg border-2 border-white/20 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        {tier.status}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Enhanced Card Design */}
                <motion.div 
                  className={`relative p-6 rounded-3xl backdrop-blur-xl border transition-all duration-500 hover:scale-105 overflow-hidden ${
                    theme === 'light'
                      ? 'bg-white/60 border-white/60 shadow-xl hover:shadow-2xl'
                      : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:border-white/40 hover:shadow-2xl hover:shadow-purple-500/20'
                  }`}
                  whileHover={{ y: -10 }}
                >
                  {/* Animated Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Floating Particles Effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-4 right-4 w-2 h-2 bg-white/20 rounded-full animate-pulse" />
                    <div className="absolute top-8 right-8 w-1 h-1 bg-white/30 rounded-full animate-ping" />
                    <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-white/25 rounded-full animate-bounce" />
                  </div>

                  <div className="relative z-10">
                    {/* Character Illustration Header */}
                    <div className="text-center mb-6">
                      <motion.div
                        className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${tier.characterBg} flex items-center justify-center text-4xl shadow-lg border-2 border-white/20`}
                        whileHover={{ 
                          scale: 1.1, 
                          rotate: [0, -5, 5, 0],
                          transition: { duration: 0.3 }
                        }}
                      >
                        {tier.character}
                      </motion.div>
                      
                      {/* Status Badge */}
                      {!tier.popular && (
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          theme === 'light' 
                            ? 'bg-gray-100 text-gray-600' 
                            : 'bg-gray-800 text-gray-300'
                        }`}>
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${tier.color}`} />
                          {tier.status}
                        </div>
                      )}
                    </div>

                    {/* Title and Subtitle */}
                    <div className="text-center mb-6">
                      <h3 className={`${theme === 'light' ? 'text-gray-900' : 'text-white'} text-2xl font-bold mb-2`}>
                        {tier.title}
                      </h3>
                      <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} text-sm font-medium mb-3`}>
                        {tier.subtitle}
                      </p>
                      
                      {/* Investment Amount */}
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${tier.color} text-white font-bold text-lg shadow-lg`}>
                        <TrendingUp className="w-4 h-4" />
                        {tier.minAmount}
                      </div>
                    </div>

                    {/* Key Features */}
                    <div className="mb-6">
                      <h4 className={`text-sm font-semibold mb-3 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        Key Features
                      </h4>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {tier.features.map((feature, i) => (
                          <span
                            key={i}
                            className={`px-2 py-1 rounded-lg text-xs font-medium ${
                              theme === 'light' 
                                ? 'bg-gray-100 text-gray-600' 
                                : 'bg-gray-800 text-gray-300'
                            }`}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Perks List */}
                    <div className="mb-6">
                      <h4 className={`text-sm font-semibold mb-3 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        What You Get
                      </h4>
                      <ul className="space-y-2">
                        {tier.perks.slice(0, 3).map((perk, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${index === 0 ? 'text-gray-400' : index === 1 ? 'text-blue-400' : index === 2 ? 'text-purple-400' : 'text-orange-400'}`} />
                            <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                              {perk}
                            </span>
                          </li>
                        ))}
                        {tier.perks.length > 3 && (
                          <li className="text-center">
                            <span className={`text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                              +{tier.perks.length - 3} more perks
                            </span>
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <motion.button
                      className={`w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r ${tier.color} hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Choose {tier.title.split(' ')[1]}</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </motion.button>

                    {/* Demo Notice */}
                    <div className="text-center mt-3">
                      <span className="text-red-400 text-xs font-medium">
                        (Demo - Not Real Data)
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Unique Experiences - Keep the flipping cards you want */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className={`text-4xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-center mb-4`}>
            Unique{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Experiences
            </span>
          </h3>
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} text-center mb-12 max-w-2xl mx-auto`}>
            Go beyond traditional investing. Get access to once-in-a-lifetime experiences that money can't usually buy.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {circlesIllustrations.map((illustration, index) => (
              <SafeGlassCard
                key={index}
                illustration={illustration}
                index={index}
                theme={theme}
                flipped={flippedCards.has(index)}
                onHoverStart={() => {
                  setFlippedCards(prev => {
                    const newSet = new Set(prev);
                    newSet.add(index);
                    return newSet;
                  });
                }}
                onHoverEnd={() => {
                  setFlippedCards(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(index);
                    return newSet;
                  });
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Rewards: React.FC = () => {
  return (
    <RewardsErrorBoundary>
      <RewardsContent />
    </RewardsErrorBoundary>
  );
};

export default Rewards;