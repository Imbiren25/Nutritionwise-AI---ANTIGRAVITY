import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AssessmentData, AIResponse, FoodItem, StockInventoryData, IFCTFood } from "../types";
const API_KEY = (import.meta.env.VITE_GENAI_API_KEY as string | undefined)
  || (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)
  || (process.env.GEMINI_API_KEY as string | undefined)
  || (process.env.API_KEY as string | undefined);
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;




const analyzeFoodPatterns = (data: AssessmentData) => {
  const allFoods: FoodItem[] = Object.values(data.sectionI.meals).flat();
  const foodNames = allFoods.map(f => f.name.toLowerCase());

  const patterns = {
    vegetablePresence: foodNames.some(name => name.includes('vegetable') || name.includes('spinach')),
    fruitPresence: foodNames.some(name => name.includes('apple') || name.includes('banana') || name.includes('fruit')),
    milkFrequency: foodNames.filter(name => name.includes('milk')).length,
    pulsesFrequency: foodNames.filter(name => name.includes('dal') || name.includes('lentil')).length,
    greensFrequency: foodNames.filter(name => name.includes('spinach')).length,
    eggsFrequency: foodNames.filter(name => name.includes('egg')).length,
    meatFrequency: foodNames.filter(name => name.includes('chicken') || name.includes('meat')).length,
  };

  return `
    - Food Intake Pattern:
      - Vegetable Presence: ${patterns.vegetablePresence ? 'Yes' : 'No'}
      - Fruit Presence: ${patterns.fruitPresence ? 'Yes' : 'No'}
      - Milk/Curd servings: ${patterns.milkFrequency}
      - Pulses/Dal servings: ${patterns.pulsesFrequency}
      - Green veg servings: ${patterns.greensFrequency}
      - Egg servings: ${patterns.eggsFrequency}
      - Meat/Fish servings: ${patterns.meatFrequency}
    `;
};


const buildPrompt = (data: AssessmentData): string => {
  const deficiencies = Object.entries(data.sectionJ.rdaComparison)
    .filter(([, value]) => value < 70)
    .map(([key, value]) => `${key} (${value}%)`)
    .join(', ') || 'none';

  const foodPatterns = analyzeFoodPatterns(data);

  return `
    SYSTEM INSTRUCTION:
    You are NutritionWise, an AI assistant for Indian medical students, aligned with ICMR-NIN 2024 and IFCT 2021.
    Your goal is to provide personalized, educational dietary advice based on the provided 24-hour recall data.
    Your analysis and suggestions MUST be adjusted for the user's age, sex, physiological state, activity level, and socio-economic status.
    You MUST NOT provide any medical advice, clinical diagnosis, or specific weight-loss plans.
    Your output MUST be in the specified JSON format and adhere to all safety filters. The string values in the JSON should be plain text without any markdown formatting.

    AI LOGIC (How to think):
    1.  Identify top 3-5 nutrient gaps based on severity (<50% is severe, 50-69% is moderate). Prioritize severe gaps. Also check for zero intake of key food groups (fruits, milk, dal, greens).
    2.  Classify the overall diet pattern (e.g., high-carb, low-protein, monotonous).
    3.  Adjust food suggestions based on SES. For lower SES (Class IV-V), recommend affordable, locally available foods like moong, chana, groundnuts, seasonal greens, bajra, jowar, sprouts. For middle/upper SES, you can include eggs, paneer, multi-millets, etc.
    4.  If household environment shows no fridge, avoid suggesting highly perishable items that require refrigeration.
    5.  Adjust hydration and activity advice based on the user's reported activity level. Be gentle and encouraging.
    6.  Apply a final safety filter: EXCLUDE diagnoses, disease names (like anemia, diabetes), supplement recommendations, and calorie-restriction for weight loss. The output must be purely educational.

    USER ASSESSMENT DATA (SANITIZED):
    - Demographics:
      - Age Group: ${data.sectionA.age > 18 ? 'Adult' : (data.sectionA.age > 5 ? 'Adolescent' : 'Child')}
      - Sex: ${data.sectionA.sex}
      - Physiological State: ${data.sectionG.physiologicalState}
      - Activity Level: ${data.sectionG.activityLevel}
      - Dietary Pattern: ${data.sectionF.dietaryPattern}
    
    - Nutrient Profile (% of RDA):
      - Energy: ${data.sectionJ.rdaComparison.energy}%
      - Protein: ${data.sectionJ.rdaComparison.protein}%
      - Fat: ${data.sectionJ.rdaComparison.fat}%
      - Carbs: ${data.sectionJ.rdaComparison.carbs}%
      - Iron: ${data.sectionJ.rdaComparison.iron}%
      - Calcium: ${data.sectionJ.rdaComparison.calcium}%
      - Vitamin A: ${data.sectionJ.rdaComparison.vitaminA}%
      - Fiber: ${data.sectionJ.rdaComparison.fiber}%
      - Key Deficiencies (<70% RDA): ${deficiencies}
      
    ${foodPatterns}
      
    - Household Environment:
      - Storage: ${data.sectionF.storageFacilities}
      - Market Access: ${data.sectionF.marketAccess}
      - Water Availability: ${data.sectionF.waterSource}
      - Fuel Type: ${data.sectionF.cookingFuel}

    - SES Class: ${data.sectionE.ses}

    TASK:
    Generate a JSON object with the specified structure. The content must be practical, non-judgmental, and based strictly on the provided data and logic instructions.
    `;
};

export const generateDietSummary = async (data: AssessmentData): Promise<AIResponse> => {
  const prompt = buildPrompt(data);
  console.log('generateDietSummary called');
  try {
    if (!ai) {
      console.error('AI not initialized for summary generation');
      throw new Error("AI is unavailable: API key not configured.");
    }
    console.log('Calling Gemini API for diet summary...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            key_nutrient_gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            food_suggestions: {
              type: Type.OBJECT,
              properties: {
                breakfast: { type: Type.ARRAY, items: { type: Type.STRING } },
                lunch: { type: Type.ARRAY, items: { type: Type.STRING } },
                dinner: { type: Type.ARRAY, items: { type: Type.STRING } },
                snacks: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            meal_wise_improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            affordable_swaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            hydration_activity: {
              type: Type.OBJECT,
              properties: {
                hydration: { type: Type.STRING },
                activity: { type: Type.STRING }
              }
            },
            disclaimer: { type: Type.STRING }
          },
          required: ["summary", "key_nutrient_gaps", "food_suggestions", "meal_wise_improvements", "affordable_swaps", "hydration_activity", "disclaimer"]
        },
      },
    });
    console.log('Summary generated successfully');
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AIResponse;
  } catch (error) {
    console.error('Error generating diet summary:', error);
    const raw = error instanceof Error ? error.message : String(error);
    console.error('Error details:', raw);

    if (/429|quota/i.test(raw)) {
      throw new Error("API quota exceeded. Please wait a moment and try again, or upgrade your Gemini API plan.");
    }
    if (/API_KEY_INVALID|API key not valid|403/i.test(raw)) {
      throw new Error("Gemini API key invalid. Set `VITE_GENAI_API_KEY`, enable Generative Language API, and allow your domain in key restrictions.");
    }
    if (/404|not found/i.test(raw)) {
      throw new Error("AI Model not accessible. The gemini-2.5-flash model may not be available with your API key.");
    }
    throw new Error(`Failed to generate AI summary: ${raw}`);
  }
};

const analyzeStockPatterns = (data: StockInventoryData) => {
  const foodGroupsPresent = Object.entries(data.sectionF)
    .filter(([, items]) => items.length > 0)
    .map(([group]) => group)
    .join(', ') || 'none';

  return `
    - Household Adequacy:
      - Dietary Diversity Score: ${data.sectionG.dietaryDiversityScore} out of 10 food groups.
      - Cereal Stock Duration: Approx. ${data.sectionG.daysFoodLasts} days.
      - Food Insecurity Risk: ${data.sectionG.foodInsecurityRisk}.
    
    - Available Food Groups: ${foodGroupsPresent}
    `;
};

const buildStockPrompt = (data: StockInventoryData): string => {
  const stockPatterns = analyzeStockPatterns(data);

  return `
    SYSTEM INSTRUCTION:
    You are NutritionWise, an AI assistant for Indian medical students, aligned with ICMR-NIN 2024 and IFCT 2021.
    Your goal is to provide educational advice on household food security and dietary diversity based on the provided stock inventory data.
    Your analysis and suggestions MUST be adjusted for the family's socio-economic status.
    You MUST NOT provide any medical advice or clinical diagnosis.
    Your output MUST be in the specified JSON format. The string values in the JSON should be plain text without any markdown formatting.

    AI LOGIC (How to think):
    1.  Analyze the 'Food Insecurity Risk'. This is the primary summary of the situation.
    2.  Analyze the 'Dietary Diversity Score'. If it's low (e.g., < 5), identify the missing food groups (cereals, pulses, vegetables, fruits, dairy, etc.).
    3.  Analyze the 'Cereal Stock Duration'. If it's low (e.g., < 7 days), emphasize the need for immediate restocking of staples.
    4.  Based on the SES Class, suggest practical and affordable ways to improve dietary diversity. For lower SES, recommend purchasing items like millets, seasonal vegetables, and pulses.
    5.  Suggest simple meal ideas that can be prepared using the currently available food groups listed in the data.
    6.  Provide general advice on smart shopping and food storage to reduce waste.

    USER ASSESSMENT DATA (SANITIZED):
    - Head of Family:
      - Education: ${data.sectionB.hofEducation}
      - Occupation: ${data.sectionB.hofOccupation}
    
    - Household Context:
      - Location: ${data.sectionC.location}
      - Total Family CU: ${data.sectionE.totalCU.toFixed(2)}
      - SES Class: ${data.sectionD.ses}
      
    ${stockPatterns}
      
    TASK:
    Generate a JSON object with the specified structure. The content must be practical, non-judgmental, and focused on improving household food security and diversity based on the stock data.
    `;
};

export const generateStockSummary = async (data: StockInventoryData): Promise<AIResponse> => {
  const prompt = buildStockPrompt(data);
  try {
    if (!ai) {
      throw new Error("AI is unavailable: API key not configured.");
    }
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            key_nutrient_gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            food_suggestions: {
              type: Type.OBJECT,
              properties: {
                breakfast: { type: Type.ARRAY, items: { type: Type.STRING } },
                lunch: { type: Type.ARRAY, items: { type: Type.STRING } },
                dinner: { type: Type.ARRAY, items: { type: Type.STRING } },
                snacks: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            meal_wise_improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            affordable_swaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            hydration_activity: {
              type: Type.OBJECT,
              properties: {
                hydration: { type: Type.STRING },
                activity: { type: Type.STRING }
              }
            },
            disclaimer: { type: Type.STRING }
          },
          required: ["summary", "key_nutrient_gaps", "food_suggestions", "meal_wise_improvements", "affordable_swaps", "hydration_activity", "disclaimer"]
        },
      },
    });
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AIResponse;
  } catch (error) {
    const raw = error instanceof Error ? error.message : String(error);
    if (/API_KEY_INVALID|API key not valid/i.test(raw)) {
      throw new Error("Gemini API key invalid. Set `VITE_GENAI_API_KEY`, enable Generative Language API, and allow `http://localhost:4173/*` in key restrictions.");
    }
    throw new Error("Failed to generate AI summary. Check API key, network, and console logs.");
  }
};


export const generateMealImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:image/png;base64,${base64ImageBytes}`;
      }
    }
    throw new Error("No image data found in response.");
  } catch (error) {
    console.error("Error generating meal image:", error);
    throw new Error("Failed to generate meal image.");
  }
};

export const lookupIFCT = async (foodName: string): Promise<IFCTFood | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are NutritionWise aligned with ICMR-NIN IFCT 2021. Return per-100g nutrient values for the food "${foodName}" as strict JSON. Use fields: name, group, per100g{energy,protein,fat,carbs,fiber,iron,calcium,vitaminA,zinc}. If unsure, return null.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            group: { type: Type.STRING },
            per100g: {
              type: Type.OBJECT,
              properties: {
                energy: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                fat: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fiber: { type: Type.NUMBER },
                iron: { type: Type.NUMBER },
                calcium: { type: Type.NUMBER },
                vitaminA: { type: Type.NUMBER },
                zinc: { type: Type.NUMBER }
              },
              required: ['energy', 'protein', 'fat', 'carbs', 'fiber', 'iron', 'calcium', 'vitaminA', 'zinc']
            }
          },
          required: ['name', 'group', 'per100g']
        }
      }
    });
    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText) as { name?: string; group?: string; per100g?: IFCTFood['per100g'] } | null;
    if (!parsed || !parsed.name || !parsed.group || !parsed.per100g) return null;
    const id = parsed.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const group = (parsed.group.toLowerCase() as IFCTFood['group']);
    return { id, name: parsed.name, group, source: 'ai', per100g: parsed.per100g } as IFCTFood;
  } catch {
    return null;
  }
};

export const compareIFCT = async (foods: string[]): Promise<IFCTFood[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Return a JSON array comparing per-100g nutrients for these Indian foods aligned with IFCT 2021: ${foods.join(', ')}. Each item fields: name, group, per100g{energy,protein,fat,carbs,fiber,iron,calcium,vitaminA,zinc}.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              group: { type: Type.STRING },
              per100g: {
                type: Type.OBJECT,
                properties: {
                  energy: { type: Type.NUMBER },
                  protein: { type: Type.NUMBER },
                  fat: { type: Type.NUMBER },
                  carbs: { type: Type.NUMBER },
                  fiber: { type: Type.NUMBER },
                  iron: { type: Type.NUMBER },
                  calcium: { type: Type.NUMBER },
                  vitaminA: { type: Type.NUMBER },
                  zinc: { type: Type.NUMBER }
                },
                required: ['energy', 'protein', 'fat', 'carbs', 'fiber', 'iron', 'calcium', 'vitaminA', 'zinc']
              }
            },
            required: ['name', 'group', 'per100g']
          }
        }
      }
    });
    const jsonText = response.text.trim();
    const items = JSON.parse(jsonText) as Array<{ name: string; group: string; per100g: IFCTFood['per100g'] }>;
    return items.map(i => ({ id: i.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name: i.name, group: i.group.toLowerCase() as IFCTFood['group'], source: 'ai', per100g: i.per100g }));
  } catch {
    return [];
  }
};