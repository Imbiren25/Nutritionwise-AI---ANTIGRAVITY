import React, { useState, useMemo } from 'react';
import { useStockInventory } from '../../hooks/useStockInventory';
import { FoodStockItem, FoodStockGroup } from '../../types';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Button } from '../ui/Button';
import Badge from '../ui/Badge';
import { Plus, Search, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { stockFoodDatabase, StockFoodItem } from './stockFoodDatabase';
import { Tabs, TabsList, TabsTrigger } from '../ui/Tabs';

const FOOD_GROUPS: { id: FoodStockGroup; label: string }[] = [
    { id: 'cereals', label: 'Cereals' },
    { id: 'pulses', label: 'Pulses' },
    { id: 'oils', label: 'Oils & Fats' },
    { id: 'vegetables', label: 'Vegetables' },
    { id: 'fruits', label: 'Fruits' },
    { id: 'dairy', label: 'Dairy & Milk Products' },
    { id: 'eggs', label: 'Eggs' },
    { id: 'meat', label: 'Meat, Fish & Poultry' },
    { id: 'sugars', label: 'Sugar & Jaggery' },
    { id: 'condiments', label: 'Condiments & Spices' },
];

const StockStep_FoodStock: React.FC<ReturnType<typeof useStockInventory>> = ({ data, updateData }) => {
    const [activeCategory, setActiveCategory] = useState<FoodStockGroup>('cereals');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFood, setSelectedFood] = useState<StockFoodItem | null>(null);
    const [currentBalance, setCurrentBalance] = useState<string>('');
    const [unit, setUnit] = useState<'kg' | 'litre' | 'unit'>('kg');
    const [purchaseFrequency, setPurchaseFrequency] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Six Monthly' | 'Yearly'>('Monthly');
    const [mobileTab, setMobileTab] = useState<'add' | 'list'>('add');

    // Filter foods based on active category, with optional search filtering
    const filteredFoods = useMemo(() => {
        const lower = searchQuery.toLowerCase();

        return stockFoodDatabase
            .filter(f => {
                // Always filter by active category
                const matchesCategory = f.category === activeCategory;
                // If there's a search query, also filter by name
                const matchesSearch = !searchQuery || f.name.toLowerCase().includes(lower);
                return matchesCategory && matchesSearch;
            })
            .slice(0, 50);
    }, [searchQuery, activeCategory]);

    const handleSelectFood = (food: StockFoodItem) => {
        if (selectedFood?.name === food.name) {
            setSelectedFood(null);
        } else {
            setSelectedFood(food);
            setCurrentBalance('');
            // Ensure we only set valid unit types
            const validUnit = food.defaultUnit === 'kg' || food.defaultUnit === 'litre' || food.defaultUnit === 'unit'
                ? food.defaultUnit
                : 'kg';
            setUnit(validUnit);
        }
    };

    const confirmAddFood = () => {
        if (!selectedFood || !currentBalance) return;

        const foodCategory = selectedFood.category as FoodStockGroup;

        // Validate that the food belongs to the active category
        if (foodCategory !== activeCategory) {
            console.error('Category mismatch - cannot add item to different category');
            return;
        }

        const newItem: FoodStockItem = {
            id: Date.now().toString(),
            name: selectedFood.name,
            quantityPurchased: parseFloat(currentBalance) || 0,
            purchaseFrequency: purchaseFrequency,
            currentBalance: parseFloat(currentBalance) || 0,
            unit: unit,
        };

        const updatedGroup = [...data.sectionF[foodCategory], newItem];
        updateData('sectionF', { ...data.sectionF, [foodCategory]: updatedGroup });

        setSelectedFood(null);
        setSearchQuery('');
        setCurrentBalance('');
        setPurchaseFrequency('Monthly');
    };

    const handleRemoveItem = (group: FoodStockGroup, id: string) => {
        const updatedGroup = data.sectionF[group].filter(item => item.id !== id);
        updateData('sectionF', { ...data.sectionF, [group]: updatedGroup });
    };

    const handleUpdateItem = (group: FoodStockGroup, id: string, updates: Partial<FoodStockItem>) => {
        const updatedGroup = data.sectionF[group].map(item =>
            item.id === id ? { ...item, ...updates } : item
        );
        updateData('sectionF', { ...data.sectionF, [group]: updatedGroup });
    };

    const totalItemsAcrossGroups = Object.values(data.sectionF).reduce((sum, items) => sum + items.length, 0);

    return (
        <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold font-heading">Household Food Stock</h1>
                <p className="text-muted-foreground">Please provide accurate information for this section.</p>
            </div>

            {/* Mobile Tabs */}
            <div className="lg:hidden">
                <Tabs defaultValue="add" value={mobileTab} onValueChange={(v) => setMobileTab(v as 'add' | 'list')} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="add">Add Items</TabsTrigger>
                        <TabsTrigger value="list">
                            My Stock
                            <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                                {totalItemsAcrossGroups}
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
                                <Badge variant="secondary" className="hidden lg:flex">{totalItemsAcrossGroups} items</Badge>
                            </div>

                            {/* Category Selector (Mobile/Tablet friendly) */}
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Category</Label>
                                <Select
                                    value={activeCategory}
                                    onValueChange={(val) => setActiveCategory(val as FoodStockGroup)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {FOOD_GROUPS.map(g => (
                                            <SelectItem key={g.id} value={g.id}>{g.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Search Input */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder={`Search ${FOOD_GROUPS.find(g => g.id === activeCategory)?.label || 'food items'}...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-muted border-border"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
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
                                                onClick={() => handleSelectFood(food)}
                                                className={cn(
                                                    'w-full flex items-center justify-between p-3 rounded-lg transition-all',
                                                    selectedFood?.name === food.name
                                                        ? 'bg-primary/5'
                                                        : 'hover:bg-muted/50'
                                                )}
                                            >
                                                <div className="text-left">
                                                    <p className="font-medium">{food.name}</p>
                                                    <p className="text-xs text-muted-foreground capitalize">
                                                        {FOOD_GROUPS.find(g => g.id === food.category)?.label}
                                                    </p>
                                                </div>
                                                {selectedFood?.name === food.name ? (
                                                    <X className="w-4 h-4 text-primary" />
                                                ) : (
                                                    <Plus className="w-4 h-4 text-muted-foreground" />
                                                )}
                                            </button>

                                            {/* Inline Stock Entry */}
                                            {selectedFood?.name === food.name && (
                                                <div className="p-4 pt-0 animate-in slide-in-from-top-2 duration-200">
                                                    <div className="p-4 bg-muted/50 rounded-lg border border-border">
                                                        <div className="space-y-3 mb-3">
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div className="space-y-1.5">
                                                                    <Label className="text-xs">Current Stock</Label>
                                                                    <Input
                                                                        type="number"
                                                                        value={currentBalance}
                                                                        onChange={(e) => setCurrentBalance(e.target.value)}
                                                                        placeholder="0"
                                                                        min="0"
                                                                        step="0.1"
                                                                        className="bg-background h-9"
                                                                    />
                                                                </div>
                                                                <div className="space-y-1.5">
                                                                    <Label className="text-xs">Unit</Label>
                                                                    <Select value={unit} onValueChange={(val) => setUnit(val as 'kg' | 'litre' | 'unit')}>
                                                                        <SelectTrigger className="bg-background h-9">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="kg">kg</SelectItem>
                                                                            <SelectItem value="litre">litre</SelectItem>
                                                                            <SelectItem value="unit">unit</SelectItem>
                                                                            <SelectItem value="gm">gm</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </div>

                                                            {/* Consumption Duration */}
                                                            <div className="space-y-1.5">
                                                                <Label className="text-xs">Consumption Duration</Label>
                                                                <Select
                                                                    value={purchaseFrequency}
                                                                    onValueChange={(val) => setPurchaseFrequency(val as 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Six Monthly' | 'Yearly')}
                                                                >
                                                                    <SelectTrigger className="bg-background h-9">
                                                                        <SelectValue placeholder="How long will this last?" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="Daily">Daily (1 day)</SelectItem>
                                                                        <SelectItem value="Weekly">Weekly (7 days)</SelectItem>
                                                                        <SelectItem value="Monthly">Monthly (30 days)</SelectItem>
                                                                        <SelectItem value="Quarterly">Quarterly (3 months)</SelectItem>
                                                                        <SelectItem value="Six Monthly">Six Monthly (6 months)</SelectItem>
                                                                        <SelectItem value="Yearly">Yearly (12 months)</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>

                                                        <Button
                                                            onClick={confirmAddFood}
                                                            className="w-full h-9"
                                                            size="sm"
                                                            disabled={!currentBalance}
                                                        >
                                                            Add to Stock Inventory
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        {searchQuery ? 'No matching items found' : 'No items available in this category'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Panel - Food Stock Categories */}
                <div className={cn("lg:col-span-3 space-y-4", mobileTab === 'list' ? "block" : "hidden lg:block")}>
                    <Card className="p-4 md:p-6 bg-card border-2">
                        <h2 className="text-xl font-bold font-heading mb-4">Food Stock by Category</h2>

                        {/* Category Tabs */}
                        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                            {FOOD_GROUPS.map((group) => {
                                const itemCount = data.sectionF[group.id].length;
                                return (
                                    <button
                                        key={group.id}
                                        onClick={() => setActiveCategory(group.id)}
                                        className={cn(
                                            'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2',
                                            activeCategory === group.id
                                                ? 'bg-primary text-primary-foreground shadow-md'
                                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                        )}
                                    >
                                        {group.label}
                                        {itemCount > 0 && (
                                            <Badge
                                                className={cn(
                                                    'ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs',
                                                    activeCategory === group.id
                                                        ? 'bg-primary-foreground text-primary'
                                                        : 'bg-primary text-primary-foreground'
                                                )}
                                            >
                                                {itemCount}
                                            </Badge>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Category Content */}
                        <div className="min-h-[400px] bg-muted/30 rounded-lg p-4 md:p-6 border-2 border-dashed border-border">
                            {data.sectionF[activeCategory].length > 0 ? (
                                <div className="space-y-3">
                                    {data.sectionF[activeCategory].map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow gap-4"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Duration: {item.purchaseFrequency}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 justify-between sm:justify-end w-full sm:w-auto">
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        value={item.currentBalance}
                                                        onChange={(e) =>
                                                            handleUpdateItem(activeCategory, item.id, {
                                                                currentBalance: parseFloat(e.target.value) || 0,
                                                            })
                                                        }
                                                        className="w-20 h-8 text-sm"
                                                        min="0"
                                                        step="0.1"
                                                    />
                                                    <Select
                                                        value={item.unit}
                                                        onValueChange={(val) =>
                                                            handleUpdateItem(activeCategory, item.id, { unit: val as 'kg' | 'litre' | 'unit' })
                                                        }
                                                    >
                                                        <SelectTrigger className="w-24 h-8 text-sm">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="kg">kg</SelectItem>
                                                            <SelectItem value="litre">litre</SelectItem>
                                                            <SelectItem value="unit">unit</SelectItem>
                                                            <SelectItem value="gm">gm</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveItem(activeCategory, item.id)}
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
                                        No items in this category yet.
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Search and add items from the left panel
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default StockStep_FoodStock;