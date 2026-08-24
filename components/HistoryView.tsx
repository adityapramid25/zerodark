'use client';

import React, { useState } from 'react';
import { ScanRecord } from '@/types/environmental';
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
  ExternalLink,
  Zap
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

  const translateCategory = (cat: string) => {
    return cat
      .replace(/Good/gi, 'Baik')
      .replace(/Pristine Air/gi, 'Udara Sangat Bersih')
      .replace(/Moderate/gi, 'Sedang')
      .replace(/Sensitive/gi, 'Sensitif')
      .replace(/Unhealthy/gi, 'Tidak Sehat')
      .replace(/Smog Alert/gi, 'Peringatan Asap')
      .replace(/Truly Dark Sky/gi, 'Langit Sangat Gelap')
      .replace(/Typical/gi, 'Khas')
      .replace(/Suburban Skyglow/gi, 'Pijar Langit Pinggiran Kota')
      .replace(/Suburban/gi, 'Pinggiran Kota')
      .replace(/Inner-City Skyglow/gi, 'Pijar Langit Dalam Kota')
      .replace(/Inner-City/gi, 'Dalam Kota')
      .replace(/Rural\/Suburban Transition/gi, 'Transisi Pedesaan/Pinggiran Kota');
  };

  const filteredScans = scans.filter((item) => {
    const matchesSearch = 
      item.coordinates.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.analysis.primaryMetric.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterMode === 'day') return item.analysis.mode === 'day_air_pollution';
    if (filterMode === 'night') return item.analysis.mode === 'night_light_pollution';
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
    downloadAnchor.setAttribute('download', `zerodark-eco-scans-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* Header with Search and Export */}
      <div className="clay-card p-4 bg-[#111827] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#151D2A] border border-white/10 flex items-center justify-center">
              <History className="w-4 h-4 text-[#DCFD8B]" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">Log Pemindaian Atmosfer</h2>
              <p className="text-[10px] text-slate-400 font-medium">
                {scans.length} Catatan Lokal Terenkripsi
              </p>
            </div>
          </div>

          <button
            onClick={handleExportJson}
            disabled={scans.length === 0}
            className="clay-button clay-button-slate py-1.5 px-2.5 text-[11px] font-bold flex items-center gap-1.5 active:scale-95 disabled:opacity-40"
            title="Ekspor semua pemindaian ke JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#DCFD8B]" />
            <span>Ekspor</span>
          </button>
        </div>

        {/* Search Input Box */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan lokasi, AQI, Bortle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-[#0E1422] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#DCFD8B]/50 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-[#DCFD8B] text-[#0B0F19]'
                : 'bg-[#0E1422] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            Semua Riwayat ({scans.length})
          </button>
          <button
            onClick={() => setFilterMode('day')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
              filterMode === 'day'
                ? 'bg-[#DCFD8B] text-[#0B0F19]'
                : 'bg-[#0E1422] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Sun className="w-3 h-3" />
            Udara Siang
          </button>
          <button
            onClick={() => setFilterMode('night')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
              filterMode === 'night'
                ? 'bg-[#BC84EE] text-[#0B0F19]'
                : 'bg-[#0E1422] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Moon className="w-3 h-3" />
            Langit Malam
          </button>
        </div>
      </div>

      {/* Scans List */}
      {filteredScans.length === 0 ? (
        <div className="clay-card p-8 text-center space-y-3 bg-[#111827]">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#0E1422] flex items-center justify-center border border-white/10">
            <History className="w-6 h-6 text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Tidak Ada Catatan Pemindaian</p>
            <p className="text-xs text-slate-400 mt-1">
              Ambil foto lingkungan pertama Anda atau muat ulang kumpulan data demo.
            </p>
          </div>
          <button
            onClick={() => {
              resetDemoDataset();
              onRefresh();
            }}
            className="clay-button clay-button-lime py-2.5 px-4 text-xs font-bold inline-flex items-center gap-1.5 mt-2"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Muat Pemindaian Demo</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredScans.map((scan) => {
            const isNight = scan.analysis.mode === 'night_light_pollution';
            const color = scan.analysis.primaryMetric.colorHex || '#DCFD8B';

            return (
              <div
                key={scan.id}
                onClick={() => onSelectScan(scan)}
                className="clay-card-interactive clay-card p-3 bg-[#151D2A] hover:border-white/20 cursor-pointer flex items-center justify-between gap-3 group"
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
                        <Moon className="w-3 h-3 text-[#BC84EE] drop-shadow" />
                      ) : (
                        <Sun className="w-3 h-3 text-[#DCFD8B] drop-shadow" />
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
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {translateCategory(scan.analysis.primaryMetric.category)}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                      <span className="flex items-center gap-0.5">
                        <Calendar className="w-2.5 h-2.5" />
                        {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>•</span>
                      <span>Jarak Pandang: {scan.analysis.secondaryMetrics.visibilityKm}km</span>
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
                    <span className="text-sm font-black block" style={{ color }}>
                      {scan.analysis.primaryMetric.value}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 block -mt-0.5">
                      {isNight ? 'Bortle' : 'AQI'}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleDelete(e, scan.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-[#FF823A] hover:bg-[#FF823A]/10 transition-colors"
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
