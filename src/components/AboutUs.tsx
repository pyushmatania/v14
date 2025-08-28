import { motion } from 'framer-motion';
import { 
  Linkedin, 
  Mail, 
  Phone, 
  Send, 
  MapPin, 
  Globe,
  Award,
  Users,
  Check,
  Instagram,
  Youtube,
  Twitter
} from 'lucide-react';
import React, { useState } from 'react';

import AKASH_PHOTO from '../images/akash-matania.JPG';
import GARIMA_PHOTO from '../images/garima.jpg';
import GAURAV_PHOTO from '../images/gaurav.jpg';
import STARTUP_INDIA from '../images/India.png';
import KAMLESH_PHOTO from '../images/kamlesh_nagware.jpg';
import STARTUP_ODISHA from '../images/startup odisha.png';

import ErrorBoundary from './ErrorBoundary';
import OptimizedImage from './OptimizedImage';
import { useTheme } from './ThemeContext';
import Typewriter from './Typewriter';
import LoadingSpinner from './LoadingSpinner';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  linkedin: string;
  phone: string;
  email: string;
  image?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "AKASH MATANIA",
    role: "Founder and CEO",
    description: "Visionary leader driving the future of entertainment investment through innovative blockchain technology and strategic partnerships.",
    linkedin: "https://www.linkedin.com/in/akash-matania-ba5b77276/",
    phone: "+91-8594935255",
    email: "pyushmatania@gmail.com",
    image: AKASH_PHOTO
  },
  {
    name: "GAURAV JAIN",
    role: "Founder and CMO",
    description: "Marketing strategist and growth expert, building global brand presence and expanding our community reach worldwide.",
    linkedin: "https://www.linkedin.com/in/gaurav-jain-9168a3372/",
    phone: "+91-8122024207",
    email: "gauravjainvinod@gmail.com",
    image: GAURAV_PHOTO
  },
  {
    name: "KAMLESH NAGWARE",
    role: "Advisor",
    description: "TEDx Speaker & Blockchain Architect | Strategic Advisor/Mentor to Startups & Enterprises adopting emerging technologies.",
    linkedin: "https://www.linkedin.com/in/kamlesh-nagware-1456094b/",
    phone: "",
    email: "",
    image: KAMLESH_PHOTO
  },
  {
    name: "GARIMA SINGH",
    role: "Advisor",
    description: "Techpreneur | Layer 1 Blockchain Researcher | Investor | Enterprise Blockchain Architect | Startup Enabler",
    linkedin: "https://www.linkedin.com/in/garima-singh-03907229/",
    phone: "",
    email: "",
    image: GARIMA_PHOTO
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
          ? 'bg-gradient-to-b from-gray-50 via-white to-gray-100' 
          : 'bg-gradient-to-b from-gray-900 via-black to-gray-900'
      }`}>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* About Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-medium mb-6 ${
            theme === 'light'
              ? 'bg-white/60 border-purple-300/60 text-purple-700'
              : 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 text-purple-300'
          }`}>
            <Users className="w-5 h-5" />
            About Our Team
          </div>
          
          <h2 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            <Typewriter
              text="Building the Future of Entertainment Investment"
              className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent"
            />
          </h2>
          
          <p className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            We're a team of visionaries, technologists, and industry experts passionate about democratizing 
            entertainment investment and empowering creators worldwide.
          </p>
          
          {/* Company Description */}
          <div className={`mt-12 p-8 rounded-2xl ${
            theme === 'light'
              ? 'bg-white/60 border border-purple-200/60 shadow-lg'
              : 'bg-gray-900/60 border border-purple-500/30'
          }`}>
            <h3 className={`text-2xl md:text-3xl font-bold mb-6 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              About EnterCircles
            </h3>
            <p className={`text-lg leading-relaxed mb-4 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              <strong>EnterCircles</strong> is a Web3-powered media fintech platform that lets fans and retail investors <strong>fractionally invest in movies, music, and web series</strong>. We're transforming entertainment into a <strong>new asset class</strong> — where audiences not only watch but also <strong>earn profits, unlock perks, and access exclusive experiences</strong>.
            </p>
            <p className={`text-lg leading-relaxed ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              From indie filmmakers to big studios, EnterCircles helps creators raise capital while giving fans ownership, voice, and upside in the stories they love. Visit <a href="https://www.EnterCircles.io" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 underline">www.EnterCircles.io</a> to learn more.
            </p>
          </div>
        </motion.div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group relative rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300 hover:scale-105 ${
                theme === 'light'
                  ? 'bg-white/60 border-gray-200/60 shadow-xl hover:shadow-2xl'
                  : 'bg-gray-900/60 border-gray-700/60 hover:border-purple-500/40'
              }`}
            >
              {/* Member Photo */}
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-purple-200 shadow-lg">
                {member.image ? (
                  <OptimizedImage 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
              
              <h3 className={`text-xl font-bold mb-2 text-center ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {member.name}
              </h3>
              
              <p className={`text-sm font-medium text-center mb-3 ${
                theme === 'light' ? 'text-purple-600' : 'text-purple-400'
              }`}>
                {member.role}
              </p>
              
              <p className={`text-sm text-center mb-4 leading-relaxed ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>
                {member.description}
              </p>
              
              {/* Contact Links */}
              <div className="flex justify-center gap-3">
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'light'
                        ? 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600'
                        : 'bg-gray-800 text-gray-300 hover:bg-purple-800 hover:text-purple-300'
                    }`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'light'
                        ? 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600'
                        : 'bg-gray-800 text-gray-300 hover:bg-purple-800 hover:text-purple-300'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'light'
                        ? 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600'
                        : 'bg-gray-800 text-gray-300 hover:bg-purple-800 hover:text-purple-300'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
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
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border font-medium mb-8 ${
              theme === 'light'
                ? 'bg-white/60 border-green-300/60 text-green-700'
                : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300'
            }`}>
              <Award className="w-6 h-6" />
              Recognition & Awards
            </div>
            
            <h3 className={`text-4xl md:text-5xl font-bold mb-8 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Government Recognized Startup
            </h3>
            
            <p className={`text-xl max-w-4xl mx-auto leading-relaxed ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              Proudly recognized by government initiatives, validating our mission to build a world-class 
              entertainment funding marketplace from India to the world.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Startup India */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className={`group relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl border-2 transition-all duration-500 hover:scale-105 ${
                theme === 'light'
                  ? 'bg-gradient-to-br from-white/80 to-blue-50/60 border-blue-200/60 shadow-2xl hover:shadow-blue-200/40'
                  : 'bg-gradient-to-br from-gray-900/80 to-blue-900/20 border-blue-500/30 hover:border-blue-400/50'
              }`}
            >
              <div className="relative z-10 text-center mb-6 mt-12">
                <div className="flex items-center justify-center">
                  <OptimizedImage 
                    src={STARTUP_INDIA} 
                    alt="Startup India" 
                    className="w-56 h-56 object-cover filter drop-shadow-lg transition-all duration-500 group-hover:scale-110 max-w-full max-h-full"
                  />
                </div>
              </div>
              
              <div className="relative z-10 text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
                  theme === 'light'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-blue-900/40 text-blue-300 border border-blue-500/30'
                }`}>
                  <Award className="w-4 h-4" />
                  Official Recognition
                </div>
                
                <h4 className={`text-2xl font-bold mb-3 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Startup India
                </h4>
                
                <p className={`text-sm font-medium mb-4 ${
                  theme === 'light' ? 'text-blue-600' : 'text-blue-300'
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
              className={`group relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl border-2 transition-all duration-500 hover:scale-105 ${
                theme === 'light'
                  ? 'bg-gradient-to-br from-white/80 to-green-50/60 border-green-200/60 shadow-2xl hover:shadow-green-200/40'
                  : 'bg-gradient-to-br from-gray-900/80 to-green-900/20 border-green-500/30 hover:border-green-400/50'
              }`}
            >
              <div className="relative z-10 text-center mb-6 mt-12">
                <div className="flex items-center justify-center">
                  <OptimizedImage 
                    src={STARTUP_ODISHA} 
                    alt="Startup Odisha" 
                    className="w-56 h-56 object-cover filter drop-shadow-lg transition-all duration-500 group-hover:scale-110 max-w-full max-h-full"
                  />
                </div>
              </div>
              
              <div className="relative z-10 text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
                  theme === 'light'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-green-900/40 text-green-300 border border-green-500/30'
                }`}>
                  <Award className="w-4 h-4" />
                  State Support
                </div>
                
                <h4 className={`text-2xl font-bold mb-3 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Startup Odisha
                </h4>
                
                <p className={`text-sm font-medium mb-4 ${
                  theme === 'light' ? 'text-green-600' : 'text-green-300'
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
          <div className="text-center mb-12">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-medium mb-6 ${
              theme === 'light'
                ? 'bg-white/60 border-blue-300/60 text-blue-700'
                : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-300'
            }`}>
              <Send className="w-5 h-5" />
              Get In Touch
            </div>
            
            <h3 className={`text-3xl md:text-4xl font-bold mb-6 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Let's Build Something Amazing Together
            </h3>
            
            <p className={`text-lg max-w-3xl mx-auto ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              Have questions about our platform? Want to collaborate? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`rounded-2xl p-8 backdrop-blur-xl border ${
                theme === 'light'
                  ? 'bg-white/60 border-gray-200/60 shadow-xl'
                  : 'bg-gray-900/60 border-gray-700/60'
              }`}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium mb-2 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      theme === 'light'
                        ? 'bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500'
                        : 'bg-gray-800 border-gray-600 text-white focus:border-purple-400 focus:ring-purple-400'
                    }`}
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      theme === 'light'
                        ? 'bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500'
                        : 'bg-gray-800 border-gray-600 text-white focus:border-purple-400 focus:ring-purple-400'
                    }`}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className={`block text-sm font-medium mb-2 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      theme === 'light'
                        ? 'bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500'
                        : 'bg-gray-800 border-gray-600 text-white focus:border-purple-400 focus:ring-purple-400'
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className={`block text-sm font-medium mb-2 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      theme === 'light'
                        ? 'bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500'
                        : 'bg-gray-800 border-gray-600 text-white focus:border-purple-400 focus:ring-purple-400'
                    }`}
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className={`block text-sm font-medium mb-2 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                      theme === 'light'
                        ? 'bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500'
                        : 'bg-gray-800 border-gray-600 text-white focus:border-purple-400 focus:ring-purple-400'
                    }`}
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                {/* Consent Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      checked={formData.consent || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                      className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="consent" className={`text-sm ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      I consent to being contacted regarding my inquiry
                    </label>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="marketingConsent"
                      name="marketingConsent"
                      checked={formData.marketingConsent || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, marketingConsent: e.target.checked }))}
                      className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="marketingConsent" className={`text-sm ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      I would like to receive updates about EnterCircles and entertainment investment opportunities
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                    isSubmitting
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:scale-105 hover:shadow-lg'
                  } ${
                    theme === 'light'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner 
                        variant="entertainment" 
                        size="sm" 
                        text="" 
                      />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </button>



                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 text-green-600 text-sm"
                  >
                    <Check className="w-5 h-5" />
                    Message sent successfully!
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
              <div className={`rounded-2xl p-8 backdrop-blur-xl border ${
                theme === 'light'
                  ? 'bg-white/60 border-gray-200/60 shadow-xl'
                  : 'bg-gray-900/60 border-gray-700/60'
              }`}>
                <h4 className={`text-xl font-bold mb-6 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Contact Information
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      theme === 'light' ? 'bg-purple-100' : 'bg-purple-900/30'
                    }`}>
                      <Mail className={`w-5 h-5 ${
                        theme === 'light' ? 'text-purple-600' : 'text-purple-400'
                      }`} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        Email
                      </p>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                      }`}>
                        entercircles@gmail.com
                      </p>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                      }`}>
                        admin@entercircles.io
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/30'
                    }`}>
                      <Phone className={`w-5 h-5 ${
                        theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                      }`} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        Phone
                      </p>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                      }`}>
                        +91-8594935255
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      theme === 'light' ? 'bg-green-100' : 'bg-green-900/30'
                    }`}>
                      <MapPin className={`w-5 h-5 ${
                        theme === 'light' ? 'text-green-600' : 'text-green-400'
                      }`} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        Location
                      </p>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                      }`}>
                        ENTERCIRCLES LABS PRIVATE LIMITED
                      </p>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                      }`}>
                        B-803, B-903, Pride, Springfields
                      </p>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                      }`}>
                        Gubbalala, Chikkalasandra
                      </p>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                      }`}>
                        Bangalore South, Bangalore-560061
                      </p>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                      }`}>
                        Karnataka, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      theme === 'light' ? 'bg-pink-100' : 'bg-pink-900/30'
                    }`}>
                      <Globe className={`w-5 h-5 ${
                        theme === 'light' ? 'text-pink-600' : 'text-pink-400'
                      }`} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        Website
                      </p>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                      }`}>
                        entercircles.io
                      </p>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="pt-4">
                    <p className={`text-sm font-medium mb-3 ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      Follow Us
                    </p>
                    <div className="flex items-center gap-3">
                      {/* LinkedIn */}
                      <a
                        href="https://www.linkedin.com/company/107834910/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                          theme === 'light' 
                            ? 'bg-blue-100 hover:bg-blue-200 text-blue-600' 
                            : 'bg-blue-900/30 hover:bg-blue-800/50 text-blue-400'
                        }`}
                        aria-label="Follow Enter Circles on LinkedIn"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>

                      {/* Instagram */}
                      <a
                        href="https://www.instagram.com/entercircles/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                          theme === 'light' 
                            ? 'bg-pink-100 hover:bg-pink-200 text-pink-600' 
                            : 'bg-pink-900/30 hover:bg-pink-800/50 text-pink-400'
                        }`}
                        aria-label="Follow Enter Circles on Instagram"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>

                      {/* YouTube */}
                      <a
                        href="https://www.youtube.com/@EnterCircles"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                          theme === 'light' 
                            ? 'bg-red-100 hover:bg-red-200 text-red-600' 
                            : 'bg-red-900/30 hover:bg-red-800/50 text-red-400'
                        }`}
                        aria-label="Subscribe to Enter Circles on YouTube"
                      >
                        <Youtube className="w-5 h-5" />
                      </a>

                      {/* X (Twitter) */}
                      <a
                        href="https://x.com/entercircles"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                          theme === 'light' 
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' 
                            : 'bg-gray-900/30 hover:bg-gray-800/50 text-gray-400'
                        }`}
                        aria-label="Follow Enter Circles on X (Twitter)"
                      >
                        <Twitter className="w-5 h-5" />
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
