import { AnalysisResult, AtmosphereMode, PolicyParams, PolicySimulationResult } from '@/types/environmental';

/**
 * Calculates average brightness from base64 image data (approximate sampling)
 */
export function estimateImageBrightness(base64Data: string): { isDaytime: boolean; brightness: number } {
  try {
    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
    // Take a small sample of decoded bytes
    const sampleSize = Math.min(cleanBase64.length, 4000);
    const sample = atob(cleanBase64.substring(0, sampleSize));
    let sum = 0;
    for (let i = 0; i < sample.length; i++) {
      sum += sample.charCodeAt(i);
    }
    const avg = sum / sample.length;
    // Normalized brightness 0..1
    const normalized = avg / 255;
    return {
      isDaytime: normalized > 0.45,
      brightness: normalized,
    };
  } catch (e) {
    // Fallback based on real local time
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 18;
    return { isDaytime: isDay, brightness: isDay ? 0.7 : 0.2 };
  }
}

/**
 * Generates rich heuristic environmental analysis when offline or when Gemini key is absent
 */
export function generateMockAnalysis(
  forcedMode?: AtmosphereMode,
  base64Image?: string,
  locationHint?: string
): AnalysisResult {
  const currentHour = new Date().getHours();
  let isNight = currentHour < 6 || currentHour >= 18;

  if (base64Image) {
    const { isDaytime } = estimateImageBrightness(base64Image);
    isNight = !isDaytime;
  }

  const mode: AtmosphereMode = forcedMode || (isNight ? 'night_light_pollution' : 'day_air_pollution');

  if (mode === 'day_air_pollution') {
    // Generate realistic daytime AQI scenario
    const aqiScenarios = [
      {
        aqi: 42,
        category: 'Good (Pristine Air)',
        colorHex: '#DCFD8B',
        visibility: 14.8,
        lux: 65000,
        haze: 'Clear Horizon',
        anomalies: ['Pristine Aerosol Clarity', 'Clean Mountain Boundary Layer'],
        faunaRisk: 'Low' as const,
        health: 'Air quality is satisfactory and poses little to no risk.',
        tip: 'Ideal conditions for outdoor eco-activities and solar capture.',
        summary: 'Excellent atmospheric visibility with low particulate concentration (PM2.5 < 12 µg/m³).'
      },
      {
        aqi: 118,
        category: 'Moderate / Sensitive Alert',
        colorHex: '#BC84EE',
        visibility: 6.2,
        lux: 48000,
        haze: 'Mild Photochemical Smog',
        anomalies: ['Vehicle Exhaust Layer', 'Stagnant Inversion Pocket'],
        faunaRisk: 'Moderate' as const,
        health: 'Sensitive individuals should limit prolonged outdoor exertion.',
        tip: 'Support low-emission transit routes and urban tree canopy buffering.',
        summary: 'Moderate ambient haze detected. Elevated particulate scattering visible along the horizon.'
      },
      {
        aqi: 168,
        category: 'Unhealthy (Smog Alert)',
        colorHex: '#FF823A',
        visibility: 2.8,
        lux: 32000,
        haze: 'Dense Particulate Inversion',
        anomalies: ['Industrial Plume Residue', 'Heavy Particulate Smog', 'Thermal Inversion'],
        faunaRisk: 'High' as const,
        health: 'Wear N95/KF94 mask outdoors. Close windows and turn on air purifiers.',
        tip: 'Enforce local industrial scrubber standards and dust suppression.',
        summary: 'Dense particulate haze obscuring structural lines beyond 3 km. High PM2.5 scattering.'
      }
    ];

    // Pick scenario with slight variation
    const scenario = aqiScenarios[Math.floor(Math.random() * aqiScenarios.length)];
    const jitter = Math.floor(Math.random() * 9) - 4;
    const finalAqi = Math.max(20, scenario.aqi + jitter);

    return {
      mode: 'day_air_pollution',
      primaryMetric: {
        label: 'Estimated AQI',
        value: finalAqi,
        category: scenario.category,
        colorHex: scenario.colorHex,
        unit: 'AQI (US)'
      },
      secondaryMetrics: {
        visibilityKm: Number((scenario.visibility + (Math.random() * 0.8 - 0.4)).toFixed(1)),
        estimatedLux: Math.round(scenario.lux + (Math.random() * 2000 - 1000)),
        hazeDensity: scenario.haze,
        detectedAnomalies: scenario.anomalies,
        skyGlowIndex: 12,
        colorTemperatureK: 5600
      },
      environmentalImpact: {
        faunaRiskLevel: scenario.faunaRisk,
        healthRecommendation: scenario.health,
        actionableEcoTip: scenario.tip,
        floraFaunaImpact: 'Daytime smog restricts photosynthetic stomata and stresses avian migration pathways.'
      },
      summaryDescription: scenario.summary,
      confidenceScore: 0.92,
      detectedFeatures: ['Atmospheric Inversion', 'Particulate Scattering', 'Horizon Degradation']
    };
  } else {
    // Nighttime light pollution scenario
    const bortleScenarios = [
      {
        bortle: 2,
        category: 'Class 2: Typical Truly Dark Sky',
        colorHex: '#DCFD8B',
        visibility: 25.0,
        lux: 0.08,
        haze: 'Pristine Night Transparency',
        anomalies: ['Airglow Bands Visible', 'Zodiacal Light Detected'],
        faunaRisk: 'Low' as const,
        health: 'Circadian melatonin cycles fully protected. Ideal astronomical seeing.',
        tip: 'Preserve natural dark sky reserve perimeter with IDA strict shielded luminaires.',
        summary: 'Milky Way core highly detailed with complex dark rifts. Minimal artificial skyglow.'
      },
      {
        bortle: 5,
        category: 'Class 5: Suburban Skyglow',
        colorHex: '#BC84EE',
        visibility: 8.5,
        lux: 18.4,
        haze: 'Diffuse Artificial Skyglow',
        anomalies: ['Unshielded Upward Stray Light', 'High-CCT 5000K Blue Glare'],
        faunaRisk: 'Moderate' as const,
        health: 'Dim bedroom lighting to maintain healthy melatonin synthesis.',
        tip: 'Implement 2200K warm-amber LED retrofits with full-cutoff top shields.',
        summary: 'Milky Way very weak or washed out at zenith. Prominent light domes in urban azimuths.'
      },
      {
        bortle: 8,
        category: 'Class 8: Inner-City Sky Glow',
        colorHex: '#FF823A',
        visibility: 3.2,
        lux: 85.0,
        haze: 'Heavy Photometric Saturation',
        anomalies: ['Unshielded Billboard Floodlights', 'Excessive Commercial Facade Glare', 'Skyward Spill Over 25%'],
        faunaRisk: 'Critical' as const,
        health: 'Severe circadian rhythm disruption risk. Use blackout curtains for sleep health.',
        tip: 'Enforce commercial lighting curfew at 22:00 and 50% public fixture dimming.',
        summary: 'Sky glow illuminates ground surfaces directly. Only brightest planets and first-magnitude stars visible.'
      }
    ];

    const scenario = bortleScenarios[Math.floor(Math.random() * bortleScenarios.length)];
    const luxJitter = Number((scenario.lux * (0.9 + Math.random() * 0.2)).toFixed(1));

    return {
      mode: 'night_light_pollution',
      primaryMetric: {
        label: 'Bortle Scale Class',
        value: scenario.bortle,
        category: scenario.category,
        colorHex: scenario.colorHex,
        unit: 'Class 1-9'
      },
      secondaryMetrics: {
        visibilityKm: Number((scenario.visibility + (Math.random() * 0.6 - 0.3)).toFixed(1)),
        estimatedLux: luxJitter,
        hazeDensity: scenario.haze,
        detectedAnomalies: scenario.anomalies,
        skyGlowIndex: scenario.bortle * 11,
        colorTemperatureK: scenario.bortle > 4 ? 4800 : 2700
      },
      environmentalImpact: {
        faunaRiskLevel: scenario.faunaRisk,
        healthRecommendation: scenario.health,
        actionableEcoTip: scenario.tip,
        floraFaunaImpact: 'Excessive nocturnal artificial light disrupts pollinator bats, firefly mating, and migratory songbirds.'
      },
      summaryDescription: scenario.summary,
      confidenceScore: 0.94,
      detectedFeatures: ['Direct Upward Stray Light', 'Luminance Glare Peak', 'Circadian Photometric Risk']
    };
  }
}

/**
 * Calculates policy impact simulation based on parameters
 */
export function calculatePolicyImpact(params: PolicyParams): PolicySimulationResult {
  const { curfewHour, dimmingFactor, shieldingCompliance, corridorBufferKm } = params;

  // Curfew active hours (e.g., 22:00 to 05:00 = 7 hours of 10-hour night = 70% curfew coverage)
  const curfewHours = Math.max(0, 24 - curfewHour + 5); // hours until 5 AM
  const curfewFactor = Math.min(1, curfewHours / 8);

  // Energy Saved: baseline 12,500 MWh/year city scale
  const baseMwh = 14500;
  const dimmingEnergySavings = (dimmingFactor / 100) * 0.45;
  const curfewEnergySavings = curfewFactor * 0.35;
  const energySavedMwh = Math.round(baseMwh * (dimmingEnergySavings + curfewEnergySavings));

  // Carbon reduced (approx 0.72 tons CO2 per MWh in typical grid)
  const carbonReducedTons = Math.round(energySavedMwh * 0.72);

  // Light Pollution Reduction % (Shielding + Dimming + Curfew)
  const lightPollutionReductionPct = Math.min(
    92,
    Math.round((shieldingCompliance * 0.42) + (dimmingFactor * 0.32) + (curfewFactor * 100 * 0.26))
  );

  // Restored Fauna Corridor (Hectares): buffer radius * factor
  const baseHectaresPerKm = 340;
  const restoredFaunaCorridorHa = Math.round(
    corridorBufferKm * baseHectaresPerKm * (lightPollutionReductionPct / 100)
  );

  // Financial savings ($0.14 per kWh = $140 per MWh)
  const costSavingsUsd = Math.round(energySavedMwh * 140);

  // Sky clarity boost %
  const skyClarityBoostPct = Math.round(lightPollutionReductionPct * 0.88);

  return {
    energySavedMwh,
    carbonReducedTons,
    lightPollutionReductionPct,
    restoredFaunaCorridorHa,
    costSavingsUsd,
    skyClarityBoostPct
  };
}
