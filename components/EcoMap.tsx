'use client';

import React, { useState, useEffect } from 'react';
import { ScanRecord } from '@/types/environmental';
import { 
  MapPin, 
  Layers, 
  Sun, 
  Moon, 
  Navigation2, 
  ExternalLink, 
  X, 
  Sparkles,
  Wind,
  Eye
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface EcoMapProps {
  scans: ScanRecord[];
  onSelectScan?: (scan: ScanRecord) => void;
  onOpenScanner?: () => void;
}

export const EcoMap: React.FC<EcoMapProps> = ({ scans, onSelectScan, onOpenScanner }) => {
  const [filterMode, setFilterMode] = useState<'all' | 'day' | 'night'>('all');
  const [selectedScan, setSelectedScan] = useState<ScanRecord | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredScans = scans.filter((s) => {
    if (filterMode === 'day') return s.analysis.mode === 'day_air_pollution';
    if (filterMode === 'night') return s.analysis.mode === 'night_light_pollution';
    return true;
  });

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* Map Control Header Bar */}
      <div className="clay-card p-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#1C2B20] border border-[#DCFD8B]/40 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-[#DCFD8B]" />
          </div>
          <div>
            <h2 className="text-xs font-black text-white">Atmosphere Heatmap</h2>
            <p className="text-[10px] text-slate-400 font-medium">
              {filteredScans.length} Spatial Geo-Points
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-[#0E1422] p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-[#DCFD8B] text-[#0B0F19]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterMode('day')}
            className={`px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
              filterMode === 'day'
                ? 'bg-[#DCFD8B] text-[#0B0F19]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3 h-3" />
            Air
          </button>
          <button
            onClick={() => setFilterMode('night')}
            className={`px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
              filterMode === 'night'
                ? 'bg-[#BC84EE] text-[#0B0F19]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className="w-3 h-3" />
            Dark Sky
          </button>
        </div>
      </div>

      {/* Map Container Frame */}
      <div className="relative w-full aspect-[4/5] rounded-[28px] overflow-hidden border-2 border-white/10 shadow-[inset_0_2px_8px_rgba(255,255,255,0.1),0_12px_32px_rgba(0,0,0,0.6)] bg-[#0B0F19]">
        {isMounted ? (
          <LeafletMapInner
            scans={filteredScans}
            onPinClick={(scan) => setSelectedScan(scan)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#151D2A] flex items-center justify-center animate-spin">
              <Layers className="w-5 h-5 text-[#DCFD8B]" />
            </div>
            <p className="text-xs text-slate-400 font-mono">Initializing Spatial Grid...</p>
          </div>
        )}

        {/* Legend Overlay */}
        <div className="absolute top-3 left-3 z-[400] bg-[#111827]/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/10 text-[10px] space-y-1.5 shadow-lg">
          <span className="font-extrabold text-white block uppercase tracking-wider text-[9px]">
            Atmospheric Legend
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DCFD8B] shadow-[0_0_6px_#DCFD8B]" />
            <span className="text-slate-300 font-medium">Clean Air / Bortle 1-3</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#BC84EE] shadow-[0_0_6px_#BC84EE]" />
            <span className="text-slate-300 font-medium">Moderate / Skyglow 4-6</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF823A] shadow-[0_0_6px_#FF823A]" />
            <span className="text-slate-300 font-medium">Unhealthy / Glare 7-9</span>
          </div>
        </div>

        {/* Selected Pin Bottom Sheet Card */}
        {selectedScan && (
          <div className="absolute bottom-3 inset-x-3 z-[500] clay-card p-3.5 bg-[#151D2A]/95 backdrop-blur-xl border-2 border-white/20 animate-in slide-in-from-bottom-5 duration-200 shadow-2xl">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedScan.photoUrl}
                  alt="Scan thumbnail"
                  className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: selectedScan.analysis.primaryMetric.colorHex }}
                    />
                    <span className="text-xs font-bold text-white line-clamp-1">
                      {selectedScan.coordinates.locationName}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-base font-black text-white">
                      {selectedScan.analysis.primaryMetric.value}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {selectedScan.analysis.primaryMetric.label}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedScan(null)}
                className="p-1 rounded-full bg-[#0E1422] text-slate-400 hover:text-white border border-white/10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-slate-300 leading-snug line-clamp-2 bg-[#0E1422]/60 p-2 rounded-xl border border-white/5 mb-3">
              {selectedScan.analysis.summaryDescription || selectedScan.analysis.environmentalImpact.healthRecommendation}
            </p>

            <div className="flex items-center gap-2">
              {onSelectScan && (
                <button
                  onClick={() => onSelectScan(selectedScan)}
                  className="w-full clay-button clay-button-lime py-2 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Inspect Full Diagnostics</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Internal dynamic leaflet wrapper component
const LeafletMapInner: React.FC<{
  scans: ScanRecord[];
  onPinClick: (scan: ScanRecord) => void;
}> = ({ scans, onPinClick }) => {
  const mapRef = React.useRef<HTMLDivElement | null>(null);
  const leafletInstanceRef = React.useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    // Dynamically import Leaflet in client environment
    import('leaflet').then((L) => {
      if (!leafletInstanceRef.current && mapRef.current) {
        const map = L.map(mapRef.current, {
          center: [-7.250444, 110.1], // Central Java archipelago baseline
          zoom: 7,
          zoomControl: false,
        });

        // Dark matter styled tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap',
          maxZoom: 18,
        }).addTo(map);

        leafletInstanceRef.current = map;
      }

      const map = leafletInstanceRef.current;
      if (!map) return;

      // Clear existing markers
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Add custom 3D clay pins
      scans.forEach((scan) => {
        const color = scan.analysis.primaryMetric.colorHex || '#DCFD8B';
        const isNight = scan.analysis.mode === 'night_light_pollution';

        const customIcon = L.divIcon({
          className: 'custom-clay-pin',
          html: `
            <div style="
              width: 38px;
              height: 38px;
              border-radius: 50%;
              background: #151D2A;
              border: 3px solid ${color};
              box-shadow: 0 0 14px ${color}80, inset -2px -2px 6px rgba(0,0,0,0.8), inset 2px 2px 6px rgba(255,255,255,0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: 'Plus Jakarta Sans', sans-serif;
              font-weight: 900;
              font-size: 11px;
              color: #FFFFFF;
              cursor: pointer;
              transform: translate(-50%, -50%);
              transition: transform 0.15s ease;
            ">
              <span>${scan.analysis.primaryMetric.value}</span>
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        });

        const marker = L.marker([scan.coordinates.lat, scan.coordinates.lng], {
          icon: customIcon,
        }).addTo(map);

        marker.on('click', () => {
          onPinClick(scan);
        });
      });
    });

    return () => {
      // Map cleanup on unmount
    };
  }, [scans, onPinClick]);

  return <div ref={mapRef} className="w-full h-full" />;
};
