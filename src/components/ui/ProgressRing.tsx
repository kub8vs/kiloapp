import React from 'react';

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
  // Zabezpieczenie przed NaN:
  const numericProgress = isNaN(progress) ? 0 : progress;
  const safeProgress = Math.max(0, Math.min(numericProgress, 100));
  const offset = circumference - (safeProgress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={safeSize} height={safeSize} style={{ transform: 'rotate(-90deg)' }}>
        <circle stroke={bgColor} fill="transparent" strokeWidth={strokeWidth} r={radius > 0 ? radius : 0} cx={safeSize / 2} cy={safeSize / 2} />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          r={radius > 0 ? radius : 0}
          cx={safeSize / 2}
          cy={safeSize / 2}
          strokeDasharray={circumference}
          strokeDashoffset={isNaN(offset) ? circumference : offset}
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'none' }}>{children}</div>}
    </div>
  );
};

export default ProgressRing;