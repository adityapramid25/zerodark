'use client';

import React from 'react';
import { Camera, MapPin, Sliders, History, Bot, Sparkles } from 'lucide-react';

export type NavTab = 'scan' | 'heatmap' | 'policy' | 'copilot' | 'history';

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
    { id: 'scan', label: 'Pindai', icon: Camera },
    { id: 'heatmap', label: 'Peta', icon: MapPin },
    { id: 'policy', label: 'Kebijakan', icon: Sliders },
    { id: 'copilot', label: 'AI Copilot', icon: Bot },
    { id: 'history', label: 'Riwayat', icon: History },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-3 pb-4 pt-1 pointer-events-none">
      <div className="pointer-events-auto clay-card-base bg-[#161F30]/95 backdrop-blur-xl border border-white/10 p-1.5 flex items-center justify-around rounded-3xl shadow-[8px_8px_16px_#070a10,-8px_-8px_16px_#212e46,inset_2px_2px_4px_rgba(255,255,255,0.1),inset_-2px_-2px_4px_rgba(0,0,0,0.4)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 scale-105 shadow-[6px_6px_12px_#070a10,-6px_-6px_12px_#212e46,inset_2px_2px_4px_rgba(255,255,255,0.4)] font-black'
                  : 'text-slate-400 hover:text-slate-200 active:scale-95'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.id === 'history' && scanCount > 0 && !isActive && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-emerald-400 text-slate-950 text-[8px] font-black flex items-center justify-center shadow-sm">
                    {scanCount > 9 ? '9+' : scanCount}
                  </span>
                )}
                {item.id === 'copilot' && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>
              <span className="text-[9px] font-bold mt-0.5 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

