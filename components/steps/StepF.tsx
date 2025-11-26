import React from 'react';
import { useAssessment } from '../../hooks/useAssessment';
import { AssessmentData } from '../../types';
import { Label } from '../ui/Label';
import { Info, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const waterSources: AssessmentData['sectionF']['waterSource'][] = ['Tap', 'Well', 'Hand Pump', 'Tanker', 'Other'];
const fuelSources: AssessmentData['sectionF']['cookingFuel'][] = ['LPG', 'Firewood', 'Kerosene', 'Cow Dung', 'Other'];
const dietPatterns: AssessmentData['sectionF']['dietaryPattern'][] = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian'];
const marketAccessOptions: AssessmentData['sectionF']['marketAccess'][] = ['Daily', 'Weekly', 'Bi-weekly', 'Monthly'];
const storageOptions: AssessmentData['sectionF']['storageFacilities'][] = ['Refrigerator', 'Cooler', 'None', 'Other'];
const electricityOptions: AssessmentData['sectionF']['electricity'][] = ['Reliable', 'Intermittent', 'None'];
const perishablesOptions: AssessmentData['sectionF']['perishablesFrequency'][] = ['Daily', 'Weekly', 'Rarely'];

const StepF: React.FC<ReturnType<typeof useAssessment>> = ({ data, updateData }) => {
  const renderButtonGroup = (
    label: string,
    options: readonly string[],
    selectedValue: string,
    onChange: (value: any) => void
  ) => (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 border shadow-sm",
              selectedValue === option
                ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-200 ring-offset-1"
                : "bg-background text-foreground border-border hover:bg-muted hover:border-muted-foreground/30"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="flex gap-3 p-4 bg-purple-50 dark:bg-purple-950/20 border-l-4 border-purple-500 rounded-r-lg">
        <Home className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-1">
            Why we ask this?
          </p>
          <p className="text-xs text-purple-800 dark:text-purple-200">
            The household environment provides context on food access, safety, and preparation methods, which helps the AI give more realistic and appropriate recommendations.
          </p>
        </div>
      </div>

      {/* Button Groups */}
      <div className="space-y-6">
        {renderButtonGroup(
          "Primary Source of Drinking Water",
          waterSources,
          data.sectionF.waterSource,
          (value) => updateData('sectionF', { waterSource: value })
        )}

        {renderButtonGroup(
          "Primary Cooking Fuel",
          fuelSources,
          data.sectionF.cookingFuel,
          (value) => updateData('sectionF', { cookingFuel: value })
        )}

        {renderButtonGroup(
          "Household Dietary Pattern",
          dietPatterns,
          data.sectionF.dietaryPattern,
          (value) => updateData('sectionF', { dietaryPattern: value })
        )}

        {renderButtonGroup(
          "Market Access for Groceries",
          marketAccessOptions,
          data.sectionF.marketAccess,
          (value) => updateData('sectionF', { marketAccess: value })
        )}

        {renderButtonGroup(
          "Food Storage Facilities",
          storageOptions,
          data.sectionF.storageFacilities,
          (value) => updateData('sectionF', { storageFacilities: value })
        )}

        {renderButtonGroup(
          "Electricity Availability",
          electricityOptions,
          data.sectionF.electricity,
          (value) => updateData('sectionF', { electricity: value })
        )}

        {renderButtonGroup(
          "Frequency of Purchasing Perishables (Fruits/Veg)",
          perishablesOptions,
          data.sectionF.perishablesFrequency,
          (value) => updateData('sectionF', { perishablesFrequency: value })
        )}
      </div>
    </div>
  );
};

export default StepF;