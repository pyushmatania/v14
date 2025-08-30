import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Film, Music, Users, TrendingUp, ArrowRight, Sparkles, Star, Play, Heart, Share2, Camera, Ticket, Award, Gift, Video, Calendar, MapPin, Globe, Shield, Zap, AlertTriangle } from 'lucide-react';
import React, { useState } from 'react';

import { projects } from '../data/projects';
import { Project } from '../types';

import AnimatedNumber from './AnimatedNumber';
import { useTheme } from './ThemeContext';
import Typewriter from './Typewriter';


interface LiveProjectsProps {
  onViewAll?: () => void;
  onProjectSelect?: (project: Project, tab?: 'overview' | 'invest') => void; // eslint-disable-line no-unused-vars
}

const LiveProjects: React.FC<LiveProjectsProps> = ({ onViewAll, onProjectSelect }) => {
  const { theme } = useTheme();
  const [statsInView, setStatsInView] = useState<{ [key: number]: boolean }>({});
  
  // Select 6 famous projects: 3 Indian and 3 Hollywood
  const selectedProjects = [
    // Indian Classics
    projects.find(p => p.title === "Sholay")!,
    projects.find(p => p.title === "Dilwale Dulhania Le Jayenge")!,
    projects.find(p => p.title === "3 Idiots")!,
    // Hollywood Classics
    projects.find(p => p.title === "The Godfather")!,
    projects.find(p => p.title === "The Dark Knight")!,
    projects.find(p => p.title === "Inception")!
  ].filter(Boolean);

  // Function to get appropriate icon for each perk
  const getPerkIcon = (perk: string) => {
    const perkLower = perk.toLowerCase();
    if (perkLower.includes('behind') || perkLower.includes('scenes') || perkLower.includes('bts')) {
      return <Camera className="w-4 h-4" />;
    } else if (perkLower.includes('poster') || perkLower.includes('signed')) {
      return <Award className="w-4 h-4" />;
    } else if (perkLower.includes('premiere') || perkLower.includes('invite')) {
      return <Ticket className="w-4 h-4" />;
    } else if (perkLower.includes('exclusive') || perkLower.includes('access')) {
      return <Shield className="w-4 h-4" />;
    } else if (perkLower.includes('meet') || perkLower.includes('greet')) {
      return <Users className="w-4 h-4" />;
    } else if (perkLower.includes('merchandise') || perkLower.includes('gift')) {
      return <Gift className="w-4 h-4" />;
    } else if (perkLower.includes('trailer') || perkLower.includes('video')) {
      return <Video className="w-4 h-4" />;
    } else if (perkLower.includes('screening') || perkLower.includes('show')) {
      return <Calendar className="w-4 h-4" />;
    } else if (perkLower.includes('location') || perkLower.includes('set')) {
      return <MapPin className="w-4 h-4" />;
    } else if (perkLower.includes('international') || perkLower.includes('global')) {
      return <Globe className="w-4 h-4" />;
    } else {
      return <Zap className="w-4 h-4" />;
    }
  };

  const handleProjectClick = (project: Project, tab: 'overview' | 'invest' = 'overview') => {
    if (onProjectSelect) {
      onProjectSelect(project, tab);
    }
  };

  const handleInvestClick = (project: Project) => {
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
    handleProjectClick(project, 'invest');
  };

  // Set stats in view when component mounts
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setStatsInView(prev => {
        const newState = { ...prev };
        selectedProjects.forEach((_, index) => {
          newState[index] = true;
        });
        return newState;
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [selectedProjects]);

  return (
    <section className={`py-24 ${
      theme === 'light' 
        ? 'animated-gradient-light' 
        : 'bg-gradient-to-b from-black to-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-5xl md:text-6xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-8`}>
            <Typewriter
              text="Live Projects"
              className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"
            />
          </h2>
          <p className={`text-xl ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} max-w-3xl mx-auto`}>
            Back the next blockbuster today. These projects are actively raising funds from fans like you.
          </p>
          
          {/* Demo Warning Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className={`mt-6 inline-flex items-center gap-3 px-6 py-3 rounded-2xl border-2 ${
              theme === 'light'
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-red-900/20 border-red-600/30 text-red-300'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Demo Version - Not Real Data</span>
          </motion.div>
        </motion.div>

        {/* Projects Grid - 3x2 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {selectedProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group relative overflow-hidden rounded-2xl backdrop-blur-xl border transition-all duration-500 hover:scale-105 ${
                theme === 'light'
                  ? 'bg-white/40 border-white/60 shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:border-white/40 hover:shadow-2xl hover:shadow-purple-500/20'
              }`}
            >
              {/* Background Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={project.poster.replace('SX300', 'SX1080')} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Demo Badge - Top Left */}
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md bg-orange-500/90 border border-orange-400/30 text-white">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Demo</span>
                  </div>
                </div>

                {/* Type Badge - Top Right */}
                <div className="absolute top-4 right-4">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md ${
                    project.type === 'film' 
                      ? 'bg-purple-500/80 border border-purple-400/30 text-white' 
                      : 'bg-blue-500/80 border border-blue-400/30 text-white'
                  }`}>
                    {project.type === 'film' ? <Film className="w-4 h-4" /> : <Music className="w-4 h-4" />}
                    <span className="text-sm font-medium capitalize">{project.type}</span>
                  </div>
                </div>

                {/* Category Badge - Below Type Badge */}
                <div className="absolute top-16 right-4">
                  <div className="px-3 py-1 rounded-full backdrop-blur-md bg-white/20 border border-white/30 text-white">
                    <span className="text-sm font-medium">{project.category}</span>
                  </div>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="p-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/30 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/30 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title and Rating */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} group-hover:text-purple-400 transition-colors`}>
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {project.rating || project.tmdbRating || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Genre and Language */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-800 text-gray-300'
                  }`}>
                    {project.genre?.split(', ')[0] || 'Drama'}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-900 text-blue-300'
                  }`}>
                    {project.language}
                  </span>
                </div>

                {/* Funding Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {project.fundedPercentage}% Funded
                    </span>
                    <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {project.raisedAmountHuman} / {project.targetAmountHuman}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.fundedPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Perks Section */}
                {project.perks && project.perks.length > 0 && (
                  <div className="mb-4">
                    <h4 className={`text-sm font-semibold mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Investor Perks
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {project.perks.slice(0, 3).map((perk, perkIndex) => (
                        <div
                          key={perkIndex}
                          className={`flex items-center gap-2 p-2 rounded-lg ${
                            theme === 'light' 
                              ? 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200/50' 
                              : 'bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-600/30'
                          }`}
                        >
                          <div className={`p-1.5 rounded-full ${
                            theme === 'light' 
                              ? 'bg-gradient-to-r from-purple-100 to-blue-100' 
                              : 'bg-gradient-to-r from-purple-800/50 to-blue-800/50'
                          }`}>
                            {getPerkIcon(perk)}
                          </div>
                          <span className={`text-xs font-medium ${
                            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                          }`}>
                            {perk}
                          </span>
                        </div>
                      ))}
                      {project.perks.length > 3 && (
                        <div className={`text-center p-2 rounded-lg ${
                          theme === 'light' 
                            ? 'bg-gray-100 text-gray-600' 
                            : 'bg-gray-800 text-gray-400'
                        }`}>
                          <span className="text-xs font-medium">+{project.perks.length - 3} more perks</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      <AnimatedNumber 
                        value={project.runtime || 120} 
                        format={(val: number) => `${val} min`}
                        inView={statsInView[index] || false}
                      />
                    </div>
                    <div className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Runtime</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      <AnimatedNumber 
                        value={project.releaseYear || 2024} 
                        inView={statsInView[index] || false}
                      />
                    </div>
                    <div className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Year</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      <AnimatedNumber 
                        value={project.rating || project.tmdbRating || 8} 
                        format={(val: number) => `${val}/10`}
                        inView={statsInView[index] || false}
                      />
                    </div>
                    <div className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Rating</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleProjectClick(project, 'overview')}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                      theme === 'light'
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleInvestClick(project)}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Invest
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button
            onClick={onViewAll}
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
              theme === 'light'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            View All Projects
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveProjects;