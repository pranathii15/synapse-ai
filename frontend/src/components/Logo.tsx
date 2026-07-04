import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
  strokeColor?: string;
  strokeWidth?: number;
}

export default function Logo({ 
  className = '', 
  size = 36, 
  strokeColor = '#3E5BFF',
  strokeWidth = 26
}: LogoProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 500 500" 
      width={size} 
      height={size} 
      className={className}
    >
      <g fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {/* Left Head */}
        <circle cx="160" cy="150" r="30" />
        
        {/* Middle Head */}
        <circle cx="250" cy="150" r="30" />
        
        {/* Right Head */}
        <circle cx="340" cy="150" r="30" />
        
        {/* Connected Body & Waves */}
        <path d="M 100 265 C 100 265 120 225 160 225 C 200 225 225 285 220 330 C 215 375 175 375 170 330 C 165 285 210 225 250 225 C 290 225 315 285 310 330 C 305 375 265 375 260 330 C 255 285 300 225 340 225 C 380 225 400 265 400 265" />
      </g>
    </svg>
  );
}
