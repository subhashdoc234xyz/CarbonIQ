import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
}

export const CarbonIQLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
}) => {
  const iconDimensions = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  const textSize = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Brand Icon Mark */}
      <div
        className={`${iconDimensions} rounded-lg bg-[#16181C] border border-[#26292F] flex items-center justify-center p-1.5 shadow-sm relative overflow-hidden group`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#34D399]/20 to-transparent opacity-60"></div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[#34D399] relative z-10"
        >
          {/* Stylized Eco-Intelligence Leaf & Circuit Node */}
          <path
            d="M19.5 4.5C19.5 4.5 12 5.5 8 9.5C4 13.5 4.5 19.5 4.5 19.5C4.5 19.5 10.5 20 14.5 16C18.5 12 19.5 4.5 19.5 4.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 15.5L14 10"
            stroke="#5af0b3"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="15.5" cy="8.5" r="2" fill="#FFFFFF" />
        </svg>
      </div>

      {showWordmark && (
        <span className={`font-semibold tracking-tight font-sans ${textSize} leading-none select-none`}>
          <span className="text-[#F5F6F7]">Carbon</span>
          <span className="text-[#34D399]">IQ</span>
        </span>
      )}
    </div>
  );
};
