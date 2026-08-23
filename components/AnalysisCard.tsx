'use client';

import React from 'react';
import { 
  Wind, 
  Moon, 
  Eye, 
  Sun, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  Share2, 
  Check, 
  Compass, 
  Leaf,
  Info
} from 'lucide-react';
import { AnalysisResult, GeoLocation } from '@/types/environmental';

interface AnalysisCardProps {
  analysis: AnalysisResult;
  location?: GeoLocation;
  photoUrl?: string;
  onExploreMap?: () => void;
  onSimulatePolicy?: () => void;
  onClose?: () => void;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({
  analysis,
  location,
  photoUrl,
  onExploreMap,
  onSimulatePolicy,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);
  const isDay = analysis.mode === 'day_air_pollution';
  const { primaryMetric, secondaryMetrics, environmentalImpact } = analysis;

  // Determine Clay style class based on colorHex or category severity
  let clayCardTheme = 'clay-card';
  let badgeColorClass = 'text-[#DCFD8B] bg-[#1C2B20] border-[#DCFD8B]/40';
  let gaugeGradient = 'from-[#DCFD8B] to-[#72B01D]';

  if (primaryMetric.colorHex === '#FF823A' || primaryMetric.value > 150 || (!isDay && primaryMetric.value >= 7)) {
    clayCardTheme = 'clay-card-orange';
    badgeColorClass = 'text-[#FF823A] bg-[#2B1D18] border-[#FF823A]/40';
    gaugeGradient = 'from-[#FF823A] to-[#D84A00]';
  } else if (primaryMetric.colorHex === '#BC84EE' || primaryMetric.value > 50 || (!isDay && primaryMetric.value >= 4)) {
    clayCardTheme = 'clay-card-purple';
    badgeColorClass = 'text-[#BC84EE] bg-[#251C33] border-[#BC84EE]/40';
    gaugeGradient = 'from-[#BC84EE] to-[#7934BD]';
  } else {
    clayCardTheme = 'clay-card-lime';
    badgeColorClass = 'text-[#DCFD8B] bg-[#1C2B20] border-[#DCFD8B]/40';
    gaugeGradient = 'from-[#DCFD8B] to-[#6AA115]';
  }

  const handleShare = async () => {
    const text = `ZeroDark Eco-Scan: ${primaryMetric.label} ${primaryMetric.value} (${primaryMetric.category}) at ${location?.locationName || 'Current Location'}. #ZeroDark #CleanSky`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ZeroDark Environmental Scan',
          text,
          url: window.location.href,
        });
      } catch (e) {
        // Share cancelled or unavailable
      }
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Main Claymorphic Metric Hero Card */}
      <div className={`p-5 relative overflow-hidden ${clayCardTheme}`}>
        {/* Glow halo behind */}
        <div 
          className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: primaryMetric.colorHex }}
        />

        {/* Top Header info */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`clay-badge text-[11px] ${badgeColorClass}`}>
                {isDay ? <Wind className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                {isDay ? 'Day Atmosphere' : 'Night Sky Glow'}
              </span>
              {location?.locationName && (
                <span className="text-xs text-slate-300 font-medium truncate max-w-[170px]">
                  📍 {location.locationName}
                </span>
              )}
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              {primaryMetric.label}
            </h2>
          </div>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-2xl bg-[#0E1422] border border-white/10 text-slate-300 hover:text-white active:scale-95 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] transition-transform"
            title="Share or Copy Scan Summary"
          >
            {copied ? <Check className="w-4 h-4 text-[#DCFD8B]" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Primary Big Score Gauge & Category */}
        <div className="flex items-end justify-between py-2 border-y border-white/10 my-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tight text-white drop-shadow-md">
                {primaryMetric.value}
              </span>
              <span className="text-sm font-bold text-slate-400">
                {primaryMetric.unit || (isDay ? 'AQI' : 'Class')}
              </span>
            </div>
            <p className="text-sm font-bold mt-1 text-slate-200">
              {primaryMetric.category}
            </p>
          </div>

          {/* Graphical level meter */}
          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Eco Severity
            </span>
            <div className="w-24 h-3 bg-[#0E1422] rounded-full p-0.5 border border-white/10 shadow-inner">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${gaugeGradient} transition-all duration-500`}
                style={{
                  width: isDay 
                    ? `${Math.min(100, (primaryMetric.value / 300) * 100)}%` 
                    : `${Math.min(100, (primaryMetric.value / 9) * 100)}%`
                }}
              />
            </div>
            <span className="text-[11px] font-extrabold mt-1" style={{ color: primaryMetric.colorHex }}>
              {isDay 
                ? (primaryMetric.value <= 50 ? 'Pristine' : primaryMetric.value <= 100 ? 'Acceptable' : 'Smog Elevated')
                : (primaryMetric.value <= 3 ? 'Dark Sky' : primaryMetric.value <= 6 ? 'Light Domed' : 'Severe Glare')}
            </span>
          </div>
        </div>

        {/* Summary Description */}
        {analysis.summaryDescription && (
          <p className="text-xs text-slate-300 leading-relaxed mt-2 bg-[#0E1422]/60 p-3 rounded-2xl border border-white/5">
            {analysis.summaryDescription}
          </p>
        )}
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Metric 1: Visibility */}
        <div className="clay-card p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Visibility</span>
            <Eye className="w-4 h-4 text-[#DCFD8B]" />
          </div>
          <div>
            <div className="text-xl font-black text-white">
              {secondaryMetrics.visibilityKm} <span className="text-xs font-medium text-slate-400">km</span>
            </div>
            <span className="text-[11px] text-slate-400">
              {secondaryMetrics.visibilityKm > 10 ? 'Broad Horizon' : 'Haze Scattering'}
            </span>
          </div>
        </div>

        {/* Metric 2: Estimated Lux / Ambient Light */}
        <div className="clay-card p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">{isDay ? 'Solar Lux' : 'Stray Lux'}</span>
            <Sun className="w-4 h-4 text-[#BC84EE]" />
          </div>
          <div>
            <div className="text-xl font-black text-white">
              {secondaryMetrics.estimatedLux} <span className="text-xs font-medium text-slate-400">lx</span>
            </div>
            <span className="text-[11px] text-slate-400">
              {isDay ? 'Ambient Daylight' : (secondaryMetrics.estimatedLux > 20 ? 'Excessive Spill' : 'Natural Darkness')}
            </span>
          </div>
        </div>
      </div>

      {/* Detected Anomalies Tags */}
      {secondaryMetrics.detectedAnomalies?.length > 0 && (
        <div className="clay-card p-4">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <AlertTriangle className="w-4 h-4 text-[#FF823A]" />
            <span>Detected Optical Anomalies</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {secondaryMetrics.detectedAnomalies.map((item, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-[#0E1422] border border-white/10 text-xs font-semibold text-slate-200 shadow-[inset_1px_1px_3px_rgba(255,255,255,0.1)] flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF823A]" />
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Environmental & Wildlife Impact */}
      <div className="clay-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#DCFD8B]" />
            <span className="font-bold text-sm text-white">Fauna & Health Advisory</span>
          </div>
          <span className={`clay-badge text-[10px] ${
            environmentalImpact.faunaRiskLevel === 'Critical' || environmentalImpact.faunaRiskLevel === 'High'
              ? 'text-[#FF823A] bg-[#2B1D18] border-[#FF823A]/40'
              : environmentalImpact.faunaRiskLevel === 'Moderate'
              ? 'text-[#BC84EE] bg-[#251C33] border-[#BC84EE]/40'
              : 'text-[#DCFD8B] bg-[#1C2B20] border-[#DCFD8B]/40'
          }`}>
            Risk: {environmentalImpact.faunaRiskLevel}
          </span>
        </div>

        {/* Health Recommendation */}
        <div className="bg-[#0E1422] p-3 rounded-2xl border border-white/5 text-xs space-y-1">
          <span className="font-bold text-[#DCFD8B] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Health Recommendation
          </span>
          <p className="text-slate-300 leading-relaxed">
            {environmentalImpact.healthRecommendation}
          </p>
        </div>

        {/* Actionable Eco Tip */}
        <div className="bg-[#0E1422] p-3 rounded-2xl border border-white/5 text-xs space-y-1">
          <span className="font-bold text-[#BC84EE] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Actionable Eco-Tip
          </span>
          <p className="text-slate-300 leading-relaxed">
            {environmentalImpact.actionableEcoTip}
          </p>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {onExploreMap && (
          <button
            onClick={onExploreMap}
            className="clay-button clay-button-slate py-3 px-4 text-xs flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#DCFD8B]" />
            <span>Pin to Heatmap</span>
          </button>
        )}

        {onSimulatePolicy && (
          <button
            onClick={onSimulatePolicy}
            className="clay-button clay-button-lime py-3 px-4 text-xs font-bold flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simulate Fixes</span>
          </button>
        )}
      </div>
    </div>
  );
};
