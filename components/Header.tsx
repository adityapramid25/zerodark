'use client';

import React from 'react';
import { Sun, Moon, Zap, Sparkles, Cpu, Settings } from 'lucide-react';
import { AtmosphereMode } from '@/types/scan';

interface HeaderProps {
  currentMode: AtmosphereMode;
  onToggleMode: (mode: AtmosphereMode) => void;
  onLoadDemo: () => void;
  onOpenModelSettings: () => void;
  isDemoLoaded?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onToggleMode,
  onLoadDemo,
  onOpenModelSettings,
  isDemoLoaded = false,
}) => {
  const isNight = currentMode === 'night_light_pollution';

  return (
    <header className="sticky top-0 z-40 w-full px-4 pt-3 pb-3 bg-[#0B0F17]/90 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#142823] via-[#161F30] to-[#2A1B28] border border-emerald-500/40 flex items-center justify-center shadow-[inset_2px_2px_4px_rgba(255,255,255,0.2),0_4px_10px_rgba(0,0,0,0.5)]">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight text-white">
                Zero<span className="text-emerald-400">Dark</span>
              </span>
              <span className="text-[9px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded-full bg-[#161F30] text-slate-300 border border-white/10">
                TM-AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Dual-Atmosphere Scanner
            </p>
          </div>
        </div>

        {/* Action Badges */}
        <div className="flex items-center gap-1.5">
          {/* Day / Night Atmosphere Mode Toggle */}
          <button
            onClick={() => onToggleMode(isNight ? 'day_air_pollution' : 'night_light_pollution')}
            className={`clay-fab py-1.5 px-2.5 text-[10px] cursor-pointer transition-all duration-200 ${
              isNight
                ? 'clay-badge-amber text-amber-300'
                : 'clay-badge-emerald text-emerald-300'
            }`}
            title="Ganti Mode Atmosfer (Siang / Malam)"
          >
            {isNight ? (
              <>
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden xs:inline font-bold">Malam</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden xs:inline font-bold">Siang</span>
              </>
            )}
          </button>

          {/* Teachable Machine Cloud Model Settings Modal Trigger */}
          <button
            onClick={onOpenModelSettings}
            className="p-2 rounded-2xl bg-[#161F30] border border-white/10 text-slate-300 hover:text-white hover:border-emerald-500/40 active:scale-95 transition-all shadow-[inset_1px_1px_3px_rgba(255,255,255,0.1)]"
            title="Pengaturan URL Model Teachable Machine"
          >
            <Cpu className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Quick Demo Data Loader */}
          <button
            onClick={onLoadDemo}
            className="clay-btn-slate py-1.5 px-2.5 text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-transform"
            title="⚡ Muat Kumpulan Data Demo Kompetisi"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-black text-[10px] hidden xs:inline">Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
