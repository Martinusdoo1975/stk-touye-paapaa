import { GoogleGenAI } from "@google/genai";
import { ImageParams, AspectRatio } from "../types";

// Helper to construct the structured prompt
const constructPrompt = (params: ImageParams): string => {
  return `
Create a high-quality image based on the following structured specification:

1. **Main Subject**: ${params.subject}
2. **Visual Style**: ${params.style}
3. **Lighting Atmosphere**: ${params.lighting}
4. **Dominant Colors**: ${params.colors}
5. **Additional Details**: ${params.details}

Please ensure the image adheres strictly to the visual style and atmosphere described.
  `.trim();
};

export const generateImageWithGemini = async (
  params: ImageParams
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = constructPrompt(params);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: params.aspectRatio,
        },
      },
    });

    // Extract image from response
    let base64Image: string | null = null;
    
    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                base64Image = part.inlineData.data;
                break;
            }
        }
    }

    if (!base64Image) {
      // Sometimes the model refuses and returns text explanation
      const textOutput = response.text || "No image generated.";
      throw new Error(`Generation failed: ${textOutput}`);
    }

    return `data:image/png;base64,${base64Image}`;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "An unexpected error occurred while generating the image.");
  }
};
