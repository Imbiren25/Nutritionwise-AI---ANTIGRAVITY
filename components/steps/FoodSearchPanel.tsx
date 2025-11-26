// src/components/steps/FoodSearchPanel.tsx

import React, { useState, useMemo } from "react";
import { foodDatabase, FoodItem } from "./foodDatabase";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import { Plus } from "lucide-react";

interface Props {
    onAdd: (food: FoodItem) => void;
}

export const FoodSearchPanel: React.FC<Props> = ({ onAdd }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const lower = query.toLowerCase();
        return foodDatabase.filter((f) => f.name.toLowerCase().includes(lower)).slice(0, 20);
    }, [query]);

    const handleSelect = (food: FoodItem) => {
        onAdd(food);
        setOpen(false);
        setQuery("");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Food
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Search Food Items</DialogTitle>
                </DialogHeader>
                <Input
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="mb-2"
                />
                <div className="max-h-64 overflow-y-auto">
                    {filtered.map((food) => (
                        <Button
                            key={food.name}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleSelect(food)}
                        >
                            {food.name}
                        </Button>
                    ))}
                    {filtered.length === 0 && <p className="text-sm text-muted-foreground">No results</p>}
                </div>
            </DialogContent>
        </Dialog>
    );
};
