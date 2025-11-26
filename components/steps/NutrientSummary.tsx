import React from "react";
import { IntakeEntry } from "./FoodIntakeTable";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { calculateNutrients } from "../../utils/unitConversion";

export const NutrientSummary: React.FC<{ entries: IntakeEntry[] }> = ({ entries }) => {
    const totals = entries.reduce(
        (acc, entry) => {
            const nutrients = calculateNutrients(entry.food, entry.quantity, entry.unit);
            acc.energy += nutrients.energy;
            acc.protein += nutrients.protein;
            acc.fat += nutrients.fat;
            acc.carbs += nutrients.carbs;
            acc.fiber += nutrients.fiber;
            return acc;
        },
        { energy: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 }
    );

    return (
        <Card className="mt-4 border-2 bg-primary/5">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5 text-primary"
                    >
                        <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14c-1 1-1 2.6 0 3.6 1 1 2.6 1 3.6 0l5.4-5.4c.4-.3.6-.8.6-1.4v-3" />
                        <path d="M20.7 3.3c-.4-.4-1-.4-1.4 0l-4 4c-.4.4-.4 1 0 1.4l1.4 1.4c.4.4 1 .4 1.4 0l4-4c.4-.4.4-1 0-1.4l-1.4-1.4z" />
                    </svg>
                    Nutrient Summary
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                <div className="bg-background p-3 rounded-lg border shadow-sm">
                    <p className="text-xs text-muted-foreground">Energy</p>
                    <p className="font-bold text-lg text-primary">{totals.energy.toFixed(0)} <span className="text-xs font-normal text-muted-foreground">kcal</span></p>
                </div>
                <div className="bg-background p-3 rounded-lg border shadow-sm">
                    <p className="text-xs text-muted-foreground">Protein</p>
                    <p className="font-bold text-lg text-blue-600 dark:text-blue-400">{totals.protein.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">g</span></p>
                </div>
                <div className="bg-background p-3 rounded-lg border shadow-sm">
                    <p className="text-xs text-muted-foreground">Fat</p>
                    <p className="font-bold text-lg text-yellow-600 dark:text-yellow-400">{totals.fat.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">g</span></p>
                </div>
                <div className="bg-background p-3 rounded-lg border shadow-sm">
                    <p className="text-xs text-muted-foreground">Carbs</p>
                    <p className="font-bold text-lg text-orange-600 dark:text-orange-400">{totals.carbs.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">g</span></p>
                </div>
                <div className="bg-background p-3 rounded-lg border shadow-sm">
                    <p className="text-xs text-muted-foreground">Fiber</p>
                    <p className="font-bold text-lg text-green-600 dark:text-green-400">{totals.fiber.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">g</span></p>
                </div>
            </CardContent>
        </Card>
    );
};
