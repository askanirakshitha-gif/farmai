import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  RefreshCw,
  ScanSearch,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useBackendStatus } from '../../context/BackendStatusContext';

export const Navbar = ({ openMobile }) => {
  const location = useLocation();
  const { isOnline, isChecking, latency, checkStatus, apiUrl } = useBackendStatus();
  const [showNotifications, setShowNotifications] = useState(false);

  // Map route to human title
  const routeTitles = {
    '/': 'Dashboard Overview',
    '/detect': 'Crop Disease Diagnosis',
    '/guidance': 'Crop Health Guidance & Agronomy',
    '/performance': 'Model Evaluation & Benchmarks',
    '/about': 'About KrishiVision AI',
  };

  const currentTitle = routeTitles[location.pathname] || 'KrishiVision AI';

  const notifications = [
    {
      id: 1,
      title: 'Monsoon Blight Risk Advisory',
      description: 'Persistent 88%+ humidity creates elevated risk for Tomato Late Blight. Preventive copper spray recommended.',
      time: '10m ago',
      urgent: true,
    },
    {
      id: 2,
      title: 'Grad-CAM Attention Engine Active',
      description: 'Visual saliency maps ready on MobileNetV3 feature layer 16.',
      time: '1h ago',
      urgent: false,
    },
  ];

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-emerald-950/10 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={openMobile}
          type="button"
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-forest-700 hidden sm:inline">
            KrishiVision AI
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          <h1 className="text-sm lg:text-base font-bold text-slate-800 leading-tight">
            {currentTitle}
          </h1>
        </div>
      </div>

      {/* Right: Backend indicator, notifications, new scan button */}
      <div className="flex items-center gap-3">
        {/* Live Backend Connection Indicator */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            isOnline
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-300'
          }`}
          title={`API Base: ${apiUrl}`}
        >
          <span className="relative flex h-2 w-2">
            {isOnline && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isOnline ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
          </span>

          <span className="hidden sm:inline">
            {isOnline ? 'API Connected' : 'API Offline'}
          </span>

          {isOnline && latency && (
            <span className="text-[10px] font-mono opacity-80 border-l border-emerald-200 pl-1.5 hidden md:inline">
              {latency}ms
            </span>
          )}

          <button
            onClick={checkStatus}
            disabled={isChecking}
            type="button"
            className="p-1 -mr-1 rounded hover:bg-black/5 text-slate-600 hover:text-slate-900 transition-colors"
            title="Re-check FastAPI connection"
          >
            <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            type="button"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
            title="Agricultural advisories"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Field Advisories
                </span>
                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Live Updates
                </span>
              </div>
              <div className="mt-3 space-y-2.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        {n.urgent && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{n.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Button: New Leaf Scan */}
        <Link
          to="/detect"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white text-xs font-semibold shadow-sm shadow-forest-900/20 transition-all hover:shadow-md"
        >
          <ScanSearch className="w-4 h-4 text-emerald-300" />
          <span className="hidden sm:inline">New Leaf Scan</span>
          <span className="sm:hidden">Scan</span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
