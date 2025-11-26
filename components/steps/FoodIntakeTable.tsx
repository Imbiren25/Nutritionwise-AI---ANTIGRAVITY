// src/components/steps/FoodIntakeTable.tsx

import React from "react";
import { FoodItem } from "./foodDatabase";
import { FoodRow } from "./FoodRow";

export type IntakeEntry = {
    id: string;
    food: FoodItem;
    quantity: number;
    unit: string;
};

interface Props {
    entries: IntakeEntry[];
    onUpdate: (id: string, updated: Partial<IntakeEntry>) => void;
    onRemove: (id: string) => void;
}

export const FoodIntakeTable: React.FC<Props> = ({ entries, onUpdate, onRemove }) => {
    return (
        <div className="mt-4 border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-muted/50 border-b">
                <div className="grid grid-cols-8 gap-2 px-4 py-3 text-sm font-medium">
                    <div className="col-span-2">Food Item</div>
                    <div>Quantity</div>
                    <div>Unit</div>
                    <div>Energy (kcal)</div>
                    <div>Protein (g)</div>
                    <div>Fat (g)</div>
                    <div>Carbs (g)</div>
                </div>
            </div>

            {/* Table Body */}
            <div className="bg-card max-h-[500px] overflow-y-auto">
                {entries.length > 0 ? (
                    entries.map((entry) => (
                        <FoodRow
                            key={entry.id}
                            entry={entry}
                            onUpdate={onUpdate}
                            onRemove={onRemove}
                        />
                    ))
                ) : (
                    <div className="py-8 text-center text-muted-foreground">
                        No food items added yet
                    </div>
                )}
            </div>
        </div>
    );
};
