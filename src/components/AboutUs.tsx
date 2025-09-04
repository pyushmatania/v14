import { motion } from 'framer-motion';
import { 
  Linkedin, 
  Mail, 
  Phone, 
  Send, 
  MapPin, 
  Globe,
  Users,
  Check,
  Instagram,
  Youtube,
  Twitter,
  Building2,
  Crown,
  Trophy,
  Star,
  Target,
  Award,
  ArrowRight
} from 'lucide-react';
import React, { useState } from 'react';

import AKASH_PHOTO from '../images/akash-matania.JPG';
import GARIMA_PHOTO from '../images/garima.jpg';
import GAURAV_PHOTO from '../images/gaurav.jpg';
import STARTUP_INDIA from '../images/India.png';
import KAMLESH_PHOTO from '../images/kamlesh_nagware.jpg';
import STARTUP_ODISHA from '../images/startup odisha.png';

import ErrorBoundary from './ErrorBoundary';
import FastOptimizedImage from './FastOptimizedImage';
import { useTheme } from './ThemeContext';
import FastLoadingSpinner from './FastLoadingSpinner';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  linkedin: string;
  phone: string;
  email: string;
  image?: string;
  expertise: string[];
  achievements: string[];
}

const teamMembers: TeamMember[] = [
  {
    name: "AKASH MATANIA",
    role: "Founder and CEO",
    description: "Visionary leader driving the future of entertainment investment through innovative blockchain technology and strategic partnerships.",
    linkedin: "https://www.linkedin.com/in/akash-matania-ba5b77276/",
    phone: "+91-8594935255",
    email: "pyushmatania@gmail.com",
    image: AKASH_PHOTO,
    expertise: ["Blockchain", "Fintech", "Strategy"],
    achievements: ["10+ Years Experience", "Serial Entrepreneur", "Industry Leader"]
  },
  {
    name: "GAURAV JAIN",
    role: "Founder and CMO",
    description: "Marketing strategist and growth expert, building global brand presence and expanding our community reach worldwide.",
    linkedin: "https://www.linkedin.com/in/gaurav-jain-9168a3372/",
    phone: "+91-8122024207",
    email: "gauravjainvinod@gmail.com",
    image: GAURAV_PHOTO,
    expertise: ["Marketing", "Growth", "Branding"],
    achievements: ["Global Expansion", "Community Building", "Brand Strategy"]
  },
  {
    name: "KAMLESH NAGWARE",
    role: "Advisor",
    description: "TEDx Speaker & Blockchain Architect | Strategic Advisor/Mentor to Startups & Enterprises adopting emerging technologies.",
    linkedin: "https://www.linkedin.com/in/kamlesh-nagware-1456094b/",
    phone: "",
    email: "",
    image: KAMLESH_PHOTO,
    expertise: ["Blockchain", "Architecture", "Advisory"],
    achievements: ["TEDx Speaker", "Blockchain Expert", "Startup Mentor"]
  },
  {
    name: "GARIMA SINGH",
    role: "Advisor",
    description: "Techpreneur | Layer 1 Blockchain Researcher | Investor | Enterprise Blockchain Architect | Startup Enabler",
    linkedin: "https://www.linkedin.com/in/garima-singh-03907229/",
    phone: "",
    email: "",
    image: GARIMA_PHOTO,
    expertise: ["Research", "Investment", "Architecture"],
    achievements: ["Layer 1 Expert", "Techpreneur", "Investor"]
  }
];

const AboutUs: React.FC = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phoneNumber: '',
    consent: false,
    marketingConsent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔄 Form submission started...');
    console.log('📝 Form data:', formData);
    setIsSubmitting(true);
    
    try {
      console.log('📦 Importing ContactMessageService...');
      // Import the service dynamically to avoid SSR issues
      const { ContactMessageService } = await import('../services/contactMessageService');
      console.log('✅ ContactMessageService imported successfully');
      
      console.log('🚀 Calling submitMessage with comprehensive data collection...');
      const result = await ContactMessageService.submitMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        phoneNumber: formData.phoneNumber,
        consent: formData.consent,
        marketingConsent: formData.marketingConsent
      });
      console.log('📤 Submit result:', result);

      if (result.success) {
        console.log('✅ Message submitted successfully with comprehensive data!');
        setSubmitSuccess(true);
        setFormData({ 
          name: '', 
          email: '', 
          subject: '', 
          message: '', 
          phoneNumber: '', 
          consent: false, 
          marketingConsent: false 
        });
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        console.error('❌ Error submitting message:', result.error);
        alert(`Failed to submit message: ${result.error}`);
      }
    } catch (error) {
      console.error('💥 Unexpected error in form submission:', error);
      alert(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
      console.log('🏁 Form submission finished');
    }
  };

  return (
    <ErrorBoundary>
      <section className={`relative py-24 overflow-hidden ${
        theme === 'light' 
          ? 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50' 
          : 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900'
      }`}>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          theme === 'light' ? 'bg-indigo-400' : 'bg-indigo-500'
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-15 ${
          theme === 'light' ? 'bg-cyan-400' : 'bg-cyan-500'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-10 ${
          theme === 'light' ? 'bg-purple-400' : 'bg-purple-500'
        }`}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* About Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 font-semibold mb-8 ${
            theme === 'light'
              ? 'bg-white/80 border-indigo-200 text-indigo-700 shadow-lg backdrop-blur-sm'
              : 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-400/30 text-indigo-300 backdrop-blur-sm'
          }`}>
            <Crown className="w-5 h-5" />
            Meet Our Team
          </div>
          
          <h2 className={`text-5xl sm:text-6xl md:text-7xl font-bold mb-8 leading-tight ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Building the Future
            </span>
            <br />
            <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
              of Entertainment Investment
            </span>
          </h2>
          
          <p className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed mb-12 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            We're a team of visionaries, technologists, and industry experts passionate about democratizing 
            entertainment investment and empowering creators worldwide.
          </p>
          
          {/* Company Description */}
                    <div className={`max-w-5xl mx-auto p-12 rounded-3xl backdrop-blur-xl border-2 ${
            theme === 'light'
              ? 'bg-white/70 border-indigo-200/60 shadow-2xl'
              : 'bg-gray-900/70 border-indigo-500/30'
          }`}>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                theme === 'light' ? 'bg-gradient-to-br from-indigo-100 to-purple-100' : 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30'
              }`}>
                <Building2 className={`w-8 h-8 ${
                  theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                }`} />
              </div>
              <h3 className={`text-3xl md:text-4xl font-bold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              About EnterCircles
            </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <p className={`text-lg leading-relaxed mb-6 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              <strong>EnterCircles</strong> is a Web3-powered media fintech platform that lets fans and retail investors <strong>fractionally invest in movies, music, and web series</strong>. We're transforming entertainment into a <strong>new asset class</strong> — where audiences not only watch but also <strong>earn profits, unlock perks, and access exclusive experiences</strong>.
            </p>
            <p className={`text-lg leading-relaxed ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
                  From indie filmmakers to big studios, EnterCircles helps creators raise capital while giving fans ownership, voice, and upside in the stories they love.
                </p>
              </div>
              <div className={`p-8 rounded-2xl ${
                theme === 'light' ? 'bg-gradient-to-br from-indigo-50 to-purple-50' : 'bg-gradient-to-br from-indigo-900/20 to-purple-900/20'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <Target className={`w-6 h-6 ${
                    theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                  }`} />
                  <h4 className={`text-xl font-semibold ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    Our Mission
                  </h4>
                </div>
                <p className={`${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Democratizing entertainment investment through blockchain technology, making it accessible to everyone while empowering creators and fans alike.
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <a 
                href="https://www.EnterCircles.io" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                  theme === 'light'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg'
                }`}
              >
                Visit EnterCircles.io
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group relative rounded-3xl p-8 backdrop-blur-xl border-2 transition-all duration-500 hover:scale-105 ${
                theme === 'light'
                  ? 'bg-white/80 border-indigo-200/60 shadow-xl hover:shadow-2xl'
                  : 'bg-gray-900/80 border-indigo-500/30 hover:border-indigo-400/50'
              }`}
            >
              {/* Member Photo */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden">
                {member.image ? (
                  <FastOptimizedImage 
                    src={member.image} 
                    alt={member.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-3xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                  </div>
                </div>
                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                  theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-900/30'
                }`}>
                  <Star className={`w-4 h-4 ${
                    theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                  }`} />
                </div>
              </div>
              
              <h3 className={`text-2xl font-bold mb-3 text-center ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {member.name}
              </h3>
              
              <p className={`text-lg font-semibold text-center mb-4 ${
                theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
              }`}>
                {member.role}
              </p>
              
              <p className={`text-sm text-center mb-6 leading-relaxed ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>
                {member.description}
              </p>

              {/* Expertise Tags */}
              <div className="mb-6">
                <h4 className={`text-sm font-semibold mb-3 text-center ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                }`}>
                  Expertise
                </h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {member.expertise.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        theme === 'light'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-indigo-900/40 text-indigo-300'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="mb-6">
                <h4 className={`text-sm font-semibold mb-3 text-center ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                }`}>
                  Achievements
                </h4>
                <div className="space-y-2">
                  {member.achievements.map((achievement, achievementIndex) => (
                    <div
                      key={achievementIndex}
                      className={`flex items-center gap-2 text-xs ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                      }`}
                    >
                      <Trophy className={`w-3 h-3 ${
                        theme === 'light' ? 'text-yellow-500' : 'text-yellow-400'
                      }`} />
                      {achievement}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Contact Links */}
              <div className="flex justify-center gap-3">
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                      theme === 'light'
                        ? 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600'
                        : 'bg-gray-800 text-gray-300 hover:bg-indigo-800 hover:text-indigo-300'
                    }`}
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                      theme === 'light'
                        ? 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600'
                        : 'bg-gray-800 text-gray-300 hover:bg-indigo-800 hover:text-indigo-300'
                    }`}
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                )}
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                      theme === 'light'
                        ? 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600'
                        : 'bg-gray-800 text-gray-300 hover:bg-indigo-800 hover:text-indigo-300'
                    }`}
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recognition Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 font-semibold mb-8 ${
              theme === 'light'
                ? 'bg-white/80 border-indigo-200 text-indigo-700 shadow-lg backdrop-blur-sm'
                : 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-400/30 text-indigo-300 backdrop-blur-sm'
            }`}>
              <Trophy className="w-5 h-5" />
              Recognition & Awards
            </div>
            
            <h3 className={`text-4xl md:text-5xl font-bold mb-8 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Government Recognized
              </span>
              <br />
              <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
                Startup
              </span>
            </h3>
            
            <p className={`text-xl max-w-4xl mx-auto leading-relaxed ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              Proudly recognized by government initiatives, validating our mission to build a world-class 
              entertainment funding marketplace from India to the world.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Startup India */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className={`group relative overflow-hidden rounded-3xl p-10 backdrop-blur-xl border-2 transition-all duration-500 hover:scale-105 ${
                theme === 'light'
                  ? 'bg-gradient-to-br from-white/80 to-indigo-50/60 border-indigo-200/60 shadow-2xl hover:shadow-indigo-200/40'
                  : 'bg-gradient-to-br from-gray-900/80 to-indigo-900/20 border-indigo-500/30 hover:border-indigo-400/50'
              }`}
            >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
              <div className="relative z-10 text-center mb-8">
                <div className="flex items-center justify-center mb-6">
                  <FastOptimizedImage 
                    src={STARTUP_INDIA} 
                    alt="Startup India" 
                    className="w-48 h-48 object-contain filter drop-shadow-lg transition-all duration-500 group-hover:scale-110"
                  />
              </div>
              
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
                  theme === 'light'
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    : 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/30'
                }`}>
                  <Award className="w-4 h-4" />
                  Official Recognition
                </div>
                
                <h4 className={`text-3xl font-bold mb-4 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Startup India
                </h4>
                
                <p className={`text-lg font-medium mb-6 ${
                  theme === 'light' ? 'text-indigo-600' : 'text-indigo-300'
                }`}>
                  DPIIT, Government of India
                </p>
                
                <p className={`text-base leading-relaxed ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Listed on the Startup India platform, recognized for our innovative approach to 
                  entertainment investment and blockchain technology integration.
                </p>
              </div>
            </motion.div>

            {/* Startup Odisha */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className={`group relative overflow-hidden rounded-3xl p-10 backdrop-blur-xl border-2 transition-all duration-500 hover:scale-105 ${
                theme === 'light'
                  ? 'bg-gradient-to-br from-white/80 to-purple-50/60 border-purple-200/60 shadow-2xl hover:shadow-purple-200/40'
                  : 'bg-gradient-to-br from-gray-900/80 to-purple-900/20 border-purple-500/30 hover:border-purple-400/50'
              }`}
            >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
              <div className="relative z-10 text-center mb-8">
                <div className="flex items-center justify-center mb-6">
                  <FastOptimizedImage 
                    src={STARTUP_ODISHA} 
                    alt="Startup Odisha" 
                    className="w-48 h-48 object-contain filter drop-shadow-lg transition-all duration-500 group-hover:scale-110"
                  />
              </div>
              
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
                  theme === 'light'
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'bg-purple-900/40 text-purple-300 border border-purple-500/30'
                }`}>
                  <Award className="w-4 h-4" />
                  State Support
                </div>
                
                <h4 className={`text-3xl font-bold mb-4 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Startup Odisha
                </h4>
                
                <p className={`text-lg font-medium mb-6 ${
                  theme === 'light' ? 'text-purple-600' : 'text-purple-300'
                }`}>
                  Government of Odisha
                </p>
                
                <p className={`text-base leading-relaxed ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  Supported under the Startup Odisha initiative, fostering innovation and 
                  entrepreneurship in the state's growing tech ecosystem.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Contact Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 font-semibold mb-8 ${
              theme === 'light'
                ? 'bg-white/80 border-indigo-200 text-indigo-700 shadow-lg backdrop-blur-sm'
                : 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-400/30 text-indigo-300 backdrop-blur-sm'
            }`}>
              <Send className="w-5 h-5" />
              Get In Touch
            </div>
            
            <h3 className={`text-4xl md:text-5xl font-bold mb-8 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Let's Build Something
              </span>
              <br />
              <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
                Amazing Together
              </span>
            </h3>
            
            <p className={`text-xl max-w-4xl mx-auto leading-relaxed ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              Have questions about our platform? Want to collaborate? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`rounded-3xl p-10 border-2 ${
                theme === 'light'
                  ? 'bg-white border-indigo-200 shadow-lg'
                  : 'bg-gray-900 border-indigo-500'
              }`}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  theme === 'light' ? 'bg-gradient-to-br from-indigo-100 to-purple-100' : 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30'
                }`}>
                  <Send className={`w-6 h-6 ${
                    theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                  }`} />
                </div>
                <h4 className={`text-2xl font-bold ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Send us a Message
                </h4>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className={`block text-sm font-semibold mb-3 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                      Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                      className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 ${
                      theme === 'light'
                          ? 'bg-gray-100 border-indigo-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:shadow-lg'
                          : 'bg-gray-800 border-indigo-600 text-white focus:border-indigo-400 focus:ring-indigo-400'
                    }`}
                      placeholder="Enter your full name"
                  />
                </div>

                <div>
                    <label htmlFor="email" className={`block text-sm font-semibold mb-3 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                      Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                      className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 ${
                      theme === 'light'
                          ? 'bg-gray-100 border-indigo-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:shadow-lg'
                          : 'bg-gray-800 border-indigo-600 text-white focus:border-indigo-400 focus:ring-indigo-400'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  </div>
                </div>

                <div>
                  <label htmlFor="phoneNumber" className={`block text-sm font-semibold mb-3 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 ${
                      theme === 'light'
                        ? 'bg-white/80 border-emerald-200 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 focus:bg-white focus:shadow-lg'
                        : 'bg-gray-800/80 border-emerald-600 text-white focus:border-emerald-400 focus:ring-emerald-400 focus:bg-gray-800'
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className={`block text-sm font-semibold mb-3 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 ${
                      theme === 'light'
                        ? 'bg-white/80 border-emerald-200 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 focus:bg-white focus:shadow-lg'
                        : 'bg-gray-800/80 border-emerald-600 text-white focus:border-emerald-400 focus:ring-emerald-400 focus:bg-gray-800'
                    }`}
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className={`block text-sm font-semibold mb-3 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 resize-none ${
                      theme === 'light'
                        ? 'bg-white/80 border-emerald-200 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 focus:bg-white focus:shadow-lg'
                        : 'bg-gray-800/80 border-emerald-600 text-white focus:border-emerald-400 focus:ring-emerald-400 focus:bg-gray-800'
                    }`}
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                {/* Consent Checkboxes */}
                <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-r from-gray-800 to-gray-700 border-2 border-gray-600">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      checked={formData.consent || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                      className="mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="consent" className={`text-sm leading-relaxed ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                    }`}>
                      I consent to being contacted regarding my inquiry
                    </label>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      id="marketingConsent"
                      name="marketingConsent"
                      checked={formData.marketingConsent || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, marketingConsent: e.target.checked }))}
                      className="mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="marketingConsent" className={`text-sm leading-relaxed ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                    }`}>
                      I would like to receive updates about EnterCircles and entertainment investment opportunities
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-5 px-8 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    isSubmitting
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:scale-105 hover:shadow-xl'
                  } ${
                    theme === 'light'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-3">
                      <FastLoadingSpinner 
                        size="sm" 
                        text="Sending..."
                      />
                      <span>Sending Message...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <Send className="w-5 h-5" />
                      Send Message
                    </div>
                  )}
                </button>

                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium ${
                      theme === 'light' 
                        ? 'bg-green-50 text-green-700 border-2 border-green-200' 
                        : 'bg-green-900/20 text-green-300 border-2 border-green-500/30'
                    }`}
                  >
                    <Check className="w-5 h-5" />
                    Message sent successfully! We'll get back to you soon.
                  </motion.div>
                )}
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className={`rounded-3xl p-10 border-2 ${
                theme === 'light'
                  ? 'bg-white border-indigo-200 shadow-lg'
                  : 'bg-gray-900 border-indigo-500'
              }`}>
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    theme === 'light' ? 'bg-gradient-to-br from-indigo-100 to-purple-100' : 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30'
                  }`}>
                    <Users className={`w-6 h-6 ${
                      theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                    }`} />
                  </div>
                  <h4 className={`text-2xl font-bold ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Contact Information
                </h4>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-r from-gray-800 to-gray-700 border-2 border-gray-600">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-900/30'
                    }`}>
                      <Mail className={`w-6 h-6 ${
                        theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                      }`} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold mb-2 ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        Email Addresses
                      </p>
                      <p className={`text-sm mb-1 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                      }`}>
                        entercircles@gmail.com
                      </p>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                      }`}>
                        admin@entercircles.io
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-r from-gray-800 to-gray-700 border-2 border-gray-600">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      theme === 'light' ? 'bg-purple-100' : 'bg-purple-900/30'
                    }`}>
                      <Phone className={`w-6 h-6 ${
                        theme === 'light' ? 'text-purple-600' : 'text-purple-400'
                      }`} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold mb-2 ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        Phone Number
                      </p>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                      }`}>
                        +91-8594935255
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-r from-gray-800 to-gray-700 border-2 border-gray-600">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      theme === 'light' ? 'bg-cyan-100' : 'bg-cyan-900/30'
                    }`}>
                      <MapPin className={`w-6 h-6 ${
                        theme === 'light' ? 'text-cyan-600' : 'text-cyan-400'
                      }`} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold mb-2 ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        Office Location
                      </p>
                      <p className={`text-sm mb-1 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                      }`}>
                        ENTERCIRCLES LABS PRIVATE LIMITED
                      </p>
                      <p className={`text-sm mb-1 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                      }`}>
                        B-803, B-903, Pride, Springfields
                      </p>
                      <p className={`text-sm mb-1 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                      }`}>
                        Gubbalala, Chikkalasandra
                      </p>
                      <p className={`text-sm mb-1 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                      }`}>
                        Bangalore South, Bangalore-560061
                      </p>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                      }`}>
                        Karnataka, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-r from-gray-800 to-gray-700 border-2 border-gray-600">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      theme === 'light' ? 'bg-purple-100' : 'bg-purple-900/30'
                    }`}>
                      <Globe className={`w-6 h-6 ${
                        theme === 'light' ? 'text-purple-600' : 'text-purple-400'
                      }`} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold mb-2 ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        Website
                      </p>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                      }`}>
                        entercircles.io
                      </p>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-gray-800 to-gray-700 border-2 border-gray-600">
                    <p className={`text-sm font-semibold mb-4 ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      Follow Us on Social Media
                    </p>
                    <div className="flex items-center gap-4">
                      {/* LinkedIn */}
                      <a
                        href="https://www.linkedin.com/company/107834910/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                          theme === 'light' 
                            ? 'bg-blue-100 hover:bg-blue-200 text-blue-600 shadow-lg' 
                            : 'bg-blue-900/30 hover:bg-blue-800/50 text-blue-400'
                        }`}
                        aria-label="Follow Enter Circles on LinkedIn"
                      >
                        <Linkedin className="w-6 h-6" />
                      </a>

                      {/* Instagram */}
                      <a
                        href="https://www.instagram.com/entercircles/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                          theme === 'light' 
                            ? 'bg-pink-100 hover:bg-pink-200 text-pink-600 shadow-lg' 
                            : 'bg-pink-900/30 hover:bg-pink-800/50 text-pink-400'
                        }`}
                        aria-label="Follow Enter Circles on Instagram"
                      >
                        <Instagram className="w-6 h-6" />
                      </a>

                      {/* YouTube */}
                      <a
                        href="https://www.youtube.com/@EnterCircles"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                          theme === 'light' 
                            ? 'bg-red-100 hover:bg-red-200 text-red-600 shadow-lg' 
                            : 'bg-red-900/30 hover:bg-red-800/50 text-red-400'
                        }`}
                        aria-label="Subscribe to Enter Circles on YouTube"
                      >
                        <Youtube className="w-6 h-6" />
                      </a>

                      {/* X (Twitter) */}
                      <a
                        href="https://x.com/entercircles"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                          theme === 'light' 
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 shadow-lg' 
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        }`}
                        aria-label="Follow Enter Circles on X (Twitter)"
                      >
                        <Twitter className="w-6 h-6" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      </section>
    </ErrorBoundary>
  );
};

export default AboutUs;
