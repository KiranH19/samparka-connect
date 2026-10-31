import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showWordmark = true }) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Brand Icon: Combined Location Pin + Human / Handshake Core */}
      <svg
        viewBox="0 0 48 48"
        className={`${iconSizes[size]} shrink-0`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Outer Location Pin in Brand Green #0BAA70 */}
        <path
          d="M24 4C14.059 4 6 12.059 6 22C6 33.5 24 44 24 44C24 44 42 33.5 42 22C42 12.059 33.941 4 24 4Z"
          fill="#0BAA70"
        />
        {/* Inner Hub / Person Head & Smile in Deep Navy #102B4E */}
        <circle cx="24" cy="18" r="8" fill="#102B4E" />
        <circle cx="24" cy="18" r="4.5" fill="#FAFAF5" />
        {/* Connected handshake / network arc */}
        <path
          d="M16 26C16 30 20 33 24 33C28 33 32 30 32 26"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      {showWordmark && (
        <span className={`font-extrabold text-[#102B4E] tracking-tight lowercase ${textSizes[size]}`}>
          samparka
        </span>
      )}
    </div>
  );
};
