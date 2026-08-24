'use client';

import React, { useState, useEffect } from 'react';
import { AtmosphereMode, ScanRecord } from '@/types/scan';
import { getStoredScans, resetDemoDataset } from '@/utils/storage';
import { Header } from '@/components/Header';
import { BottomNav, NavTab } from '@/components/BottomNav';
import { ScannerClay } from '@/components/ScannerClay';
import { ResultCardClay } from '@/components/ResultCardClay';
import { MobileEcoMap } from '@/components/MobileEcoMap';
import { PolicySimulatorClay } from '@/components/PolicySimulatorClay';
import { HistoryView } from '@/components/HistoryView';
import { AICopilotView } from '@/components/AICopilotView';
import { ModelSettingsModal } from '@/components/ModelSettingsModal';
import { Sparkles, ArrowLeft, CheckCircle2, Zap } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>('scan');
  const [atmosphereMode, setAtmosphereMode] = useState<AtmosphereMode>('night_light_pollution');
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [activeScan, setActiveScan] = useState<ScanRecord | null>(null);
  const [copilotScanContext, setCopilotScanContext] = useState<ScanRecord | null>(null);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
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
    showToast('⚡ Dataset Demo Kompetisi Berhasil Dimuat');
  };

  const handleScanCompleted = (record: ScanRecord) => {
    setActiveScan(record);
    setScans(getStoredScans());
    showToast('✨ Analisis AI Selesai');
  };

  const handleSelectScanFromList = (record: ScanRecord) => {
    setActiveScan(record);
  };

  const handleConsultAI = (scan: ScanRecord) => {
    setCopilotScanContext(scan);
    setActiveScan(null);
    setActiveTab('copilot');
  };

  return (
    <main className="min-h-screen bg-[#070A10] flex items-center justify-center p-0 md:py-6">
      {/* Mobile-First Device Enclosure Container */}
      <div className="w-full max-w-md min-h-screen md:min-h-[860px] md:max-h-[900px] bg-[#0B0F17] md:rounded-[44px] md:border-8 md:border-[#1E2B40] shadow-[0_25px_70px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.1)] relative flex flex-col overflow-hidden">
        
        {/* Simulated Top Notch/Ear Speaker for Desktop View */}
        <div className="hidden md:flex absolute top-0 inset-x-0 h-5 z-50 items-center justify-center pointer-events-none">
          <div className="w-24 h-3.5 bg-[#1E2B40] rounded-b-xl flex items-center justify-center gap-1.5 border-b border-white/10 shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-[#070A10]" />
            <div className="w-8 h-1 bg-[#070A10] rounded-full" />
          </div>
        </div>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="absolute top-16 inset-x-4 z-50 flex justify-center pointer-events-none animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="clay-badge-green py-2 px-3.5 rounded-2xl text-[11px] font-black text-emerald-300 flex items-center gap-2 shadow-2xl bg-[#142823] border border-emerald-500/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Mobile Header Bar */}
        <Header
          currentMode={atmosphereMode}
          onToggleMode={(mode) => setAtmosphereMode(mode)}
          onLoadDemo={handleLoadDemoDataset}
          onOpenModelSettings={() => setIsModelModalOpen(true)}
        />

        {/* Scrollable Main Mobile Viewport */}
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-20">
          {/* Active Scan Detail Sheet Overlay (If currently viewing a scan result) */}
          {activeScan ? (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setActiveScan(null)}
                  className="clay-btn-slate py-1.5 px-3 text-xs flex items-center gap-1.5 active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kembali ke Pemindai</span>
                </button>
                <span className="text-[10px] text-slate-400 font-mono">
                  ID: {activeScan.id.slice(0, 10)}
                </span>
              </div>

              <ResultCardClay
                scan={activeScan}
                onExploreMap={() => {
                  setActiveScan(null);
                  setActiveTab('heatmap');
                }}
                onSimulatePolicy={() => {
                  setActiveScan(null);
                  setActiveTab('policy');
                }}
                onConsultAI={handleConsultAI}
                onClose={() => setActiveScan(null)}
              />
            </div>
          ) : (
            <>
              {/* Tab 1: Scanner View */}
              {activeTab === 'scan' && (
                <ScannerClay
                  currentAtmosphereMode={atmosphereMode}
                  onScanCompleted={handleScanCompleted}
                  onOpenModelSettings={() => setIsModelModalOpen(true)}
                  onViewHeatmap={() => setActiveTab('heatmap')}
                />
              )}

              {/* Tab 2: Leaflet Mobile Heatmap View */}
              {activeTab === 'heatmap' && (
                <MobileEcoMap
                  scans={scans}
                  onSelectScan={(scan) => setActiveScan(scan)}
                  onOpenScanner={() => setActiveTab('scan')}
                />
              )}

              {/* Tab 3: Policy Simulator View */}
              {activeTab === 'policy' && <PolicySimulatorClay />}

              {/* Tab 4: AI Eco-Copilot View */}
              {activeTab === 'copilot' && (
                <AICopilotView
                  initialScanContext={copilotScanContext}
                  onOpenModelSettings={() => setIsModelModalOpen(true)}
                  onNavigateToTab={(tab) => {
                    setActiveScan(null);
                    setActiveTab(tab);
                  }}
                />
              )}

              {/* Tab 5: Local History Logs View */}
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

        {/* Floating Clay Dock Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={(tab) => {
            setActiveScan(null);
            setActiveTab(tab);
          }}
          scanCount={scans.length}
        />

        {/* AI Integration & Model Settings Modal */}
        <ModelSettingsModal
          isOpen={isModelModalOpen}
          onClose={() => setIsModelModalOpen(false)}
          onModelUpdated={(url) => {
            showToast('Konfigurasi AI Diperbarui');
          }}
        />
      </div>
    </main>
  );
}

