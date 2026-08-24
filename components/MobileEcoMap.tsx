'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ScanRecord } from '@/types/scan';
import { 
  MapPin, 
  Layers, 
  Sun, 
  Moon, 
  X, 
  Sparkles,
  Compass,
  Eye,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface MobileEcoMapProps {
  scans: ScanRecord[];
  onSelectScan?: (scan: ScanRecord) => void;
  onOpenScanner?: () => void;
}

export const MobileEcoMap: React.FC<MobileEcoMapProps> = ({
  scans,
  onSelectScan,
  onOpenScanner,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'day' | 'night'>('all');
  const [selectedScan, setSelectedScan] = useState<ScanRecord | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredScans = scans.filter((s) => {
    if (filterMode === 'day') return s.mode === 'day_air_pollution';
    if (filterMode === 'night') return s.mode === 'night_light_pollution';
    return true;
  });

  return (
    <div className="space-y-3 pb-24 animate-in fade-in duration-300">
      {/* Map Control Clay Header */}
      <div className="clay-card-base p-3 flex items-center justify-between gap-2 bg-[#161F30]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#142823] border border-emerald-500/40 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xs font-black text-white">Peta Panas Dual-Atmosfer</h2>
            <p className="text-[10px] text-slate-400 font-medium">
              {filteredScans.length} Titik Geo-Spasial Aktif
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-[#0C121E] p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterMode('day')}
            className={`px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
              filterMode === 'day'
                ? 'bg-emerald-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3 h-3" />
            Siang
          </button>
          <button
            onClick={() => setFilterMode('night')}
            className={`px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
              filterMode === 'night'
                ? 'bg-amber-400 text-slate-950 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className="w-3 h-3" />
            Malam
          </button>
        </div>
      </div>

      {/* Map Viewport Frame */}
      <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border-2 border-white/10 shadow-[8px_8px_16px_#070a10,-8px_-8px_16px_#212e46,inset_2px_2px_4px_rgba(255,255,255,0.1),inset_-2px_-2px_4px_rgba(0,0,0,0.4)] bg-[#0B0F17]">
        {isMounted ? (
          <LeafletMapInner
            scans={filteredScans}
            onPinClick={(scan) => setSelectedScan(scan)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#161F30] flex items-center justify-center animate-spin">
              <Layers className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-xs text-slate-400 font-mono">Menginisialisasi Kisi Spasial...</p>
          </div>
        )}

        {/* Floating Clay Legend */}
        <div className="absolute top-3 left-3 z-[400] bg-[#161F30]/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/10 text-[10px] space-y-1.5 shadow-lg">
          <span className="font-extrabold text-white block uppercase tracking-wider text-[9px]">
            Legenda Kualitas
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
            <span className="text-slate-300 font-medium">Bersih (AQI 0-50 / Bortle 1-3)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#F59E0B]" />
            <span className="text-slate-300 font-medium">Sedang (AQI 51-100 / Bortle 4-6)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_6px_#EF4444]" />
            <span className="text-slate-300 font-medium">Tinggi (AQI 150+ / Bortle 7-9)</span>
          </div>
        </div>

        {/* Selected Pin Bottom Sheet Card */}
        {selectedScan && (
          <div className="absolute bottom-3 inset-x-3 z-[500] clay-card-base p-3.5 bg-[#161F30]/95 backdrop-blur-xl border-2 border-white/20 animate-in slide-in-from-bottom-5 duration-200 shadow-2xl">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedScan.photoUrl}
                  alt="Scan thumbnail"
                  className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0 bg-black"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: selectedScan.metadata.colorHex }}
                    />
                    <span className="text-xs font-bold text-white line-clamp-1">
                      {selectedScan.coordinates.locationName}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-base font-black text-white">
                      {selectedScan.metadata.metricValue}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {selectedScan.metadata.metricUnit}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold ml-1">
                      • {selectedScan.topPrediction.className}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedScan(null)}
                className="p-1 rounded-full bg-[#0C121E] text-slate-400 hover:text-white border border-white/10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-slate-300 leading-snug line-clamp-2 bg-[#0C121E]/70 p-2 rounded-xl border border-white/5 mb-3">
              {selectedScan.metadata.statusText}: {selectedScan.metadata.ecoTip}
            </p>

            <div className="flex items-center gap-2">
              {onSelectScan && (
                <button
                  onClick={() => onSelectScan(selectedScan)}
                  className="w-full clay-btn-mint py-2 text-xs font-black flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Periksa Diagnostik 3D Lengkap</span>
                  <ChevronRight className="w-3.5 h-3.5" />
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
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    // Dynamically import Leaflet in client environment
    import('leaflet').then((L) => {
      if (!leafletInstanceRef.current && mapRef.current) {
        const map = L.map(mapRef.current, {
          center: [-7.250444, 110.1], // Central Java archipelago baseline
          zoom: 6,
          zoomControl: false,
        });

        // Dark-mode carto voyager tile layer
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
        const color = scan.metadata?.colorHex || '#10B981';

        const customIcon = L.divIcon({
          className: 'custom-clay-pin',
          html: `
            <div style="
              width: 38px;
              height: 38px;
              border-radius: 50%;
              background: #161F30;
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
              <span>${scan.metadata?.metricValue || 0}</span>
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
