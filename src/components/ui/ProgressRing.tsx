import React from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  children?: React.ReactNode;
}

const ProgressRing = ({
  progress = 0,
  size = 80,
  strokeWidth = 6,
  color = 'hsl(var(--foreground))',
  bgColor = 'hsl(var(--muted))',
  children,
}: ProgressRingProps) => {
  const safeSize = size > 0 ? size : 80;
  const radius = (safeSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const numericProgress = typeof progress === 'number' && !isNaN(progress) ? progress : 0;
  const safeProgress = Math.max(0, Math.min(numericProgress, 100));
  
  const offset = circumference - (safeProgress / 100) * circumference;
  const safeOffset = isNaN(offset) ? circumference : offset;

  // Unikalne ID dla gradientu (aby uniknąć konfliktów przy wielu kółkach)
  const gradientId = `progress-gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="relative inline-flex items-center justify-center group">
      
      <svg 
        width={safeSize} 
        height={safeSize} 
        viewBox={`0 0 ${safeSize} ${safeSize}`}
        className="transform -rotate-90 overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity={0.6} />
          </linearGradient>
          
          {/* Efekt poświaty */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Tło pierścienia (Track) */}
        <circle
          stroke={bgColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius > 0 ? radius : 0}
          cx={safeSize / 2}
          cy={safeSize / 2}
          className="opacity-20"
        />

        {/* Pierścień postępu z animacją */}
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: safeOffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          stroke={`url(#${gradientId})`}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          r={radius > 0 ? radius : 0}
          cx={safeSize / 2}
          cy={safeSize / 2}
          strokeDasharray={circumference}
          filter="url(#glow)"
          className="drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
        />
      </svg>
      
      {/* Centrowana treść (np. procenty lub ikona) */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProgressRing;