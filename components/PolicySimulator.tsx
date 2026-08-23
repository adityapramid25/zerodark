'use client';

import React, { useState } from 'react';
import { 
  Sliders, 
  Zap, 
  ShieldAlert, 
  Leaf, 
  Clock, 
  SunMedium, 
  Shield, 
  Sparkles, 
  TrendingDown, 
  DollarSign,
  Bird
} from 'lucide-react';
import { PolicyParams } from '@/types/environmental';
import { calculatePolicyImpact } from '@/utils/mockEngine';

export const PolicySimulator: React.FC = () => {
  const [params, setParams] = useState<PolicyParams>({
    curfewHour: 22, // 10 PM
    dimmingFactor: 55, // 55% dimming after curfew
    shieldingCompliance: 75, // 75% full cutoff shielding
    corridorBufferKm: 12, // 12 km protected dark corridor
  });

  const impact = calculatePolicyImpact(params);

  const applyPreset = (name: 'reserve' | 'urban' | 'balanced') => {
    if (name === 'reserve') {
      setParams({
        curfewHour: 20, // 8 PM
        dimmingFactor: 80,
        shieldingCompliance: 95,
        corridorBufferKm: 20,
      });
    } else if (name === 'urban') {
      setParams({
        curfewHour: 23, // 11 PM
        dimmingFactor: 60,
        shieldingCompliance: 80,
        corridorBufferKm: 8,
      });
    } else {
      setParams({
        curfewHour: 22,
        dimmingFactor: 50,
        shieldingCompliance: 65,
        corridorBufferKm: 12,
      });
    }
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="clay-card p-4 bg-[#111827]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#251C33] border border-[#BC84EE]/40 flex items-center justify-center">
              <Sliders className="w-4 h-4 text-[#BC84EE]" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">Dark Corridor Policy Simulator</h2>
              <p className="text-[10px] text-slate-400 font-medium">Urban & Ecological Light Mitigation</p>
            </div>
          </div>
          <span className="clay-badge text-[10px] bg-[#1C2B20] text-[#DCFD8B] border border-[#DCFD8B]/40">
            Live Model
          </span>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Presets:
          </span>
          <button
            onClick={() => applyPreset('reserve')}
            className="px-2.5 py-1 rounded-xl bg-[#0E1422] border border-white/10 hover:border-[#DCFD8B]/50 text-[10px] font-bold text-slate-300 hover:text-white transition-all active:scale-95"
          >
            🌌 IDA Reserve
          </button>
          <button
            onClick={() => applyPreset('urban')}
            className="px-2.5 py-1 rounded-xl bg-[#0E1422] border border-white/10 hover:border-[#BC84EE]/50 text-[10px] font-bold text-slate-300 hover:text-white transition-all active:scale-95"
          >
            🏙️ Urban Eco
          </button>
          <button
            onClick={() => applyPreset('balanced')}
            className="px-2.5 py-1 rounded-xl bg-[#0E1422] border border-white/10 hover:border-[#FF823A]/50 text-[10px] font-bold text-slate-300 hover:text-white transition-all active:scale-95"
          >
            ⚖️ Balanced
          </button>
        </div>
      </div>

      {/* Live Clay Gauge Hero Card */}
      <div className="clay-card-lime p-5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#0B0F19] bg-[#DCFD8B] px-2.5 py-0.5 rounded-full">
            Projected Eco-Dividend
          </span>
          <span className="text-[11px] font-extrabold text-[#DCFD8B]">
            +{impact.skyClarityBoostPct}% Sky Clarity
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 my-2">
          {/* Gauge 1: Light Pollution Drop */}
          <div className="bg-[#0B0F19]/60 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold">Light Spill Reduction</span>
              <TrendingDown className="w-3.5 h-3.5 text-[#DCFD8B]" />
            </div>
            <div className="text-2xl font-black text-[#DCFD8B]">
              -{impact.lightPollutionReductionPct}%
            </div>
            <div className="w-full h-1.5 bg-black/40 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-[#DCFD8B] transition-all duration-300"
                style={{ width: `${impact.lightPollutionReductionPct}%` }}
              />
            </div>
          </div>

          {/* Gauge 2: Restored Fauna Corridor Area */}
          <div className="bg-[#0B0F19]/60 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold">Restored Corridor</span>
              <Bird className="w-3.5 h-3.5 text-[#BC84EE]" />
            </div>
            <div className="text-2xl font-black text-white">
              {impact.restoredFaunaCorridorHa.toLocaleString()} <span className="text-xs font-bold text-slate-400">Ha</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Wildlife Sanctuary</p>
          </div>
        </div>

        {/* Secondary Dividend Metrics */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="bg-[#0B0F19]/40 p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#DCFD8B] shrink-0" />
            <div>
              <span className="text-xs font-black text-white">{impact.energySavedMwh.toLocaleString()} MWh</span>
              <p className="text-[9px] text-slate-400">Grid Energy Saved / Year</p>
            </div>
          </div>

          <div className="bg-[#0B0F19]/40 p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#DCFD8B] shrink-0" />
            <div>
              <span className="text-xs font-black text-white">${impact.costSavingsUsd.toLocaleString()}</span>
              <p className="text-[9px] text-slate-400">Annual Municipal Savings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Policy Sliders with Clay Knobs */}
      <div className="clay-card p-5 space-y-5 bg-[#151D2A]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Municipal Policy Adjusters
        </h3>

        {/* Slider 1: Commercial Lighting Curfew */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#BC84EE]" />
              Commercial Lighting Curfew
            </label>
            <span className="font-mono font-extrabold text-[#BC84EE] bg-[#251C33] px-2 py-0.5 rounded-lg border border-[#BC84EE]/30">
              {params.curfewHour}:00 PM
            </span>
          </div>
          <input
            type="range"
            min={18}
            max={24}
            step={1}
            value={params.curfewHour}
            onChange={(e) => setParams({ ...params, curfewHour: Number(e.target.value) })}
            className="clay-slider"
          />
          <div className="flex justify-between text-[9px] text-slate-500 font-semibold px-1">
            <span>6:00 PM (Strict)</span>
            <span>10:00 PM</span>
            <span>12:00 AM (Late)</span>
          </div>
        </div>

        {/* Slider 2: Public LED Dimming Factor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-200 flex items-center gap-1.5">
              <SunMedium className="w-3.5 h-3.5 text-[#DCFD8B]" />
              Public LED Dimming Factor
            </label>
            <span className="font-mono font-extrabold text-[#DCFD8B] bg-[#1C2B20] px-2 py-0.5 rounded-lg border border-[#DCFD8B]/30">
              {params.dimmingFactor}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={params.dimmingFactor}
            onChange={(e) => setParams({ ...params, dimmingFactor: Number(e.target.value) })}
            className="clay-slider"
          />
          <div className="flex justify-between text-[9px] text-slate-500 font-semibold px-1">
            <span>0% (Full Blast)</span>
            <span>50% Adaptive</span>
            <span>100% Full Cut</span>
          </div>
        </div>

        {/* Slider 3: Full-Cutoff Shielding Compliance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-200 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#FF823A]" />
              Luminaire Shielding Mandate
            </label>
            <span className="font-mono font-extrabold text-[#FF823A] bg-[#2B1D18] px-2 py-0.5 rounded-lg border border-[#FF823A]/30">
              {params.shieldingCompliance}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={params.shieldingCompliance}
            onChange={(e) => setParams({ ...params, shieldingCompliance: Number(e.target.value) })}
            className="clay-slider"
          />
          <div className="flex justify-between text-[9px] text-slate-500 font-semibold px-1">
            <span>0% Unshielded</span>
            <span>50% Standard</span>
            <span>100% Zero-Spill</span>
          </div>
        </div>

        {/* Slider 4: Dark Corridor Buffer Radius */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-200 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-[#DCFD8B]" />
              Ecological Buffer Radius
            </label>
            <span className="font-mono font-extrabold text-[#DCFD8B] bg-[#1C2B20] px-2 py-0.5 rounded-lg border border-[#DCFD8B]/30">
              {params.corridorBufferKm} km
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={25}
            step={1}
            value={params.corridorBufferKm}
            onChange={(e) => setParams({ ...params, corridorBufferKm: Number(e.target.value) })}
            className="clay-slider"
          />
          <div className="flex justify-between text-[9px] text-slate-500 font-semibold px-1">
            <span>1 km</span>
            <span>12 km Regional</span>
            <span>25 km Biosphere</span>
          </div>
        </div>
      </div>
    </div>
  );
};
