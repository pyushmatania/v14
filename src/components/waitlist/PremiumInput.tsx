import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Phone, Mail, User } from 'lucide-react';

interface CountryCode {
  code: string;
  flag: string;
  dialCode: string;
  name: string;
}

interface PremiumInputProps {
  type: 'text' | 'email' | 'tel';
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  validation?: {
    pattern?: RegExp;
    message?: string;
    validate?: (value: string) => boolean;
  };
  showCountryCode?: boolean;
  className?: string;
}

const countryCodes: CountryCode[] = [
  { code: 'IN', flag: '🇮🇳', dialCode: '+91', name: 'India' },
  { code: 'US', flag: '🇺🇸', dialCode: '+1', name: 'United States' },
  { code: 'GB', flag: '🇬🇧', dialCode: '+44', name: 'United Kingdom' },
  { code: 'CA', flag: '🇨🇦', dialCode: '+1', name: 'Canada' },
  { code: 'AU', flag: '🇦🇺', dialCode: '+61', name: 'Australia' },
  { code: 'DE', flag: '🇩🇪', dialCode: '+49', name: 'Germany' },
  { code: 'FR', flag: '🇫🇷', dialCode: '+33', name: 'France' },
  { code: 'JP', flag: '🇯🇵', dialCode: '+81', name: 'Japan' },
  { code: 'SG', flag: '🇸🇬', dialCode: '+65', name: 'Singapore' },
  { code: 'AE', flag: '🇦🇪', dialCode: '+971', name: 'UAE' },
];

const PremiumInput: React.FC<PremiumInputProps> = ({
  type,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  validation,
  showCountryCode = false,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryCodes[0]); // India default
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Validation logic
  const validateInput = (inputValue: string): boolean => {
    if (!inputValue.trim()) {
      return !required; // Valid if not required and empty
    }

    if (validation?.pattern) {
      return validation.pattern.test(inputValue);
    }

    if (validation?.validate) {
      return validation.validate(inputValue);
    }

    // Default validations
    switch (type) {
      case 'email': {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(inputValue);
      }
      case 'tel': {
        const phonePattern = /^[0-9+\-\s()]{10,}$/;
        return phonePattern.test(inputValue);
      }
      default:
        return inputValue.length >= 2;
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (newValue.trim()) {
      const valid = validateInput(newValue);
      setIsValid(valid);
    } else {
      setIsValid(null);
    }
  };

  // Handle country selection
  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setShowCountrySelector(false);
    // Trigger onChange with the full phone number
    if (type === 'tel' && value) {
      const phoneWithoutCode = value.replace(/^\+?\d+\s*/, '');
      onChange(`${country.dialCode} ${phoneWithoutCode}`);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCountrySelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get icon based on input type
  const getIcon = () => {
    switch (type) {
      case 'email':
        return <Mail className="w-5 h-5" />;
      case 'tel':
        return <Phone className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  // Get validation message
  const getValidationMessage = () => {
    if (isValid === null) return '';
    
    if (isValid) {
      return validation?.message || 'Looks good!';
    }

    switch (type) {
      case 'email':
        return 'Please enter a valid email address';
      case 'tel':
        return 'Please enter a valid phone number';
      default:
        return validation?.message || 'Please enter a valid value';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-semibold text-white mb-3">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      <div className="relative">
        {/* Premium Input Container */}
        <motion.div
          animate={{
            borderColor: isFocused 
              ? isValid === true 
                ? '#10b981' // green
                : isValid === false 
                  ? '#ef4444' // red
                  : '#8b5cf6' // purple
              : '#374151',
            boxShadow: isFocused 
              ? `0 0 0 3px ${isValid === true ? 'rgba(16, 185, 129, 0.1)' : isValid === false ? 'rgba(239, 68, 68, 0.1)' : 'rgba(139, 92, 246, 0.1)'}`
              : 'none'
          }}
          transition={{ duration: 0.2 }}
          className={`
            relative flex items-center bg-gray-900/50 backdrop-blur-sm border-2 rounded-xl
            transition-all duration-300 hover:bg-gray-800/50
            ${isFocused ? 'ring-2 ring-opacity-20' : ''}
          `}
        >
          {/* Country Code Selector for Phone */}
          {showCountryCode && type === 'tel' && (
            <div className="relative" style={{ zIndex: 9998 }}>
              <button
                type="button"
                onClick={() => setShowCountrySelector(!showCountrySelector)}
                className="flex items-center gap-2 px-4 py-3 text-white hover:bg-gray-800/50 transition-colors rounded-l-xl border-r border-gray-600"
              >
                <span className="text-lg">{selectedCountry.flag}</span>
                <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
                <motion.div
                  animate={{ rotate: showCountrySelector ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </button>

              {/* Country Dropdown */}
              <AnimatePresence>
                {showCountrySelector && (
                  <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-1 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-[99999] max-h-60 overflow-y-auto"
                    style={{
                      position: 'absolute',
                      zIndex: 99999,
                      isolation: 'isolate'
                    }}
                  >
                    {countryCodes.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className="flex items-center gap-3 w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition-colors"
                      >
                        <span className="text-lg">{country.flag}</span>
                        <div className="flex-1">
                          <div className="font-medium">{country.name}</div>
                          <div className="text-sm text-gray-400">{country.dialCode}</div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Input Field */}
          <div className="flex-1 flex items-center">
            <div className="flex items-center justify-center w-12 h-12 text-gray-400">
              {getIcon()}
            </div>
            
            <input
              ref={inputRef}
              type={type}
              value={value}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-base"
              required={required}
            />
          </div>

          {/* Validation Icon */}
          <AnimatePresence>
            {value.trim() && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center justify-center w-12 h-12"
              >
                {isValid === true ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : isValid === false ? (
                  <XCircle className="w-5 h-5 text-red-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Validation Message */}
        <AnimatePresence>
          {value.trim() && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-2 text-sm font-medium ${
                isValid === true ? 'text-green-400' : 
                isValid === false ? 'text-red-400' : 
                'text-gray-400'
              }`}
            >
              {getValidationMessage()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PremiumInput; 