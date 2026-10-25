import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, RefreshCw, WifiOff } from 'lucide-react';

export const StatusAlert = ({
  type = 'info',
  title,
  message,
  action,
  onRetry,
  className = '',
}) => {
  const configs = {
    info: {
      bg: 'bg-sky-50 border-sky-200 text-sky-900',
      icon: Info,
      iconColor: 'text-sky-600',
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: CheckCircle,
      iconColor: 'text-emerald-600',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
    },
    danger: {
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
      icon: AlertCircle,
      iconColor: 'text-rose-600',
    },
    offline: {
      bg: 'bg-amber-50/90 border-amber-300 text-amber-950',
      icon: WifiOff,
      iconColor: 'text-amber-600',
    },
    uncertain: {
      bg: 'bg-amber-50 border-amber-300 text-amber-900',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
    },
  };

  const current = configs[type] || configs.info;
  const Icon = current.icon;

  return (
    <div
      className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${current.bg} ${className}`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${current.iconColor}`} />
      <div className="flex-1 min-w-0">
        {title && <h4 className="text-sm font-semibold mb-1 leading-snug">{title}</h4>}
        {message && <div className="text-xs leading-relaxed opacity-90">{message}</div>}
        {action && <div className="mt-2.5">{action}</div>}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="shrink-0 p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 text-xs font-medium border border-slate-200 shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};

export const EmptyState = ({
  icon: Icon = AlertCircle,
  title = "No data found",
  description = "No matching records or items available at this time.",
  action = null,
}) => {
  return (
    <div className="text-center py-12 px-4 rounded-2xl bg-white border border-dashed border-slate-200">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700 mb-3.5">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">{description}</p>
      {action}
    </div>
  );
};

export default StatusAlert;
