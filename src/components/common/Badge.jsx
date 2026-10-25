import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon = null,
}) => {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-forest-50 text-forest-800 border-forest-200',
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-800 border-rose-200',
    info: 'bg-sky-50 text-sky-800 border-sky-200',
    purple: 'bg-purple-50 text-purple-800 border-purple-200',
    outline: 'bg-transparent text-slate-600 border-slate-300',
    // Pathogen specific
    fungal: 'bg-orange-50 text-orange-800 border-orange-200',
    bacterial: 'bg-blue-50 text-blue-800 border-blue-200',
    viral: 'bg-violet-50 text-violet-800 border-violet-200',
    pest: 'bg-amber-100 text-amber-900 border-amber-300',
    healthy: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-medium',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-full gap-1.5',
    lg: 'text-sm px-3 py-1.5 rounded-lg gap-2',
  };

  const currentVariant = variantStyles[variant.toLowerCase()] || variantStyles.default;
  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <span
      className={`inline-flex items-center border ${currentVariant} ${currentSize} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  );
};

export default Badge;
