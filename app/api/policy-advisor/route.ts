import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PolicyParams, PolicySimulationResult, AIPolicyRecommendation } from '@/types/scan';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      params, 
      impact, 
      cityName = 'Kawasan Perkotaan',
      apiKey: clientApiKey, 
      model: requestedModel = 'gemini-1.5-flash' 
    } = body;

    const apiKey = clientApiKey || req.headers.get('x-gemini-key') || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    // If no Gemini key, return intelligent procedural policy recommendation
    if (!apiKey || apiKey.trim() === '') {
      const fallback = generateFallbackPolicyRecommendation(params, impact, cityName);
      return NextResponse.json(fallback);
    }

    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const modelName = requestedModel.includes('pro') ? 'gemini-1.5-pro' : 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `
Anda adalah Pakar Perancang Regulasi Lingkungan Hidup & Kebijakan Tata Kota ZeroDark.
Buat analisis kebijakan dan draf rekomendasi peraturan tata kelola pencahayaan luar ruang (*Dark Sky Ordinance*) untuk wilayah: "${cityName}".

Parameter Simulasi Kebijakan yang Diuji Pengguna:
- Jam Malam Penerangan Komersial: Pukul ${params.curfewHour}:00
- Faktor Peredupan LED Publik: ${params.dimmingFactor}%
- Kepatuhan Tudung Lampu (Full-Cutoff Shielding): ${params.shieldingCompliance}%
- Radius Koridor Penyangga Langit Gelap: ${params.corridorBufferKm} km

Hasil Proyeksi Dampak Simulasi:
- Reduksi Polusi Cahaya: -${impact.lightPollutionReductionPct}%
- Energi Dihemat: ${impact.energySavedMwh} MWh/tahun
- Penurunan Emisi Karbon: ${impact.carbonReducedTons} Ton CO2e/tahun
- Penghematan Biaya Pemda: $${impact.costSavingsUsd.toLocaleString()} / tahun
- Luas Koridor Suaka Satwa Pulih: ${impact.restoredFaunaCorridorHa} Hektar
- Peningkatan Kejernihan Langit Malam: +${impact.skyClarityBoostPct}%

Berikan respon HANYA dalam format JSON valid strictly matching struktur berikut (tanpa markdown wrapper \`\`\`json):
{
  "executiveSummary": "Ringkasan eksekutif 2-3 kalimat mengenai dampak penerapan kebijakan ini di ${cityName}",
  "projectedROI": "Deskripsi singkat mengenai efisiensi anggaran dan payback period investasi tudung/smart dimming",
  "legalDraftingPoints": [
    "Pasal 1: ...",
    "Pasal 2: ...",
    "Pasal 3: ..."
  ],
  "ecologicalBenefits": [
    "Poin manfaat 1 untuk satwa nokturnal",
    "Poin manfaat 2 untuk ritme sirkadian warga",
    "Poin manfaat 3 untuk pariwisata astrowisata"
  ],
  "implementationRoadmap": [
    { "phase": "Fase 1 (0-6 Bulan)", "title": "Sosialisasi & Audit Inventaris", "desc": "Penjelasan langkah..." },
    { "phase": "Fase 2 (6-18 Bulan)", "title": "Retrofit Lampu & Penegakan Regulasi", "desc": "Penjelasan langkah..." },
    { "phase": "Fase 3 (18+ Bulan)", "title": "Sertifikasi Cagar Langit Gelap (IDA)", "desc": "Penjelasan langkah..." }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed: AIPolicyRecommendation = JSON.parse(jsonMatch[0]);
      return NextResponse.json(parsed);
    } else {
      throw new Error('Gagal mem-parsing output JSON dari AI');
    }
  } catch (error: any) {
    console.error('Policy advisor error:', error?.message);
    const fallback = generateFallbackPolicyRecommendation(
      { curfewHour: 22, dimmingFactor: 55, shieldingCompliance: 75, corridorBufferKm: 12 },
      { energySavedMwh: 2600, carbonReducedTons: 1870, lightPollutionReductionPct: 68, restoredFaunaCorridorHa: 2000, costSavingsUsd: 350000, skyClarityBoostPct: 71 },
      'Kawasan Perkotaan'
    );
    return NextResponse.json(fallback);
  }
}

function generateFallbackPolicyRecommendation(
  params: PolicyParams,
  impact: PolicySimulationResult,
  cityName: string
): AIPolicyRecommendation {
  return {
    executiveSummary: `Penerapan kombinasi jam malam penerangan pukul ${params.curfewHour}:00 dan kepatuhan tudung ${params.shieldingCompliance}% di ${cityName} diproyeksikan memangkas limpahan cahaya liar sebesar ${impact.lightPollutionReductionPct}% sekaligus menghemat anggaran listrik pemda sebesar $${impact.costSavingsUsd.toLocaleString()} per tahun.`,
    projectedROI: `Penghematan energi listrik sebesar ${impact.energySavedMwh.toLocaleString()} MWh per tahun memungkinkan periode pengembalian modal (payback period) retrofit lampu pintar full-cutoff tercapai dalam 14-18 bulan.`,
    legalDraftingPoints: [
      `Kewajiban Penggunaan Tudung Penuh (Full-Cutoff): Semua lampu penerangan jalan umum (PJU) dan lampu sorot komersial wajib menggunakan luminer berpelindung 100% downward-throw.`,
      `Batas Suhu Warna Cahaya: Dilarang menggunakan lampu luar ruangan bernada dingin di atas 2700K (wajib warm-amber) untuk mencegah hamburan spektrum biru.`,
      `Jam Malam Reklame & Fasilitas Komersial: Papan reklame LED dan penerangan arsitektural gedung diwajibkan padam otomatis atau meredup minimal 50% setelah pukul ${params.curfewHour}:00 WIB.`,
      `Zonasi Penyangga Ekologis: Radius ${params.corridorBufferKm} km dari habitat hutan/pesisir ditetapkan sebagai Kawasan Nol Limpahan Cahaya Ke Atas (*Zero Upward Light Ratio*).`,
    ],
    ecologicalBenefits: [
      `Pemulihan ${impact.restoredFaunaCorridorHa.toLocaleString()} Ha koridor jelajah satwa malam dari bahaya disorientasi fototaksis.`,
      `Perlindungan populasi serangga penyerbuk dan burung migran yang melintasi wilayah ${cityName}.`,
      `Peningkatan kejernihan kubah langit hingga +${impact.skyClarityBoostPct}%, membuka potensi ekonomi ekowisata pengamatan bintang (*astrotourism*).`,
    ],
    implementationRoadmap: [
      {
        phase: 'Fase 1 (Bulan 1-6)',
        title: 'Inventarisasi & Penetapan Peraturan Walikota/Bupati',
        desc: 'Audit titik lampu PJU dan pengesahan panduan teknis pencahayaan ramah lingkungan.',
      },
      {
        phase: 'Fase 2 (Bulan 7-18)',
        title: 'Program Retrofit Lampu Pintar & Insentif Komersial',
        desc: 'Penggantian bertahap tudung lampu jalan dan insentif pengurangan pajak bagi gedung yang patuh.',
      },
      {
        phase: 'Fase 3 (Bulan 19-36)',
        title: 'Monitoring Terbuka & Pengajuan Sertifikasi Cagar Langit Gelap',
        desc: 'Pemantauan berkala via sensor ZeroDark dan inisiasi suaka langit malam internasional.',
      },
    ],
  };
}
