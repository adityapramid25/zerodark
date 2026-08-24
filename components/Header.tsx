'use client';

import React from 'react';
import { Sun, Moon, Zap, Sparkles, Navigation } from 'lucide-react';
import { AtmosphereMode } from '@/types/environmental';

interface HeaderProps {
  currentMode: AtmosphereMode;
  onToggleMode: (mode: AtmosphereMode) => void;
  onLoadDemo: () => void;
  isDemoLoaded?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onToggleMode,
  onLoadDemo,
  isDemoLoaded = false,
}) => {
  const isNight = currentMode === 'night_light_pollution';

  return (
    <header className="sticky top-0 z-40 w-full px-4 pt-3 pb-3 bg-cosmic-night/90 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1C2B20] via-[#151D2A] to-[#251C33] border border-[#DCFD8B]/40 flex items-center justify-center shadow-[inset_2px_2px_6px_rgba(255,255,255,0.2),0_4px_10px_rgba(0,0,0,0.5)]">
            <Sparkles className="w-5 h-5 text-[#DCFD8B] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">
                Zero<span className="text-[#DCFD8B]">Dark</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[#151D2A] text-slate-400 border border-white/10">
                Eco-Scan
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#DCFD8B] animate-ping" />
              AI Dua Atmosfer
            </p>
          </div>
        </div>

        {/* Action Badges */}
        <div className="flex items-center gap-2">
          {/* Day / Night Atmosphere Mode Toggle */}
          <button
            onClick={() => onToggleMode(isNight ? 'day_air_pollution' : 'night_light_pollution')}
            className={`clay-badge cursor-pointer transition-all duration-200 ${
              isNight
                ? 'bg-[#251C33] text-[#BC84EE] border border-[#BC84EE]/50'
                : 'bg-[#1C2B20] text-[#DCFD8B] border border-[#DCFD8B]/50'
            }`}
            title="Ganti Mode Atmosfer"
          >
            {isNight ? (
              <>
                <Moon className="w-3.5 h-3.5" />
                <span>Langit Malam</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5" />
                <span>Udara Siang</span>
              </>
            )}
          </button>

          {/* Quick Demo Data Loader */}
          <button
            onClick={onLoadDemo}
            className="clay-button clay-button-slate text-xs py-1.5 px-3 flex items-center gap-1.5 active:scale-95 transition-transform"
            title="Muat Data Demo Nasional/Global"
          >
            <Zap className="w-3.5 h-3.5 text-[#DCFD8B]" />
            <span className="font-bold hidden xs:inline">Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
