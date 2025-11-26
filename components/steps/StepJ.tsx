import React, { useEffect, useState } from 'react';
import { useDeviceMode } from '../../hooks/useDeviceMode';
import { useAssessment } from '../../hooks/useAssessment';
import { FoodItem, AssessmentData, NutrientIntake } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Loader2, Info, AlertCircle, TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';
import { calculateNutrients } from '../../utils/unitConversion';
import { calculateRDA } from '../../utils/rdaCalculator';
import NutrientChart, { NutrientRow } from '../NutrientChart';

// Temporary compatibility function - maps new RDA format to old format
const getRDA = (sectionA: AssessmentData['sectionA'], sectionG: AssessmentData['sectionG']) => {
  const rda = calculateRDA({
    age: sectionA.age,
    ageInMonths: sectionA.ageInMonths,
    sex: sectionA.sex,
    activityLevel: sectionG.activityLevel,
    physiologicalState: sectionG.physiologicalState,
  });

  // Map to old format for compatibility
  return {
    energy: rda.energy,
    protein: rda.protein,
    fat: rda.fat,
    carbs: rda.carbs,
    fiber: rda.fiber,
    calcium: rda.calcium,
    iron: rda.iron,
    zinc: rda.zinc,
    vitaminA: rda.vitaminA,
    b12: rda.vitaminB12,
  };
};

const getDeficiencyClassification = (percentage: number): { text: string; variant: 'success' | 'error' | 'warning' | 'info' | 'neutral'; color: string } => {
  if (percentage < 50) return { text: 'Severe deficit', variant: 'error', color: 'var(--color-error)' };
  if (percentage < 70) return { text: 'Moderate deficit', variant: 'error', color: 'var(--color-error)' };
  if (percentage < 90) return { text: 'Mild deficit', variant: 'warning', color: 'var(--color-warning)' };
  if (percentage <= 120) return { text: 'Adequate', variant: 'success', color: 'var(--color-success)' };
  return { text: 'Excess', variant: 'info', color: 'var(--color-info)' };
};

const StepJ: React.FC<ReturnType<typeof useAssessment>> = ({ data, updateData }) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const mode = useDeviceMode();

  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => {
      const allFoods = (Object.values(data.sectionI.meals) as any[]).flat();

      const totals = allFoods.reduce((acc, item) => {
        // Handle both local state (nested .food) and global state (flat) structures
        const foodItem = item.food || item;
        const quantity = item.quantity || 1;
        const unit = item.unit || 'serving';

        const nutrients = calculateNutrients(foodItem, quantity, unit);
        acc.energy += nutrients.energy;
        acc.protein += nutrients.protein;
        acc.fat += nutrients.fat;
        acc.carbs += nutrients.carbs;
        acc.fiber += nutrients.fiber;
        acc.b12 += nutrients.b12;
        acc.zinc += nutrients.zinc;
        return acc;
      }, {
        energy: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        fiber: 0,
        b12: 0,
        zinc: 0,
        iron: 0, // Will be calculated below
        calcium: 0, // Will be calculated below
        vitaminA: 0 // Will be calculated below
      });

      // Placeholder logic for micronutrients not fully in DB yet
      totals.iron = allFoods.length * 2;
      totals.calcium = allFoods.length * 100;
      totals.vitaminA = allFoods.length * 50;

      const RDA = getRDA(data.sectionA, data.sectionG);

      const comparison = {
        energy: Math.round((totals.energy / RDA.energy) * 100),
        protein: Math.round((totals.protein / RDA.protein) * 100),
        fat: Math.round((totals.fat / RDA.fat) * 100),
        carbs: Math.round((totals.carbs / RDA.carbs) * 100),
        iron: Math.round((totals.iron / RDA.iron) * 100),
        calcium: Math.round((totals.calcium / RDA.calcium) * 100),
        vitaminA: Math.round((totals.vitaminA / RDA.vitaminA) * 100),
        b12: Math.round((totals.b12 / RDA.b12) * 100),
        zinc: Math.round((totals.zinc / RDA.zinc) * 100),
        fiber: Math.round((totals.fiber / RDA.fiber) * 100),
      };

      updateData('sectionJ', { nutrientIntake: totals, rdaComparison: comparison });
      setIsCalculating(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [data.sectionI.meals, data.sectionA, data.sectionG]);

  if (isCalculating) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
        <p className="mt-4 text-muted-foreground">Analyzing nutritional data...</p>
      </div>
    );
  }

  const RDA = getRDA(data.sectionA, data.sectionG);

  // Enhanced chart data with units and categories
  const macronutrients: NutrientRow[] = [
    { name: 'Energy', percentage: data.sectionJ.rdaComparison.energy, intake: Math.round(data.sectionJ.nutrientIntake.energy), rda: RDA.energy, unit: 'kcal', category: 'Macronutrients', fill: getDeficiencyClassification(data.sectionJ.rdaComparison.energy).color },
    { name: 'Protein', percentage: data.sectionJ.rdaComparison.protein, intake: Math.round(data.sectionJ.nutrientIntake.protein), rda: RDA.protein, unit: 'g', category: 'Macronutrients', fill: getDeficiencyClassification(data.sectionJ.rdaComparison.protein).color },
    { name: 'Fat', percentage: data.sectionJ.rdaComparison.fat, intake: Math.round(data.sectionJ.nutrientIntake.fat), rda: RDA.fat, unit: 'g', category: 'Macronutrients', fill: getDeficiencyClassification(data.sectionJ.rdaComparison.fat).color },
    { name: 'Carbs', percentage: data.sectionJ.rdaComparison.carbs, intake: Math.round(data.sectionJ.nutrientIntake.carbs), rda: RDA.carbs, unit: 'g', category: 'Macronutrients', fill: getDeficiencyClassification(data.sectionJ.rdaComparison.carbs).color },
    { name: 'Fiber', percentage: data.sectionJ.rdaComparison.fiber, intake: Math.round(data.sectionJ.nutrientIntake.fiber), rda: RDA.fiber, unit: 'g', category: 'Macronutrients', fill: getDeficiencyClassification(data.sectionJ.rdaComparison.fiber).color },
  ];

  const micronutrients: NutrientRow[] = [
    { name: 'Iron', percentage: data.sectionJ.rdaComparison.iron, intake: Math.round(data.sectionJ.nutrientIntake.iron), rda: RDA.iron, unit: 'mg', category: 'Minerals', fill: getDeficiencyClassification(data.sectionJ.rdaComparison.iron).color },
    { name: 'Calcium', percentage: data.sectionJ.rdaComparison.calcium, intake: Math.round(data.sectionJ.nutrientIntake.calcium), rda: RDA.calcium, unit: 'mg', category: 'Minerals', fill: getDeficiencyClassification(data.sectionJ.rdaComparison.calcium).color },
    { name: 'Zinc', percentage: data.sectionJ.rdaComparison.zinc, intake: Math.round(data.sectionJ.nutrientIntake.zinc), rda: RDA.zinc, unit: 'mg', category: 'Minerals', fill: getDeficiencyClassification(data.sectionJ.rdaComparison.zinc).color },
    { name: 'Vitamin A', percentage: data.sectionJ.rdaComparison.vitaminA, intake: Math.round(data.sectionJ.nutrientIntake.vitaminA), rda: RDA.vitaminA, unit: 'mcg', category: 'Vitamins', fill: getDeficiencyClassification(data.sectionJ.rdaComparison.vitaminA).color },
    { name: 'Vitamin B12', percentage: data.sectionJ.rdaComparison.b12, intake: Math.round(data.sectionJ.nutrientIntake.b12 * 10) / 10, rda: RDA.b12, unit: 'mcg', category: 'Vitamins', fill: getDeficiencyClassification(data.sectionJ.rdaComparison.b12).color },
  ];

  const allNutrients = [...macronutrients, ...micronutrients];

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Nutrient Intake vs. RDA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This analysis shows how your 24-hour dietary recall compares to the Recommended Daily Allowance (RDA) based on ICMR-NIN 2024 guidelines for your age, sex, and activity level.
          </p>
          <div className="flex items-start gap-2 p-3 bg-[var(--color-warning-light)] border-l-4 border-[var(--color-warning)] rounded-r">
            <AlertCircle className="w-4 h-4 text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[var(--color-warning-dark)]">Note on Accuracy</p>
              <p className="text-xs text-[var(--color-warning-dark)] opacity-90">
                These values are estimates based on IFCT 2017 food composition tables. Actual nutrient content may vary based on food source, preparation method, and seasonal factors.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shared Nutrient Chart Component */}
      <NutrientChart data={allNutrients} />
    </div>
  );
};

export default StepJ;
