import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateMockAnalysis } from '@/utils/mockEngine';
import { AnalysisResult, AtmosphereMode } from '@/types/environmental';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, mode: requestedMode, location } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'Image base64 is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    // If no API key is provided, use the high-fidelity mock engine
    if (!apiKey) {
      console.log('No GEMINI_API_KEY found, using intelligent offline heuristic analyzer.');
      const mockResult = generateMockAnalysis(requestedMode as AtmosphereMode, image, location?.locationName);
      return NextResponse.json(mockResult);
    }

    // Process image base64
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `
You are the ZeroDark Dual-Atmosphere Eco-Scanner vision engine.
Analyze this environmental or sky photograph.

1. Determine whether this scene represents:
   - "day_air_pollution" (Daytime scene: analyze atmospheric clarity, visible haze, smog, PM2.5 scattering, horizon contrast, estimated AQI 0-500)
   - "night_light_pollution" (Nighttime scene: analyze artificial skyglow, unshielded lighting, glare, Bortle Scale 1-9, estimated ground lux 0-200)

2. Respond ONLY with valid JSON strictly matching this schema:
{
  "mode": "day_air_pollution" or "night_light_pollution",
  "primaryMetric": {
    "label": "Estimated AQI" (if day) or "Bortle Scale Class" (if night),
    "value": number (e.g. 45 or 142 for AQI; 1 to 9 for Bortle),
    "category": string (e.g. "Good", "Moderate", "Unhealthy for Sensitive Groups", "Suburban Sky", "Inner-City Skyglow"),
    "colorHex": string ("#DCFD8B" for clean/low risk, "#BC84EE" for moderate, "#FF823A" for high/unhealthy/polluted),
    "unit": string ("AQI" or "Class 1-9")
  },
  "secondaryMetrics": {
    "visibilityKm": number (e.g. 4.5),
    "estimatedLux": number (e.g. 45 or 0.1),
    "hazeDensity": string (e.g. "Low", "Moderate", "Dense Particulate Smog", "Diffuse Marine Skyglow"),
    "detectedAnomalies": [string, string] (e.g. ["Unshielded Billboard Glare", "Particulate Smog Layer", "Blue CCT Overillumination", "Thermal Inversion Trap"])
  },
  "environmentalImpact": {
    "faunaRiskLevel": "Low" | "Moderate" | "High" | "Critical",
    "healthRecommendation": string,
    "actionableEcoTip": string,
    "floraFaunaImpact": string
  },
  "summaryDescription": string,
  "confidenceScore": number
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
    const mockResult = generateMockAnalysis();
    return NextResponse.json(mockResult);
  }
}
