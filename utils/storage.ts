import { ScanRecord } from '@/types/environmental';

const STORAGE_KEY = 'zerodark_mobile_scans_v1';

export const DEMO_DATASET: ScanRecord[] = [
  {
    id: 'demo-bortle-bromo',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    coordinates: {
      lat: -7.9425,
      lng: 112.9530,
      locationName: 'Mount Bromo Dark Sky Reserve',
      region: 'East Java'
    },
    photoUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    notes: 'Pristine starry night over volcanic caldera. Zodiacal light clearly visible.',
    analysis: {
      mode: 'night_light_pollution',
      primaryMetric: {
        label: 'Bortle Scale Class',
        value: 2,
        category: 'Class 2: Truly Dark Sky',
        colorHex: '#DCFD8B',
        unit: 'Class 1-9'
      },
      secondaryMetrics: {
        visibilityKm: 28.5,
        estimatedLux: 0.05,
        hazeDensity: 'Pristine Atmosphere',
        detectedAnomalies: ['Airglow Bands', 'Milky Way Core Starlight'],
        skyGlowIndex: 4,
        colorTemperatureK: 2400
      },
      environmentalImpact: {
        faunaRiskLevel: 'Low',
        healthRecommendation: 'Protected melatonin synthesis and natural dark cycles.',
        actionableEcoTip: 'Maintain IDA Dark Sky Reserve buffer against perimeter resort development.',
        floraFaunaImpact: 'Nocturnal raptor hunting and insect orientation fully protected.'
      },
      summaryDescription: 'Caldera elevation ensures minimal upward artificial scatter. Bortle 2 conditions confirmed.',
      confidenceScore: 0.98,
      detectedFeatures: ['Zero Artificial Skyglow', 'Galactic Structure Resolved', 'Optimal Darkness']
    }
  },
  {
    id: 'demo-aqi-jakarta',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    coordinates: {
      lat: -6.2088,
      lng: 106.8456,
      locationName: 'Jakarta Golden Triangle Corridor',
      region: 'DKI Jakarta'
    },
    photoUrl: 'https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    notes: 'Midday traffic canyon with dense thermal inversion layer.',
    analysis: {
      mode: 'day_air_pollution',
      primaryMetric: {
        label: 'Estimated AQI',
        value: 168,
        category: 'Unhealthy (Smog Alert)',
        colorHex: '#FF823A',
        unit: 'AQI (US)'
      },
      secondaryMetrics: {
        visibilityKm: 2.8,
        estimatedLux: 36000,
        hazeDensity: 'Dense Photochemical Smog',
        detectedAnomalies: ['Urban Canyon Heat Island', 'Particulate Smog Inversion', 'Diesel Exhaust Plume'],
        skyGlowIndex: 88,
        colorTemperatureK: 5200
      },
      environmentalImpact: {
        faunaRiskLevel: 'Critical',
        healthRecommendation: 'Wear N95 mask outdoors. High PM2.5 concentration requires room air filtration.',
        actionableEcoTip: 'Promote zero-emission bus corridors and vertical greenery along arterial bridges.',
        floraFaunaImpact: 'Heavy soot deposition on roadside foliage inhibits carbon sequestration.'
      },
      summaryDescription: 'Severe horizon degradation due to trapped fine aerosols. High scattering coefficient.',
      confidenceScore: 0.94,
      detectedFeatures: ['Microparticle Inversion', 'Sky Opacity 65%', 'Vehicle Canyon Trapping']
    }
  },
  {
    id: 'demo-bortle-semarang',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    coordinates: {
      lat: -6.9666,
      lng: 110.4166,
      locationName: 'Tanjung Emas Industrial Harbor',
      region: 'Semarang'
    },
    photoUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    notes: 'High-mast unshielded dock floodlights radiating across coastline.',
    analysis: {
      mode: 'night_light_pollution',
      primaryMetric: {
        label: 'Bortle Scale Class',
        value: 8,
        category: 'Class 8: Inner-City Skyglow',
        colorHex: '#FF823A',
        unit: 'Class 1-9'
      },
      secondaryMetrics: {
        visibilityKm: 4.1,
        estimatedLux: 92.4,
        hazeDensity: 'Light Marine Fog + Skyglow Bleed',
        detectedAnomalies: ['Unshielded High-Mast Floodlight Glare', 'Skyward Marine Spill >40%', '5000K Blue Glare'],
        skyGlowIndex: 94,
        colorTemperatureK: 5400
      },
      environmentalImpact: {
        faunaRiskLevel: 'High',
        healthRecommendation: 'Harbor staff should wear glare-shielded protective lenses during night shifts.',
        actionableEcoTip: 'Install full cut-off asymmetric hoods on container terminal cranes.',
        floraFaunaImpact: 'Sea turtle hatchling disorientation and coastal migratory bird trapping observed.'
      },
      summaryDescription: 'Massive upward photometric flare detected from industrial floodlights without shielding.',
      confidenceScore: 0.96,
      detectedFeatures: ['High Glare Directivity', 'Marine Light Spill', 'Severe Sky Domed Halo']
    }
  },
  {
    id: 'demo-aqi-lembang',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    coordinates: {
      lat: -6.8168,
      lng: 107.6186,
      locationName: 'Lembang Botanical Highlands',
      region: 'Bandung Regency'
    },
    photoUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    notes: 'Mountain valley breeze dispersing morning aerosol particles.',
    analysis: {
      mode: 'day_air_pollution',
      primaryMetric: {
        label: 'Estimated AQI',
        value: 38,
        category: 'Good (Clean Mountain Air)',
        colorHex: '#DCFD8B',
        unit: 'AQI (US)'
      },
      secondaryMetrics: {
        visibilityKm: 18.2,
        estimatedLux: 72000,
        hazeDensity: 'Negligible (Crisp Alpine View)',
        detectedAnomalies: ['Clean Pine Canopy Aeration'],
        skyGlowIndex: 8,
        colorTemperatureK: 6000
      },
      environmentalImpact: {
        faunaRiskLevel: 'Low',
        healthRecommendation: 'Excellent air quality. Great for respiratory wellness and outdoor recreation.',
        actionableEcoTip: 'Preserve high-altitude green corridors and natural bio-filtering pine forests.',
        floraFaunaImpact: 'Optimal stomatal conductance and thriving endemic bird biodiversity.'
      },
      summaryDescription: 'Crisp mountain horizon with high Rayleigh clarity and minimal human particulate footprint.',
      confidenceScore: 0.95,
      detectedFeatures: ['Pure Mountain Air', 'Low Aerosol Scattering', 'High Sun Penetration']
    }
  },
  {
    id: 'demo-bortle-bali',
    timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    coordinates: {
      lat: -8.8291,
      lng: 115.0849,
      locationName: 'Uluwatu Ocean Cliff Corridor',
      region: 'Bali'
    },
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    notes: 'Cliffside resort ambient glow meeting southern dark ocean horizon.',
    analysis: {
      mode: 'night_light_pollution',
      primaryMetric: {
        label: 'Bortle Scale Class',
        value: 4,
        category: 'Class 4: Rural/Suburban Transition',
        colorHex: '#BC84EE',
        unit: 'Class 1-9'
      },
      secondaryMetrics: {
        visibilityKm: 16.4,
        estimatedLux: 4.8,
        hazeDensity: 'Mild Ocean Salt Mist',
        detectedAnomalies: ['Resort Facade Up-Lighting', 'Cliff Pathway String Lights'],
        skyGlowIndex: 38,
        colorTemperatureK: 3000
      },
      environmentalImpact: {
        faunaRiskLevel: 'Moderate',
        healthRecommendation: 'Mild ambient glare along pathways. Suitable for evening relaxation.',
        actionableEcoTip: 'Enforce warm 2200K amber lighting guidelines along cliffside nesting grounds.',
        floraFaunaImpact: 'Preserving seaward darkness protects oceanic petrels and cliff-dwelling raptors.'
      },
      summaryDescription: 'Southern oceanic view remains dark with visible constellations, though landward resort glow is present.',
      confidenceScore: 0.91,
      detectedFeatures: ['Coastal Light Transition', 'Partially Shielded Path Lights', 'Good Ocean Horizon']
    }
  }
];

export function getStoredScans(): ScanRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First time initialization: pre-fill demo dataset for a rich first-run experience
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_DATASET));
      return DEMO_DATASET;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse stored scans:', err);
    return DEMO_DATASET;
  }
}

export function saveScanRecord(record: ScanRecord): ScanRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getStoredScans();
    const updated = [record, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Trigger custom window event for instant cross-component sync
    window.dispatchEvent(new CustomEvent('zerodark_scans_updated', { detail: updated }));
    return updated;
  } catch (err) {
    console.error('Failed to save scan record:', err);
    return [];
  }
}

export function deleteScanRecord(id: string): ScanRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getStoredScans();
    const updated = current.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('zerodark_scans_updated', { detail: updated }));
    return updated;
  } catch (err) {
    console.error('Failed to delete scan record:', err);
    return [];
  }
}

export function resetDemoDataset(): ScanRecord[] {
  if (typeof window === 'undefined') return DEMO_DATASET;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_DATASET));
    window.dispatchEvent(new CustomEvent('zerodark_scans_updated', { detail: DEMO_DATASET }));
    return DEMO_DATASET;
  } catch (err) {
    console.error('Failed to reset demo dataset:', err);
    return DEMO_DATASET;
  }
}
