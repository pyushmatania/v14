import { Star, Film } from 'lucide-react';
import * as React from 'react';

// Import logo image


interface Illustration {
  image: string;
  imageFallback?: string;
  title: string;
  description: string;
  backTitle: string;
  backSubtitle: string;
  backDescription: string;
}

interface GlassCardProps {
  illustration: Illustration;
  index: number;
  theme: string;
  flipped: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onToggleFlip?: () => void;
}



const GlassCard: React.FC<GlassCardProps> = ({ 
  illustration, 
  theme, 
  flipped, 
  onHoverStart, 
  onHoverEnd, 
  onToggleFlip 
}) => {
  const touchTimeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const timeout = touchTimeoutRef.current;
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (onToggleFlip) {
      onToggleFlip();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onToggleFlip) {
        onToggleFlip();
      } else {
        onHoverStart();
      }
    }
  };

  return (
    <div
      className="group relative w-full h-96 sm:h-[28rem] md:h-[32rem] rounded-2xl overflow-hidden cursor-pointer"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      role="button"
      tabIndex={0}
      aria-label={illustration.title}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      onKeyDown={handleKeyDown}
    >
      {/* Card Container with 3D Transform */}
      <div
        className="relative w-full h-full transition-transform duration-700 ease-out"
        style={{
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front Side */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl"
          style={{ 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <img 
            src={illustration.image} 
            alt={illustration.title}
            className="w-full h-full object-cover rounded-2xl"
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget;
              if (target && illustration.imageFallback) {
                target.src = illustration.imageFallback;
              } else {
                target.style.display = 'none';
              }
            }}
          />
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t ${
            theme === 'light'
              ? 'from-black/60 via-transparent to-transparent'
              : 'from-black/80 via-transparent to-transparent'
          } rounded-2xl`} />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
            <h4 className="text-xl font-bold mb-2 text-white drop-shadow-lg">
              {illustration.title}
            </h4>
            <p className="text-sm text-gray-200 drop-shadow-md leading-relaxed">
              {illustration.description}
            </p>
          </div>
        </div>

        {/* Back Side */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl"
          style={{ 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="w-full h-full rounded-2xl relative overflow-hidden">
            {/* Purple Gradient Background with Transparency */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-400/40 via-purple-600/40 to-purple-900/40 backdrop-blur-sm"></div>
            
            {/* VIP Badge */}
            <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
              VIP
            </div>
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center p-6">
              {/* Film Reel Icon and Title */}
              <div className="flex items-center gap-3 mb-3">
                <Film className="w-8 h-8 text-white" />
                <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  {illustration.backTitle}
                </h3>
              </div>
              
              {/* Subtitle with underline */}
              <p className="text-white text-lg mb-4">
                {illustration.backSubtitle}
              </p>
              <div className="w-24 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mb-4"></div>
              
              {/* Description */}
              <p className="text-white text-sm leading-relaxed mb-8">
                {illustration.backDescription}
              </p>
              
              {/* Official Perk Badge */}
              <div className="flex items-center gap-3 mt-auto">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-400 p-0.5">
                    <div className="w-full h-full rounded-full bg-purple-900 flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-400 opacity-60 blur-sm animate-pulse"></div>
                </div>
                <span className="text-yellow-300 font-bold text-lg drop-shadow-lg italic font-handwriting">
                  Official Perk
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: theme === 'light'
            ? 'radial-gradient(circle at center, rgba(59,130,246,0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle at center, rgba(59,130,246,0.2) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
    </div>
  );
};

export default GlassCard; 