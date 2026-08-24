'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Sun, 
  Moon, 
  Crosshair, 
  RefreshCw, 
  MapPin, 
  Zap, 
  SlidersHorizontal,
  Layers,
  AlertCircle,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AtmosphereMode, GeoCoordinates, ScanRecord } from '@/types/scan';
import { saveScanRecord, getStoredModelUrl } from '@/utils/storage';
import { classifyImage, mapPredictionToMetadata } from '@/utils/tmClassifier';

interface ScannerClayProps {
  currentAtmosphereMode: AtmosphereMode;
  onScanCompleted: (record: ScanRecord) => void;
  onOpenModelSettings?: () => void;
  onViewHeatmap?: () => void;
}

// Preset samples for rapid demo testing
const DEMO_PRESETS = [
  {
    title: 'Cagar Langit Gelap Bromo (Bortle 2)',
    mode: 'night_light_pollution' as const,
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=700&auto=format&fit=crop&q=80',
    location: { lat: -7.9425, lng: 112.9530, locationName: 'Kaldera Bromo', region: 'Jawa Timur' },
  },
  {
    title: 'Smog Padat Jakarta (AQI 172)',
    mode: 'day_air_pollution' as const,
    url: 'https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=700&auto=format&fit=crop&q=80',
    location: { lat: -6.2088, lng: 106.8456, locationName: 'Sudirman Central Jakarta', region: 'DKI Jakarta' },
  },
  {
    title: 'Langit Bersih Lembang (AQI 28)',
    mode: 'day_air_pollution' as const,
    url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=700&auto=format&fit=crop&q=80',
    location: { lat: -6.8168, lng: 107.6186, locationName: 'Dataran Tinggi Lembang', region: 'Bandung' },
  },
  {
    title: 'Silau Dermaga Pelabuhan (Bortle 8)',
    mode: 'night_light_pollution' as const,
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=700&auto=format&fit=crop&q=80',
    location: { lat: -6.9666, lng: 110.4166, locationName: 'Pelabuhan Tanjung Emas', region: 'Semarang' },
  },
];

export const ScannerClay: React.FC<ScannerClayProps> = ({
  currentAtmosphereMode,
  onScanCompleted,
  onOpenModelSettings,
  onViewHeatmap,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [scanMode, setScanMode] = useState<'auto' | AtmosphereMode>('auto');
  const [userLocation, setUserLocation] = useState<GeoCoordinates>({
    lat: -6.2088,
    lng: 106.8456,
    locationName: 'Sensor Lokasi GPS',
    region: 'Perangkat Aktif',
  });
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [modelUrl, setModelUrl] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const hiddenImgRef = useRef<HTMLImageElement | null>(null);

  const [aiEngine, setAiEngine] = useState<import('@/types/scan').AIEngineType>('hybrid');

  // Initialize model URL, AI engine, and GPS on mount
  useEffect(() => {
    setModelUrl(getStoredModelUrl());
    setAiEngine(import('@/utils/storage').then ? 'hybrid' : 'hybrid');
    if (typeof window !== 'undefined') {
      const storedEngine = localStorage.getItem('zerodark_ai_engine_pref_v1') as import('@/types/scan').AIEngineType;
      if (storedEngine) setAiEngine(storedEngine);
    }

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: Number(pos.coords.latitude.toFixed(4)),
            lng: Number(pos.coords.longitude.toFixed(4)),
            locationName: 'Koordinat Lapangan Aktif',
            region: 'GPS Pengguna',
          });
        },
        () => {
          // Fallback to default coordinate
        },
        { timeout: 6000 }
      );
    }

    const handleModelUpdate = (e: any) => {
      if (e.detail) setModelUrl(e.detail);
    };
    const handleEngineUpdate = (e: any) => {
      if (e.detail) setAiEngine(e.detail);
    };

    window.addEventListener('zerodark_model_updated', handleModelUpdate);
    window.addEventListener('zerodark_ai_engine_updated', handleEngineUpdate);
    return () => {
      window.removeEventListener('zerodark_model_updated', handleModelUpdate);
      window.removeEventListener('zerodark_ai_engine_updated', handleEngineUpdate);
    };
  }, []);

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      setCameraError('Kamera tidak dapat diakses. Silakan unggah file foto langit.');
      setIsCameraActive(false);
    }
  };

  const captureCamera = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setSelectedImage(dataUrl);
      if (streamRef.current) {
        streamRef.current.getTracks((t: MediaStreamTrack) => t.stop());
        setIsCameraActive(false);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        if (isCameraActive && streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          setIsCameraActive(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset: typeof DEMO_PRESETS[0]) => {
    setSelectedImage(preset.url);
    setUserLocation(preset.location);
    if (preset.mode) {
      setScanMode(preset.mode);
    }
    if (isCameraActive && streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      setIsCameraActive(false);
    }
  };

  const executeAIScan = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    const steps = [
      aiEngine === 'gemini' 
        ? 'Mengirim ke Google Gemini 1.5 Vision API...'
        : aiEngine === 'teachable_machine'
        ? 'Memuat Pipeline Teachable Machine...'
        : 'Menjalankan Dual-AI Hybrid Inference...',
      'Mengekstraksi Vektor Fitur Spektral Atmosfer...',
      'Menganalisis Partikulat & Skala Bortle...',
      'Memetakan Status Ekologis & Kerentanan Fauna...',
      'Menyusun Kartu Diagnostik 3D...',
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      stepIdx = (stepIdx + 1) % steps.length;
      setAnalysisStep(steps[stepIdx]);
    }, 350);

    try {
      const effectiveMode: AtmosphereMode =
        scanMode === 'auto' ? currentAtmosphereMode : scanMode;

      let tmPredictions: import('@/types/scan').PredictionResult[] = [];
      let topPrediction: import('@/types/scan').PredictionResult = {
        className: effectiveMode === 'day_air_pollution' ? 'Clean Sky (AQI 0-50)' : 'Dark Sky / Bortle 1-3',
        probability: 0.92,
      };
      let metadata: import('@/types/scan').ClassMetadata = mapPredictionToMetadata(topPrediction.className, effectiveMode);
      let detectedAnomalies: string[] = [];
      let summaryDescription: string = '';
      let aiConfidence: number = 0.94;

      // 1. Run Teachable Machine / Edge Model if in TM or Hybrid mode
      if (aiEngine === 'teachable_machine' || aiEngine === 'hybrid') {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = selectedImage;
        await new Promise((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(true);
        });

        tmPredictions = await classifyImage(img, modelUrl, effectiveMode);
        if (tmPredictions.length > 0) {
          topPrediction = tmPredictions[0];
          metadata = mapPredictionToMetadata(topPrediction.className, effectiveMode);
        }
      }

      // 2. Run Gemini Multi-Modal Vision if in Gemini or Hybrid mode
      if (aiEngine === 'gemini' || aiEngine === 'hybrid') {
        try {
          const geminiKey = localStorage.getItem('zerodark_gemini_api_key_v1') || '';
          const geminiModel = localStorage.getItem('zerodark_gemini_model_pref_v1') || 'gemini-1.5-flash';

          const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: selectedImage,
              mode: effectiveMode,
              location: userLocation,
              apiKey: geminiKey || undefined,
              model: geminiModel,
            }),
          });

          if (res.ok) {
            const geminiResult = await res.json();
            if (geminiResult.primaryMetric) {
              const primary = geminiResult.primaryMetric;
              const secondary = geminiResult.secondaryMetrics || {};
              const envImpact = geminiResult.environmentalImpact || {};

              metadata = {
                label: `${primary.label}: ${primary.category || primary.value}`,
                badgeText: primary.category || (effectiveMode === 'day_air_pollution' ? 'Air Quality' : 'Night Sky'),
                badgeStyle: primary.value > 100 || primary.value >= 7 ? 'red' : primary.value > 50 || primary.value >= 4 ? 'amber' : 'green',
                severity: envImpact.faunaRiskLevel || 'Moderate',
                metricValue: primary.value || metadata.metricValue,
                metricLabel: primary.label || metadata.metricLabel,
                metricUnit: primary.unit || metadata.metricUnit,
                statusText: geminiResult.summaryDescription || metadata.statusText,
                ecoTip: envImpact.actionableEcoTip || metadata.ecoTip,
                faunaHealthImpact: envImpact.floraFaunaImpact || envImpact.healthRecommendation || metadata.faunaHealthImpact,
                colorHex: primary.colorHex || metadata.colorHex,
                glowColor: primary.colorHex ? `${primary.colorHex}66` : metadata.glowColor,
                visibilityKm: secondary.visibilityKm || metadata.visibilityKm,
                estimatedLux: secondary.estimatedLux || metadata.estimatedLux,
              };

              detectedAnomalies = secondary.detectedAnomalies || [];
              summaryDescription = geminiResult.summaryDescription || '';
              aiConfidence = geminiResult.confidenceScore || 0.95;

              // If Gemini-only mode, populate predictions with rich AI classes
              if (aiEngine === 'gemini' || tmPredictions.length === 0) {
                topPrediction = {
                  className: metadata.label,
                  probability: aiConfidence,
                };
                tmPredictions = [
                  topPrediction,
                  { className: effectiveMode === 'day_air_pollution' ? 'Moderate Haze' : 'Urban Glow', probability: 0.15 },
                  { className: effectiveMode === 'day_air_pollution' ? 'Severe Smog' : 'Severe Glare', probability: 0.05 },
                ];
              }
            }
          }
        } catch (apiErr) {
          console.warn('Gemini vision analysis fallback to edge:', apiErr);
        }
      }

      const record: ScanRecord = {
        id: `scan-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toISOString(),
        photoUrl: selectedImage,
        mode: effectiveMode,
        coordinates: userLocation,
        predictions: tmPredictions,
        topPrediction,
        metadata,
        engineUsed: aiEngine,
        detectedAnomalies,
        summaryDescription,
        aiConfidenceScore: aiConfidence,
        notes: `Dipindai dengan ${aiEngine === 'gemini' ? 'Google Gemini 1.5 Vision' : aiEngine === 'teachable_machine' ? 'Teachable Machine' : 'Dual-AI Hybrid'} di ${userLocation.locationName}`,
      };

      saveScanRecord(record);

      // Trigger Confetti
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#10B981', '#F59E0B', '#EF4444', '#34D399'],
      });

      setTimeout(() => {
        clearInterval(interval);
        setIsAnalyzing(false);
        onScanCompleted(record);
      }, 500);
    } catch (err) {
      console.error('Scan failed:', err);
      clearInterval(interval);
      setIsAnalyzing(false);
    }
  };


  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      {/* Hidden image element for canvas inference */}
      <img ref={hiddenImgRef} className="hidden" alt="hidden-for-inference" />

      {/* Main Viewport Box */}
      <div className="clay-card-base p-4 relative overflow-hidden bg-[#161F30]">
        {/* HUD Top Bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">
              Lensa Spektral
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#0C121E] text-emerald-400 border border-emerald-500/30">
              {aiEngine === 'gemini' ? 'Gemini Vision' : aiEngine === 'teachable_machine' ? 'Teachable Machine' : '⚡ Dual-AI'}
            </span>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1 bg-[#0C121E] p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setScanMode('auto')}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                scanMode === 'auto'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Auto
            </button>
            <button
              onClick={() => setScanMode('day_air_pollution')}
              className={`px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
                scanMode === 'day_air_pollution'
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-3 h-3" />
              Siang
            </button>
            <button
              onClick={() => setScanMode('night_light_pollution')}
              className={`px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
                scanMode === 'night_light_pollution'
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon className="w-3 h-3" />
              Malam
            </button>
          </div>
        </div>

        {/* Viewfinder Window Frame */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#070A10] border-2 border-white/10 flex items-center justify-center">
          {/* Active Video Stream */}
          {isCameraActive ? (
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="w-full h-full object-cover"
            />
          ) : selectedImage ? (
            <img
              src={selectedImage}
              alt="Target Scan"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-6 space-y-2.5">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-[#161F30] border border-white/10 flex items-center justify-center shadow-[inset_2px_2px_6px_rgba(255,255,255,0.15)]">
                <Camera className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Bidik Objek Atmosfer</p>
                <p className="text-xs text-slate-400 mt-0.5 max-w-[240px] mx-auto">
                  Arahkan kamera ke langit/kabut asap siang hari atau lampu kota malam hari
                </p>
              </div>
            </div>
          )}

          {/* Camera Reticle Overlay */}
          <div className="absolute inset-0 pointer-events-none p-3.5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-6 h-6 border-t-2 border-l-2 border-emerald-400/80 rounded-tl-lg" />
              <div className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                <Crosshair className="w-3 h-3 text-emerald-400" />
                <span>AI SPECTRAL RETICLE</span>
              </div>
              <div className="w-6 h-6 border-t-2 border-r-2 border-emerald-400/80 rounded-tr-lg" />
            </div>

            {/* Laser scanning sweep */}
            {isAnalyzing && (
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_16px_#10B981] animate-laser" />
            )}

            <div className="flex justify-between items-end">
              <div className="w-6 h-6 border-b-2 border-l-2 border-emerald-400/80 rounded-bl-lg" />
              <div className="text-[9px] font-mono text-slate-300 bg-black/70 px-2 py-0.5 rounded-full">
                {userLocation.lat}, {userLocation.lng}
              </div>
              <div className="w-6 h-6 border-b-2 border-r-2 border-emerald-400/80 rounded-br-lg" />
            </div>
          </div>

          {/* Analyzing Progress Overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-[#0B0F17]/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-3xl bg-[#142823] border-2 border-emerald-400 flex items-center justify-center shadow-[0_0_24px_rgba(16,185,129,0.4)] animate-bounce">
                <Sparkles className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white">
                  {aiEngine === 'gemini' ? 'Google Gemini 1.5 Vision' : aiEngine === 'teachable_machine' ? 'Google Teachable Machine' : 'Dual-AI Multimodal Scanner'}
                </h3>
                <p className="text-xs font-mono text-emerald-400 animate-pulse">
                  {analysisStep || 'Menginferensi model AI...'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Camera error message */}
        {cameraError && (
          <div className="mt-2.5 p-2 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Action Buttons for Camera / Upload */}
        <div className="grid grid-cols-2 gap-2.5 mt-3">
          {isCameraActive ? (
            <button
              onClick={captureCamera}
              className="clay-btn-mint py-3 text-xs font-black flex items-center justify-center gap-2 col-span-2 shadow-[0_4px_16px_rgba(16,185,129,0.3)]"
            >
              <Crosshair className="w-4 h-4" />
              <span>Jepret Bingkai Target</span>
            </button>
          ) : (
            <>
              <button
                onClick={startCamera}
                className="clay-btn-slate py-2.5 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Buka Kamera</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="clay-btn-slate py-2.5 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Unggah Foto</span>
              </button>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Main Inference Trigger Button */}
      {selectedImage && !isCameraActive && (
        <button
          onClick={executeAIScan}
          disabled={isAnalyzing}
          className="w-full clay-btn-mint py-4 text-sm font-black flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(16,185,129,0.35)]"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Memproses dengan AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>
                {aiEngine === 'gemini' 
                  ? 'Jalankan Gemini 1.5 Vision Analysis' 
                  : aiEngine === 'teachable_machine' 
                  ? 'Jalankan Teachable Machine AI' 
                  : 'Jalankan Dual-AI Multimodal Scan'}
              </span>
            </>
          )}
        </button>
      )}

      {/* Quick Test Presets Grid */}
      <div className="clay-card-base p-4 space-y-3 bg-[#161F30]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            Preset Skenario Uji Cepat
          </span>
          <span className="text-[10px] text-slate-400 font-medium">1-Ketuk Uji</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {DEMO_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(preset)}
              className="p-2.5 rounded-2xl bg-[#0C121E] border border-white/10 hover:border-emerald-500/40 text-left transition-all group flex flex-col justify-between active:scale-95"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-2">
                <img
                  src={preset.url}
                  alt={preset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span
                  className={`absolute top-1 right-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                    preset.mode === 'night_light_pollution'
                      ? 'bg-amber-950/90 text-amber-400 border border-amber-500/40'
                      : 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {preset.mode === 'night_light_pollution' ? 'Malam' : 'Siang'}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight line-clamp-1">
                  {preset.title}
                </p>
                <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-2.5 h-2.5" />
                  {preset.location.locationName}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
