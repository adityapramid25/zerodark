'use client';

import React from 'react';
import { Camera, MapPin, Sliders, History } from 'lucide-react';

export type NavTab = 'scan' | 'heatmap' | 'policy' | 'history';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  scanCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  scanCount = 0,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'scan', label: 'Scan', icon: Camera },
    { id: 'heatmap', label: 'Heatmap', icon: MapPin },
    { id: 'policy', label: 'Policy', icon: Sliders },
    { id: 'history', label: 'Logs', icon: History },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-lg mx-auto px-4 pb-5 pt-2">
      <div className="clay-card bg-[#111827]/95 backdrop-blur-xl border border-white/10 p-2 flex items-center justify-around rounded-[32px] shadow-[0_12px_32px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.15)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-3.5 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'clay-button-lime text-[#0B0F19] scale-105 shadow-[0_4px_16px_rgba(220,253,139,0.35)]'
                  : 'text-slate-400 hover:text-slate-200 active:scale-95'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.id === 'history' && scanCount > 0 && !isActive && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#DCFD8B] text-[#0B0F19] text-[9px] font-black flex items-center justify-center border border-black/40">
                    {scanCount > 9 ? '9+' : scanCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold mt-1 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
