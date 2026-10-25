import React from 'react';

export const ConfidenceBar = ({
  score = 0,
  label,
  showPercentage = true,
  size = 'md',
  className = '',
}) => {
  // score between 0 and 1 or 0 and 100
  const normalized = score > 1 ? score : score * 100;
  const clamped = Math.min(100, Math.max(0, normalized));

  // Determine color based on confidence level
  const getColor = () => {
    if (clamped >= 85) return 'bg-emerald-500';
    if (clamped >= 65) return 'bg-forest-600';
    if (clamped >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getTextColor = () => {
    if (clamped >= 85) return 'text-emerald-700';
    if (clamped >= 65) return 'text-forest-700';
    if (clamped >= 50) return 'text-amber-700';
    return 'text-rose-700';
  };

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs mb-1.5">
          {label && <span className="font-medium text-slate-700">{label}</span>}
          {showPercentage && (
            <span className={`font-semibold font-mono ${getTextColor()}`}>
              {clamped.toFixed(1)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`${heightClass} rounded-full transition-all duration-700 ease-out ${getColor()}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export default ConfidenceBar;
