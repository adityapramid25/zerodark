'use client';

import React, { useState, useEffect } from 'react';
import { AtmosphereMode, ScanRecord } from '@/types/environmental';
import { getStoredScans, resetDemoDataset } from '@/utils/storage';
import { Header } from '@/components/Header';
import { BottomNav, NavTab } from '@/components/BottomNav';
import { ScannerSheet } from '@/components/ScannerSheet';
import { AnalysisCard } from '@/components/AnalysisCard';
import { EcoMap } from '@/components/EcoMap';
import { PolicySimulator } from '@/components/PolicySimulator';
import { HistoryView } from '@/components/HistoryView';
import { Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>('scan');
  const [atmosphereMode, setAtmosphereMode] = useState<AtmosphereMode>('night_light_pollution');
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [activeScan, setActiveScan] = useState<ScanRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize scans and default atmosphere mode based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 18;
    setAtmosphereMode(isDay ? 'day_air_pollution' : 'night_light_pollution');

    const loadedScans = getStoredScans();
    setScans(loadedScans);

    const handleStorageUpdate = (e: any) => {
      if (e.detail) {
        setScans(e.detail);
      } else {
        setScans(getStoredScans());
      }
    };

    window.addEventListener('zerodark_scans_updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('zerodark_scans_updated', handleStorageUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleLoadDemoDataset = () => {
    const updated = resetDemoDataset();
    setScans(updated);
    showToast('⚡ 5 Koordinat Demo Nasional & Global Berhasil Dimuat');
  };

  const handleScanCompleted = (record: ScanRecord) => {
    setActiveScan(record);
    setScans(getStoredScans());
    showToast('✨ Pemindaian Atmosfer Berhasil Disintesis');
  };

  const handleSelectScanFromList = (record: ScanRecord) => {
    setActiveScan(record);
  };

  return (
    <main className="min-h-screen bg-[#070A11] flex items-center justify-center p-0 md:py-8">
      {/* Desktop Simulated Mobile Enclosure Device Frame */}
      <div className="w-full max-w-[460px] min-h-screen md:min-h-[890px] md:max-h-[920px] bg-[#0B0F19] md:rounded-[48px] md:border-[10px] md:border-[#1E293B] shadow-[0_25px_70px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.1)] relative flex flex-col overflow-hidden">
        
        {/* Simulated Top Speaker & Sensor Notch (visible on larger screens) */}
        <div className="hidden md:flex absolute top-0 inset-x-0 h-6 z-50 items-center justify-center pointer-events-none">
          <div className="w-28 h-4 bg-[#1E293B] rounded-b-2xl flex items-center justify-center gap-2 border-b border-white/10 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-[#070A11]" />
            <div className="w-10 h-1 bg-[#070A11] rounded-full" />
          </div>
        </div>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="absolute top-16 inset-x-4 z-50 flex justify-center pointer-events-none animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="clay-card-lime py-2 px-3.5 rounded-2xl text-[11px] font-extrabold text-[#0B0F19] flex items-center gap-2 shadow-xl bg-[#DCFD8B]">
              <CheckCircle2 className="w-4 h-4 text-[#0B0F19]" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Mobile Header Bar */}
        <Header
          currentMode={atmosphereMode}
          onToggleMode={(mode) => setAtmosphereMode(mode)}
          onLoadDemo={handleLoadDemoDataset}
        />

        {/* Scrollable Main Mobile Viewport */}
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-20">
          {/* Active Scan Detail Sheet Overlay (If currently viewing a scan record) */}
          {activeScan ? (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setActiveScan(null)}
                  className="clay-button clay-button-slate py-1.5 px-3 text-xs flex items-center gap-1.5 active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#DCFD8B]" />
                  <span>Kembali ke Pemindai</span>
                </button>
                <span className="text-[10px] text-slate-400 font-mono">
                  ID: {activeScan.id.slice(0, 12)}
                </span>
              </div>

              <AnalysisCard
                analysis={activeScan.analysis}
                location={activeScan.coordinates}
                photoUrl={activeScan.photoUrl}
                onExploreMap={() => {
                  setActiveScan(null);
                  setActiveTab('heatmap');
                }}
                onSimulatePolicy={() => {
                  setActiveScan(null);
                  setActiveTab('policy');
                }}
                onClose={() => setActiveScan(null)}
              />
            </div>
          ) : (
            <>
              {/* Tab 1: Scanner View */}
              {activeTab === 'scan' && (
                <ScannerSheet
                  currentAtmosphereMode={atmosphereMode}
                  onScanCompleted={handleScanCompleted}
                  onViewHeatmap={() => setActiveTab('heatmap')}
                />
              )}

              {/* Tab 2: Leaflet Heatmap View */}
              {activeTab === 'heatmap' && (
                <EcoMap
                  scans={scans}
                  onSelectScan={(scan) => setActiveScan(scan)}
                  onOpenScanner={() => setActiveTab('scan')}
                />
              )}

              {/* Tab 3: Policy Simulator View */}
              {activeTab === 'policy' && <PolicySimulator />}

              {/* Tab 4: Local History Logs View */}
              {activeTab === 'history' && (
                <HistoryView
                  scans={scans}
                  onSelectScan={handleSelectScanFromList}
                  onRefresh={() => setScans(getStoredScans())}
                />
              )}
            </>
          )}
        </div>

        {/* Bottom Thumb-Friendly Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={(tab) => {
            setActiveScan(null);
            setActiveTab(tab);
          }}
          scanCount={scans.length}
        />
      </div>
    </main>
  );
}
