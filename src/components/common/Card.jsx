import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  bordered = true,
  onClick = null,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl ${
        bordered ? 'border border-emerald-950/10' : ''
      } shadow-card transition-all duration-200 ${
        hoverEffect ? 'hover:shadow-card-hover hover:-translate-y-0.5' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  title,
  subtitle,
  icon: Icon,
  action,
  className = '',
}) => {
  return (
    <div className={`p-5 border-b border-slate-100 flex items-start justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-800 shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <h3 className="text-base font-semibold text-slate-900 leading-tight">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardBody = ({ children, className = '' }) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`p-4 bg-slate-50/60 border-t border-slate-100 rounded-b-2xl ${className}`}>
      {children}
    </div>
  );
};

export default Card;
