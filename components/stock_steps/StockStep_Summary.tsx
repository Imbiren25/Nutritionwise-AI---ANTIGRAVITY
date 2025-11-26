import React, { useEffect, useCallback } from 'react';
import { useStockInventory } from '../../hooks/useStockInventory';
import { FoodStockItem } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';
import { Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const SummaryCard: React.FC<{ title: string, value: string | number, variant: 'primary' | 'warning' | 'destructive', icon: React.ReactNode }> = ({ title, value, variant, icon }) => {
    const variantStyles = {
        primary: 'border-primary/40 bg-primary/5',
        warning: 'border-[var(--color-warning)]/40 bg-[var(--color-warning)]/5',
        destructive: 'border-destructive/40 bg-destructive/5',
    };

    return (
        <Card className={cn('text-center', variantStyles[variant])}>
            <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-2">
                    {icon}
                    <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
                    <p className="text-3xl font-bold">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
};

interface StockStep_SummaryProps extends ReturnType<typeof useStockInventory> { }

const StockStep_Summary: React.FC<StockStep_SummaryProps> = ({ data, updateData }) => {

    const calculateSummary = useCallback(() => {
        const foodGroupsWithItems = Object.values(data.sectionF).filter((group: FoodStockItem[]) => group.length > 0);
        const dietaryDiversityScore = foodGroupsWithItems.length;

        const totalCereals = data.sectionF.cereals.reduce((sum, item) => sum + item.currentBalance, 0);
        // Ensure totalCU is at least 1 to avoid division by zero if not set, though logic handles dailyCerealNeed > 0
        const dailyCerealNeed = (data.sectionE.totalCU || 0) * 0.450;

        // If no cereals or no people, days lasts is 0
        const daysFoodLasts = (dailyCerealNeed > 0 && totalCereals > 0) ? Math.round(totalCereals / dailyCerealNeed) : 0;

        let foodInsecurityRisk: 'Low' | 'Moderate' | 'Severe' = 'Low';

        // Logic: If no stock (days=0), it's Severe (unless they just haven't entered data?)
        // Assuming if they reached summary, they entered what they have.
        if (daysFoodLasts < 7) {
            foodInsecurityRisk = 'Severe';
        } else if (daysFoodLasts < 15 || dietaryDiversityScore < 5) {
            foodInsecurityRisk = 'Moderate';
        }

        updateData('sectionG', { dietaryDiversityScore, daysFoodLasts, foodInsecurityRisk });
    }, [data.sectionF, data.sectionE.totalCU, updateData]);

    useEffect(() => {
        calculateSummary();
    }, [calculateSummary]);

    const getRiskVariant = (risk: string): 'primary' | 'warning' | 'destructive' => {
        if (risk === 'Low') return 'primary';
        if (risk === 'Moderate') return 'warning';
        return 'destructive';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="border-primary/40 bg-gradient-to-br from-primary/10 to-[var(--color-info)]/10">
                <CardContent className="text-center pt-6">
                    <Package className="w-12 h-12 text-primary mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-primary mb-2">Adequacy Summary</h3>
                    <p className="text-muted-foreground">
                        The household's food stock and security status has been calculated based on your entries.
                    </p>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard
                    title="Days Cereals Last"
                    value={data.sectionG.daysFoodLasts}
                    variant="primary"
                    icon={<Package className="w-8 h-8 text-primary" />}
                />
                <SummaryCard
                    title="Dietary Diversity Score"
                    value={`${data.sectionG.dietaryDiversityScore} / 10`}
                    variant="primary"
                    icon={<TrendingUp className="w-8 h-8 text-[var(--color-info)]" />}
                />
                <SummaryCard
                    title="Food Insecurity Risk"
                    value={data.sectionG.foodInsecurityRisk}
                    variant={getRiskVariant(data.sectionG.foodInsecurityRisk)}
                    icon={<AlertTriangle className={cn(
                        "w-8 h-8",
                        data.sectionG.foodInsecurityRisk === 'Low' && "text-primary",
                        data.sectionG.foodInsecurityRisk === 'Moderate' && "text-[var(--color-warning)]",
                        data.sectionG.foodInsecurityRisk === 'Severe' && "text-destructive"
                    )} />}
                />
            </div>

            {/* Key Insights */}
            <Card>
                <CardHeader>
                    <CardTitle>Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-2">
                            <Badge className="mt-0.5">1</Badge>
                            <span>
                                The household has approximately <strong>{data.sectionG.daysFoodLasts} days' worth</strong> of staple cereals remaining.
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Badge className="mt-0.5">2</Badge>
                            <span>
                                The diet includes items from <strong>{data.sectionG.dietaryDiversityScore} out of 10</strong> major food groups, indicating its diversity.
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Badge className="mt-0.5">3</Badge>
                            <span>
                                Based on stock levels and diversity, the household's food insecurity risk is assessed as <strong>{data.sectionG.foodInsecurityRisk}</strong>.
                            </span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default StockStep_Summary;