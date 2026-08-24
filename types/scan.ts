export type AtmosphereMode = 'day_air_pollution' | 'night_light_pollution';

export type AIEngineType = 'gemini' | 'teachable_machine' | 'hybrid';

export interface PredictionResult {
  className: string;
  probability: number;
}

export interface ClassMetadata {
  label: string;
  badgeText: string;
  badgeStyle: 'green' | 'amber' | 'red' | 'emerald' | 'crimson';
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  metricValue: number;
  metricLabel: string;
  metricUnit: string;
  statusText: string;
  ecoTip: string;
  faunaHealthImpact: string;
  colorHex: string;
  glowColor: string;
  visibilityKm: number;
  estimatedLux: number;
}

export interface GeoCoordinates {
  lat: number;
  lng: number;
  locationName: string;
  region?: string;
}

export interface ScanRecord {
  id: string;
  timestamp: string; // ISO string
  photoUrl: string;
  mode: AtmosphereMode;
  coordinates: GeoCoordinates;
  predictions: PredictionResult[];
  topPrediction: PredictionResult;
  metadata: ClassMetadata;
  notes?: string;
  isDemo?: boolean;
  engineUsed?: AIEngineType;
  detectedAnomalies?: string[];
  summaryDescription?: string;
  aiConfidenceScore?: number;
}

export interface PolicyParams {
  curfewHour: number; // e.g., 22 (10 PM)
  dimmingFactor: number; // 0 to 100%
  shieldingCompliance: number; // 0 to 100%
  corridorBufferKm: number; // 1 to 25 km
}

export interface PolicySimulationResult {
  energySavedMwh: number;
  carbonReducedTons: number;
  lightPollutionReductionPct: number;
  restoredFaunaCorridorHa: number;
  costSavingsUsd: number;
  skyClarityBoostPct: number;
}

export interface ModelConfig {
  customModelUrl: string;
  isUsingCustomModel: boolean;
  geminiApiKey?: string;
  selectedGeminiModel?: string;
  preferredEngine?: AIEngineType;
  modelStatus: 'idle' | 'loading' | 'ready' | 'error';
  errorMessage?: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  scanContext?: {
    locationName?: string;
    mode?: AtmosphereMode;
    label?: string;
    metricValue?: number;
    metricUnit?: string;
    severity?: string;
  };
}

export interface AIPolicyRecommendation {
  executiveSummary: string;
  projectedROI: string;
  legalDraftingPoints: string[];
  ecologicalBenefits: string[];
  implementationRoadmap: { phase: string; title: string; desc: string }[];
}

