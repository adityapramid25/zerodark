import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateMockAnalysis } from '@/utils/mockEngine';
import { AnalysisResult, AtmosphereMode } from '@/types/environmental';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      image, 
      mode: requestedMode, 
      location, 
      apiKey: clientApiKey,
      model: requestedModel = 'gemini-1.5-flash' 
    } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'Image base64 is required' },
        { status: 400 }
      );
    }

    const apiKey = clientApiKey || req.headers.get('x-gemini-key') || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    // If no API key is provided, use the high-fidelity heuristic engine
    if (!apiKey || apiKey.trim() === '') {
      console.log('No GEMINI_API_KEY found, using intelligent offline heuristic vision analyzer.');
      const mockResult = generateMockAnalysis(requestedMode as AtmosphereMode, image, location?.locationName);
      return NextResponse.json(mockResult);
    }

    // Process image base64
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';

    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const modelName = requestedModel.includes('pro') ? 'gemini-1.5-pro' : 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    const systemPrompt = `
You are the ZeroDark Dual-Atmosphere Eco-Scanner vision engine (AI Vision Environmental Analyst).
Analyze this environmental or sky photograph with extreme precision.

1. Determine whether this scene represents:
   - "day_air_pollution" (Daytime scene: analyze atmospheric clarity, visible haze, smog, PM2.5 scattering, horizon contrast, estimated AQI 0-500)
   - "night_light_pollution" (Nighttime scene: analyze artificial skyglow, unshielded lighting, glare, Bortle Scale 1-9, estimated ground lux 0-200)

2. Respond ONLY with valid JSON strictly matching this schema with NO markdown formatting around it (do not wrap in \`\`\`json):
{
  "mode": "day_air_pollution" or "night_light_pollution",
  "primaryMetric": {
    "label": "Estimated AQI" (if day) or "Bortle Scale Class" (if night),
    "value": number (e.g. 35 or 168 for AQI; 1 to 9 for Bortle),
    "category": string (e.g. "Good", "Moderate", "Unhealthy for Sensitive Groups", "Suburban Skyglow", "Inner-City Light Dome", "Pristine Dark Sky"),
    "colorHex": string ("#10B981" for clean/low risk, "#F59E0B" for moderate, "#EF4444" for high/critical),
    "unit": string ("AQI (US)" or "Class 1-9")
  },
  "secondaryMetrics": {
    "visibilityKm": number (e.g. 18.5),
    "estimatedLux": number (e.g. 45000 for day, 0.08 to 85.0 for night),
    "hazeDensity": string (e.g. "Low", "Moderate", "Dense Particulate Smog", "Diffuse Marine Skyglow"),
    "detectedAnomalies": [string, string] (e.g. ["Unshielded Billboard Floodlight", "High-CCT Blue Glare", "Particulate Thermal Inversion", "Rayleigh Scattering Loss"])
  },
  "environmentalImpact": {
    "faunaRiskLevel": "Low" | "Moderate" | "High" | "Critical",
    "healthRecommendation": string (actionable advice in Indonesian language),
    "actionableEcoTip": string (specific eco action in Indonesian language),
    "floraFaunaImpact": string (impact on nocturnal pollinators, bats, bird migration, or plant stomata in Indonesian language)
  },
  "summaryDescription": string (brief analytical summary in Indonesian language),
  "confidenceScore": number (0.0 to 1.0)
}
`;

    const result = await model.generateContent([
      systemPrompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
    ]);

    const responseText = result.response.text();
    // Parse json out of response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed: AnalysisResult = JSON.parse(jsonMatch[0]);
      return NextResponse.json(parsed);
    } else {
      throw new Error('Could not parse Gemini JSON output');
    }
  } catch (error: any) {
    console.error('Error in analyze route, falling back to mock engine:', error?.message);
    const mockResult = generateMockAnalysis(undefined, undefined, undefined);
    return NextResponse.json({
      ...mockResult,
      _fallbackNotice: `Analisis AI lokal aktif (${error?.message || 'Gemini fallback'})`,
    });
  }
}

