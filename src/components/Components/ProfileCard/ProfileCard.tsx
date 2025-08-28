import React, { useEffect, useRef, useCallback, useMemo, memo } from "react";
import "./ProfileCard.css";

interface ProfileCardProps {
  avatarUrl?: string;
  iconUrl?: string;
  grainUrl?: string;
  behindGradient?: string;
  innerGradient?: string;
  showBehindGradient?: boolean;
  className?: string;
  enableTilt?: boolean;
  miniAvatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onContactClick?: () => void;
  avatarStyle?: React.CSSProperties;
}

const DEFAULT_BEHIND_GRADIENT = "rgba(0,231,255,0.5)";
const DEFAULT_INNER_GRADIENT = "linear-gradient(145deg, rgba(255,255,255,0.3) 0%, rgba(0,231,255,0.8) 50%, rgba(255,0,128,0.7) 100%)";

// clamp function removed as it was unused



const ProfileCardComponent: React.FC<ProfileCardProps> = ({
  avatarUrl = "<Placeholder for avatar URL>",
  iconUrl = "<Placeholder for icon URL>",
  grainUrl = "<Placeholder for grain URL>",
  behindGradient,
  innerGradient,
  showBehindGradient = true,
  className = "",
  enableTilt = true,
  miniAvatarUrl,
  name = "Javi A. Torres",
  title = "Software Engineer",
  handle = "javicodes",
  status = "Online",
  contactText = "Contact",
  showUserInfo = true,
  onContactClick,
  avatarStyle,
}) => {
  // Always call hooks first, before any conditions or early returns
  const cardRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const cardStyle = useMemo(
    () =>
      ({
        "--icon": iconUrl ? `url(${iconUrl})` : "none",
        "--grain": grainUrl ? `url(${grainUrl})` : "none",
        "--behind-gradient": showBehindGradient
          ? behindGradient ?? DEFAULT_BEHIND_GRADIENT
          : "none",
        "--inner-gradient": innerGradient ?? DEFAULT_INNER_GRADIENT,
      }) as React.CSSProperties,
    [iconUrl, grainUrl, showBehindGradient, behindGradient, innerGradient],
  );

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!enableTilt || !cardRef.current) return;

    try {
      const cardBounds = cardRef.current.getBoundingClientRect();
      const cardCenterX = cardBounds.left + cardBounds.width / 2;
      const cardCenterY = cardBounds.top + cardBounds.height / 2;
      const mouseX = e.clientX - cardCenterX;
      const mouseY = e.clientY - cardCenterY;

      const maxTilt = 20;
      const tiltX = (mouseY / (cardBounds.height / 2)) * -maxTilt;
      const tiltY = (mouseX / (cardBounds.width / 2)) * maxTilt;

      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`;
      }

      // Update glare position
      const glare = cardRef.current?.querySelector('.pc-glare') as HTMLElement;
      if (glare) {
        const glareX = (mouseX / cardBounds.width) * 100;
        const glareY = (mouseY / cardBounds.height) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.8) 0%, transparent 50%)`;
        glare.style.opacity = '1';
      }
    } catch (error) {
      console.error('Error in handleMouseMove:', error);
    }
  }, [enableTilt]);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;

    try {
      if (cardRef.current) {
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }

      // Reset glare
      const glare = cardRef.current?.querySelector('.pc-glare') as HTMLElement;
      if (glare) {
        glare.style.opacity = '0';
      }
    } catch (error) {
      console.error('Error in handleMouseLeave:', error);
    }
  }, []);

  const handleContactClick = useCallback(() => {
    try {
      if (onContactClick) {
        onContactClick();
      }
    } catch (error) {
      console.error('Error in handleContactClick:', error);
    }
  }, [onContactClick]);

  useEffect(() => {
    if (!enableTilt || !cardRef.current) return;

    try {
      const currentCard = cardRef.current;
      currentCard.addEventListener('mousemove', handleMouseMove);
      currentCard.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        currentCard.removeEventListener('mousemove', handleMouseMove);
        currentCard.removeEventListener('mouseleave', handleMouseLeave);
      };
    } catch (error) {
      console.error('Error setting up event listeners:', error);
    }
  }, [handleMouseMove, handleMouseLeave, enableTilt]);

  // Main component JSX
  try {
    return (
      <div
        ref={wrapRef}
        className={`pc-card-wrapper ${className}`.trim()}
        style={cardStyle}
      >
        <section ref={cardRef} className="pc-card">
          <div className="pc-inside">
            <div className="pc-shine" />
            <div className="pc-glare" />
            <div className="pc-content pc-avatar-content">
              <img
                className="avatar"
                src={avatarUrl}
                alt={`${name || "User"} avatar`}
                loading="lazy"
                style={avatarStyle}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  try {
                    if (!e.currentTarget) return;
                    e.currentTarget.style.display = "none";
                  } catch (error) {
                    console.error('Error handling image error:', error);
                  }
                }}
                onLoad={() => {
                  // Image loaded successfully
                }}
              />
              {showUserInfo && (
                <div className="pc-user-info">
                  <div className="pc-user-details">
                    <div className="pc-mini-avatar">
                      <img
                        src={miniAvatarUrl || avatarUrl}
                        alt={`${name || "User"} mini avatar`}
                        loading="lazy"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          try {
                            if (!e.currentTarget) return;
                            e.currentTarget.style.opacity = "0.5";
                            e.currentTarget.src = avatarUrl;
                          } catch (error) {
                            console.error('Error handling mini avatar error:', error);
                          }
                        }}
                        onLoad={() => {
                          // Mini avatar loaded successfully
                        }}
                      />
                    </div>
                    <div className="pc-user-text">
                      <div className="pc-handle">@{handle}</div>
                      <div className="pc-status">{status}</div>
                    </div>
                  </div>
                  <button
                    className="pc-contact-btn"
                    onClick={handleContactClick}
                    style={{ pointerEvents: "auto" }}
                    type="button"
                    aria-label={`Contact ${name || "user"}`}
                  >
                    {contactText}
                  </button>
                </div>
              )}
            </div>
            <div className="pc-content">
              <div className="pc-details">
                <h3>{name}</h3>
                <p>{title}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('ProfileCard render error:', error);
    // Return a fallback component if rendering fails
    return (
      <div className={`pc-card-wrapper bg-gray-200 dark:bg-gray-800 rounded-2xl p-4 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-400 rounded-full mx-auto mb-2"></div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">{name || "User"}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title || "Title"}</p>
        </div>
      </div>
    );
  }
};

const ProfileCard = memo(ProfileCardComponent);
export default ProfileCard;
