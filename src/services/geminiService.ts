import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Workout } from "../types/fitness";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateWorkout(user: UserProfile, date: string): Promise<Workout> {
  const prompt = `
    Generate a personalized workout for a user with the following profile:
    Age: ${user.age}
    Weight: ${user.weight}kg
    Height: ${user.height}cm
    Activity Level: ${user.activityLevel}
    Goals: ${user.fitnessGoals?.join(", ") || "General fitness"}
    Date: ${date}

    The workout should be balanced and safe.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are an expert fitness coach. Provide daily workout suggestions in JSON format.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          difficulty: { type: Type.STRING },
          estimatedTime: { type: Type.INTEGER, description: "Duration in minutes" },
          exercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                reps: { type: Type.STRING },
                sets: { type: Type.INTEGER },
                duration: { type: Type.STRING }
              },
              required: ["name"]
            }
          }
        },
        required: ["title", "difficulty", "estimatedTime", "exercises"]
      }
    }
  });

  const workoutData = JSON.parse(response.text);
  
  return {
    ...workoutData,
    userId: user.uid,
    date,
    generatedAt: new Date().toISOString()
  };
}
