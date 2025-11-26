// src/components/steps/FoodRow.tsx

import React, { useState, useCallback } from "react";
import { IntakeEntry } from "./FoodIntakeTable";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Trash2 } from "lucide-react";

interface Props {
    entry: IntakeEntry;
    onUpdate: (id: string, updated: Partial<IntakeEntry>) => void;
    onRemove: (id: string) => void;
}

export const FoodRow: React.FC<Props> = ({ entry, onUpdate, onRemove }) => {
    const [quantity, setQuantity] = useState(entry.quantity.toString());

    const handleQuantityChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            setQuantity(val);
            const num = parseFloat(val);
            if (!isNaN(num) && num >= 0) {
                onUpdate(entry.id, { quantity: num });
            }
        },
        [entry.id, onUpdate]
    );

    const energy = (entry.food.baseEnergy * entry.quantity).toFixed(0);
    const protein = (entry.food.baseProtein * entry.quantity).toFixed(1);
    const fat = (entry.food.baseFat * entry.quantity).toFixed(1);
    const carbs = (entry.food.baseCarbs * entry.quantity).toFixed(1);

    return (
        <div className="grid grid-cols-8 gap-2 px-4 py-3 border-b hover:bg-muted/30 transition-colors items-center">
            <div className="col-span-2 text-sm font-medium truncate" title={entry.food.name}>
                {entry.food.name}
            </div>
            <div>
                <Input
                    className="w-20 h-8 text-sm"
                    value={quantity}
                    onChange={handleQuantityChange}
                    type="number"
                    min="0"
                    step="0.1"
                />
            </div>
            <div className="text-sm">{entry.unit}</div>
            <div className="text-sm">{energy}</div>
            <div className="text-sm">{protein}</div>
            <div className="text-sm">{fat}</div>
            <div className="text-sm flex items-center gap-2">
                <span>{carbs}</span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(entry.id)}
                    className="h-7 w-7 p-0"
                >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
            </div>
        </div>
    );
};
