export type AtmosphereMode = 'day_air_pollution' | 'night_light_pollution';

export interface PrimaryMetric {
  label: string;
  value: number;
  category: string;
  colorHex: string;
  unit?: string;
}

export interface SecondaryMetrics {
  visibilityKm: number;
  estimatedLux: number;
  hazeDensity: string;
  detectedAnomalies: string[];
  skyGlowIndex?: number;
  colorTemperatureK?: number;
}

export interface EnvironmentalImpact {
  faunaRiskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  healthRecommendation: string;
  actionableEcoTip: string;
  floraFaunaImpact?: string;
}

export interface AnalysisResult {
  mode: AtmosphereMode;
  primaryMetric: PrimaryMetric;
  secondaryMetrics: SecondaryMetrics;
  environmentalImpact: EnvironmentalImpact;
  summaryDescription?: string;
  confidenceScore?: number;
  detectedFeatures?: string[];
}

export interface GeoLocation {
  lat: number;
  lng: number;
  locationName: string;
  region?: string;
}

export interface ScanRecord {
  id: string;
  timestamp: string; // ISO string
  coordinates: GeoLocation;
  photoUrl: string;
  analysis: AnalysisResult;
  notes?: string;
  isDemo?: boolean;
}

export interface PolicyParams {
  curfewHour: number; // e.g., 22 (10 PM)
  dimmingFactor: number; // 0 to 100%
  shieldingCompliance: number; // 0 to 100%
  corridorBufferKm: number; // 1 to 20 km
}

export interface PolicySimulationResult {
  energySavedMwh: number;
  carbonReducedTons: number;
  lightPollutionReductionPct: number;
  restoredFaunaCorridorHa: number;
  costSavingsUsd: number;
  skyClarityBoostPct: number;
}
