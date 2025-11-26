import { AssessmentData, FoodItem } from '../types';

export interface AnalysisResult {
    mealPattern: {
        frequency: number;
        frequencyText: string;
        spacingText: string;
        skippedMeals: string[];
        lateDinner: boolean;
        quality: Record<string, 'Light' | 'Moderate' | 'Heavy' | 'Balanced'>;
    };
    macroDistribution: {
        carbsPct: number;
        proteinPct: number;
        fatPct: number;
        summary: string;
    };
    foodGroups: {
        scores: Record<string, 'Missing' | 'Low' | 'Adequate'>;
        dds: number;
        ddsScore: string; // "3/8"
        missing: string[];
    };
    flags: {
        red: string[];
        green: string[];
    };
    clinical: {
        hydration: { status: 'Low' | 'Adequate' | 'High'; text: string };
        activity: { text: string };
        physState: { text: string };
    };
    dietPattern: string;
}

const FOOD_GROUPS = {
    cereals: ['roti', 'rice', 'bread', 'chapati', 'paratha', 'poha', 'upma', 'dosa', 'idli', 'oats', 'wheat', 'bajra', 'jowar', 'corn', 'biscuit', 'khakhra'],
    pulses: ['dal', 'lentil', 'rajma', 'chana', 'moong', 'urad', 'toor', 'beans', 'chole', 'sambar', 'besan'],
    vegetables: ['sabzi', 'curry', 'bhaji', 'saag', 'spinach', 'methi', 'gourd', 'okra', 'brinjal', 'potato', 'onion', 'tomato', 'carrot', 'cabbage', 'cauliflower'],
    fruits: ['apple', 'banana', 'mango', 'orange', 'grape', 'papaya', 'guava', 'pomegranate', 'fruit', 'juice'],
    milk: ['milk', 'curd', 'yogurt', 'paneer', 'cheese', 'buttermilk', 'lassi', 'chai', 'tea', 'coffee'],
    flesh: ['chicken', 'mutton', 'fish', 'egg', 'meat', 'prawn'],
    nuts: ['almond', 'cashew', 'walnut', 'groundnut', 'peanut'],
    fats: ['oil', 'ghee', 'butter'],
    sugars: ['sugar', 'jaggery', 'honey', 'sweet', 'chocolate', 'cake', 'biscuit', 'cookie', 'jam'],
};

const RED_FLAGS = ['sugar', 'fried', 'samosa', 'kachori', 'vadapav', 'burger', 'pizza', 'chips', 'biscuit', 'cookie', 'cake', 'sweet', 'jalebi', 'gulab jamun'];
const GREEN_FLAGS = ['fruit', 'salad', 'sprouts', 'dal', 'vegetable', 'milk', 'curd', 'egg', 'fish', 'chicken'];

export const analyzeReport = (data: AssessmentData): AnalysisResult => {
    const allFoods: FoodItem[] = Object.values(data.sectionI.meals).flat();
    const foodNames = allFoods.map(f => f.name.toLowerCase());

    // 1. Meal Pattern
    const meals = data.sectionI.meals;
    const mealKeys = Object.keys(meals) as Array<keyof typeof meals>;
    const activeMeals = mealKeys.filter(k => meals[k].length > 0);
    const frequency = activeMeals.length;

    const skippedMeals = [];
    if (meals.breakfast.length === 0) skippedMeals.push('Breakfast');
    if (meals.lunch.length === 0) skippedMeals.push('Lunch');
    if (meals.dinner.length === 0) skippedMeals.push('Dinner');

    const mealQuality: Record<string, any> = {};
    mealKeys.forEach(key => {
        const cal = meals[key].reduce((sum, item) => sum + item.energy, 0);
        if (cal === 0) mealQuality[key] = 'Skipped';
        else if (cal < 300) mealQuality[key] = 'Light';
        else if (cal < 700) mealQuality[key] = 'Moderate';
        else mealQuality[key] = 'Heavy';
    });

    // 2. Macro Distribution
    const { protein, fat, carbs, energy } = data.sectionJ.nutrientIntake;
    const proteinCal = protein * 4;
    const fatCal = fat * 9;
    const carbsCal = carbs * 4;
    const totalCal = proteinCal + fatCal + carbsCal || 1; // Avoid div by 0

    const proteinPct = Math.round((proteinCal / totalCal) * 100);
    const fatPct = Math.round((fatCal / totalCal) * 100);
    const carbsPct = Math.round((carbsCal / totalCal) * 100);

    let macroSummary = "Balanced macronutrient distribution.";
    if (carbsPct > 70) macroSummary = "High carbohydrate intake detected.";
    if (fatPct > 35) macroSummary = "High fat intake detected.";
    if (proteinPct < 10) macroSummary = "Protein intake is lower than recommended.";

    // 3. Food Groups & DDS
    const groupScores: Record<string, 'Missing' | 'Low' | 'Adequate'> = {};
    let dds = 0;
    const missing: string[] = [];

    Object.entries(FOOD_GROUPS).forEach(([group, keywords]) => {
        const count = foodNames.filter(name => keywords.some(k => name.includes(k))).length;
        if (count === 0) {
            groupScores[group] = 'Missing';
            missing.push(group.charAt(0).toUpperCase() + group.slice(1));
        } else if (count < 2 && ['vegetables', 'fruits', 'milk'].includes(group)) {
            groupScores[group] = 'Low';
            dds += 0.5;
        } else {
            groupScores[group] = 'Adequate';
            dds += 1;
        }
    });

    // 4. Flags
    const redFlags = [...new Set(foodNames.filter(name => RED_FLAGS.some(flag => name.includes(flag))))];
    const greenFlags = [...new Set(foodNames.filter(name => GREEN_FLAGS.some(flag => name.includes(flag))))];

    // 5. Clinical
    const water = data.sectionG.waterIntake;
    let hydStatus: 'Low' | 'Adequate' | 'High' = 'Adequate';
    if (water < 2) hydStatus = 'Low';
    if (water > 4) hydStatus = 'High';

    const activityText = data.sectionG.activityLevel === 'Light Exercise'
        ? "More movement can help improve overall metabolism."
        : "Your activity level today supports better energy balance.";

    const physState = data.sectionG.physiologicalState;
    const physText = physState === 'NPNL'
        ? "As a non-pregnant adult, your RDA is based on standard requirements."
        : `As a ${physState} woman, your requirements are significantly higher.`;

    // 6. Diet Pattern
    let dietPattern = "Typical Mixed Diet";
    if (groupScores.flesh === 'Missing' && groupScores.milk !== 'Missing') dietPattern = "Lacto-Vegetarian";
    if (groupScores.flesh === 'Missing' && groupScores.milk === 'Missing') dietPattern = "Vegan / Strict Vegetarian";
    if (carbsPct > 75) dietPattern = "High-Carb Cereal Dominant";

    return {
        mealPattern: {
            frequency,
            frequencyText: `You had ${frequency} eating occasions today.`,
            spacingText: `Your meals were spaced roughly ${Math.round(14 / (frequency || 1))} hours apart.`,
            skippedMeals,
            lateDinner: meals.lateNight.length > 0,
            quality: mealQuality,
        },
        macroDistribution: {
            carbsPct, proteinPct, fatPct, summary: macroSummary
        },
        foodGroups: {
            scores: groupScores,
            dds: Math.min(Math.round(dds), 8),
            ddsScore: `${Math.min(Math.round(dds), 8)}/8`,
            missing
        },
        flags: {
            red: redFlags,
            green: greenFlags
        },
        clinical: {
            hydration: { status: hydStatus, text: water < 2 ? "Low hydration (< 2L)" : "Adequate hydration (> 3L)" },
            activity: { text: activityText },
            physState: { text: physText }
        },
        dietPattern
    };
};
