import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import EntertainmentLoading from './EntertainmentLoading';

const LoadingDemo: React.FC = () => {
  const [currentVariant, setCurrentVariant] = useState<'default' | 'premium' | 'entertainment'>('default');
  const [currentSize, setCurrentSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [customText, setCustomText] = useState('Loading...');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          🎬 Loading Components Showcase
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Controls */}
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-pink-400">⚙️ Customization</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Variant:</label>
                <select 
                  value={currentVariant} 
                  onChange={(e) => setCurrentVariant(e.target.value as any)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="default">Default (Purple/Pink)</option>
                  <option value="premium">Premium (Gold/Orange)</option>
                  <option value="entertainment">Entertainment (Pink/Purple)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Size:</label>
                <select 
                  value={currentSize} 
                  onChange={(e) => setCurrentSize(e.target.value as any)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Custom Text:</label>
                <input 
                  type="text" 
                  value={customText} 
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  placeholder="Enter custom loading text..."
                />
              </div>
            </div>
          </div>
          
          {/* Preview */}
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">👀 Preview</h2>
            <div className="flex items-center justify-center min-h-[300px]">
              <LoadingSpinner 
                variant={currentVariant} 
                size={currentSize} 
                text={customText}
              />
            </div>
          </div>
        </div>
        
        {/* Entertainment Loading Showcase */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-400">🎭 Entertainment Loading</h2>
          <p className="text-gray-300 mb-4 text-center">
            This is the full-screen entertainment-themed loading component used in the app's Suspense fallback
          </p>
          <div className="flex items-center justify-center">
            <EntertainmentLoading size="md" text="Loading Entertainment..." />
          </div>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-3 text-pink-400">✨ Features</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• Smooth animations with Framer Motion</li>
              <li>• Multiple theme variants</li>
              <li>• Responsive sizing options</li>
              <li>• Custom loading text</li>
              <li>• Floating particles & effects</li>
            </ul>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-3 text-purple-400">🎨 Themes</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• <span className="text-pink-400">Default:</span> Purple to Pink</li>
              <li>• <span className="text-yellow-400">Premium:</span> Gold to Orange</li>
              <li>• <span className="text-purple-400">Entertainment:</span> Pink to Purple</li>
            </ul>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-3 text-cyan-400">📱 Sizes</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• <span className="text-cyan-400">Small:</span> 32x32px</li>
              <li>• <span className="text-cyan-400">Medium:</span> 48x48px</li>
              <li>• <span className="text-cyan-400">Large:</span> 64x64px</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingDemo;
