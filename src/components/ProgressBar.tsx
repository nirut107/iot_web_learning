import React from 'react';

interface ProgressBarProps {
  label: string;
  percentage: number;
  fractionText?: string;
  color?: 'emerald' | 'blue' | 'purple' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
}

export function ProgressBar({
  label,
  percentage,
  fractionText,
  color = 'emerald',
  size = 'md',
  showPercentage = true
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percentage));

  const colorClasses = {
    emerald: 'bg-emerald-500 text-emerald-400',
    blue: 'bg-sky-500 text-sky-400',
    purple: 'bg-purple-500 text-purple-400',
    amber: 'bg-amber-500 text-amber-400'
  };

  const trackHeight = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between text-xs font-medium">
        <span className="text-slate-700 dark:text-slate-300">{label}</span>
        <div className="flex items-center gap-2">
          {fractionText && (
            <span className="text-slate-500 dark:text-slate-400">{fractionText}</span>
          )}
          {showPercentage && (
            <span className={`font-semibold ${colorClasses[color].split(' ')[1]}`}>
              {clamped}%
            </span>
          )}
        </div>
      </div>
      <div
        className={`w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 ${trackHeight[size]}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClasses[color].split(' ')[0]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
