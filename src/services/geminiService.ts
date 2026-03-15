import { GoogleGenAI, Modality, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is missing. AI features will not work.");
}

export const getQuranicResponse = async (query: string, language: string = 'en') => {
  const model = ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: query,
    config: {
      systemInstruction: `You are an advanced Islamic AI assistant named "Noor". 
      Your knowledge is based strictly on the Holy Quran and authentic Sunnah (Hadith). 
      Answer questions related to life problems, spiritual guidance, and Islamic history. 
      Always provide references to Surah and Ayah when possible. 
      Respond in the requested language: ${language}. 
      If a question is outside Islamic scope, politely redirect the user.`,
    },
  });
  return (await model).text;
};

export const generateStoryAudio = async (text: string, voiceName: 'Kore' | 'Zephyr' | 'Puck' = 'Kore') => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio || null;
};

export const translateContent = async (text: string, targetLang: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Translate the following text to ${targetLang}: ${text}`,
  });
  return response.text;
};
