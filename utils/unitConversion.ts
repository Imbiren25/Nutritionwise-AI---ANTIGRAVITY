import { FoodItem } from '../components/steps/foodDatabase';

export const getNutrientMultiplier = (unit: string, category?: string, name?: string): number => {
    const u = unit.toLowerCase().trim();
    const n = name?.toLowerCase() || '';
    const c = category?.toLowerCase() || '';

    // Standard Volume/Weight Definitions (approximate)
    // Base is usually 100g or 100ml
    const UNIT_CONVERSIONS: Record<string, number> = {
        'cup': 2.0,      // 200ml/g -> 2.0x base
        'bowl': 2.5,     // 250ml/g -> 2.5x base
        'katori': 1.5,   // 150ml/g -> 1.5x base
        'glass': 2.5,    // 250ml -> 2.5x base
        'tbsp': 0.15,    // 15g -> 0.15x base
        'tsp': 0.05,     // 5g -> 0.05x base
        'ml': 0.01,      // 1ml -> 0.01x base
        'l': 10,         // 1000ml -> 10x base
        'gm': 0.01,      // 1g -> 0.01x base
        'g': 0.01,       // 1g -> 0.01x base
        'kg': 10,        // 1000g -> 10x base
        'serving': 1,    // Default 1 serving = 100g (conservative estimate)
        'piece': 1,      // Default 1 piece
        'slice': 1,      // Default 1 slice
        'packet': 1,     // Default 1 packet
        'scoop': 0.5,    // Approx 50g -> 0.5x base
    };

    // 1. Check for specific unit overrides first
    if (UNIT_CONVERSIONS[u]) {
        const multiplier = UNIT_CONVERSIONS[u];

        // Special handling for "Discrete" items (Roti, Egg, Fruit, etc.)
        // For these, "piece", "serving", "slice" should be 1.
        // But "gm" or "ml" needs to be inverted based on item weight.
        const isDiscrete = c === 'fruit' ||
            n.includes('roti') || n.includes('chapathi') || n.includes('paratha') ||
            n.includes('egg') || n.includes('bread') || n.includes('biscuit') ||
            n.includes('idli') || n.includes('dosa') || n.includes('vada') ||
            n.includes('burger') || n.includes('pizza') || n.includes('sandwich');

        if (isDiscrete) {
            // If unit is weight/volume based (gm, ml, kg, l), we need to convert TO pieces
            // This is tricky without knowing exact weight per piece.
            // We will assume the "Base" values in DB for discrete items are PER PIECE/SERVING.

            if (u === 'gm' || u === 'g' || u === 'ml') {
                // Inverse calculation: How many pieces is X grams?
                // We need approx weight of 1 piece to do this accurately.
                let weightPerPiece = 100; // Default fallback

                if (n.includes('roti') || n.includes('chapathi')) weightPerPiece = 40;
                else if (n.includes('paratha')) weightPerPiece = 80;
                else if (n.includes('bread')) weightPerPiece = 25;
                else if (n.includes('egg')) weightPerPiece = 50;
                else if (n.includes('idli')) weightPerPiece = 40;
                else if (n.includes('dosa')) weightPerPiece = 80;
                else if (n.includes('vada')) weightPerPiece = 45;
                else if (n.includes('biscuit')) weightPerPiece = 10;
                else if (n.includes('pizza')) weightPerPiece = 150; // slice
                else if (n.includes('burger')) weightPerPiece = 200;

                return 1 / weightPerPiece;
            }

            // For standard discrete units (piece, serving, slice), return 1 * quantity (handled by caller)
            // So multiplier is 1.
            // Exception: If someone says "1 Cup of Idli", that's ambiguous. 
            // We'll assume standard volume multipliers apply if they use volume units for discrete items?
            // Actually, "1 Cup Idli" probably means "pieces that fit in a cup". 
            // Let's stick to the standard volume multiplier for simplicity if they use volume units.
            // But for 'piece', 'slice', 'serving', it remains 1.
            if (u === 'piece' || u === 'slice' || u === 'serving' || u === 'packet') return 1;
        }

        return multiplier;
    }

    // Fallback
    return 1;
};

export const calculateNutrients = (food: FoodItem, quantity: number, unit: string) => {
    const multiplier = getNutrientMultiplier(unit, food.category, food.name);
    const factor = quantity * multiplier;

    // Ensure base nutrient values are numbers; fallback to 0 if undefined
    const baseEnergy = food.baseEnergy ?? 0;
    const baseProtein = food.baseProtein ?? 0;
    const baseFat = food.baseFat ?? 0;
    const baseCarbs = food.baseCarbs ?? 0;
    const baseFiber = food.baseFiber ?? 0;
    const baseB12 = food.baseB12 ?? 0;
    const baseZinc = food.baseZinc ?? 0;
    return {
        energy: baseEnergy * factor,
        protein: baseProtein * factor,
        fat: baseFat * factor,
        carbs: baseCarbs * factor,
        fiber: baseFiber * factor,
        b12: baseB12 * factor,
        zinc: baseZinc * factor,
    };
};
