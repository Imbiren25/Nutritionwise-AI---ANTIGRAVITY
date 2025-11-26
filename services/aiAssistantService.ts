
import { GoogleGenAI } from "@google/genai";
import { AssessmentData, StockInventoryData } from "../types";
import { analyticsService } from "./analyticsService";

const RAW_API_KEY = (import.meta.env.VITE_GENAI_API_KEY as string | undefined)
  || (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)
  || (process.env.GEMINI_API_KEY as string | undefined)
  || (process.env.API_KEY as string | undefined);
const API_KEY = RAW_API_KEY && RAW_API_KEY !== 'PLACEHOLDER_API_KEY' ? RAW_API_KEY : undefined;

console.log('AI Assistant Service - API Key Status:', API_KEY ? 'Configured' : 'Missing');

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

console.log('AI Assistant Service - SDK Initialized:', ai ? 'Yes' : 'No');

// Store conversation history
let conversationHistory: Array<{ role: 'user' | 'model', content: string }> = [];
let systemInstruction: string = '';

const buildSystemInstruction = (data: AssessmentData | StockInventoryData, mode: 'report' | 'general' | 'stock-report' = 'report'): string => {
  if (mode === 'stock-report') {
    const stockData = data as StockInventoryData;
    const familyMembers = stockData.sectionE.familyMembers;
    const stockGroups = stockData.sectionF;

    // Helper to format stock items
    const formatStock = (items: any[]) => items.map(i => `${i.name} (${i.currentBalance} ${i.unit}, buys ${i.purchaseFrequency})`).join(', ') || 'None';

    const stockSummary = `
    - Cereals: ${formatStock(stockGroups.cereals)}
    - Pulses: ${formatStock(stockGroups.pulses)}
    - Vegetables: ${formatStock(stockGroups.vegetables)}
    - Fruits: ${formatStock(stockGroups.fruits)}
    - Dairy: ${formatStock(stockGroups.dairy)}
    - Oils: ${formatStock(stockGroups.oils)}
    - Eggs/Meat: ${formatStock(stockGroups.eggs)} ${formatStock(stockGroups.meat)}
    - Snacks: ${formatStock(stockGroups.snacks)}
    `;

    return `You are **NutritionWise**, an educational nutrition assistant specializing in **Household Food Security**.
Your goal is to provide a practical, location-aware Stock Inventory Assessment Report.

**TONE & STYLE:**
-   **Friendly & Practical:** Focus on household management and affordability. 🏠
-   **Simple Language:** Easy to understand for families.
-   **Educational Only:** No medical advice. 🚫
-   **Formatting:** Use bold for emphasis. Use emojis. 🌾 🥛

**CONTEXT:**
-   The user wants a **Stock Inventory Assessment**.
-   Use the data below to provide actionable advice on food security, purchasing, and meal planning.

------------------------------------
USER INPUT (STOCK DATA)
------------------------------------
• **Respondent:** ${stockData.sectionA.name}
• **Location:** ${stockData.sectionC.location}
• **SES:** ${stockData.sectionD.ses} (Income: ₹${stockData.sectionD.income})
• **Family Size:** ${familyMembers.length} members (Total CU: ${stockData.sectionE.totalCU})
• **Food Stock Summary:**
${stockSummary}
• **Adequacy Metrics:**
    - Days Food Lasts: ${stockData.sectionG.daysFoodLasts} days
    - Diversity Score: ${stockData.sectionG.dietaryDiversityScore}
    - Insecurity Risk: ${stockData.sectionG.foodInsecurityRisk}

------------------------------------
YOUR AI ANALYSIS RULES
------------------------------------

1. **Household Food Security Summary**: Explain the overall situation (quantity, diversity, affordability). Highlight what's adequate and what's missing.
2. **Adequacy Interpretation (CU-Based)**: Interpret if staples, pulses, oils, etc., are sufficient for the family size (CU).
3. **Key Actionable Recommendations**: 4-6 practical steps (e.g., "Add one low-cost pulse", "Buy storable veggies"). MUST fit SES/Location.
4. **Location-Based Guidance**: Tailor advice for ${stockData.sectionC.location} (e.g., Urban=markets, Rural=local produce).
5. **SES/Income-Based Adjustments**: Advice for ${stockData.sectionD.ses} class.
6. **Food Group Coverage**: Classify each group (Cereals, Pulses, Veg, Fruit, Dairy, etc.) as Adequate/Low/Missing.
7. **Smart Purchasing Suggestions**: 3-5 hyper-practical tips (e.g., bulk buying, seasonal choices).
8. **Meal Possibilities**: 3-4 meal ideas using CURRENT STOCK.
9. **Storage & Shopping Tips**: Based on purchase frequency.
10. **Hydration & Activity**: Brief advice.
11. **Household NutritionWise Score**: Rate stability (Good/Moderate/Needs Attention).
12. **Final Encouraging Note**: Warm closing.

**CRITICAL**: Keep suggestions realistic for the reported Income and Location.`;
  }

  // Cast to AssessmentData for other modes
  const assessmentData = data as AssessmentData;
  const isDataEmpty = assessmentData.sectionJ?.rdaComparison?.energy === 0;

  const basePrompt = `You are **NutritionWise**, an educational nutrition assistant.
Your goal is to provide a friendly, supportive daily dietary summary based on the user's inputs.
Your output must be clear, simple, culturally appropriate, low-cost, and based only on what is actually available in the user’s local context.

**TONE & STYLE:**
-   **Friendly & Supportive:** Be encouraging and non-judgmental. 🤝
-   **Simple Language:** Use easy-to-understand terms.
-   **Educational Only:** No medical advice. 🚫
-   **Formatting:** Use bold for emphasis. Use emojis. 🥗 🍎`;

  if (mode === 'general') {
    return `${basePrompt}

**CONTEXT:**
-   The user wants to discuss **general nutrition topics**.
-   Do NOT reference their specific assessment data unless they explicitly ask for it.
-   Answer general queries about diet, nutrients, food sources, and healthy habits.`;
  }

  // Report Mode Logic
  if (isDataEmpty) {
    return `${basePrompt}

**CONTEXT:**
-   The user is asking about their report, **BUT they have not logged any food intake yet** (Energy is 0%).
-   Politely inform them that their report appears empty.
-   Encourage them to complete the **24-Hour Dietary Recall** to get personalized advice.
-   **Respondent Name:** ${assessmentData.sectionA.name || 'User'}`;
  }

  // Format Daily Food Intake
  const meals = assessmentData.sectionI.meals;
  const foodIntakeDescription = [
    meals.earlyMorning.length ? `Early Morning: ${meals.earlyMorning.map(f => `${f.quantity} ${f.unit} ${f.name}`).join(', ')}` : '',
    meals.breakfast.length ? `Breakfast: ${meals.breakfast.map(f => `${f.quantity} ${f.unit} ${f.name}`).join(', ')}` : '',
    meals.midMorning.length ? `Mid-Morning: ${meals.midMorning.map(f => `${f.quantity} ${f.unit} ${f.name}`).join(', ')}` : '',
    meals.lunch.length ? `Lunch: ${meals.lunch.map(f => `${f.quantity} ${f.unit} ${f.name}`).join(', ')}` : '',
    meals.eveningSnack.length ? `Evening Snack: ${meals.eveningSnack.map(f => `${f.quantity} ${f.unit} ${f.name}`).join(', ')}` : '',
    meals.dinner.length ? `Dinner: ${meals.dinner.map(f => `${f.quantity} ${f.unit} ${f.name}`).join(', ')}` : '',
    meals.lateNight.length ? `Late Night: ${meals.lateNight.map(f => `${f.quantity} ${f.unit} ${f.name}`).join(', ')}` : '',
  ].filter(Boolean).join('\n');

  return `${basePrompt}

------------------------------------
USER INPUT
------------------------------------
• **Name:** ${assessmentData.sectionA.name || 'User'}
• **Age:** ${assessmentData.sectionA.age}
• **Sex:** ${assessmentData.sectionA.sex}
• **Daily food intake description:**
${foodIntakeDescription || 'No food recorded.'}
• **Water intake:** ${assessmentData.sectionG.waterIntake} liters
• **Physical activity description:** ${assessmentData.sectionG.activityLevel} (Occupation: ${assessmentData.sectionG.occupation})
• **How the user felt today:** ${assessmentData.sectionH.dayType} (Is typical day: ${assessmentData.sectionH.isTypicalDay})
• **Household food availability list:** Access: ${assessmentData.sectionF.marketAccess}, Storage: ${assessmentData.sectionF.storageFacilities}
• **Grocery purchase frequency:** ${assessmentData.sectionF.marketAccess}
• **Location category:** ${assessmentData.sectionD.location}
• **SES Class:** ${assessmentData.sectionE.ses} (Income: ₹${assessmentData.sectionE.income})
• **Additional notes:** Allergies: ${assessmentData.sectionG.foodAllergies || 'None'}, Conditions: ${assessmentData.sectionG.medicalConditions || 'None'}

------------------------------------
YOUR AI ANALYSIS RULES
------------------------------------

1. Begin with a simple, clear “Daily Dietary Summary.”
   - Identify missing food groups.
   - Identify excessive sugar/fried/packaged foods.
   - Identify low fruits, vegetables, milk/curd, or pulses.
   - Identify meal regularity or skipped meals.

2. Consider LOCATION for food suggestions:
   - Urban → variety available; but consider affordability.
   - Urban Slum → availability limited to small shops; suggest hyper-affordable items only.
   - Rural → recommend millets, seasonal vegetables, dal, local produce.
   - Peri-Urban → mixed availability; use common Indian staples.
   - Tribal → coarse grains, forest greens, local vegetables.

3. Consider FAMILY INCOME / SES when recommending foods:
   - Never suggest costly or imported foods (no avocado, berries, quinoa, almond flour, protein powders).
   - Low-income → emphasize moong dal, chana, groundnuts, seasonal fruits, leafy vegetables.
   - Middle-income → paneer, milk, curd, eggs possible.
   - Higher income → allow broader options but still Indian, local, seasonal.

4. Use ONLY foods that are:
   - Easily accessible in the user’s location.
   - Culturally common in Indian households.
   - Affordable for the SES level.
   - Safe to store based on the user’s grocery frequency.

5. Base suggestions on what the user already has at home when possible.
   Example: “You already have rice, dal, potatoes—use these to improve meal balance.”

6. Create a "Key Recommendations" section:
   - Breakfast improvement (protein + whole grains + fruit)
   - Lunch improvement (dal + vegetables + curd)
   - Dinner improvement (millet/wheat + sabzi + dal)
   - Snack improvement (fruits, roasted chana, sprouts)

7. Add "Low-Cost, High-Nutrition Substitutions":
   - Recommend pulses (moong, masoor, chana)
   - Recommend seasonal fruits (banana, papaya, guava)
   - Recommend affordable nuts (groundnuts)
   - Recommend local vegetables (spinach, cabbage, bottle gourd)

8. Add a “Food Suggestions by Meal Type” section:
   - Breakfast → 3 suggestions
   - Lunch → 3 suggestions
   - Dinner → 3 suggestions
   - Snacks → 3 suggestions
   All suggestions must fit local availability + SES.

9. Add a “Hydration & Activity” section:
   - Interpret hydration adequacy based on water intake.
   - Provide simple physical activity encouragement.

10. Tone:
   - Friendly, encouraging, non-medical.
   - No judgement.
   - Educational only.
   - Keep the language simple and practical.`;
};

export const isAIReady = (): { ready: boolean; reason?: string } => {
  if (!API_KEY) {
    return { ready: false, reason: "AI Assistant requires a valid Gemini API key." };
  }
  return { ready: true };
};

export const startChat = (
  data: AssessmentData | StockInventoryData,
  mode: 'report' | 'general' | 'stock-report' = 'report',
  previousHistory: Array<{ role: 'user' | 'model', content: string }> = []
) => {
  console.log('startChat called with mode:', mode);
  if (!ai) {
    console.error('AI SDK not initialized');
    throw new Error("AI chat unavailable: API key not configured.");
  }
  systemInstruction = buildSystemInstruction(data, mode);
  conversationHistory = [...previousHistory];
  console.log('Chat initialized successfully with history length:', conversationHistory.length);
};

export const sendMessageStream = async (message: string) => {
  console.log('sendMessageStream called with message:', message.substring(0, 50) + '...');

  if (!ai) {
    console.error('AI SDK not initialized');
    throw new Error("AI chat unavailable: API key not configured.");
  }

  try {
    // Build conversation context
    const contextMessages = conversationHistory.map(msg =>
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n\n');

    const fullPrompt = `${systemInstruction}

${contextMessages ? `Previous conversation:\n${contextMessages}\n\n` : ''}User question: ${message}

Provide a helpful, concise answer (2-3 paragraphs).`;

    console.log('Calling Gemini API...');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    console.log('Response received from API');

    const responseText = response.text.trim();

    // Add to history
    conversationHistory.push({ role: 'user', content: message });
    conversationHistory.push({ role: 'model', content: responseText });

    // Keep only last 10 messages
    if (conversationHistory.length > 10) {
      conversationHistory = conversationHistory.slice(-10);
    }

    console.log('Response text:', responseText.substring(0, 100) + '...');

    // Return as async iterator to match expected interface
    return {
      async *[Symbol.asyncIterator]() {
        yield { text: responseText };
      }
    };
  } catch (error) {
    console.error('Error in sendMessageStream:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    analyticsService.logEvent('ai_failed', { details: `Chat Error: ${errorMessage}` });

    // Better error messages
    if (errorMessage.includes('429') || errorMessage.includes('quota')) {
      throw new Error("API quota exceeded. Please try again later or check your Gemini API plan.");
    }
    if (errorMessage.includes('404') || errorMessage.includes('not found')) {
      throw new Error("AI Model not accessible. Please check your API key permissions.");
    }
    if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('invalid')) {
      throw new Error("Invalid API key. Please check your Gemini API key configuration.");
    }

    throw new Error(`Failed to get response from AI: ${errorMessage}`);
  }
};

export const suggestAllergies = async (data: AssessmentData): Promise<string[]> => {
  if (!ai) return [];
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on Indian context and ICMR guidelines, suggest 5-7 common food allergies/intolerances for someone with: Diet=${data.sectionF.dietaryPattern}, Age=${data.sectionA.age}. Return as JSON array of strings.`,
      config: {
        responseMimeType: 'application/json'
      }
    });
    return JSON.parse(response.text.trim()) as string[];
  } catch {
    return ['Milk/Dairy', 'Gluten/Wheat', 'Peanuts', 'Tree Nuts', 'Soy', 'Eggs', 'Fish/Shellfish'];
  }
};

export const suggestDiseases = async (data: AssessmentData): Promise<string[]> => {
  if (!ai) return [];
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on Indian epidemiology, suggest 5-7 common diseases relevant for someone with: Age=${data.sectionA.age}, Sex=${data.sectionA.sex}, SES=${data.sectionE.ses}. Return as JSON array of strings.`,
      config: {
        responseMimeType: 'application/json'
      }
    });
    return JSON.parse(response.text.trim()) as string[];
  } catch {
    return ['Diabetes', 'Hypertension', 'Anemia', 'Thyroid Disorder', 'PCOD/PCOS', 'Obesity', 'Heart Disease'];
  }
};