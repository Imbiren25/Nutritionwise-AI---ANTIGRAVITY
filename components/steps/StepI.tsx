import React, { useEffect, useReducer, useCallback, useState } from "react";
import { useAssessment } from "../../hooks/useAssessment";
import { FoodItem as GlobalFoodItem } from "../../types";
import { calculateNutrients } from "../../utils/unitConversion";
import { Loader2, Plus, Search, Trash2, X } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import Badge from "../ui/Badge";
import { Label } from "../ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { IntakeEntry } from "./FoodIntakeTable";
import { NutrientSummary } from "./NutrientSummary";
import { FoodItem as DBFoodItem, INDIAN_STATES } from "./foodDatabase";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "../ui/Tabs";

// Lazy load the large food database to keep initial bundle small
const loadFoodDatabase = () => import("./foodDatabase");

type MealType = 'earlyMorning' | 'breakfast' | 'midMorning' | 'lunch' | 'eveningSnack' | 'dinner' | 'lateNight';

const MEAL_TYPES: { id: MealType; label: string }[] = [
  { id: 'earlyMorning', label: 'Early Morning' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'midMorning', label: 'Mid-Morning' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'eveningSnack', label: 'Evening Snack' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'lateNight', label: 'Late Night' },
];

type State = {
  entries: Record<MealType, IntakeEntry[]>;
  foodDB: DBFoodItem[] | null;
};

type Action =
  | { type: "SET_DB"; payload: DBFoodItem[] }
  | { type: "ADD_ENTRY"; payload: { meal: MealType; food: DBFoodItem; quantity?: number; unit?: string } }
  | { type: "UPDATE_ENTRY"; payload: { meal: MealType; id: string; updates: Partial<IntakeEntry> } }
  | { type: "REMOVE_ENTRY"; payload: { meal: MealType; id: string } };

const initialEntries: Record<MealType, IntakeEntry[]> = {
  earlyMorning: [],
  breakfast: [],
  midMorning: [],
  lunch: [],
  eveningSnack: [],
  dinner: [],
  lateNight: [],
};

const PORTION_UNITS: Record<string, string[]> = {
  'Beverage': ['cup', 'ml', 'glass', 'serving'],
  'Fruit': ['piece', 'serving', 'cup', 'gm'],
  'Staple': ['piece', 'cup', 'serving', 'gm', 'katori'],
  'Curry': ['bowl', 'cup', 'serving', 'gm', 'katori'],
  'Vegetable': ['cup', 'serving', 'gm', 'bowl', 'katori'],
  'Protein': ['piece', 'serving', 'cup', 'gm'],
  'Dairy': ['cup', 'ml', 'glass', 'serving'],
  'Snack': ['piece', 'serving', 'gm', 'packet'],
  'Fast Food': ['piece', 'serving', 'slice'],
  'Dessert': ['piece', 'serving', 'cup', 'scoop'],
  'Soup': ['bowl', 'cup', 'serving'],
  'Condiment': ['tbsp', 'tsp', 'serving'],
  'default': ['serving', 'piece', 'cup', 'bowl', 'gm', 'ml']
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_DB":
      return { ...state, foodDB: action.payload };
    case "ADD_ENTRY": {
      const { meal, food, quantity, unit } = action.payload;
      const newEntry: IntakeEntry = {
        id: crypto.randomUUID(),
        food,
        quantity: quantity || 1,
        unit: unit || "serving",
      };
      return {
        ...state,
        entries: {
          ...state.entries,
          [meal]: [...state.entries[meal], newEntry],
        },
      };
    }
    case "UPDATE_ENTRY": {
      const { meal, id, updates } = action.payload;
      return {
        ...state,
        entries: {
          ...state.entries,
          [meal]: state.entries[meal].map((e) => (e.id === id ? { ...e, ...updates } : e)),
        },
      };
    }
    case "REMOVE_ENTRY": {
      const { meal, id } = action.payload;
      return {
        ...state,
        entries: {
          ...state.entries,
          [meal]: state.entries[meal].filter((e) => e.id !== id),
        },
      };
    }
    default:
      return state;
  }
};

// Mappers
const mapToLocal = (globalItems: GlobalFoodItem[]): IntakeEntry[] => {
  return globalItems.map(item => ({
    id: item.id,
    food: {
      name: item.name,
      baseEnergy: item.baseEnergy,
      baseProtein: item.baseProtein,
      baseFat: item.baseFat,
      baseCarbs: item.baseCarbs,
      baseFiber: item.baseFiber,
      baseB12: item.baseB12,
      baseZinc: item.baseZinc,
      category: item.category,
      region: item.region
    },
    quantity: item.quantity,
    unit: item.unit
  }));
};

const mapToGlobal = (entries: IntakeEntry[]): GlobalFoodItem[] => {
  return entries.map(entry => {
    const nutrients = calculateNutrients(entry.food, entry.quantity, entry.unit);
    return {
      id: entry.id,
      name: entry.food.name,
      quantity: entry.quantity,
      unit: entry.unit,
      cookingMethod: 'Other',
      baseEnergy: entry.food.baseEnergy,
      baseProtein: entry.food.baseProtein,
      baseFat: entry.food.baseFat,
      baseCarbs: entry.food.baseCarbs,
      baseFiber: entry.food.baseFiber,
      baseB12: entry.food.baseB12,
      baseZinc: entry.food.baseZinc,
      category: entry.food.category,
      region: entry.food.region,
      ...nutrients
    };
  });
};

const StepI: React.FC<ReturnType<typeof useAssessment>> = ({ data, updateData }) => {
  // Initialize state from props if available, otherwise default
  const [state, dispatch] = useReducer(reducer, {
    entries: data.sectionI.meals ? {
      earlyMorning: mapToLocal(data.sectionI.meals.earlyMorning || []),
      breakfast: mapToLocal(data.sectionI.meals.breakfast || []),
      midMorning: mapToLocal(data.sectionI.meals.midMorning || []),
      lunch: mapToLocal(data.sectionI.meals.lunch || []),
      eveningSnack: mapToLocal(data.sectionI.meals.eveningSnack || []),
      dinner: mapToLocal(data.sectionI.meals.dinner || []),
      lateNight: mapToLocal(data.sectionI.meals.lateNight || [])
    } : initialEntries,
    foodDB: null
  });
  const [loadingDB, setLoadingDB] = useState(true);
  const [activeMeal, setActiveMeal] = useState<MealType>('breakfast');
  const [searchQuery, setSearchQuery] = useState("");
  const [regionalFilter, setRegionalFilter] = useState<string>("all");
  const [mobileTab, setMobileTab] = useState<'add' | 'list'>('add');

  // Portion Selection State
  const [selectedFood, setSelectedFood] = useState<DBFoodItem | null>(null);
  const [portionQuantity, setPortionQuantity] = useState<string>("1");
  const [portionUnit, setPortionUnit] = useState<string>("serving");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sync local state changes to global store
  useEffect(() => {
    const globalMeals = {
      earlyMorning: mapToGlobal(state.entries.earlyMorning),
      breakfast: mapToGlobal(state.entries.breakfast),
      midMorning: mapToGlobal(state.entries.midMorning),
      lunch: mapToGlobal(state.entries.lunch),
      eveningSnack: mapToGlobal(state.entries.eveningSnack),
      dinner: mapToGlobal(state.entries.dinner),
      lateNight: mapToGlobal(state.entries.lateNight)
    };
    updateData('sectionI', { meals: globalMeals });
  }, [state.entries, updateData]);
  useEffect(() => {
    let cancelled = false;
    loadFoodDatabase()
      .then((mod) => {
        if (!cancelled) {
          dispatch({ type: "SET_DB", payload: mod.foodDatabase });
          setLoadingDB(false);
        }
      })
      .catch(() => setLoadingDB(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddFood = useCallback((food: DBFoodItem) => {
    setSelectedFood(food);
    setPortionQuantity("1");
    const units = PORTION_UNITS[food.category || 'default'] || PORTION_UNITS['default'];
    setPortionUnit(units[0]);
    setIsDialogOpen(true);
  }, []);

  const confirmAddFood = useCallback(() => {
    if (selectedFood) {
      dispatch({
        type: "ADD_ENTRY",
        payload: {
          meal: activeMeal,
          food: selectedFood,
          quantity: parseFloat(portionQuantity) || 1,
          unit: portionUnit
        }
      });
    }
    setIsDialogOpen(false);
    setSearchQuery("");
    setSelectedFood(null);
  }, [activeMeal, selectedFood, portionQuantity, portionUnit]);

  const handleUpdate = useCallback((id: string, updates: Partial<IntakeEntry>) => {
    dispatch({ type: "UPDATE_ENTRY", payload: { meal: activeMeal, id, updates } });
  }, [activeMeal]);

  const handleRemove = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ENTRY", payload: { meal: activeMeal, id } });
  }, [activeMeal]);

  const filteredFoods = React.useMemo(() => {
    if (!state.foodDB) return [];

    const lower = searchQuery.toLowerCase();
    return state.foodDB
      .filter((f) => {
        // If there's a search query, match by name
        const matchesSearch = !searchQuery || f.name.toLowerCase().includes(lower);
        // If a region is selected, match by region
        const matchesRegion = regionalFilter === "all" || f.region === regionalFilter;
        return matchesSearch && matchesRegion;
      })
      .slice(0, 50);
  }, [searchQuery, state.foodDB, regionalFilter]);

  const totalItemsAcrossMeals = Object.values(state.entries).reduce((sum, meals) => sum + meals.length, 0);

  if (loadingDB) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-lg text-muted-foreground">Loading food database...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold font-heading">Food Intake</h1>
        <p className="text-muted-foreground">Record your meals for the last 24 hours.</p>
      </div>

      {/* Mobile Tabs */}
      <div className="lg:hidden">
        <Tabs defaultValue="add" value={mobileTab} onValueChange={(v) => setMobileTab(v as 'add' | 'list')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">Add Food</TabsTrigger>
            <TabsTrigger value="list">
              My Meals
              <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                {totalItemsAcrossMeals}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel - Add Food Items */}
        <div className={cn("lg:col-span-2 space-y-4", mobileTab === 'add' ? "block" : "hidden lg:block")}>
          <Card className="p-4 md:p-6 bg-card border-2 h-full flex flex-col">
            <div className="space-y-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-heading">Add Food Items</h2>
                <Badge variant="secondary" className="hidden lg:flex">{totalItemsAcrossMeals} items</Badge>
              </div>

              {/* Regional Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Select State for Regional Foods
                </label>
                <select
                  value={regionalFilter}
                  onChange={(e) => setRegionalFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {INDIAN_STATES.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search food library..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted border-border"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Food List */}
              <div className="space-y-2 flex-1 overflow-y-auto pr-2 min-h-[300px] lg:min-h-[200px] max-h-[500px]">
                {filteredFoods.length > 0 ? (
                  filteredFoods.map((food) => (
                    <div key={food.name} className="space-y-2 bg-card rounded-lg border transition-all">
                      <button
                        onClick={() => {
                          if (selectedFood?.name === food.name) {
                            setSelectedFood(null);
                          } else {
                            setSelectedFood(food);
                            setPortionQuantity("1");
                            const units = PORTION_UNITS[food.category || 'default'] || PORTION_UNITS['default'];
                            setPortionUnit(units[0]);
                          }
                        }}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-lg transition-all",
                          selectedFood?.name === food.name
                            ? "bg-primary/5"
                            : "hover:bg-muted/50"
                        )}
                      >
                        <div className="text-left">
                          <p className="font-medium">{food.name}</p>
                          {food.region && (
                            <p className="text-xs text-muted-foreground capitalize">
                              {INDIAN_STATES.find(s => s.value === food.region)?.label || 'Regional'}
                            </p>
                          )}
                        </div>
                        {selectedFood?.name === food.name ? (
                          <X className="w-4 h-4 text-primary" />
                        ) : (
                          <Plus className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>

                      {/* Inline Portion Selection */}
                      {selectedFood?.name === food.name && (
                        <div className="p-4 pt-0 animate-in slide-in-from-top-2 duration-200">
                          <div className="p-4 bg-muted/50 rounded-lg border border-border">
                            <div className="space-y-3 mb-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Quantity</Label>
                                  <Input
                                    type="number"
                                    inputMode="decimal"
                                    value={portionQuantity}
                                    onChange={(e) => setPortionQuantity(e.target.value)}
                                    min="0.1"
                                    step="0.1"
                                    className="bg-background h-9"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Unit</Label>
                                  <Select value={portionUnit} onValueChange={setPortionUnit}>
                                    <SelectTrigger className="bg-background h-9">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {(PORTION_UNITS[food.category || 'default'] || PORTION_UNITS['default']).map((u) => (
                                        <SelectItem key={u} value={u}>
                                          {u}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {/* Portion Size Presets */}
                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Quick Select</Label>
                                <div className="grid grid-cols-4 gap-2">
                                  {[
                                    { label: 'Small', val: '0.5' },
                                    { label: 'Std', val: '1' },
                                    { label: 'Large', val: '1.5' },
                                    { label: 'Dbl', val: '2' }
                                  ].map((preset) => (
                                    <button
                                      key={preset.label}
                                      onClick={() => setPortionQuantity(preset.val)}
                                      className={cn(
                                        "flex flex-col items-center justify-center py-2 rounded-md border transition-all",
                                        portionQuantity === preset.val
                                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                          : "bg-background border-border hover:bg-muted hover:border-muted-foreground/50"
                                      )}
                                    >
                                      <span className="text-xs font-semibold">{preset.label}</span>
                                      <span className="text-[10px] opacity-80">{preset.val}x</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <Button onClick={confirmAddFood} className="w-full h-9" size="sm">
                              Add to {MEAL_TYPES.find(m => m.id === activeMeal)?.label}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No food items found matching your criteria.
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel - Today's Meals */}
        <div className={cn("lg:col-span-3 space-y-4", mobileTab === 'list' ? "block" : "hidden lg:block")}>
          <Card className="p-4 md:p-6 bg-card border-2">
            <h2 className="text-xl font-bold font-heading mb-4">Today's Meals</h2>

            {/* Meal Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              {MEAL_TYPES.map((meal) => {
                const itemCount = state.entries[meal.id].length;
                return (
                  <button
                    key={meal.id}
                    onClick={() => setActiveMeal(meal.id)}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2",
                      activeMeal === meal.id
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {meal.label}
                    {itemCount > 0 && (
                      <Badge
                        className={cn(
                          "ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs",
                          activeMeal === meal.id
                            ? "bg-primary-foreground text-primary"
                            : "bg-primary text-primary-foreground"
                        )}
                      >
                        {itemCount}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Meal Content */}
            <div className="min-h-[400px] bg-muted/30 rounded-lg p-4 md:p-6 border-2 border-dashed border-border">
              {state.entries[activeMeal].length > 0 ? (
                <div className="space-y-3">
                  {state.entries[activeMeal].map((entry) => (
                    <div
                      key={entry.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{entry.food.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {entry.food.category || 'Food Item'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 justify-between sm:justify-end w-full sm:w-auto">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            inputMode="decimal"
                            value={entry.quantity}
                            onChange={(e) => handleUpdate(entry.id, { quantity: parseFloat(e.target.value) || 0 })}
                            className="w-20 h-8 text-sm"
                            min="0.1"
                            step="0.1"
                          />
                          <Select
                            value={entry.unit}
                            onValueChange={(val) => handleUpdate(entry.id, { unit: val })}
                          >
                            <SelectTrigger className="w-24 h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(PORTION_UNITS[entry.food.category || 'default'] || PORTION_UNITS['default']).map((u) => (
                                <SelectItem key={u} value={u}>
                                  {u}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(entry.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Plus className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-lg">
                    No food items added to this meal yet.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Search and add items from the left panel
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Nutrient Summary */}
          {totalItemsAcrossMeals > 0 && (
            <NutrientSummary entries={Object.values(state.entries).flat()} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StepI;
