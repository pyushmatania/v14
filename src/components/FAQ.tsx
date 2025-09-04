import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Search, Filter, MessageCircle, Lightbulb, Shield, Users, Star, Zap, Globe, Target, Award } from 'lucide-react';
import React, { useState, useMemo } from 'react';

import ErrorBoundary from './ErrorBoundary';
import { useTheme } from './ThemeContext';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  tags: string[];
  priority: 'high' | 'medium' | 'low';
  views?: number;
}

const faqData: FAQItem[] = [
  {
    question: "What is EnterCircles?",
    answer: "EnterCircles is a Web3-powered media fintech platform that allows fans and retail investors to fractionally invest in movies, music, and web series. We're transforming entertainment into a new asset class where audiences can earn profits, unlock perks, and access exclusive experiences.",
    category: "Platform",
    tags: ["platform", "web3", "investment"],
    priority: "high",
    views: 1250
  },
  {
    question: "How does fractional investment work?",
    answer: "Fractional investment means you can own a small piece of entertainment projects without needing large amounts of capital. For example, you could invest $100 in a movie and own a proportional share of its profits and perks.",
    category: "Investment",
    tags: ["fractional", "capital", "ownership"],
    priority: "high",
    views: 980
  },
  {
    question: "What types of projects can I invest in?",
    answer: "You can invest in various entertainment projects including movies, web series, music albums, documentaries, and other creative content. Each project is carefully vetted and comes with detailed information about the team, budget, and expected returns.",
    category: "Projects",
    tags: ["movies", "series", "music", "documentaries"],
    priority: "high",
    views: 856
  },
  {
    question: "Is my investment safe?",
    answer: "We implement multiple security measures including blockchain technology, smart contracts, and regulatory compliance. However, like all investments, there are risks involved. We recommend diversifying your portfolio and only investing what you can afford to lose.",
    category: "Security",
    tags: ["security", "blockchain", "smart-contracts", "compliance"],
    priority: "high",
    views: 1120
  },
  {
    question: "How do I get started?",
    answer: "Getting started is easy! Simply create an account, complete KYC verification, browse available projects, and start investing with as little as $10. Our platform guides you through every step of the process.",
    category: "Getting Started",
    tags: ["onboarding", "kyc", "verification"],
    priority: "medium",
    views: 745
  },
  {
    question: "What are the fees involved?",
    answer: "We charge a small platform fee on successful investments and a percentage of profits. There are no hidden fees, and all costs are clearly displayed before you invest. We believe in complete transparency.",
    category: "Fees",
    tags: ["fees", "transparency", "costs"],
    priority: "medium",
    views: 632
  },
  {
    question: "Can I sell my investment?",
    answer: "Yes! Our platform includes a secondary market where you can trade your investment shares with other users. This provides liquidity and flexibility for your entertainment investments.",
    category: "Trading",
    tags: ["secondary-market", "liquidity", "trading"],
    priority: "medium",
    views: 589
  },
  {
    question: "What perks do I get as an investor?",
    answer: "As an investor, you get exclusive access to behind-the-scenes content, meet-and-greets with creators, premiere tickets, merchandise, and other unique experiences. The more you invest, the more perks you unlock.",
    category: "Perks",
    tags: ["perks", "exclusive", "experiences"],
    priority: "low",
    views: 478
  },
  {
    question: "How do I track my investments?",
    answer: "Our dashboard provides real-time updates on all your investments, including current value, projected returns, upcoming milestones, and perk availability. You can also set up notifications for important updates.",
    category: "Tracking",
    tags: ["dashboard", "tracking", "notifications"],
    priority: "low",
    views: 445
  },
  {
    question: "What if a project doesn't meet its goals?",
    answer: "If a project doesn't meet its funding goals, your investment is automatically refunded. If a funded project underperforms, we have contingency plans and insurance to protect investors to the maximum extent possible.",
    category: "Risk Management",
    tags: ["refunds", "insurance", "protection"],
    priority: "medium",
    views: 567
  }
];

const FAQ: React.FC = () => {
  const { theme } = useTheme();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'popularity' | 'priority'>('relevance');

  const categories = ['All', ...Array.from(new Set(faqData.map(item => item.category)))];

  const filteredAndSortedFAQs = useMemo(() => {
    let filtered = faqData;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort by selected criteria
    switch (sortBy) {
      case 'popularity':
        filtered = filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        filtered = filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      default: // relevance - keep original order
        break;
    }

    return filtered;
  }, [selectedCategory, searchQuery, sortBy]);

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return theme === 'light' ? 'text-red-600 bg-red-50' : 'text-red-400 bg-red-900/20';
      case 'medium': return theme === 'light' ? 'text-yellow-600 bg-yellow-50' : 'text-yellow-400 bg-yellow-900/20';
      case 'low': return theme === 'light' ? 'text-green-600 bg-green-50' : 'text-green-400 bg-green-900/20';
      default: return theme === 'light' ? 'text-gray-600 bg-gray-50' : 'text-gray-400 bg-gray-900/20';
    }
  };

  return (
    <ErrorBoundary>
      <section className={`relative py-12 overflow-hidden ${
        theme === 'light' 
          ? 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50' 
          : 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900'
      }`}>
        
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-10 left-10 w-40 h-40 rounded-full blur-3xl opacity-10 ${
            theme === 'light' ? 'bg-indigo-400' : 'bg-indigo-500'
          }`}></div>
          <div className={`absolute bottom-10 right-10 w-48 h-48 rounded-full blur-3xl opacity-8 ${
            theme === 'light' ? 'bg-cyan-400' : 'bg-cyan-500'
          }`}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
            
            <p className={`text-lg max-w-2xl mx-auto ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              Quick answers to common questions about our platform.
            </p>
          </motion.div>

                    {/* Simple Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? theme === 'light'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                      : theme === 'light'
                        ? 'bg-white/60 border border-indigo-200 text-indigo-700 hover:bg-indigo-50'
                        : 'bg-gray-800/60 border border-indigo-600 text-indigo-300 hover:bg-indigo-900/30'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* FAQ Items */}
          <div className="max-w-3xl mx-auto mb-8">
            {filteredAndSortedFAQs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className={`mb-4 rounded-lg border transition-all duration-300 ${
                  theme === 'light'
                    ? 'bg-white border-indigo-200 shadow-sm hover:shadow-md'
                    : 'bg-gray-800 border-indigo-700 hover:border-indigo-600'
                }`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className={`w-full p-4 text-left flex items-center justify-between transition-colors ${
                    theme === 'light' ? 'hover:bg-indigo-50' : 'hover:bg-indigo-900/20'
                  }`}
                >
                  <h3 className={`text-lg font-medium pr-4 ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {faq.question}
                    </h3>
                  <motion.div
                    animate={{ rotate: expandedItems.has(index) ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex-shrink-0 p-1 rounded ${
                      theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-900/30'
                    }`}
                  >
                    <ChevronDown className={`w-4 h-4 ${
                      theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                    }`} />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {expandedItems.has(index) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className={`px-4 pb-4 ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                      }`}>
                        <p className="leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Simple CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className={`rounded-lg p-6 ${
              theme === 'light'
                ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200'
                : 'bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/30'
            }`}>
              <h3 className={`text-xl font-bold mb-3 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Ready to Get Started?
              </h3>
              
              <p className={`text-sm mb-4 ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>
                Join EnterCircles and start investing in entertainment today.
              </p>
              
              <button className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 ${
                  theme === 'light'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg'
              }`}>
                Get Started
                <ArrowRight className="w-4 h-4" />
                </button>
            </div>
          </motion.div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default FAQ;

