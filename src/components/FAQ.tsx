import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Zap, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';

import ErrorBoundary from './ErrorBoundary';
import { useTheme } from './ThemeContext';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is EnterCircles?",
    answer: "EnterCircles is a Web3-powered media fintech platform that allows fans and retail investors to fractionally invest in movies, music, and web series. We're transforming entertainment into a new asset class where audiences can earn profits, unlock perks, and access exclusive experiences.",
    category: "Platform"
  },
  {
    question: "How does fractional investment work?",
    answer: "Fractional investment means you can own a small piece of entertainment projects without needing large amounts of capital. For example, you could invest $100 in a movie and own a proportional share of its profits and perks.",
    category: "Investment"
  },
  {
    question: "What types of projects can I invest in?",
    answer: "You can invest in various entertainment projects including movies, web series, music albums, documentaries, and other creative content. Each project is carefully vetted and comes with detailed information about the team, budget, and expected returns.",
    category: "Projects"
  },
  {
    question: "Is my investment safe?",
    answer: "We implement multiple security measures including blockchain technology, smart contracts, and regulatory compliance. However, like all investments, there are risks involved. We recommend diversifying your portfolio and only investing what you can afford to lose.",
    category: "Security"
  },
  {
    question: "How do I get started?",
    answer: "Getting started is easy! Simply create an account, complete KYC verification, browse available projects, and start investing with as little as $10. Our platform guides you through every step of the process.",
    category: "Getting Started"
  },
  {
    question: "What are the fees involved?",
    answer: "We charge a small platform fee on successful investments and a percentage of profits. There are no hidden fees, and all costs are clearly displayed before you invest. We believe in complete transparency.",
    category: "Fees"
  },
  {
    question: "Can I sell my investment?",
    answer: "Yes! Our platform includes a secondary market where you can trade your investment shares with other users. This provides liquidity and flexibility for your entertainment investments.",
    category: "Trading"
  },
  {
    question: "What perks do I get as an investor?",
    answer: "As an investor, you get exclusive access to behind-the-scenes content, meet-and-greets with creators, premiere tickets, merchandise, and other unique experiences. The more you invest, the more perks you unlock.",
    category: "Perks"
  },
  {
    question: "How do I track my investments?",
    answer: "Our dashboard provides real-time updates on all your investments, including current value, projected returns, upcoming milestones, and perk availability. You can also set up notifications for important updates.",
    category: "Tracking"
  },
  {
    question: "What if a project doesn't meet its goals?",
    answer: "If a project doesn't meet its funding goals, your investment is automatically refunded. If a funded project underperforms, we have contingency plans and insurance to protect investors to the maximum extent possible.",
    category: "Risk Management"
  }
];

const FAQ: React.FC = () => {
  const { theme } = useTheme();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(faqData.map(item => item.category)))];

  const filteredFAQs = selectedCategory === 'All' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <ErrorBoundary>
      <section className={`relative py-24 overflow-hidden ${
        theme === 'light' 
          ? 'bg-gradient-to-b from-gray-50 via-white to-gray-100' 
          : 'bg-gradient-to-b from-gray-900 via-black to-gray-900'
      }`}>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-medium mb-6 ${
              theme === 'light'
                ? 'bg-white/60 border-blue-300/60 text-blue-700'
                : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-300'
            }`}>
              <HelpCircle className="w-5 h-5" />
              Frequently Asked Questions
            </div>
            
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Everything You Need to Know
            </h2>
            
            <p className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              Get answers to the most common questions about investing in entertainment projects, 
              understanding our platform, and maximizing your returns.
            </p>
          </motion.div>

          {/* FAQ Categories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? theme === 'light'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-blue-500 text-white shadow-lg'
                      : theme === 'light'
                        ? 'bg-white/60 border border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-200'
                        : 'bg-gray-800/60 border border-gray-600 text-gray-300 hover:bg-blue-900/30 hover:border-blue-500'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* FAQ Items */}
          <div className="max-w-4xl mx-auto mb-20">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`mb-4 rounded-2xl border transition-all duration-300 ${
                  theme === 'light'
                    ? 'bg-white/60 border-gray-200/60 shadow-lg hover:shadow-xl'
                    : 'bg-gray-900/60 border-gray-700/60 hover:border-blue-500/30'
                }`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className={`w-full p-6 text-left flex items-center justify-between transition-colors ${
                    theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-2 ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {faq.question}
                    </h3>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                      theme === 'light'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-blue-900/40 text-blue-300'
                    }`}>
                      {faq.category}
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedItems.has(index) ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`ml-4 p-2 rounded-lg ${
                      theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'
                    }`}
                  >
                    <ChevronDown className={`w-5 h-5 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-300'
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
                      <div className={`px-6 pb-6 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        <p className="leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className={`rounded-3xl p-12 backdrop-blur-xl border ${
              theme === 'light'
                ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200/60 shadow-2xl'
                : 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30'
            }`}>
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-semibold mb-6 ${
                theme === 'light'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-blue-900/40 text-blue-300 border border-blue-500/30'
              }`}>
                <Zap className="w-5 h-5" />
                Ready to Start Investing?
              </div>
              
              <h3 className={`text-3xl md:text-4xl font-bold mb-6 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Join the Future of Entertainment Investment
              </h3>
              
              <p className={`text-lg max-w-2xl mx-auto mb-8 ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>
                Don't just watch entertainment—own it, profit from it, and unlock exclusive experiences. 
                Start your investment journey today with EnterCircles.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className={`inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 ${
                  theme === 'light'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg'
                }`}>
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <button className={`inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold border transition-all duration-300 hover:scale-105 ${
                  theme === 'light'
                    ? 'bg-white/60 border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'bg-gray-800/60 border-gray-600 text-gray-300 hover:bg-gray-700/60'
                }`}>
                  Learn More
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default FAQ;
