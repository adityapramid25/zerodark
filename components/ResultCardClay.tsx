'use client';

import React, { useState } from 'react';
import { 
  Wind, 
  Moon, 
  Eye, 
  Sun, 
  Sparkles, 
  Share2, 
  Check, 
  Compass, 
  Leaf, 
  ShieldCheck, 
  AlertTriangle,
  Layers,
  MapPin,
  Cpu,
  Bot,
  Zap,
  Activity
} from 'lucide-react';
import { ScanRecord } from '@/types/scan';

interface ResultCardClayProps {
  scan: ScanRecord;
  onExploreMap?: () => void;
  onSimulatePolicy?: () => void;
  onConsultAI?: (scan: ScanRecord) => void;
  onClose?: () => void;
}

export const ResultCardClay: React.FC<ResultCardClayProps> = ({
  scan,
  onExploreMap,
  onSimulatePolicy,
  onConsultAI,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const { 
    mode, 
    coordinates, 
    predictions, 
    topPrediction, 
    metadata, 
    photoUrl,
    engineUsed = 'hybrid',
    detectedAnomalies = [],
    summaryDescription,
    aiConfidenceScore
  } = scan;
  const isDay = mode === 'day_air_pollution';

  // Card theme classes
  let cardThemeClass = 'clay-card-base';
  let badgeClass = 'clay-badge-green';
  let gaugeGradient = 'from-emerald-400 to-emerald-600';

  if (metadata.badgeStyle === 'red' || metadata.badgeStyle === 'crimson') {
    cardThemeClass = 'clay-card-red';
    badgeClass = metadata.badgeStyle === 'crimson' ? 'clay-badge-crimson' : 'clay-badge-red';
    gaugeGradient = 'from-red-400 to-rose-600';
  } else if (metadata.badgeStyle === 'amber') {
    cardThemeClass = 'clay-card-amber';
    badgeClass = 'clay-badge-amber';
    gaugeGradient = 'from-amber-400 to-yellow-600';
  } else if (metadata.badgeStyle === 'emerald') {
    cardThemeClass = 'clay-card-green';
    badgeClass = 'clay-badge-emerald';
    gaugeGradient = 'from-emerald-400 to-teal-600';
  } else {
    cardThemeClass = 'clay-card-green';
    badgeClass = 'clay-badge-green';
    gaugeGradient = 'from-emerald-400 to-emerald-600';
  }

  const handleShare = async () => {
    const text = `ZeroDark Eco-Scan: ${metadata.label} (${(topPrediction.probability * 100).toFixed(1)}%) di ${coordinates.locationName}. Status: ${metadata.statusText}. #ZeroDark #AI`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hasil Pemindaian ZeroDark AI',
          text,
          url: window.location.href,
        });
      } catch {
        // Ignored
      }
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* 3D Clay Hero Result Card */}
      <div className={`p-5 relative overflow-hidden ${cardThemeClass}`}>
        {/* Ambient Glow */}
        <div
          className="absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{ backgroundColor: metadata.colorHex }}
        />

        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              <span className={badgeClass}>
                {isDay ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                <span>{metadata.badgeText}</span>
              </span>
              <span className="text-[10px] text-slate-300 font-bold bg-[#0C121E] px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
                {engineUsed === 'gemini' ? (
                  <>
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Gemini 1.5 Vision</span>
                  </>
                ) : engineUsed === 'teachable_machine' ? (
                  <>
                    <Cpu className="w-3 h-3 text-emerald-400" />
                    <span>Teachable Machine</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3 h-3 text-emerald-400" />
                    <span>Dual-AI Hybrid</span>
                  </>
                )}
              </span>
            </div>

            <h2 className="text-lg font-black text-white tracking-tight">
              {metadata.label}
            </h2>
            <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{coordinates.locationName}</span>
            </p>
          </div>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-2xl bg-[#0C121E] border border-white/10 text-slate-300 hover:text-white active:scale-95 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)] transition-transform"
            title="Bagikan Ringkasan"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Primary Metric Score and Gauge */}
        <div className="flex items-end justify-between py-3 border-y border-white/10 my-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tight text-white drop-shadow-md">
                {metadata.metricValue}
              </span>
              <span className="text-xs font-bold text-slate-400">
                {metadata.metricUnit}
              </span>
            </div>
            <p className="text-xs font-bold mt-1 text-slate-200">
              {metadata.statusText}
            </p>
          </div>

          {/* Model Confidence Meter */}
          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Keyakinan AI
            </span>
            <div className="text-xl font-black text-emerald-400 font-mono">
              {((aiConfidenceScore || topPrediction.probability) * 100).toFixed(1)}%
            </div>
            <div className="w-24 h-2.5 bg-[#0C121E] rounded-full p-0.5 border border-white/10 mt-1 shadow-inner">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${gaugeGradient} transition-all duration-500`}
                style={{ width: `${Math.min(100, (aiConfidenceScore || topPrediction.probability) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Detected AI Anomalies Tags */}
        {detectedAnomalies.length > 0 && (
          <div className="my-3 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
              <Activity className="w-3 h-3 text-amber-400" />
              Anomali Spektral Terdeteksi:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {detectedAnomalies.map((ano, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg bg-black/40 text-[10px] font-bold text-amber-300 border border-amber-500/30"
                >
                  ⚡ {ano}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Teachable Machine / AI Probabilities Breakdown */}
        {predictions && predictions.length > 0 && (
          <div className="space-y-2 mt-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                Distribusi Probabilitas Model
              </span>
              <span>Skor</span>
            </div>

            <div className="space-y-1.5">
              {predictions.map((pred, idx) => {
                const pct = (pred.probability * 100).toFixed(1);
                const isTop = pred.className === topPrediction.className;

                return (
                  <div
                    key={idx}
                    className={`p-2 rounded-xl transition-all ${
                      isTop
                        ? 'bg-[#0C121E] border border-white/20'
                        : 'bg-[#0C121E]/60 border border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={`font-bold ${isTop ? 'text-white' : 'text-slate-400'}`}>
                        {pred.className}
                      </span>
                      <span className={`font-mono font-extrabold ${isTop ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isTop ? 'bg-emerald-400' : 'bg-slate-600'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Secondary Metrics: Visibility & Lux */}
      <div className="grid grid-cols-2 gap-3">
        <div className="clay-card-base p-4 flex flex-col justify-between bg-[#161F30]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Jarak Pandang</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">
              {metadata.visibilityKm} <span className="text-xs font-medium text-slate-400">km</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {metadata.visibilityKm > 15 ? 'Cakrawala Bersih' : 'Hamburan Aerosol'}
            </span>
          </div>
        </div>

        <div className="clay-card-base p-4 flex flex-col justify-between bg-[#161F30]">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">{isDay ? 'Lux Matahari' : 'Pencahayaan Liar'}</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">
              {metadata.estimatedLux} <span className="text-xs font-medium text-slate-400">lx</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {isDay ? 'Radiasi Siang Hari' : metadata.estimatedLux > 20 ? 'Limpahan Silau' : 'Kegelapan Alami'}
            </span>
          </div>
        </div>
      </div>

      {/* Environmental & Wildlife Tips */}
      <div className="clay-card-base p-4 space-y-3 bg-[#161F30]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span className="font-black text-xs uppercase tracking-wider text-white">
              Dampak Ekologis & Fauna
            </span>
          </div>
          <span className={badgeClass}>
            Tingkat Risiko: {metadata.severity}
          </span>
        </div>

        {/* Fauna & Health Impact */}
        <div className="clay-inset-well p-3 text-xs space-y-1">
          <span className="font-bold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Kesehatan & Navigasi Satwa
          </span>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            {metadata.faunaHealthImpact}
          </p>
        </div>

        {/* Actionable Eco Tip */}
        <div className="clay-inset-well p-3 text-xs space-y-1">
          <span className="font-bold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Tindakan Mitigasi yang Disarankan
          </span>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            {metadata.ecoTip}
          </p>
        </div>
      </div>

      {/* Consult AI Copilot Banner */}
      {onConsultAI && (
        <button
          onClick={() => onConsultAI(scan)}
          className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-900/60 via-[#142823] to-[#161F30] border border-emerald-500/50 flex items-center justify-between text-left group hover:border-emerald-400 active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(16,185,129,0.2)]"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-white flex items-center gap-1.5">
                <span>Konsultasikan Hasil Ini dengan AI Copilot</span>
                <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
              </p>
              <p className="text-[10px] text-emerald-300/80">Tanyakan solusi mitigasi atau dampak satwa spesifik lokasi ini</p>
            </div>
          </div>
        </button>
      )}

      {/* Bottom Actions */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {onExploreMap && (
          <button
            onClick={onExploreMap}
            className="clay-btn-slate py-3 px-4 text-xs flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Lihat di Peta</span>
          </button>
        )}

        {onSimulatePolicy && (
          <button
            onClick={onSimulatePolicy}
            className="clay-btn-mint py-3 px-4 text-xs flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simulasi Kebijakan</span>
          </button>
        )}
      </div>
    </div>
  );
};

