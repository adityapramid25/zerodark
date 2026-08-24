import React, { useState } from 'react';
import { 
  Sliders, 
  Zap, 
  Leaf, 
  Clock, 
  SunMedium, 
  Shield, 
  Sparkles, 
  TrendingDown, 
  DollarSign,
  Bird,
  ShieldCheck,
  Award,
  Bot,
  RefreshCw,
  FileText,
  ChevronDown,
  ChevronUp,
  CheckCircle2
} from 'lucide-react';
import { PolicyParams, PolicySimulationResult, AIPolicyRecommendation } from '@/types/scan';
import { getStoredGeminiKey, getStoredGeminiModel } from '@/utils/storage';

export function calculatePolicySimulation(params: PolicyParams): PolicySimulationResult {
  const { curfewHour, dimmingFactor, shieldingCompliance, corridorBufferKm } = params;

  // Base urban metrics
  const curfewHoursCount = Math.max(0, 24 - curfewHour + 6); // hours between curfew and 6 AM
  const curfewMultiplier = curfewHoursCount / 8; // Normalized

  // Energy saved calculation (MWh per annum)
  const baseEnergy = 4800; // Base MWh municipal street lighting
  const dimmingSavings = (dimmingFactor / 100) * 0.45;
  const curfewSavings = curfewMultiplier * 0.35;
  const shieldingSavings = (shieldingCompliance / 100) * 0.2;
  const totalEfficiency = Math.min(0.85, dimmingSavings + curfewSavings + shieldingSavings);

  const energySavedMwh = Math.round(baseEnergy * totalEfficiency);
  const carbonReducedTons = Math.round(energySavedMwh * 0.72); // 0.72 tCO2e / MWh grid factor
  const costSavingsUsd = Math.round(energySavedMwh * 135); // $135/MWh average rate

  // Light pollution reduction percentage
  const lightPollutionReductionPct = Math.min(
    92,
    Math.round(
      (dimmingFactor * 0.4) +
      (shieldingCompliance * 0.45) +
      (curfewMultiplier * 15)
    )
  );

  // Protected corridor in Hectares
  const restoredFaunaCorridorHa = Math.round(
    Math.PI * Math.pow(corridorBufferKm, 2) * 100 * (lightPollutionReductionPct / 100) * 0.65
  );

  // Night Sky clarity boost
  const skyClarityBoostPct = Math.min(95, Math.round(lightPollutionReductionPct * 1.05));

  return {
    energySavedMwh,
    carbonReducedTons,
    lightPollutionReductionPct,
    restoredFaunaCorridorHa,
    costSavingsUsd,
    skyClarityBoostPct,
  };
}

export const PolicySimulatorClay: React.FC = () => {
  const [params, setParams] = useState<PolicyParams>({
    curfewHour: 22, // 10 PM
    dimmingFactor: 55, // 55%
    shieldingCompliance: 75, // 75%
    corridorBufferKm: 12, // 12 km
  });

  const [cityName, setCityName] = useState<string>('Kawasan Metropolitan / Ibu Kota');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiPolicy, setAiPolicy] = useState<AIPolicyRecommendation | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);

  const impact = calculatePolicySimulation(params);

  const handleGenerateAIPolicy = async () => {
    setIsGeneratingAI(true);
    try {
      const apiKey = getStoredGeminiKey();
      const model = getStoredGeminiModel();

      const res = await fetch('/api/policy-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          params,
          impact,
          cityName,
          apiKey: apiKey || undefined,
          model,
        }),
      });

      const data: AIPolicyRecommendation = await res.json();
      setAiPolicy(data);
      setShowAiModal(true);
    } catch (err) {
      console.error('Failed to generate AI policy:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const applyPreset = (name: 'reserve' | 'urban' | 'balanced') => {
    if (name === 'reserve') {
      setParams({
        curfewHour: 20, // 8 PM
        dimmingFactor: 80,
        shieldingCompliance: 95,
        corridorBufferKm: 20,
      });
      setCityName('Kawasan Cagar Alam / Biosfer');
    } else if (name === 'urban') {
      setParams({
        curfewHour: 23, // 11 PM
        dimmingFactor: 60,
        shieldingCompliance: 80,
        corridorBufferKm: 8,
      });
      setCityName('Kawasan Pusat Bisnis & Komersial');
    } else {
      setParams({
        curfewHour: 22,
        dimmingFactor: 50,
        shieldingCompliance: 65,
        corridorBufferKm: 12,
      });
      setCityName('Kawasan Residensial & Kota Madya');
    }
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="clay-card-base p-4 bg-[#161F30]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#142823] border border-emerald-500/40 flex items-center justify-center">
              <Sliders className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">Simulator Kebijakan Koridor Gelap</h2>
              <p className="text-[10px] text-slate-400 font-medium">Mitigasi Limpahan Cahaya & Konservasi Fauna</p>
            </div>
          </div>
          <span className="clay-badge-emerald text-[9px]">
            Model Dinamis AI
          </span>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Preset:
          </span>
          <button
            onClick={() => applyPreset('reserve')}
            className="px-2.5 py-1 rounded-xl bg-[#0C121E] border border-white/10 hover:border-emerald-500/50 text-[10px] font-bold text-slate-300 hover:text-white transition-all active:scale-95"
          >
            🌌 IDA Reserve
          </button>
          <button
            onClick={() => applyPreset('urban')}
            className="px-2.5 py-1 rounded-xl bg-[#0C121E] border border-white/10 hover:border-amber-500/50 text-[10px] font-bold text-slate-300 hover:text-white transition-all active:scale-95"
          >
            🏙️ Urban Eco
          </button>
          <button
            onClick={() => applyPreset('balanced')}
            className="px-2.5 py-1 rounded-xl bg-[#0C121E] border border-white/10 hover:border-emerald-500/50 text-[10px] font-bold text-slate-300 hover:text-white transition-all active:scale-95"
          >
            ⚖️ Seimbang
          </button>
        </div>
      </div>

      {/* Live Clay Dividend Hero Card */}
      <div className="clay-card-green p-5 relative overflow-hidden bg-[#142823]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-950 bg-emerald-400 px-2.5 py-0.5 rounded-full shadow-sm">
            Proyeksi Dividen Ekologis
          </span>
          <span className="text-[11px] font-extrabold text-emerald-400">
            +{impact.skyClarityBoostPct}% Kejernihan Langit
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 my-2">
          {/* Gauge 1: Light Pollution Drop */}
          <div className="bg-[#0B0F17]/70 backdrop-blur-sm p-3 rounded-2xl border border-white/10 shadow-inner">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold">Reduksi Limpahan</span>
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              -{impact.lightPollutionReductionPct}%
            </div>
            <div className="w-full h-1.5 bg-black/50 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${impact.lightPollutionReductionPct}%` }}
              />
            </div>
          </div>

          {/* Gauge 2: Restored Fauna Corridor Area */}
          <div className="bg-[#0B0F17]/70 backdrop-blur-sm p-3 rounded-2xl border border-white/10 shadow-inner">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold">Koridor Fauna Pulih</span>
              <Bird className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {impact.restoredFaunaCorridorHa.toLocaleString()} <span className="text-xs font-bold text-slate-400">Ha</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Suaka Nokturnal</p>
          </div>
        </div>

        {/* Secondary Dividend Metrics */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="bg-[#0B0F17]/50 p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-xs font-black text-white">{impact.energySavedMwh.toLocaleString()} MWh</span>
              <p className="text-[9px] text-slate-400">Energi Dihemat / Thn</p>
            </div>
          </div>

          <div className="bg-[#0B0F17]/50 p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-xs font-black text-white">${impact.costSavingsUsd.toLocaleString()}</span>
              <p className="text-[9px] text-slate-400">Penghematan Pemkot / Thn</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Policy Advisor Trigger Button */}
      <button
        onClick={handleGenerateAIPolicy}
        disabled={isGeneratingAI}
        className="w-full clay-btn-mint py-3.5 px-4 text-xs font-black flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(16,185,129,0.3)] group"
      >
        {isGeneratingAI ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
            <span>AI Sedang Menyusun Draf Regulasi Tata Kota...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
            <span>✨ Dapatkan Rekomendasi Regulasi & Naskah Kebijakan AI</span>
          </>
        )}
      </button>

      {/* Interactive Policy Sliders with Clay Knobs */}
      <div className="clay-card-base p-5 space-y-5 bg-[#161F30]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Kontrol Parameter Kebijakan Tata Kota
        </h3>

        {/* Slider 1: Commercial Lighting Curfew */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Jam Malam Penerangan Komersial
            </label>
            <span className="font-mono font-extrabold text-amber-400 bg-[#0C121E] px-2 py-0.5 rounded-lg border border-amber-500/30">
              {params.curfewHour === 12 ? '12:00 siang' : params.curfewHour > 12 ? `${params.curfewHour - 12}:00 malam` : `${params.curfewHour}:00 pagi`}
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
            <span>6:00 Sore (Ketat)</span>
            <span>10:00 Malam</span>
            <span>12:00 Malam (Longgar)</span>
          </div>
        </div>

        {/* Slider 2: Public LED Dimming Factor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-200 flex items-center gap-1.5">
              <SunMedium className="w-3.5 h-3.5 text-emerald-400" />
              Faktor Peredupan LED Publik
            </label>
            <span className="font-mono font-extrabold text-emerald-400 bg-[#0C121E] px-2 py-0.5 rounded-lg border border-emerald-500/30">
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
            <span>0% Terang Total</span>
            <span>50% Adaptif Cerdas</span>
            <span>100% Redup Penuh</span>
          </div>
        </div>

        {/* Slider 3: Full-Cutoff Shielding Compliance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-200 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              Kepatuhan Tudung Lampu (Full-Cutoff)
            </label>
            <span className="font-mono font-extrabold text-rose-400 bg-[#0C121E] px-2 py-0.5 rounded-lg border border-rose-500/30">
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
            <span>0% Tanpa Tudung</span>
            <span>50% Standar</span>
            <span>100% Terlindungi Total</span>
          </div>
        </div>

        {/* Slider 4: Dark Corridor Buffer Radius */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-200 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              Radius Penyangga Cagar Gelap
            </label>
            <span className="font-mono font-extrabold text-emerald-400 bg-[#0C121E] px-2 py-0.5 rounded-lg border border-emerald-500/30">
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
            <span>1 km Lokal</span>
            <span>12 km Koridor Regional</span>
            <span>25 km Suaka Biosfer</span>
          </div>
        </div>
      </div>

      {/* AI Policy Recommendations Modal / Drawer */}
      {showAiModal && aiPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md max-h-[85vh] clay-card-base p-5 space-y-4 relative border border-emerald-500/40 bg-[#161F30] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-[#142823] border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Rekomendasi Kebijakan AI</h3>
                  <p className="text-[10px] text-emerald-400">ZeroDark Environmental Policy Advisor</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="p-1.5 rounded-full bg-[#0C121E] text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Executive Summary */}
            <div className="clay-inset-well p-3 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Ringkasan Eksekutif & ROI:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {aiPolicy.executiveSummary}
              </p>
              <p className="text-[11px] text-emerald-300 font-mono mt-2 pt-2 border-t border-white/5">
                💡 {aiPolicy.projectedROI}
              </p>
            </div>

            {/* Legal Drafting Points */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                Poin Rancang Regulasi (Klausul Perda):
              </span>
              <div className="space-y-1.5">
                {aiPolicy.legalDraftingPoints.map((point, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#0C121E] border border-white/5 text-[11px] text-slate-300 leading-snug flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Implementation Roadmap */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                Peta Jalan Implementasi (Roadmap):
              </span>
              <div className="space-y-2">
                {aiPolicy.implementationRoadmap.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#0C121E] border border-white/5 text-xs">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono">{item.phase}</span>
                    <p className="font-bold text-white text-[11px] mt-0.5">{item.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowAiModal(false)}
              className="w-full clay-btn-slate py-2.5 text-xs font-bold mt-2"
            >
              Tutup Kajian Regulasi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

