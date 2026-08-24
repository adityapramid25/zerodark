import { ScanRecord } from '@/types/scan';
import { mapPredictionToMetadata } from './tmClassifier';

const SCANS_STORAGE_KEY = 'zerodark_tm_scans_v2';
const MODEL_URL_STORAGE_KEY = 'zerodark_tm_model_url_v2';

export const DEFAULT_MODEL_URL = 'https://teachablemachine.withgoogle.com/models/sample-model/';

export const COMPETITION_DEMO_DATASET: ScanRecord[] = [
  {
    id: 'demo-dark-bromo',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    photoUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=700&auto=format&fit=crop&q=80',
    mode: 'night_light_pollution',
    coordinates: {
      lat: -7.9425,
      lng: 112.9530,
      locationName: 'Cagar Langit Gelap Kaldera Bromo',
      region: 'Jawa Timur',
    },
    predictions: [
      { className: 'Dark Sky / Bortle 1-3', probability: 0.942 },
      { className: 'Urban Glow / Bortle 4-6', probability: 0.048 },
      { className: 'Severe Glare / Bortle 7-9', probability: 0.010 },
    ],
    topPrediction: { className: 'Dark Sky / Bortle 1-3', probability: 0.942 },
    metadata: mapPredictionToMetadata('Dark Sky / Bortle 1-3', 'night_light_pollution'),
    notes: 'Kondisi langit malam luar biasa gelap di atas kaldera purba. Garis kabut Bima Sakti dan cahaya zodiak tampak kasat mata.',
    isDemo: true,
  },
  {
    id: 'demo-smog-jakarta',
    timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    photoUrl: 'https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=700&auto=format&fit=crop&q=80',
    mode: 'day_air_pollution',
    coordinates: {
      lat: -6.2088,
      lng: 106.8456,
      locationName: 'Segitiga Emas Koridor Sudirman',
      region: 'DKI Jakarta',
    },
    predictions: [
      { className: 'Severe Smog (AQI 150+)', probability: 0.895 },
      { className: 'Moderate Haze (AQI 51-100)', probability: 0.088 },
      { className: 'Clean Sky (AQI 0-50)', probability: 0.017 },
    ],
    topPrediction: { className: 'Severe Smog (AQI 150+)', probability: 0.895 },
    metadata: mapPredictionToMetadata('Severe Smog (AQI 150+)', 'day_air_pollution'),
    notes: 'Inversi fotokimia padat memerangkap partikulat mikro di antara gedung bertingkat. Jarak pandang cakrawala sangat terbatas.',
    isDemo: true,
  },
  {
    id: 'demo-clean-lembang',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    photoUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=700&auto=format&fit=crop&q=80',
    mode: 'day_air_pollution',
    coordinates: {
      lat: -6.8168,
      lng: 107.6186,
      locationName: 'Dataran Tinggi Suaka Lembang',
      region: 'Kabupaten Bandung',
    },
    predictions: [
      { className: 'Clean Sky (AQI 0-50)', probability: 0.963 },
      { className: 'Moderate Haze (AQI 51-100)', probability: 0.031 },
      { className: 'Severe Smog (AQI 150+)', probability: 0.006 },
    ],
    topPrediction: { className: 'Clean Sky (AQI 0-50)', probability: 0.963 },
    metadata: mapPredictionToMetadata('Clean Sky (AQI 0-50)', 'day_air_pollution'),
    notes: 'Sirkulasi udara pegunungan alami bebas jelaga knalpot. Penetrasi cahaya matahari maksimal dengan Rayleigh scattering optimal.',
    isDemo: true,
  },
  {
    id: 'demo-glare-semarang',
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    photoUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=700&auto=format&fit=crop&q=80',
    mode: 'night_light_pollution',
    coordinates: {
      lat: -6.9666,
      lng: 110.4166,
      locationName: 'Dermaga Kontainer Tanjung Emas',
      region: 'Semarang',
    },
    predictions: [
      { className: 'Severe Glare / Bortle 7-9', probability: 0.912 },
      { className: 'Urban Glow / Bortle 4-6', probability: 0.075 },
      { className: 'Dark Sky / Bortle 1-3', probability: 0.013 },
    ],
    topPrediction: { className: 'Severe Glare / Bortle 7-9', probability: 0.912 },
    metadata: mapPredictionToMetadata('Severe Glare / Bortle 7-9', 'night_light_pollution'),
    notes: 'Lampu sorot tiang tinggi tanpa tudung memancar ke arah laut & kubah langit, memicu disorientasi fauna pesisir.',
    isDemo: true,
  },
  {
    id: 'demo-urban-bali',
    timestamp: new Date(Date.now() - 1000 * 60 * 450).toISOString(),
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&auto=format&fit=crop&q=80',
    mode: 'night_light_pollution',
    coordinates: {
      lat: -8.8291,
      lng: 115.0849,
      locationName: 'Tebing Pesisir Resor Uluwatu',
      region: 'Bali',
    },
    predictions: [
      { className: 'Urban Glow / Bortle 4-6', probability: 0.841 },
      { className: 'Dark Sky / Bortle 1-3', probability: 0.114 },
      { className: 'Severe Glare / Bortle 7-9', probability: 0.045 },
    ],
    topPrediction: { className: 'Urban Glow / Bortle 4-6', probability: 0.841 },
    metadata: mapPredictionToMetadata('Urban Glow / Bortle 4-6', 'night_light_pollution'),
    notes: 'Transisi antara pijar lampu hias vila daratan dan cakrawala samudra selatan yang masih cukup gelap.',
    isDemo: true,
  },
  {
    id: 'demo-moderate-surabaya',
    timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    photoUrl: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=700&auto=format&fit=crop&q=80',
    mode: 'day_air_pollution',
    coordinates: {
      lat: -7.2575,
      lng: 112.7521,
      locationName: 'Koridor Pusat Niaga Surabaya',
      region: 'Jawa Timur',
    },
    predictions: [
      { className: 'Moderate Haze (AQI 51-100)', probability: 0.785 },
      { className: 'Clean Sky (AQI 0-50)', probability: 0.142 },
      { className: 'Severe Smog (AQI 150+)', probability: 0.073 },
    ],
    topPrediction: { className: 'Moderate Haze (AQI 51-100)', probability: 0.785 },
    metadata: mapPredictionToMetadata('Moderate Haze (AQI 51-100)', 'day_air_pollution'),
    notes: 'Kabut tipis aerosol lalu lintas urban siang hari dengan angin pesisir yang membantu sedikit dispersi.',
    isDemo: true,
  },
];

export function getStoredScans(): ScanRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SCANS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SCANS_STORAGE_KEY, JSON.stringify(COMPETITION_DEMO_DATASET));
      return COMPETITION_DEMO_DATASET;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse scans from localStorage:', err);
    return COMPETITION_DEMO_DATASET;
  }
}

export function saveScanRecord(record: ScanRecord): ScanRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getStoredScans();
    const updated = [record, ...current];
    localStorage.setItem(SCANS_STORAGE_KEY, JSON.stringify(updated));
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
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(SCANS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('zerodark_scans_updated', { detail: updated }));
    return updated;
  } catch (err) {
    console.error('Failed to delete scan record:', err);
    return [];
  }
}

export function resetDemoDataset(): ScanRecord[] {
  if (typeof window === 'undefined') return COMPETITION_DEMO_DATASET;
  try {
    localStorage.setItem(SCANS_STORAGE_KEY, JSON.stringify(COMPETITION_DEMO_DATASET));
    window.dispatchEvent(new CustomEvent('zerodark_scans_updated', { detail: COMPETITION_DEMO_DATASET }));
    return COMPETITION_DEMO_DATASET;
  } catch (err) {
    console.error('Failed to reset demo dataset:', err);
    return COMPETITION_DEMO_DATASET;
  }
}

export function getStoredModelUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_MODEL_URL;
  try {
    return localStorage.getItem(MODEL_URL_STORAGE_KEY) || DEFAULT_MODEL_URL;
  } catch {
    return DEFAULT_MODEL_URL;
  }
}

export function saveStoredModelUrl(url: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MODEL_URL_STORAGE_KEY, url.trim());
    window.dispatchEvent(new CustomEvent('zerodark_model_updated', { detail: url.trim() }));
  } catch (err) {
    console.error('Failed to save model URL:', err);
  }
}

const GEMINI_API_KEY_STORAGE = 'zerodark_gemini_api_key_v1';
const AI_ENGINE_PREF_STORAGE = 'zerodark_ai_engine_pref_v1';
const GEMINI_MODEL_PREF_STORAGE = 'zerodark_gemini_model_pref_v1';
const CHAT_MESSAGES_STORAGE = 'zerodark_chat_messages_v1';

export function getStoredGeminiKey(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(GEMINI_API_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function saveStoredGeminiKey(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GEMINI_API_KEY_STORAGE, key.trim());
    window.dispatchEvent(new CustomEvent('zerodark_gemini_key_updated', { detail: key.trim() }));
  } catch (err) {
    console.error('Failed to save Gemini key:', err);
  }
}

export function getStoredAIEngine(): import('@/types/scan').AIEngineType {
  if (typeof window === 'undefined') return 'hybrid';
  try {
    const val = localStorage.getItem(AI_ENGINE_PREF_STORAGE) as import('@/types/scan').AIEngineType;
    return val || 'hybrid';
  } catch {
    return 'hybrid';
  }
}

export function saveStoredAIEngine(engine: import('@/types/scan').AIEngineType): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AI_ENGINE_PREF_STORAGE, engine);
    window.dispatchEvent(new CustomEvent('zerodark_ai_engine_updated', { detail: engine }));
  } catch (err) {
    console.error('Failed to save AI engine pref:', err);
  }
}

export function getStoredGeminiModel(): string {
  if (typeof window === 'undefined') return 'gemini-1.5-flash';
  try {
    return localStorage.getItem(GEMINI_MODEL_PREF_STORAGE) || 'gemini-1.5-flash';
  } catch {
    return 'gemini-1.5-flash';
  }
}

export function saveStoredGeminiModel(model: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GEMINI_MODEL_PREF_STORAGE, model);
    window.dispatchEvent(new CustomEvent('zerodark_gemini_model_updated', { detail: model }));
  } catch (err) {
    console.error('Failed to save Gemini model pref:', err);
  }
}

export function getStoredChatHistory(): import('@/types/scan').AIChatMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CHAT_MESSAGES_STORAGE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredChatHistory(messages: import('@/types/scan').AIChatMessage[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CHAT_MESSAGES_STORAGE, JSON.stringify(messages));
  } catch (err) {
    console.error('Failed to save chat history:', err);
  }
}

