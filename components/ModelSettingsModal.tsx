'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  RefreshCw, 
  ExternalLink, 
  Cpu, 
  AlertCircle, 
  CheckCircle2, 
  Key, 
  Layers,
  Zap,
  Bot
} from 'lucide-react';
import { 
  DEFAULT_MODEL_URL, 
  getStoredModelUrl, 
  saveStoredModelUrl,
  getStoredGeminiKey,
  saveStoredGeminiKey,
  getStoredAIEngine,
  saveStoredAIEngine,
  getStoredGeminiModel,
  saveStoredGeminiModel
} from '@/utils/storage';
import { AIEngineType } from '@/types/scan';
import { loadTeachableModel } from '@/utils/tmClassifier';

interface ModelSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onModelUpdated?: (url: string) => void;
}

export const ModelSettingsModal: React.FC<ModelSettingsModalProps> = ({
  isOpen,
  onClose,
  onModelUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'gemini' | 'tm' | 'engine'>('gemini');
  const [geminiKey, setGeminiKey] = useState<string>(getStoredGeminiKey());
  const [selectedGeminiModel, setSelectedGeminiModel] = useState<string>(getStoredGeminiModel());
  const [modelUrl, setModelUrl] = useState<string>(getStoredModelUrl());
  const [aiEngine, setAiEngine] = useState<AIEngineType>(getStoredAIEngine());

  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  if (!isOpen) return null;

  const handleTestGemini = async () => {
    setIsTesting(true);
    setTestStatus({ type: null, message: '' });

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Ping test',
          apiKey: geminiKey || undefined,
          model: selectedGeminiModel,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTestStatus({
          type: 'success',
          message: data.source === 'gemini_api'
            ? '✅ Kunci Google Gemini API valid & aktif!'
            : 'ℹ️ Berjalan dengan mode fallback AI lokal cerdas.',
        });
      } else {
        throw new Error(data.error || 'Gagal memverifikasi API Key');
      }
    } catch (err: any) {
      setTestStatus({
        type: 'error',
        message: `Gagal: ${err.message || 'Periksa API Key dan koneksi internet.'}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestTeachableMachine = async () => {
    if (!modelUrl || modelUrl.trim().length < 5) {
      setTestStatus({
        type: 'error',
        message: 'Silakan masukkan URL model Teachable Machine yang valid.',
      });
      return;
    }

    setIsTesting(true);
    setTestStatus({ type: null, message: '' });

    try {
      if (modelUrl.includes('sample-model')) {
        setTimeout(() => {
          setIsTesting(false);
          setTestStatus({
            type: 'success',
            message: 'Mode fallback cerdas lokal aktif (siap mengenali foto siang & malam).',
          });
        }, 400);
        return;
      }

      await loadTeachableModel(modelUrl);
      setIsTesting(false);
      setTestStatus({
        type: 'success',
        message: 'Model Teachable Machine Cloud berhasil dimuat & diverifikasi!',
      });
    } catch (err: any) {
      setIsTesting(false);
      setTestStatus({
        type: 'error',
        message: err.message || 'Gagal memverifikasi URL model. Periksa koneksi internet & format link.',
      });
    }
  };

  const handleSaveAll = () => {
    saveStoredGeminiKey(geminiKey);
    saveStoredGeminiModel(selectedGeminiModel);
    saveStoredModelUrl(modelUrl);
    saveStoredAIEngine(aiEngine);

    if (onModelUpdated) {
      onModelUpdated(modelUrl);
    }
    onClose();
  };

  const handleResetDefaults = () => {
    setModelUrl(DEFAULT_MODEL_URL);
    saveStoredModelUrl(DEFAULT_MODEL_URL);
    setGeminiKey('');
    saveStoredGeminiKey('');
    setAiEngine('hybrid');
    saveStoredAIEngine('hybrid');
    setSelectedGeminiModel('gemini-1.5-flash');
    saveStoredGeminiModel('gemini-1.5-flash');

    setTestStatus({
      type: 'success',
      message: 'Pengaturan AI dikembalikan ke konfigurasi default.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm clay-card-base p-5 space-y-4 relative border border-white/15 bg-[#161F30] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#0C121E] text-slate-400 hover:text-white border border-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#142823] border border-emerald-500/40 flex items-center justify-center shadow-inner">
            <Cpu className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">Pusat Integrasi AI</h3>
            <p className="text-[11px] text-slate-400">Gemini 1.5 & Teachable Machine</p>
          </div>
        </div>

        {/* Modal Navigation Sub-Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-[#0C121E] p-1 rounded-2xl border border-white/5 text-xs">
          <button
            onClick={() => {
              setActiveTab('gemini');
              setTestStatus({ type: null, message: '' });
            }}
            className={`py-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1 text-[11px] ${
              activeTab === 'gemini'
                ? 'bg-emerald-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Gemini</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('tm');
              setTestStatus({ type: null, message: '' });
            }}
            className={`py-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1 text-[11px] ${
              activeTab === 'tm'
                ? 'bg-emerald-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3 h-3" />
            <span>Teachable</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('engine');
              setTestStatus({ type: null, message: '' });
            }}
            className={`py-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1 text-[11px] ${
              activeTab === 'engine'
                ? 'bg-emerald-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Engine</span>
          </button>
        </div>

        {/* Tab 1: Gemini API Key & Model Settings */}
        {activeTab === 'gemini' && (
          <div className="space-y-3 animate-in fade-in">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                Google Gemini API Key
              </label>
              <div className="clay-inset-well p-2.5 flex items-center gap-2">
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => {
                    setGeminiKey(e.target.value);
                    setTestStatus({ type: null, message: '' });
                  }}
                  placeholder="AIzaSy... (Opsional, fallback otomatis aktif)"
                  className="w-full bg-transparent text-xs text-white placeholder-slate-500 font-mono outline-none"
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Digunakan untuk analisis foto multi-modal dan Asisten AI Eco-Copilot. Dapatkan di{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-bold"
                >
                  Google AI Studio
                </a>.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                Pilihan Model Gemini
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGeminiModel('gemini-1.5-flash')}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    selectedGeminiModel === 'gemini-1.5-flash'
                      ? 'bg-[#142823] border-emerald-500/50 text-white'
                      : 'bg-[#0C121E] border-white/10 text-slate-400'
                  }`}
                >
                  <p className="text-[11px] font-black">1.5 Flash (Cepat)</p>
                  <p className="text-[9px] text-slate-400">Rekomendasi real-time</p>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGeminiModel('gemini-1.5-pro')}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    selectedGeminiModel === 'gemini-1.5-pro'
                      ? 'bg-[#142823] border-emerald-500/50 text-white'
                      : 'bg-[#0C121E] border-white/10 text-slate-400'
                  }`}
                >
                  <p className="text-[11px] font-black">1.5 Pro (Mendalam)</p>
                  <p className="text-[9px] text-slate-400">Analisis penalaran detail</p>
                </button>
              </div>
            </div>

            <button
              onClick={handleTestGemini}
              disabled={isTesting}
              className="w-full clay-btn-slate py-2 text-xs flex items-center justify-center gap-1.5"
            >
              {isTesting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>Uji Koneksi Gemini AI</span>
            </button>
          </div>
        )}

        {/* Tab 2: Teachable Machine Cloud Model */}
        {activeTab === 'tm' && (
          <div className="space-y-3 animate-in fade-in">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                Cloud Model Endpoint URL
              </label>
              <div className="clay-inset-well p-2.5 flex items-center gap-2">
                <input
                  type="url"
                  value={modelUrl}
                  onChange={(e) => {
                    setModelUrl(e.target.value);
                    setTestStatus({ type: null, message: '' });
                  }}
                  placeholder="https://teachablemachine.withgoogle.com/models/xyz/"
                  className="w-full bg-transparent text-xs text-white placeholder-slate-500 font-mono outline-none"
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Tempel link ekspor model Teachable Machine Anda sebagai{' '}
                <span className="text-emerald-400 font-bold">Tensorflow.js / Upload link</span>.
              </p>
            </div>

            <button
              onClick={handleTestTeachableMachine}
              disabled={isTesting}
              className="w-full clay-btn-slate py-2 text-xs flex items-center justify-center gap-1.5"
            >
              {isTesting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>Uji Endpoint Teachable Machine</span>
            </button>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span>Latih model sendiri:</span>
              <a
                href="https://teachablemachine.withgoogle.com/train/image"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
              >
                <span>Teachable Machine</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Tab 3: Preferred AI Engine Selector */}
        {activeTab === 'engine' && (
          <div className="space-y-2.5 animate-in fade-in">
            <label className="text-xs font-bold text-slate-300 block">
              Pilih Engine AI Utama Saat Pemindaian:
            </label>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setAiEngine('hybrid')}
                className={`w-full p-3 rounded-2xl text-left border transition-all flex items-start gap-2.5 ${
                  aiEngine === 'hybrid'
                    ? 'bg-[#142823] border-emerald-500 text-white shadow-md'
                    : 'bg-[#0C121E] border-white/10 text-slate-400'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-white">⚡ Dual-AI Hybrid (Rekomendasi)</p>
                  <p className="text-[10px] text-slate-400 leading-snug mt-0.5">
                    Klasifikasi instan via Teachable Machine Edge + Diagnostik mendalam via Gemini Multi-Modal Vision.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAiEngine('gemini')}
                className={`w-full p-3 rounded-2xl text-left border transition-all flex items-start gap-2.5 ${
                  aiEngine === 'gemini'
                    ? 'bg-[#142823] border-emerald-500 text-white shadow-md'
                    : 'bg-[#0C121E] border-white/10 text-slate-400'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-white">✨ Google Gemini 1.5 Vision</p>
                  <p className="text-[10px] text-slate-400 leading-snug mt-0.5">
                    Penalaran spektral atmosferik komprehensif, deteksi anomali partikulat, dan rekomendasi satwa.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAiEngine('teachable_machine')}
                className={`w-full p-3 rounded-2xl text-left border transition-all flex items-start gap-2.5 ${
                  aiEngine === 'teachable_machine'
                    ? 'bg-[#142823] border-emerald-500 text-white shadow-md'
                    : 'bg-[#0C121E] border-white/10 text-slate-400'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-white">🧠 Google Teachable Machine</p>
                  <p className="text-[10px] text-slate-400 leading-snug mt-0.5">
                    Inferensi on-device cepat dengan visualisasi distribusi probabilitas kelas.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Status indicator message */}
        {testStatus.type && (
          <div
            className={`p-2.5 rounded-xl text-xs flex items-start gap-2 ${
              testStatus.type === 'success'
                ? 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-300'
                : 'bg-red-950/50 border border-red-500/40 text-red-300'
            }`}
          >
            {testStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <span className="leading-snug">{testStatus.message}</span>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="space-y-2 pt-1 border-t border-white/5">
          <button
            onClick={handleSaveAll}
            className="w-full clay-btn-mint py-3 px-3 text-xs font-black flex items-center justify-center gap-2 shadow-lg"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Semua Pengaturan AI</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="w-full text-center text-[10px] text-slate-400 hover:text-slate-200 py-1"
          >
            Kembalikan ke Pengaturan Default
          </button>
        </div>
      </div>
    </div>
  );
};

