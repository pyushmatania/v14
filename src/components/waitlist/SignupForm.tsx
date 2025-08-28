import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { handleWaitlistSignup } from '../../api/waitlistSupabase';
import PremiumInput from './PremiumInput';
import { collectDeviceInfo, getIPInfo } from '../../utils/deviceDetection';

interface SignupFormData {
  name: string;
  email: string;
  phoneNumber?: string;
  consent: boolean;
  marketingConsent: boolean;
}

interface SignupFormProps {
  onSuccess?: (data: SignupFormData) => void;
  onError?: (error: string) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    phoneNumber: '',
    consent: false,
    marketingConsent: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: keyof SignupFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    
    // Basic validation
    if (!formData.name.trim()) {
      alert('Please enter your name');
      return;
    }
    
        if (!formData.email.trim() || !formData.email.includes('@')) {
      alert('Please enter a valid email');
      return;
    }
    
    if (!formData.consent) {
      alert('Please agree to the terms');
      return;
    }

    setIsSubmitting(true);

    try {
      // Collect comprehensive device and location information
      const [deviceInfo, ipInfo] = await Promise.all([
        collectDeviceInfo(),
        getIPInfo()
      ]);

      await handleWaitlistSignup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber?.trim(),
        consent: formData.consent,
        marketingConsent: formData.marketingConsent,
        source: 'direct',
        deviceInfo,
        ipInfo
      });

      setIsSubmitted(true);
      
      // Trigger confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (error) {
        console.warn('Confetti failed:', error);
      }
      
      onSuccess?.(formData);
      
    } catch (error) {
      console.error('Form submission error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'An error occurred'}`);
      onError?.(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-lg mx-auto p-8 bg-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="text-green-400 text-8xl mb-6"
        >
          ✓
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-4">
          Welcome to the Future! 🚀
        </h3>
        <p className="text-gray-300 mb-6 text-lg">
          You're now on the exclusive waitlist for curated entertainment investments.
        </p>
        <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-400/30">
          <p className="text-base text-green-300">
            <Crown className="w-5 h-5 inline mr-2" />
            You'll receive early access to curated projects, exclusive perks, and VIP experiences.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-8 bg-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-8 text-center bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
        Join the Waitlist
      </h2>
      

      
      <form onSubmit={handleSubmit} className="space-y-6">
        <PremiumInput
          type="text"
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(value) => handleInputChange('name', value)}
          required={true}
          validation={{
            validate: (value) => value.trim().length >= 2,
            message: 'Name must be at least 2 characters'
          }}
        />

        <PremiumInput
          type="email"
          label="Email Address"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={(value) => handleInputChange('email', value)}
          required={true}
          validation={{
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
          }}
        />

        <PremiumInput
          type="tel"
          label="Phone Number (Optional)"
          placeholder="Enter your phone number"
          value={formData.phoneNumber || ''}
          onChange={(value) => handleInputChange('phoneNumber', value)}
          required={false}
          showCountryCode={true}
          validation={{
            validate: (value) => !value || /^[0-9+\-\s()]{10,}$/.test(value),
            message: 'Please enter a valid phone number'
          }}
        />

        <div className="flex items-start space-x-3 p-4 bg-gray-900/30 backdrop-blur-sm border border-gray-700 rounded-xl">
          <input
            type="checkbox"
            id="consent"
            checked={formData.consent}
            onChange={(e) => handleInputChange('consent', e.target.checked)}
            className="mt-1 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
            required
          />
          <label htmlFor="consent" className="text-sm text-gray-300 leading-relaxed">
            I agree to receive updates about exclusive entertainment investment opportunities and understand that my data will be used in accordance with our privacy policy.
          </label>
        </div>

        <div className="flex items-start space-x-3 p-4 bg-gray-900/30 backdrop-blur-sm border border-gray-700 rounded-xl">
          <input
            type="checkbox"
            id="marketingConsent"
            checked={formData.marketingConsent}
            onChange={(e) => handleInputChange('marketingConsent', e.target.checked)}
            className="mt-1 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
          />
          <label htmlFor="marketingConsent" className="text-sm text-gray-300 leading-relaxed">
            I would like to receive marketing communications about special offers and promotions. (Optional)
          </label>
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              <span className="text-lg">Joining Waitlist...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Crown className="w-6 h-6 mr-3" />
              <span className="text-lg">Join Waitlist</span>
            </div>
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default SignupForm; 