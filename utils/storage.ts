import { ScanRecord } from '@/types/environmental';

const STORAGE_KEY = 'zerodark_mobile_scans_v1';

export const DEMO_DATASET: ScanRecord[] = [
  {
    id: 'demo-bortle-bromo',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    coordinates: {
      lat: -7.9425,
      lng: 112.9530,
      locationName: 'Cagar Langit Gelap Gunung Bromo',
      region: 'Jawa Timur'
    },
    photoUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    notes: 'Malam berbintang yang sangat bersih di atas kaldera gunung berapi. Cahaya zodiak terlihat jelas.',
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
        hazeDensity: 'Atmosfer Sangat Bersih',
        detectedAnomalies: ['Pita Airglow', 'Cahaya Bintang Inti Bima Sakti'],
        skyGlowIndex: 4,
        colorTemperatureK: 2400
      },
      environmentalImpact: {
        faunaRiskLevel: 'Low',
        healthRecommendation: 'Sintesis melatonin terlindungi dan siklus gelap alami terjaga.',
        actionableEcoTip: 'Pertahankan radius penyangga Cagar Langit Gelap IDA dari pembangunan resor di sekitarnya.',
        floraFaunaImpact: 'Perburuan raptor nokturnal dan orientasi serangga sepenuhnya terlindungi.'
      },
      summaryDescription: 'Ketinggian kaldera memastikan hamburan buatan ke atas sangat minimal. Kondisi Bortle 2 terkonfirmasi.',
      confidenceScore: 0.98,
      detectedFeatures: ['Tanpa Pijar Langit Buatan', 'Struktur Galaksi Terlihat', 'Kegelapan Optimal']
    }
  },
  {
    id: 'demo-aqi-jakarta',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    coordinates: {
      lat: -6.2088,
      lng: 106.8456,
      locationName: 'Koridor Segitiga Emas Jakarta',
      region: 'DKI Jakarta'
    },
    photoUrl: 'https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    notes: 'Kawasan lalu lintas padat tengah hari dengan lapisan inversi termal yang padat.',
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
        hazeDensity: 'Kabut Asap Fotokimia Padat',
        detectedAnomalies: ['Pulau Panas Perkotaan', 'Inversi Asap Partikulat', 'Asap Knalpot Diesel'],
        skyGlowIndex: 88,
        colorTemperatureK: 5200
      },
      environmentalImpact: {
        faunaRiskLevel: 'Critical',
        healthRecommendation: 'Kenakan masker N95 di luar ruangan. Konsentrasi PM2.5 yang tinggi memerlukan filtrasi udara ruangan.',
        actionableEcoTip: 'Dorong koridor bus bebas emisi dan penghijauan vertikal di sepanjang jembatan arteri.',
        floraFaunaImpact: 'Pengendapan jelaga yang berat pada dedaunan di pinggir jalan menghambat penyerapan karbon.'
      },
      summaryDescription: 'Degradasi cakrawala yang parah akibat aerosol halus yang terperangkap. Koefisien hamburan yang tinggi.',
      confidenceScore: 0.94,
      detectedFeatures: ['Inversi Mikropartikel', 'Opasitas Langit 65%', 'Pemerangkapan Polusi Jalanan']
    }
  },
  {
    id: 'demo-bortle-semarang',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    coordinates: {
      lat: -6.9666,
      lng: 110.4166,
      locationName: 'Pelabuhan Industri Tanjung Emas',
      region: 'Semarang'
    },
    photoUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    notes: 'Lampu sorot dermaga tiang tinggi tanpa pelindung memancar di sepanjang garis pantai.',
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
        hazeDensity: 'Kabut Laut Tipis + Kebocoran Pijar Langit',
        detectedAnomalies: ['Silau Lampu Sorot Tiang Tinggi Tanpa Pelindung', 'Limpahan Cahaya Kelautan ke Arah Langit >40%', 'Silau Biru CCT 5000K'],
        skyGlowIndex: 94,
        colorTemperatureK: 5400
      },
      environmentalImpact: {
        faunaRiskLevel: 'High',
        healthRecommendation: 'Staf pelabuhan harus mengenakan lensa pelindung anti-silau selama shift malam.',
        actionableEcoTip: 'Pasang tudung asimetris pelindung penuh pada derek terminal peti kemas.',
        floraFaunaImpact: 'Disorientasi anak penyu dan pemerangkapan burung migran pesisir teramati.'
      },
      summaryDescription: 'Suar fotometrik ke atas yang masif terdeteksi dari lampu sorot industri tanpa pelindung.',
      confidenceScore: 0.96,
      detectedFeatures: ['Direktivitas Silau Tinggi', 'Limpahan Cahaya Laut', 'Halo Kubah Langit yang Parah']
    }
  },
  {
    id: 'demo-aqi-lembang',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    coordinates: {
      lat: -6.8168,
      lng: 107.6186,
      locationName: 'Dataran Tinggi Botani Lembang',
      region: 'Kabupaten Bandung'
    },
    photoUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    notes: 'Angin lembah gunung membubarkan partikel aerosol pagi hari.',
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
        hazeDensity: 'Sangat Sedikit (Pemandangan Pegunungan Bersih)',
        detectedAnomalies: ['Aerasi Kanopi Pinus Bersih'],
        skyGlowIndex: 8,
        colorTemperatureK: 6000
      },
      environmentalImpact: {
        faunaRiskLevel: 'Low',
        healthRecommendation: 'Kualitas udara sangat baik. Bagus untuk kesehatan pernapasan dan rekreasi luar ruangan.',
        actionableEcoTip: 'Pertahankan koridor hijau dataran tinggi dan hutan pinus penyaring biologis alami.',
        floraFaunaImpact: 'Konduktansi stomata optimal dan keanekaragaman hayati burung endemik berkembang pesat.'
      },
      summaryDescription: 'Cakrawala gunung yang bersih dengan kejelasan Rayleigh tinggi dan jejak partikulat manusia minimal.',
      confidenceScore: 0.95,
      detectedFeatures: ['Udara Gunung Murni', 'Hamburan Aerosol Rendah', 'Penetrasi Matahari Tinggi']
    }
  },
  {
    id: 'demo-bortle-bali',
    timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    coordinates: {
      lat: -8.8291,
      lng: 115.0849,
      locationName: 'Koridor Tebing Samudra Uluwatu',
      region: 'Bali'
    },
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    isDemo: true,
    notes: 'Pijar lingkungan resor tepi tebing bertemu dengan cakrawala samudra selatan yang gelap.',
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
        hazeDensity: 'Kabut Garam Laut Ringan',
        detectedAnomalies: ['Pencahayaan Fasad Resor ke Atas', 'Lampu Hias Jalur Tebing'],
        skyGlowIndex: 38,
        colorTemperatureK: 3000
      },
      environmentalImpact: {
        faunaRiskLevel: 'Moderate',
        healthRecommendation: 'Silau lingkungan ringan di sepanjang jalur. Cocok untuk relaksasi malam hari.',
        actionableEcoTip: 'Terapkan pedoman pencahayaan amber hangat 2200K di sepanjang tempat bersarang di tepi tebing.',
        floraFaunaImpact: 'Menjaga kegelapan ke arah laut melindungi petrel samudra dan raptor yang tinggal di tebing.'
      },
      summaryDescription: 'Pemandangan samudra selatan tetap gelap dengan rasi bintang terlihat, meskipun pijar resor di daratan ada.',
      confidenceScore: 0.91,
      detectedFeatures: ['Transisi Cahaya Pesisir', 'Lampu Jalur Terlindungi Sebagian', 'Cakrawala Samudra yang Baik']
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
