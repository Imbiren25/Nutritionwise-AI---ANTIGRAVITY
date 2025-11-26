/**
 * ICMR-NIN 2024 RDA Calculator
 * Provides dynamic RDA values based on exact age, sex, activity level, and physiological state
 * Reference: ICMR-NIN Nutrient Requirements for Indians 2024
 */

export interface RDAValues {
    energy: number;
    protein: number;
    fat: number;
    carbs: number;
    calcium: number;
    iron: number;
    zinc: number;
    vitaminA: number; // mcg RAE
    vitaminC: number; // mg
    vitaminD: number; // mcg
    vitaminE: number; // mg
    vitaminB1: number; // mg (Thiamine)
    vitaminB2: number; // mg (Riboflavin)
    vitaminB3: number; // mg (Niacin)
    vitaminB6: number; // mg
    vitaminB9: number; // mcg (Folate)
    vitaminB12: number; // mcg
    fiber: number; // g
}

interface RDAParams {
    age: number; // exact age in years
    ageInMonths?: number; // for infants < 1 year
    sex: 'Male' | 'Female' | 'Other';
    activityLevel: string;
    physiologicalState?: 'NPNL' | 'Pregnant' | 'Lactating';
    trimester?: 1 | 2 | 3; // for pregnant women
    lactationMonths?: number; // months postpartum for lactating women
}

/**
 * ICMR-NIN 2024 Base RDA Data
 * Organized by age groups with exact values
 */

// Infants (0-12 months)
const INFANT_RDA = {
    '0-6months': {
        energy: 520, protein: 9.1, fat: 30, carbs: 60, calcium: 300, iron: 0.55, zinc: 1.7,
        vitaminA: 350, vitaminC: 25, vitaminD: 10, vitaminE: 2.3, vitaminB1: 0.2, vitaminB2: 0.3,
        vitaminB3: 2, vitaminB6: 0.1, vitaminB9: 25, vitaminB12: 0.2, fiber: 0
    },
    '7-12months': {
        energy: 710, protein: 11.5, fat: 30, carbs: 95, calcium: 400, iron: 7.3, zinc: 2.9,
        vitaminA: 350, vitaminC: 30, vitaminD: 10, vitaminE: 2.3, vitaminB1: 0.3, vitaminB2: 0.4,
        vitaminB3: 4, vitaminB6: 0.3, vitaminB9: 35, vitaminB12: 0.5, fiber: 0
    }
};

// Children (1-9 years)
const CHILDREN_RDA = {
    '1-3years': {
        energy: 1060, protein: 12.5, fat: 27, carbs: 130, calcium: 500, iron: 8, zinc: 3.3,
        vitaminA: 390, vitaminC: 40, vitaminD: 15, vitaminE: 5, vitaminB1: 0.5, vitaminB2: 0.6,
        vitaminB3: 8, vitaminB6: 0.5, vitaminB9: 80, vitaminB12: 0.9, fiber: 15
    },
    '4-6years': {
        energy: 1350, protein: 16, fat: 25, carbs: 130, calcium: 550, iron: 11, zinc: 4.5,
        vitaminA: 510, vitaminC: 40, vitaminD: 15, vitaminE: 6, vitaminB1: 0.7, vitaminB2: 0.8,
        vitaminB3: 11, vitaminB6: 0.6, vitaminB9: 100, vitaminB12: 1.2, fiber: 20
    },
    '7-9years': {
        energy: 1690, protein: 23, fat: 30, carbs: 130, calcium: 650, iron: 15, zinc: 5.9,
        vitaminA: 630, vitaminC: 45, vitaminD: 15, vitaminE: 8, vitaminB1: 0.9, vitaminB2: 1.0,
        vitaminB3: 13, vitaminB6: 1.0, vitaminB9: 120, vitaminB12: 1.8, fiber: 25
    }
};

// Boys (10-17 years)
const BOYS_RDA = {
    '10-12years': {
        energy: 2190, protein: 32, fat: 35, carbs: 130, calcium: 850, iron: 16, zinc: 8.5,
        vitaminA: 770, vitaminC: 65, vitaminD: 15, vitaminE: 10, vitaminB1: 1.1, vitaminB2: 1.3,
        vitaminB3: 15, vitaminB6: 1.3, vitaminB9: 160, vitaminB12: 2.4, fiber: 30
    },
    '13-15years': {
        energy: 2750, protein: 45, fat: 45, carbs: 130, calcium: 1000, iron: 22, zinc: 14.3,
        vitaminA: 930, vitaminC: 75, vitaminD: 15, vitaminE: 12, vitaminB1: 1.3, vitaminB2: 1.6,
        vitaminB3: 16, vitaminB6: 1.3, vitaminB9: 200, vitaminB12: 2.4, fiber: 35
    },
    '16-17years': {
        energy: 3020, protein: 55, fat: 50, carbs: 130, calcium: 1050, iron: 26, zinc: 17.6,
        vitaminA: 1000, vitaminC: 90, vitaminD: 15, vitaminE: 15, vitaminB1: 1.4, vitaminB2: 1.8,
        vitaminB3: 16, vitaminB6: 1.3, vitaminB9: 200, vitaminB12: 2.4, fiber: 40
    }
};

// Girls (10-17 years)
const GIRLS_RDA = {
    '10-12years': {
        energy: 2010, protein: 33, fat: 35, carbs: 130, calcium: 850, iron: 28, zinc: 8.5,
        vitaminA: 790, vitaminC: 65, vitaminD: 15, vitaminE: 10, vitaminB1: 1.0, vitaminB2: 1.2,
        vitaminB3: 14, vitaminB6: 1.2, vitaminB9: 160, vitaminB12: 2.4, fiber: 30
    },
    '13-15years': {
        energy: 2330, protein: 43, fat: 40, carbs: 130, calcium: 1000, iron: 30, zinc: 12.8,
        vitaminA: 890, vitaminC: 65, vitaminD: 15, vitaminE: 12, vitaminB1: 1.1, vitaminB2: 1.4,
        vitaminB3: 14, vitaminB6: 1.2, vitaminB9: 200, vitaminB12: 2.4, fiber: 35
    },
    '16-17years': {
        energy: 2500, protein: 46, fat: 45, carbs: 130, calcium: 1050, iron: 32, zinc: 14.2,
        vitaminA: 860, vitaminC: 75, vitaminD: 15, vitaminE: 15, vitaminB1: 1.2, vitaminB2: 1.5,
        vitaminB3: 14, vitaminB6: 1.2, vitaminB9: 200, vitaminB12: 2.4, fiber: 40
    }
};

// Adult Men (18+ years) by activity level
const MEN_RDA = {
    sedentary: {
        energy: 2110, protein: 54, fat: 25, carbs: 130, calcium: 1000, iron: 19, zinc: 17,
        vitaminA: 1000, vitaminC: 90, vitaminD: 15, vitaminE: 15, vitaminB1: 1.2, vitaminB2: 1.3,
        vitaminB3: 16, vitaminB6: 1.3, vitaminB9: 200, vitaminB12: 2.4, fiber: 30
    },
    moderate: {
        energy: 2710, protein: 54, fat: 30, carbs: 130, calcium: 1000, iron: 19, zinc: 17,
        vitaminA: 1000, vitaminC: 90, vitaminD: 15, vitaminE: 15, vitaminB1: 1.2, vitaminB2: 1.3,
        vitaminB3: 16, vitaminB6: 1.3, vitaminB9: 200, vitaminB12: 2.4, fiber: 40
    },
    heavy: {
        energy: 3470, protein: 54, fat: 40, carbs: 130, calcium: 1000, iron: 19, zinc: 17,
        vitaminA: 1000, vitaminC: 90, vitaminD: 15, vitaminE: 15, vitaminB1: 1.2, vitaminB2: 1.3,
        vitaminB3: 16, vitaminB6: 1.3, vitaminB9: 200, vitaminB12: 2.4, fiber: 50
    }
};

// Adult Women (18+ years) by activity level
const WOMEN_RDA = {
    sedentary: {
        energy: 1660, protein: 46, fat: 20, carbs: 130, calcium: 1000, iron: 29, zinc: 13.2,
        vitaminA: 840, vitaminC: 75, vitaminD: 15, vitaminE: 12, vitaminB1: 1.1, vitaminB2: 1.1,
        vitaminB3: 14, vitaminB6: 1.3, vitaminB9: 200, vitaminB12: 2.4, fiber: 25
    },
    moderate: {
        energy: 2130, protein: 46, fat: 25, carbs: 130, calcium: 1000, iron: 29, zinc: 13.2,
        vitaminA: 840, vitaminC: 75, vitaminD: 15, vitaminE: 12, vitaminB1: 1.1, vitaminB2: 1.1,
        vitaminB3: 14, vitaminB6: 1.3, vitaminB9: 200, vitaminB12: 2.4, fiber: 30
    },
    heavy: {
        energy: 2720, protein: 46, fat: 30, carbs: 130, calcium: 1000, iron: 29, zinc: 13.2,
        vitaminA: 840, vitaminC: 75, vitaminD: 15, vitaminE: 12, vitaminB1: 1.1, vitaminB2: 1.1,
        vitaminB3: 14, vitaminB6: 1.3, vitaminB9: 200, vitaminB12: 2.4, fiber: 40
    }
};

/**
 * Get activity level key from activity level string
 */
function getActivityKey(activityLevel: string): 'sedentary' | 'moderate' | 'heavy' {
    const level = activityLevel.toLowerCase();
    if (level.includes('vigorous') || level.includes('intense') || level.includes('heavy')) {
        return 'heavy';
    }
    if (level.includes('moderate') || level.includes('light')) {
        return 'moderate';
    }
    return 'sedentary';
}

/**
 * Interpolate RDA values between two age groups
 */
function interpolateRDA(rda1: RDAValues, rda2: RDAValues, ratio: number): RDAValues {
    const result = {} as RDAValues;
    for (const key in rda1) {
        result[key as keyof RDAValues] = rda1[key as keyof RDAValues] +
            (rda2[key as keyof RDAValues] - rda1[key as keyof RDAValues]) * ratio;
    }
    return result;
}

/**
 * Calculate RDA based on exact age, sex, activity level, and physiological state
 * Following ICMR-NIN 2024 guidelines
 */
export function calculateRDA(params: RDAParams): RDAValues {
    const { age, ageInMonths = 0, sex, activityLevel, physiologicalState, trimester, lactationMonths } = params;

    let baseRDA: RDAValues;

    // Infants (< 1 year)
    if (age === 0) {
        if (ageInMonths < 6) {
            baseRDA = { ...INFANT_RDA['0-6months'] };
        } else {
            baseRDA = { ...INFANT_RDA['7-12months'] };
        }
    }
    // Children (1-9 years)
    else if (age >= 1 && age < 10) {
        if (age <= 3) {
            baseRDA = { ...CHILDREN_RDA['1-3years'] };
        } else if (age <= 6) {
            // Interpolate between 1-3 and 4-6
            const ratio = (age - 3) / 3;
            baseRDA = interpolateRDA(CHILDREN_RDA['1-3years'], CHILDREN_RDA['4-6years'], ratio);
        } else {
            // Interpolate between 4-6 and 7-9
            const ratio = (age - 6) / 3;
            baseRDA = interpolateRDA(CHILDREN_RDA['4-6years'], CHILDREN_RDA['7-9years'], ratio);
        }
    }
    // Adolescents (10-17 years)
    else if (age >= 10 && age < 18) {
        const isFemale = sex === 'Female';
        const rdaData = isFemale ? GIRLS_RDA : BOYS_RDA;

        if (age <= 12) {
            baseRDA = { ...rdaData['10-12years'] };
        } else if (age <= 15) {
            const ratio = (age - 12) / 3;
            baseRDA = interpolateRDA(rdaData['10-12years'], rdaData['13-15years'], ratio);
        } else {
            const ratio = (age - 15) / 2;
            baseRDA = interpolateRDA(rdaData['13-15years'], rdaData['16-17years'], ratio);
        }
    }
    // Adults (18+ years)
    else {
        const activityKey = getActivityKey(activityLevel);
        const isFemale = sex === 'Female';

        baseRDA = isFemale
            ? { ...WOMEN_RDA[activityKey] }
            : { ...MEN_RDA[activityKey] };

        // Apply physiological state adjustments for women
        if (isFemale && physiologicalState) {
            if (physiologicalState === 'Pregnant') {
                // Pregnancy adjustments based on trimester
                if (trimester === 1) {
                    // First trimester - minimal increase
                    baseRDA.energy += 0;
                    baseRDA.protein += 0.7;
                } else if (trimester === 2) {
                    // Second trimester
                    baseRDA.energy += 350;
                    baseRDA.protein += 6.9;
                } else {
                    // Third trimester (default if not specified)
                    baseRDA.energy += 350;
                    baseRDA.protein += 22.7;
                }

                // Common pregnancy adjustments
                baseRDA.iron = 27; // Increased for pregnancy
                baseRDA.calcium = 1200; // Increased
                baseRDA.zinc += 3.3;
                baseRDA.vitaminA += 100;
                baseRDA.vitaminC += 10;
                baseRDA.vitaminD = 15;
                baseRDA.vitaminB9 = 500; // Folate is critical
                baseRDA.vitaminB12 += 0.2;
            }
            else if (physiologicalState === 'Lactating') {
                // Lactation adjustments based on months postpartum
                const isEarlyLactation = !lactationMonths || lactationMonths <= 6;

                if (isEarlyLactation) {
                    // 0-6 months postpartum
                    baseRDA.energy += 600;
                    baseRDA.protein += 16.9;
                } else {
                    // 7-12 months postpartum
                    baseRDA.energy += 520;
                    baseRDA.protein += 12.7;
                }

                // Common lactation adjustments
                baseRDA.iron = 29;
                baseRDA.calcium = 1200;
                baseRDA.zinc += 4.0;
                baseRDA.vitaminA += 350;
                baseRDA.vitaminC += 30;
                baseRDA.vitaminD = 15;
                baseRDA.vitaminB9 = 300;
                baseRDA.vitaminB12 += 0.5;
            }
        }
    }

    return baseRDA;
}

/**
 * Get RDA as percentage of intake
 */
export function getRDAPercentage(intake: number, rda: number): number {
    if (rda === 0) return 0;
    return (intake / rda) * 100;
}

/**
 * Get nutrient status based on RDA percentage
 */
export function getNutrientStatus(percentage: number): 'deficient' | 'adequate' | 'excess' {
    if (percentage < 67) return 'deficient'; // < 67% of RDA
    if (percentage > 150) return 'excess'; // > 150% of RDA
    return 'adequate';
}
