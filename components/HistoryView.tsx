'use client';

import React, { useState } from 'react';
import { ScanRecord } from '@/types/scan';
import { 
  History, 
  Trash2, 
  Download, 
  Sun, 
  Moon, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Search, 
  Cpu, 
  Zap,
  ChevronRight
} from 'lucide-react';
import { deleteScanRecord, resetDemoDataset } from '@/utils/storage';

interface HistoryViewProps {
  scans: ScanRecord[];
  onSelectScan: (scan: ScanRecord) => void;
  onRefresh: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  scans,
  onSelectScan,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'day' | 'night'>('all');

  const filteredScans = scans.filter((item) => {
    const matchesSearch = 
      item.coordinates.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topPrediction.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.metadata.statusText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterMode === 'day') return item.mode === 'day_air_pollution';
    if (filterMode === 'night') return item.mode === 'night_light_pollution';
    return true;
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteScanRecord(id);
    onRefresh();
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scans, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `zerodark-tm-scans-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-3 pb-24 animate-in fade-in duration-300">
      {/* Header with Search and Export */}
      <div className="clay-card-base p-4 bg-[#161F30] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0C121E] border border-white/10 flex items-center justify-center">
              <History className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">Log Pemindaian Teachable Machine</h2>
              <p className="text-[10px] text-slate-400 font-medium">
                {scans.length} Catatan Tersimpan di Perangkat (LocalStorage)
              </p>
            </div>
          </div>

          <button
            onClick={handleExportJson}
            disabled={scans.length === 0}
            className="clay-btn-slate py-1.5 px-2.5 text-[11px] font-bold flex items-center gap-1.5 active:scale-95 disabled:opacity-40"
            title="Ekspor semua pemindaian ke JSON"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ekspor</span>
          </button>
        </div>

        {/* Search Input Box */}
        <div className="clay-inset-well p-2 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400 ml-1" />
          <input
            type="text"
            placeholder="Cari lokasi, kelas Teachable Machine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-emerald-500 text-slate-950 font-black'
                : 'bg-[#0C121E] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            Semua ({scans.length})
          </button>
          <button
            onClick={() => setFilterMode('day')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
              filterMode === 'day'
                ? 'bg-emerald-500 text-slate-950 font-black'
                : 'bg-[#0C121E] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Sun className="w-3 h-3" />
            Siang
          </button>
          <button
            onClick={() => setFilterMode('night')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
              filterMode === 'night'
                ? 'bg-amber-400 text-slate-950 font-black'
                : 'bg-[#0C121E] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Moon className="w-3 h-3" />
            Malam
          </button>
        </div>
      </div>

      {/* Scans List */}
      {filteredScans.length === 0 ? (
        <div className="clay-card-base p-8 text-center space-y-3 bg-[#161F30]">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#0C121E] flex items-center justify-center border border-white/10">
            <History className="w-6 h-6 text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Tidak Ada Catatan Pemindaian</p>
            <p className="text-xs text-slate-400 mt-1">
              Ambil foto lingkungan pertama Anda atau muat dataset kompetisi.
            </p>
          </div>
          <button
            onClick={() => {
              resetDemoDataset();
              onRefresh();
            }}
            className="clay-btn-mint py-2.5 px-4 text-xs font-bold inline-flex items-center gap-1.5 mt-2"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Muat Dataset Demo Kompetisi</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredScans.map((scan) => {
            const isNight = scan.mode === 'night_light_pollution';
            const color = scan.metadata.colorHex || '#10B981';

            return (
              <div
                key={scan.id}
                onClick={() => onSelectScan(scan)}
                className="clay-card-base p-3 bg-[#161F30] hover:border-white/20 cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Photo thumbnail */}
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/15 shrink-0 bg-black">
                    <img
                      src={scan.photoUrl}
                      alt="Scan"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-1 left-1">
                      {isNight ? (
                        <Moon className="w-3 h-3 text-amber-400 drop-shadow" />
                      ) : (
                        <Sun className="w-3 h-3 text-emerald-400 drop-shadow" />
                      )}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-white truncate">
                        {scan.coordinates.locationName}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-bold truncate mt-0.5">
                      {scan.topPrediction.className}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                      <span className="flex items-center gap-0.5">
                        <Calendar className="w-2.5 h-2.5" />
                        {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {(scan.topPrediction.probability * 100).toFixed(1)}% AI
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Pill & Delete */}
                <div className="flex items-center gap-2 shrink-0">
                  <div
                    className="px-2.5 py-1 rounded-xl text-center border"
                    style={{
                      backgroundColor: `${color}15`,
                      borderColor: `${color}40`,
                    }}
                  >
                    <span className="text-sm font-black block font-mono" style={{ color }}>
                      {scan.metadata.metricValue}
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 block -mt-0.5 uppercase">
                      {isNight ? 'Bortle' : 'AQI'}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleDelete(e, scan.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    title="Hapus Catatan Pemindaian"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
