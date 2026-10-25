import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanSearch,
  BookOpen,
  BarChart3,
  Info,
  ChevronLeft,
  ChevronRight,
  Sprout,
  ShieldCheck,
  Cpu,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useBackendStatus } from '../../context/BackendStatusContext';

export const Sidebar = ({ isCollapsed, toggleSidebar, mobileOpen, closeMobile }) => {
  const { isOnline, latency, apiUrl } = useBackendStatus();

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/detect',
      label: 'Disease Detection',
      icon: ScanSearch,
      badge: 'AI Vision',
    },
    {
      to: '/guidance',
      label: 'Crop Guidance',
      icon: BookOpen,
      badge: '38 Classes',
    },
    {
      to: '/performance',
      label: 'Model Performance',
      icon: BarChart3,
      badge: '96.8%',
    },
    {
      to: '/about',
      label: 'About Project',
      icon: Info,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#166534] text-white flex flex-col transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-inner shrink-0">
              <Sprout className="w-6 h-6 animate-pulse-subtle" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  KrishiVision <span className="text-emerald-300 text-xs font-mono font-medium px-1 py-0.5 rounded bg-emerald-400/15">AI</span>
                </span>
                <span className="text-[10px] text-emerald-200/80 tracking-wider uppercase font-medium">
                  Crop Diagnostic SaaS
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={toggleSidebar}
            type="button"
            className="hidden lg:flex w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 items-center justify-center text-white/80 hover:text-white transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-950/20'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`
                }
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110`} />
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full bg-white/20 text-white shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Architecture Specs Pill (when expanded) */}
        {!isCollapsed && (
          <div className="mx-3 my-2 p-3 rounded-xl bg-forest-900/60 border border-emerald-400/20 text-xs">
            <div className="flex items-center justify-between text-emerald-200 font-medium mb-1.5">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-300" />
                MobileNetV3-Large
              </span>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                Edge Ready
              </span>
            </div>
            <p className="text-[11px] text-emerald-100/70 leading-relaxed">
              5.4M weights with Squeeze-and-Excitation attention mechanism.
            </p>
          </div>
        )}

        {/* Backend Connectivity Status Footer */}
        <div className="p-3 border-t border-white/10 shrink-0">
          <div
            className={`flex items-center gap-2.5 p-2 rounded-xl text-xs transition-colors ${
              isOnline
                ? 'bg-emerald-900/40 text-emerald-200 border border-emerald-500/30'
                : 'bg-amber-950/50 text-amber-200 border border-amber-500/30'
            } ${isCollapsed ? 'justify-center' : ''}`}
            title={`Backend: ${apiUrl}`}
          >
            <div className="relative shrink-0">
              {isOnline ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute inset-0 radar-indicator block" />
                </>
              ) : (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block" />
              )}
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white truncate">
                    {isOnline ? 'FastAPI Online' : 'FastAPI Offline'}
                  </span>
                  {isOnline && latency && (
                    <span className="text-[10px] font-mono text-emerald-300">
                      {latency}ms
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-white/60 block truncate">
                  {apiUrl}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
