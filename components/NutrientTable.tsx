import React from 'react';
import { NutrientIntake } from '../types';

interface NutrientTableProps {
    intake: NutrientIntake;
    rdaComparison: NutrientIntake;
}

const NutrientTable: React.FC<NutrientTableProps> = ({ intake, rdaComparison }) => {
    const nutrients = [
        { key: 'energy', label: 'Energy', unit: 'kcal' },
        { key: 'protein', label: 'Protein', unit: 'g' },
        { key: 'fat', label: 'Fat', unit: 'g' },
        { key: 'carbs', label: 'Carbohydrates', unit: 'g' },
        { key: 'fiber', label: 'Fiber', unit: 'g' },
        { key: 'calcium', label: 'Calcium', unit: 'mg' },
        { key: 'iron', label: 'Iron', unit: 'mg' },
        { key: 'vitaminA', label: 'Vitamin A', unit: 'mcg' },
        { key: 'b12', label: 'Vitamin B12', unit: 'mcg' },
        { key: 'zinc', label: 'Zinc', unit: 'mg' },
    ] as const;

    const getStatusColor = (percentage: number) => {
        if (percentage < 70) return 'text-red-600 dark:text-red-400 font-bold';
        if (percentage > 110) return 'text-yellow-600 dark:text-yellow-400 font-bold'; // Potential excess
        return 'text-green-600 dark:text-green-400 font-bold';
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                        <th className="p-2 border border-border">Nutrient</th>
                        <th className="p-2 border border-border text-right">Actual Intake</th>
                        <th className="p-2 border border-border text-right">RDA (Target)</th>
                        <th className="p-2 border border-border text-right">% Fulfilled</th>
                    </tr>
                </thead>
                <tbody>
                    {nutrients.map(({ key, label, unit }) => {
                        const actual = intake[key];
                        const percentage = rdaComparison[key];
                        // Calculate RDA back from percentage if not explicitly available, or show N/A if 0
                        const rda = percentage > 0 ? (actual / (percentage / 100)) : 0;

                        return (
                            <tr key={key} className="border-b border-border hover:bg-muted/50">
                                <td className="p-2 border border-border font-medium">{label}</td>
                                <td className="p-2 border border-border text-right">{actual.toFixed(1)} {unit}</td>
                                <td className="p-2 border border-border text-right">{rda > 0 ? `${rda.toFixed(1)} ${unit}` : '-'}</td>
                                <td className={`p-2 border border-border text-right ${getStatusColor(percentage)}`}>
                                    {percentage.toFixed(0)}%
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default NutrientTable;
