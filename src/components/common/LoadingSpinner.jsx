import React from 'react';
import { Sprout } from 'lucide-react';

export const LoadingSpinner = ({
  size = 'md',
  text = 'Processing...',
  className = '',
  withIcon = true,
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 gap-3 ${className}`}>
      <div className="relative">
        <div
          className={`${sizeMap[size] || sizeMap.md} rounded-full border-2 border-emerald-100 border-t-emerald-600 animate-spin`}
        />
        {withIcon && size !== 'sm' && (
          <div className="absolute inset-0 flex items-center justify-center text-forest-700">
            <Sprout className="w-4 h-4 animate-pulse" />
          </div>
        )}
      </div>
      {text && <p className="text-xs font-medium text-slate-500 animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
