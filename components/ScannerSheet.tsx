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
  Layers,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AnalysisResult, AtmosphereMode, GeoLocation, ScanRecord } from '@/types/environmental';
import { saveScanRecord } from '@/utils/storage';
import { generateMockAnalysis } from '@/utils/mockEngine';

interface ScannerSheetProps {
  currentAtmosphereMode: AtmosphereMode;
  onScanCompleted: (record: ScanRecord) => void;
  onViewHeatmap?: () => void;
}

// Preset samples for fast demo testing
const DEMO_PRESETS = [
  {
    title: 'Starry Dark Sky (Bortle 2)',
    mode: 'night_light_pollution' as const,
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
    location: { lat: -7.9425, lng: 112.9530, locationName: 'Bromo Dark Sky Reserve', region: 'East Java' }
  },
  {
    title: 'Urban Particulate Smog (AQI 168)',
    mode: 'day_air_pollution' as const,
    url: 'https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=600&auto=format&fit=crop&q=80',
    location: { lat: -6.2088, lng: 106.8456, locationName: 'Jakarta Skyline', region: 'DKI Jakarta' }
  },
  {
    title: 'Harbor Unshielded Glare (Bortle 8)',
    mode: 'night_light_pollution' as const,
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&auto=format&fit=crop&q=80',
    location: { lat: -6.9666, lng: 110.4166, locationName: 'Semarang Port Terminal', region: 'Central Java' }
  },
  {
    title: 'Alpine Clean Mountain (AQI 38)',
    mode: 'day_air_pollution' as const,
    url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
    location: { lat: -6.8168, lng: 107.6186, locationName: 'Lembang Alpine Sanctuary', region: 'Bandung' }
  }
];

export const ScannerSheet: React.FC<ScannerSheetProps> = ({
  currentAtmosphereMode,
  onScanCompleted,
  onViewHeatmap,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [scanMode, setScanMode] = useState<'auto' | AtmosphereMode>('auto');
  const [userLocation, setUserLocation] = useState<GeoLocation>({
    lat: -6.2088,
    lng: 106.8456,
    locationName: 'Detected GPS Location',
    region: 'Active Device'
  });
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Get user geolocation on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: Number(pos.coords.latitude.toFixed(4)),
            lng: Number(pos.coords.longitude.toFixed(4)),
            locationName: 'GPS Current Field Coordinates',
            region: 'User Sensor'
          });
        },
        (err) => {
          console.log('Using default geolocation coordinates');
        },
        { timeout: 8000 }
      );
    }
  }, []);

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Start hardware camera
  const startCamera = async () => {
    try {
      setCameraError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Camera unavailable. Please upload a photo or select a test scene.');
      setIsCameraActive(false);
    }
  };

  // Capture snapshot from video element
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
        streamRef.current.getTracks().forEach((track) => track.stop());
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

  const runDualAtmosphereScan = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    const steps = [
      'Initializing Photometric Sensors...',
      'Decomposing Aerosol & Rayleigh Scatter...',
      'Quantifying Upward Skyward Glare Vectors...',
      'Evaluating Wildlife Corridor Risk Factors...',
      'Synthesizing Environmental Action Report...'
    ];

    let currentStepIdx = 0;
    const stepTimer = setInterval(() => {
      currentStepIdx = (currentStepIdx + 1) % steps.length;
      setAnalysisStep(steps[currentStepIdx]);
    }, 450);

    try {
      // Send image to API route
      const effectiveMode = scanMode === 'auto' ? undefined : scanMode;
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: selectedImage,
          mode: effectiveMode,
          location: userLocation,
        }),
      });

      let analysisResult: AnalysisResult;
      if (res.ok) {
        analysisResult = await res.json();
      } else {
        // Fallback to local heuristic engine
        analysisResult = generateMockAnalysis(effectiveMode, selectedImage, userLocation.locationName);
      }

      // Create scan record and persist to storage
      const record: ScanRecord = {
        id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        timestamp: new Date().toISOString(),
        coordinates: userLocation,
        photoUrl: selectedImage,
        analysis: analysisResult,
        notes: `Dual-Atmosphere Scan captured at ${userLocation.locationName}`
      };

      saveScanRecord(record);

      // Trigger celebratory confetti
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#DCFD8B', '#BC84EE', '#FF823A']
      });

      setTimeout(() => {
        clearInterval(stepTimer);
        setIsAnalyzing(false);
        onScanCompleted(record);
      }, 600);
    } catch (err) {
      console.error('Scan execution error:', err);
      // Fallback
      const fallbackResult = generateMockAnalysis(scanMode === 'auto' ? undefined : scanMode, selectedImage);
      const record: ScanRecord = {
        id: `scan-${Date.now()}`,
        timestamp: new Date().toISOString(),
        coordinates: userLocation,
        photoUrl: selectedImage,
        analysis: fallbackResult,
      };
      saveScanRecord(record);
      clearInterval(stepTimer);
      setIsAnalyzing(false);
      onScanCompleted(record);
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      {/* Scanner Viewport Box */}
      <div className="clay-card p-4 relative overflow-hidden bg-[#111827]">
        {/* HUD Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DCFD8B] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Optical Lens Scanner
            </span>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1 bg-[#0E1422] p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setScanMode('auto')}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                scanMode === 'auto'
                  ? 'bg-[#DCFD8B] text-[#0B0F19] shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Auto AI
            </button>
            <button
              onClick={() => setScanMode('day_air_pollution')}
              className={`px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
                scanMode === 'day_air_pollution'
                  ? 'bg-[#DCFD8B] text-[#0B0F19]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-3 h-3" />
              Day
            </button>
            <button
              onClick={() => setScanMode('night_light_pollution')}
              className={`px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
                scanMode === 'night_light_pollution'
                  ? 'bg-[#BC84EE] text-[#0B0F19]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon className="w-3 h-3" />
              Night
            </button>
          </div>
        </div>

        {/* Viewport Frame */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#070A11] border-2 border-white/10 flex items-center justify-center">
          {/* Active Hardware Video */}
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
              alt="Scan Target"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-6 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-[#151D2A] border border-white/10 flex items-center justify-center shadow-[inset_2px_2px_6px_rgba(255,255,255,0.15)]">
                <Camera className="w-7 h-7 text-[#DCFD8B]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Target Viewfinder Empty</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Point at daytime smog horizon or nighttime sky & lighting fixtures
                </p>
              </div>
            </div>
          )}

          {/* Camera Viewfinder Crosshairs & Reticle Overlay */}
          <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-6 h-6 border-t-2 border-l-2 border-[#DCFD8B]/70 rounded-tl-lg" />
              <div className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-[9px] font-mono text-[#DCFD8B] flex items-center gap-1">
                <Crosshair className="w-3 h-3 text-[#DCFD8B]" />
                <span>GRID RETICLE: ACTIVE</span>
              </div>
              <div className="w-6 h-6 border-t-2 border-r-2 border-[#DCFD8B]/70 rounded-tr-lg" />
            </div>

            {/* Scanning Laser Beam */}
            {isAnalyzing && (
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#DCFD8B] to-transparent shadow-[0_0_15px_#DCFD8B] animate-laser" />
            )}

            <div className="flex justify-between items-end">
              <div className="w-6 h-6 border-b-2 border-l-2 border-[#DCFD8B]/70 rounded-bl-lg" />
              <div className="text-[9px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded-full">
                {userLocation.lat}, {userLocation.lng}
              </div>
              <div className="w-6 h-6 border-b-2 border-r-2 border-[#DCFD8B]/70 rounded-br-lg" />
            </div>
          </div>

          {/* Analyzing Progress Modal Over Viewport */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-[#0B0F19]/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#1C2B20] border-2 border-[#DCFD8B] flex items-center justify-center shadow-[0_0_24px_rgba(220,253,139,0.4)] animate-bounce">
                <Sparkles className="w-8 h-8 text-[#DCFD8B]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-white">
                  Gemini Dual-Atmosphere AI
                </h3>
                <p className="text-xs font-mono text-[#DCFD8B] animate-pulse">
                  {analysisStep || 'Analyzing atmospheric scattering...'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Camera error message if any */}
        {cameraError && (
          <div className="mt-2.5 p-2 rounded-xl bg-orange-950/40 border border-[#FF823A]/30 text-xs text-[#FF823A] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Camera Control Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 mt-3">
          {isCameraActive ? (
            <button
              onClick={captureCamera}
              className="clay-button clay-button-lime py-3 text-xs font-black flex items-center justify-center gap-2 col-span-2 shadow-[0_4px_16px_rgba(220,253,139,0.3)]"
            >
              <Crosshair className="w-4 h-4" />
              <span>Capture Atmosphere Frame</span>
            </button>
          ) : (
            <>
              <button
                onClick={startCamera}
                className="clay-button clay-button-slate py-2.5 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4 text-[#DCFD8B]" />
                <span>Open Camera</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="clay-button clay-button-slate py-2.5 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4 text-[#BC84EE]" />
                <span>Upload Sky Photo</span>
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

      {/* Main Scan Trigger Clay Button */}
      {selectedImage && !isCameraActive && (
        <button
          onClick={runDualAtmosphereScan}
          disabled={isAnalyzing}
          className="w-full clay-button clay-button-lime py-4 text-sm font-extrabold flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(220,253,139,0.35)] active:scale-95 transition-all"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Analyzing Atmospheric Sensor Data...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Run Gemini Dual-Atmosphere Scan</span>
            </>
          )}
        </button>
      )}

      {/* Preset Sky Scenarios for Instant Testing */}
      <div className="clay-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#DCFD8B]" />
            Quick-Test Preset Scenarios
          </span>
          <span className="text-[10px] text-slate-400 font-medium">1-Tap Pitch Demo</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {DEMO_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(preset)}
              className="clay-card-interactive p-2.5 rounded-2xl bg-[#0E1422] border border-white/10 hover:border-white/20 text-left transition-all group flex flex-col justify-between"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-2">
                <img
                  src={preset.url}
                  alt={preset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className={`absolute top-1 right-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                  preset.mode === 'night_light_pollution'
                    ? 'bg-[#251C33]/90 text-[#BC84EE] border border-[#BC84EE]/40'
                    : 'bg-[#1C2B20]/90 text-[#DCFD8B] border border-[#DCFD8B]/40'
                }`}>
                  {preset.mode === 'night_light_pollution' ? 'Night Sky' : 'Day Air'}
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
