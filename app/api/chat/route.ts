import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ChatRequestBody {
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  scanContext?: {
    locationName?: string;
    mode?: string;
    label?: string;
    metricValue?: number;
    metricUnit?: string;
    severity?: string;
    faunaHealthImpact?: string;
    ecoTip?: string;
  };
  apiKey?: string;
  model?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestBody = await req.json();
    const { message, history = [], scanContext, apiKey: clientApiKey, model: requestedModel = 'gemini-1.5-flash' } = body;

    if (!message || message.trim() === '') {
      return NextResponse.json({ error: 'Pesan tidak boleh kosong' }, { status: 400 });
    }

    const apiKey = clientApiKey || req.headers.get('x-gemini-key') || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    // Intelligent heuristic assistant fallback if no API key is set
    if (!apiKey || apiKey.trim() === '') {
      const fallbackReply = generateHeuristicChatReply(message, scanContext);
      return NextResponse.json({
        reply: fallbackReply,
        source: 'local_heuristic_copilot',
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const modelName = requestedModel.includes('pro') ? 'gemini-1.5-pro' : 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    let systemContext = `
Anda adalah "ZeroDark Eco-Copilot", asisten AI spesialis kecerdasan lingkungan, konservasi langit malam (International Dark-Sky standards), mitigasi polusi cahaya, dan analisis kualitas udara (Air Quality Index / AQI).

Tugas Anda:
1. Memberikan jawaban yang ramah, berbasis sains mutakhir, praktis, dan mudah dipahami dalam Bahasa Indonesia (kecuali jika pengguna bertanya dalam bahasa lain).
2. Fokus pada dampak ekologis: polusi cahaya terhadap satwa nokturnal (kelelawar, penyu laut, kunang-kunang, ritme sirkadian melatonin manusia) dan polusi udara terhadap sistem pernapasan dan stomata tumbuhan.
3. Memberikan rekomendasi mitigasi konkret (misal: penggunaan lampu LED hangat <=2700K, tudung lampu full-cutoff, jam malam penerangan, filter HEPA, koridor hijau).
`;

    if (scanContext && scanContext.label) {
      systemContext += `\n[KONTEKS HASIL PEMINDAIAN AKTIF PENGGUNA]:
- Lokasi: ${scanContext.locationName || 'Tidak ditentukan'}
- Mode Pemindaian: ${scanContext.mode === 'day_air_pollution' ? 'Siang Hari (Kualitas Udara & Kabut Asap)' : 'Malam Hari (Polusi Cahaya & Skala Bortle)'}
- Klasifikasi: ${scanContext.label}
- Nilai Metrik: ${scanContext.metricValue} ${scanContext.metricUnit}
- Tingkat Risiko Ekologis: ${scanContext.severity || 'Sedang'}
- Dampak Satwa: ${scanContext.faunaHealthImpact || '-'}
- Rekomendasi Ekologis Awal: ${scanContext.ecoTip || '-'}
Gunakan konteks ini secara relevan untuk menjawab pertanyaan pengguna.
`;
    }

    // Build chat history for Gemini
    const contents = [
      {
        role: 'user',
        parts: [{ text: `${systemContext}\n\nPertanyaan/Pesan Pengguna:\n${message}` }],
      },
    ];

    // If there is prior conversation history
    if (history.length > 0) {
      const formattedHistory = history.slice(-6).map((h) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      }));
      // Append current message
      formattedHistory.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const chat = model.startChat({
        systemInstruction: systemContext,
        history: formattedHistory.slice(0, -1),
      });

      const response = await chat.sendMessage(message);
      return NextResponse.json({
        reply: response.response.text(),
        source: 'gemini_api',
      });
    }

    const response = await model.generateContent({
      contents,
    });

    return NextResponse.json({
      reply: response.response.text(),
      source: 'gemini_api',
    });
  } catch (error: any) {
    console.error('Chat endpoint error:', error?.message);
    const body: ChatRequestBody = await req.json().catch(() => ({ message: '' }));
    const fallbackReply = generateHeuristicChatReply(body.message || '', body.scanContext);
    return NextResponse.json({
      reply: `${fallbackReply}\n\n*(Catatan: Mode Asisten Offline ZeroDark aktif karena kendala koneksi Gemini: ${error?.message || 'Error'})*`,
      source: 'fallback',
    });
  }
}

function generateHeuristicChatReply(
  query: string,
  scanContext?: ChatRequestBody['scanContext']
): string {
  const q = query.toLowerCase();

  if (q.includes('cahaya') || q.includes('lampu') || q.includes('bortle') || q.includes('glare')) {
    return `💡 **Panduan Mitigasi Polusi Cahaya ZeroDark:**
1. **Gunakan Tudung Penuh (*Full-Cutoff Shield*)**: Pastikan 100% berkas cahaya mengarah ke bawah, bukan ke langit atau mata pejalan kaki.
2. **Pilih Suhu Warna Hangat**: Gunakan LED dengan Correlated Color Temperature (CCT) ≤ 2700K (amber/kuning). Cahaya biru (>4000K) menyebar 4x lebih kuat di atmosfer dan mematikan produksi hormon melatonin.
3. **Terapkan Jam Malam (*Curfew*)**: Pasang timer atau sensor gerak agar lampu fasad dan dekoratif padam setelah pukul 22:00.
4. **Lindungi Satwa**: Satwa malam seperti serangga penyerbuk, kelelawar, dan burung migran mengandalkan langit gelap alami untuk navigasi dan reproduksi.`;
  }

  if (q.includes('udara') || q.includes('aqi') || q.includes('smog') || q.includes('asap') || q.includes('pm2.5')) {
    return `🍃 **Panduan Perlindungan Kualitas Udara ZeroDark:**
1. **Indeks AQI**: Nilai 0–50 tergolong Bersih/Pristine, 51–100 Sedang, dan >150 Berbahaya untuk kelompok rentan.
2. **Mitigasi Partikulat PM2.5**: Gunakan masker standar N95/KF94 saat kabut asap tebal, pasang filter udara HEPA di dalam ruangan, dan jaga vegetasi penyerap polutan (seperti lidah mertua dan trembesi).
3. **Penyebab Utama**: Emisi gas buang kendaraan, debu konstruksi, serta fenomena inversi termal yang memerangkap polutan di lapisan udara bawah.`;
  }

  if (q.includes('perda') || q.includes('kebijakan') || q.includes('aturan') || q.includes('kota')) {
    return `🏛️ **Draf Rekomendasi Kebijakan Tata Kota ZeroDark:**
- **Zonasi Penerangan Luar Ruang**: Membagi kawasan kota menjadi Zona Cagar Gelap (E1), Zona Rural (E2), Zona Urban Teratur (E3), dan Zona Komersial Terkendali (E4).
- **Insentif Efisiensi Energi**: Memberikan potongan pajak PBB bagi gedung komersial yang mengadopsi pencahayaan ramah langit (*Dark Sky Compliant*).
- **Regulasi Billboard Digital**: Pembatasan batas luminansi maksimal 100 nits setelah matahari terbenam.`;
  }

  if (scanContext && scanContext.label) {
    return `🔍 **Analisis Terkait Pemindaian Anda (${scanContext.label}):**
- **Metrik Tercatat**: ${scanContext.metricValue} ${scanContext.metricUnit} di area ${scanContext.locationName || 'sekitar'}.
- **Tingkat Risiko**: ${scanContext.severity || 'Sedang'}.
- **Dampak Satwa**: ${scanContext.faunaHealthImpact || 'Perlu pemantauan berkala terhadap keanekaragaman hayati nokturnal.'}
- **Langkah Disarankan**: ${scanContext.ecoTip || 'Kurangi limpahan cahaya dan pertahankan ruang terbuka hijau di sekitar titik ini.'}`;
  }

  return `🌿 **ZeroDark AI Eco-Copilot Siap Membantu!**
Anda dapat berkonsultasi mengenai:
1. Cara menekan polusi cahaya di lingkungan perumahan atau fasilitas usaha.
2. Mengapa spektrum biru LED berbahaya bagi satwa malam & kesehatan tidur.
3. Strategi mitigasi kabut asap dan partikulat debu (PM2.5).
4. Pembuatan draf regulasi tata kelola pencahayaan publik ramah lingkungan.

Silakan ajukan pertanyaan spesifik Anda!`;
}
