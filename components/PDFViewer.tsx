
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { CompletedReport, AssessmentData, StockInventoryData, User, FamilyMember, FoodItem, AIResponse, FoodStockGroup, FoodStockItem } from '../types';
import { calculateRDA } from '../utils/rdaCalculator';
import Logo from './Logo';
import { analyzeReport } from '../utils/reportAnalysis';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import Badge from './ui/Badge';
import { cn } from '@/lib/utils';
import {
    ArrowLeft,
    Printer,
    FileText,
    User as UserIcon,
    MapPin,
    Activity,
    Droplets,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Award,
    Calendar,
    Home,
    Briefcase,
    GraduationCap,
    Package,
    Users,
    Loader2,
    Sparkles
} from 'lucide-react';

const NutrientChart = lazy(() => import('./NutrientChart'));
const NutrientTable = lazy(() => import('./NutrientTable'));
const MacroDistributionChart = lazy(() => import('./MacroDistributionChart'));

// #region SHARED COMPONENTS
const PDFHeader: React.FC<{ title: string; report: CompletedReport }> = ({ title, report }) => {
    const isStockReport = title.includes('Stock');

    return (
        <header className="flex items-center justify-between pb-6 mb-6 border-b border-border/60">
            <div className="flex items-center gap-4">
                <div className={cn(
                    "p-3.5 rounded-2xl shadow-sm border",
                    isStockReport ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-green-50 text-green-600 border-green-100"
                )}>
                    {isStockReport ? (
                        <Package className="w-8 h-8" />
                    ) : (
                        <FileText className="w-8 h-8" />
                    )}
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight">
                        {title}
                    </h1>
                    <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-md border border-border/50">
                            <Calendar className="w-3.5 h-3.5" />
                            {report.completionDate}
                        </span>
                        <span className="text-border">|</span>
                        <span className="font-mono text-xs opacity-70 bg-muted/30 px-2 py-1 rounded-md">ID: {report.id.slice(0, 8)}</span>
                    </div>
                </div>
            </div>
            <div className="text-right hidden md:block">
                <Logo className="w-12 h-12 opacity-90" />
            </div>
        </header>
    );
};

const ReportSection: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode; className?: string }> = ({ title, children, icon, className = '' }) => (
    <Card className={cn("p-6 mb-6 shadow-sm border-primary/10", className)}>
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-primary/10">
            {icon && <div className="p-2 bg-primary/5 rounded-lg text-primary">{icon}</div>}
            <h2 className="text-xl font-bold font-heading text-foreground tracking-tight">{title}</h2>
        </div>
        <div className="space-y-4">{children}</div>
    </Card>
);

const DataRow: React.FC<{ label: string; value: React.ReactNode; icon?: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex justify-between items-center py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors group border border-transparent hover:border-border/40">
        <span className="text-muted-foreground flex items-center gap-2.5 text-sm font-medium group-hover:text-foreground transition-colors">
            {icon && <span className="text-primary/70 group-hover:text-primary transition-colors">{icon}</span>}
            {label}
        </span>
        <span className="font-semibold text-foreground text-right text-sm">{value}</span>
    </div>
);

const MetricCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; color?: string }> = ({ label, value, icon, color = "bg-primary/10 text-primary" }) => (
    <Card className="p-4 border shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-3.5">
            <div className={cn("p-2.5 rounded-xl shrink-0", color)}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-0.5">{label}</p>
                <p className="text-lg font-bold text-foreground leading-none">{value}</p>
            </div>
        </div>
    </Card>
);

const ReportFooter: React.FC<{ report: CompletedReport }> = ({ report }) => (
    <footer className="text-center text-xs text-muted-foreground mt-8 pt-4 border-t space-y-1">
        <p className="font-semibold">NutritionWise © {new Date().getFullYear()} • All rights reserved</p>
        <p className="text-xs">Educational use only — not medical advice</p>
        <p className="text-xs">Assessment ID: {report.id}</p>
    </footer>
);

const CoverPage: React.FC<{ report: CompletedReport; user: User }> = ({ report, user }) => (
    <div className="h-full flex flex-col justify-center items-center text-center py-12 bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10 space-y-8 max-w-2xl mx-auto px-6">
            <div className="mb-12">
                <div className="w-32 h-32 mx-auto bg-card border-2 border-border rounded-3xl shadow-xl flex items-center justify-center mb-6 p-6">
                    <Logo className="w-full h-full" />
                </div>
                <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
                    NutritionWise
                </h1>
                <p className="text-xl text-muted-foreground font-light tracking-wide">Advanced Nutritional Assessment Report</p>
            </div>

            <Card className="p-8 backdrop-blur-sm bg-card/95 border-primary/20 shadow-2xl">
                <div className="space-y-6">
                    <div className="border-b border-border/50 pb-4">
                        <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-1">Assessment Type</p>
                        <h2 className="text-3xl font-bold text-foreground">{report.type}</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 text-left">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-full text-primary">
                                    <UserIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">Student Name</p>
                                    <p className="font-semibold">{user.name}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">Institution</p>
                                    <p className="font-semibold">{user.college}</p>
                                </div>
                            </div>
                            <Badge variant="secondary" className="bg-secondary/50 shadow-sm">Batch {user.batch}</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-full text-green-600">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">Completion Date</p>
                                    <p className="font-semibold">{report.completionDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="pt-12 text-sm text-muted-foreground opacity-70">
                <p>Generated by NutritionWise AI Platform</p>
                <p className="text-xs mt-1 font-mono">ID: {report.id}</p>
            </div>
        </div>
    </div>
);

const AIRecommendations: React.FC<{ aiResponse?: AIResponse }> = ({ aiResponse }) => {
    if (!aiResponse) {
        return (
            <Card className="p-8 bg-muted/30 border-dashed text-center">
                <div className="flex flex-col items-center gap-2">
                    <Sparkles className="w-8 h-8 text-muted-foreground/50" />
                    <p className="text-muted-foreground font-medium">AI analysis was not generated for this report.</p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary */}
            <Card className="overflow-hidden border-blue-200 shadow-sm">
                <div className="bg-blue-50/50 p-4 border-b border-blue-100 flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-blue-900">Dietary Summary</h3>
                </div>
                <div className="p-5">
                    <p className="text-foreground leading-relaxed text-sm">{aiResponse.summary}</p>
                </div>
            </Card>

            {/* Recommendations Grid */}
            {((aiResponse.meal_wise_improvements?.length > 0) || (aiResponse.affordable_swaps?.length > 0)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiResponse.meal_wise_improvements?.length > 0 && (
                        <Card className="border-green-200 shadow-sm h-full">
                            <div className="bg-green-50/50 p-4 border-b border-green-100 flex items-center gap-2">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                </div>
                                <h3 className="font-bold text-green-900">Key Improvements</h3>
                            </div>
                            <div className="p-4">
                                <ul className="space-y-3">
                                    {aiResponse.meal_wise_improvements.map((rec, i) => (
                                        <li key={`rec-${i}`} className="flex items-start gap-3 text-sm">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                                            <span className="text-muted-foreground">{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Card>
                    )}

                    {aiResponse.affordable_swaps?.length > 0 && (
                        <Card className="border-indigo-200 shadow-sm h-full">
                            <div className="bg-indigo-50/50 p-4 border-b border-indigo-100 flex items-center gap-2">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <Activity className="w-4 h-4 text-indigo-600" />
                                </div>
                                <h3 className="font-bold text-indigo-900">Smart Swaps</h3>
                            </div>
                            <div className="p-4">
                                <ul className="space-y-3">
                                    {aiResponse.affordable_swaps.map((swap, i) => (
                                        <li key={`swap-${i}`} className="flex items-start gap-3 text-sm">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                                            <span className="text-muted-foreground">{swap}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Card>
                    )}
                </div>
            )}

            {/* Food Suggestions Table */}
            {aiResponse.food_suggestions && Object.values(aiResponse.food_suggestions).some((s: string[] | undefined) => s && s.length > 0) && (
                <Card className="overflow-hidden shadow-sm">
                    <div className="bg-orange-50/50 p-4 border-b border-orange-100 flex items-center gap-2">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Award className="w-4 h-4 text-orange-600" />
                        </div>
                        <h3 className="font-bold text-orange-900">Recommended Foods</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/40">
                                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground w-1/3">Nutrient Category</th>
                                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Suggested Items</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(aiResponse.food_suggestions).map(([nutrient, suggestions]: [string, string[] | undefined], idx) => (
                                    (suggestions && suggestions.length > 0) && (
                                        <tr key={nutrient} className={cn("border-b last:border-0 transition-colors hover:bg-muted/50", idx % 2 === 0 ? "bg-background" : "bg-muted/10")}>
                                            <td className="p-4 align-top font-medium capitalize text-foreground">{nutrient.replace('_', ' ')}</td>
                                            <td className="p-4 align-top">
                                                <div className="space-y-2">
                                                    {suggestions.map((food, i) => (
                                                        <div key={i} className="text-sm text-muted-foreground">
                                                            • {food}
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Hydration & Activity */}
            {aiResponse.hydration_activity && (
                <Card className="overflow-hidden border-cyan-200 shadow-sm">
                    <div className="bg-cyan-50/50 p-4 border-b border-cyan-100 flex items-center gap-2">
                        <div className="p-2 bg-cyan-100 rounded-lg">
                            <Droplets className="w-4 h-4 text-cyan-600" />
                        </div>
                        <h3 className="font-bold text-cyan-900">Lifestyle Factors</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 rounded-full mt-1">
                                <Droplets className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Water Intake</p>
                                <p className="text-lg font-semibold text-foreground">{aiResponse.hydration_activity.water}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-emerald-100 rounded-full mt-1">
                                <Activity className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Activity Level</p>
                                <p className="text-lg font-semibold text-foreground">{aiResponse.hydration_activity.activity}</p>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Disclaimer */}
            {aiResponse.disclaimer && (
                <div className="bg-muted/30 p-4 rounded-lg border border-dashed text-center">
                    <p className="text-xs italic text-muted-foreground">
                        {aiResponse.disclaimer}
                    </p>
                </div>
            )}
        </div>
    );
};
// #endregion

// #region 24-HOUR RECALL COMPONENTS
type MealType = keyof AssessmentData['sectionI']['meals'];
const mealOrder: MealType[] = ['earlyMorning', 'breakfast', 'midMorning', 'lunch', 'eveningSnack', 'dinner', 'lateNight'];

const FoodIntakeTable: React.FC<{ meals: AssessmentData['sectionI']['meals'] }> = ({ meals }) => (
    <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm bg-card">
        <table className="w-full text-sm">
            <thead>
                <tr className="bg-muted/50 border-b border-border/60">
                    <th className="p-4 text-left font-semibold text-muted-foreground w-32">Meal</th>
                    <th className="p-4 text-left font-semibold text-muted-foreground">Food Item</th>
                    <th className="p-4 text-right font-semibold text-muted-foreground">Qty</th>
                    <th className="p-4 text-right font-semibold text-muted-foreground">Energy</th>
                    <th className="p-4 text-right font-semibold text-muted-foreground">Protein</th>
                    <th className="p-4 text-right font-semibold text-muted-foreground">Carbs</th>
                    <th className="p-4 text-right font-semibold text-muted-foreground">Fat</th>
                    <th className="p-4 text-right font-semibold text-muted-foreground">Fiber</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
                {mealOrder.flatMap(mealType =>
                    meals[mealType].map((item, index) => (
                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                            <td className="p-4 font-medium text-primary">
                                {index === 0 ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                        {mealType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </span>
                                ) : ''}
                            </td>
                            <td className="p-4 font-medium text-foreground">{item.name}</td>
                            <td className="p-4 text-right text-muted-foreground">{item.quantity} {item.unit}</td>
                            <td className="p-4 text-right font-semibold text-foreground">{item.energy.toFixed(0)}</td>
                            <td className="p-4 text-right text-muted-foreground">{item.protein.toFixed(1)}</td>
                            <td className="p-4 text-right text-muted-foreground">{item.carbs.toFixed(1)}</td>
                            <td className="p-4 text-right text-muted-foreground">{item.fat.toFixed(1)}</td>
                            <td className="p-4 text-right text-muted-foreground">{item.fiber.toFixed(1)}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>
);

const getDeficiencyClassification = (percentage: number): { text: string; variant: 'success' | 'error' | 'warning' | 'info' | 'neutral'; color: string } => {
    if (percentage < 50) return { text: 'Severe deficit', variant: 'error', color: 'var(--color-error)' };
    if (percentage < 70) return { text: 'Moderate deficit', variant: 'error', color: 'var(--color-error)' };
    if (percentage < 90) return { text: 'Mild deficit', variant: 'warning', color: 'var(--color-warning)' };
    if (percentage <= 120) return { text: 'Adequate', variant: 'success', color: 'var(--color-success)' };
    return { text: 'Excess', variant: 'info', color: 'var(--color-info)' };
};

const NutrientSummary: React.FC<{ data: AssessmentData }> = ({ data }) => {
    const nutrientIntake = data.sectionJ.nutrientIntake;
    const rdaComparison = data.sectionJ.rdaComparison;

    // Calculate RDA dynamically to ensure accuracy
    const rdaValues = calculateRDA({
        age: data.sectionA.age,
        ageInMonths: data.sectionA.ageInMonths,
        sex: data.sectionA.sex,
        activityLevel: data.sectionG.activityLevel,
        physiologicalState: data.sectionG.physiologicalState,
    });

    // Map RDA values to match the structure used in StepJ
    // Note: rdaValues from calculator has more fields than we might display, but we map what we need
    const RDA = {
        energy: rdaValues.energy,
        protein: rdaValues.protein,
        fat: rdaValues.fat,
        carbs: rdaValues.carbs,
        fiber: rdaValues.fiber,
        calcium: rdaValues.calcium,
        iron: rdaValues.iron,
        zinc: rdaValues.zinc,
        vitaminA: rdaValues.vitaminA,
        b12: rdaValues.vitaminB12,
    };

    const chartData = [
        { name: 'Energy', percentage: rdaComparison.energy, intake: Math.round(nutrientIntake.energy), rda: RDA.energy, unit: 'kcal', category: 'Macronutrients', fill: getDeficiencyClassification(rdaComparison.energy).color },
        { name: 'Protein', percentage: rdaComparison.protein, intake: Math.round(nutrientIntake.protein), rda: RDA.protein, unit: 'g', category: 'Macronutrients', fill: getDeficiencyClassification(rdaComparison.protein).color },
        { name: 'Fat', percentage: rdaComparison.fat, intake: Math.round(nutrientIntake.fat), rda: RDA.fat, unit: 'g', category: 'Macronutrients', fill: getDeficiencyClassification(rdaComparison.fat).color },
        { name: 'Carbs', percentage: rdaComparison.carbs, intake: Math.round(nutrientIntake.carbs), rda: RDA.carbs, unit: 'g', category: 'Macronutrients', fill: getDeficiencyClassification(rdaComparison.carbs).color },
        { name: 'Fiber', percentage: rdaComparison.fiber, intake: Math.round(nutrientIntake.fiber), rda: RDA.fiber, unit: 'g', category: 'Macronutrients', fill: getDeficiencyClassification(rdaComparison.fiber).color },
        { name: 'Iron', percentage: rdaComparison.iron, intake: Math.round(nutrientIntake.iron), rda: RDA.iron, unit: 'mg', category: 'Minerals', fill: getDeficiencyClassification(rdaComparison.iron).color },
        { name: 'Calcium', percentage: rdaComparison.calcium, intake: Math.round(nutrientIntake.calcium), rda: RDA.calcium, unit: 'mg', category: 'Minerals', fill: getDeficiencyClassification(rdaComparison.calcium).color },
        { name: 'Zinc', percentage: rdaComparison.zinc, intake: Math.round(nutrientIntake.zinc), rda: RDA.zinc, unit: 'mg', category: 'Minerals', fill: getDeficiencyClassification(rdaComparison.zinc).color },
        { name: 'Vitamin A', percentage: rdaComparison.vitaminA, intake: Math.round(nutrientIntake.vitaminA), rda: RDA.vitaminA, unit: 'mcg', category: 'Vitamins', fill: getDeficiencyClassification(rdaComparison.vitaminA).color },
        { name: 'Vitamin B12', percentage: rdaComparison.b12, intake: Math.round(nutrientIntake.b12 * 10) / 10, rda: RDA.b12, unit: 'mcg', category: 'Vitamins', fill: getDeficiencyClassification(rdaComparison.b12).color },
    ];

    return (
        <div>
            <p className="text-sm text-muted-foreground mb-4">Comparison of nutrient intake against Recommended Dietary Allowance (RDA).</p>
            <Suspense fallback={<div className="text-center text-sm text-muted-foreground py-8">Loading chart…</div>}>
                <NutrientChart data={chartData} />
            </Suspense>
        </div>
    );
};
// #endregion

// #region STOCK INVENTORY COMPONENTS
const SESClassification: React.FC<{ data: StockInventoryData }> = ({ data }) => {
    const { income } = data.sectionD;
    const { hofEducation, hofOccupation } = data.sectionB;
    const { location } = data.sectionC;
    const isRural = location === 'Rural' || location === 'Tribal';
    const scaleUsed = isRural ? 'BG Prasad (Rural)' : 'Kuppuswamy (Urban)';

    if (isRural) {
        const perCapitaIncome = income / (data.sectionE.familyMembers.length || 1);
        return (
            <div className="space-y-3">
                <DataRow label="Method Used" value={scaleUsed} />
                <DataRow label="Total Family Income" value={`₹ ${income.toLocaleString('en-IN')}`} />
                <DataRow label="Per Capita Income (PCI)" value={`₹ ${perCapitaIncome.toLocaleString('en-IN')}`} />
                <DataRow label="SES Class" value={<Badge className="bg-primary text-primary-foreground">{data.sectionD.ses}</Badge>} />
            </div>
        );
    }

    const eduMap: { [key: string]: number } = { 'Professional': 7, 'Graduate & Above': 6, 'Higher Secondary': 4, 'Secondary': 3, 'Primary': 2, 'Illiterate': 1 };
    const occMap: { [key: string]: number } = { 'Unemployed': 1, 'Unskilled': 2, 'Semi-skilled': 3, 'Skilled': 4, 'Clerical/Shop': 5, 'Semi-professional': 6, 'Professional': 10 };
    const educationScore = eduMap[hofEducation] || 1;
    const occupationScore = occMap[hofOccupation] || 1;
    let incomeScore = 1;
    if (income > 75000) incomeScore = 12; else if (income > 37500) incomeScore = 10; else if (income > 28000) incomeScore = 6; else if (income > 18500) incomeScore = 4; else if (income > 9500) incomeScore = 3; else if (income > 0) incomeScore = 2;
    const totalScore = educationScore + occupationScore + incomeScore;

    return (
        <div className="space-y-4">
            <DataRow label="Method Used" value={scaleUsed} />
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-muted border-b-2 border-primary/20">
                            <th className="p-3 text-left font-semibold">Component</th>
                            <th className="p-3 text-right font-semibold">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b hover:bg-muted/50"><td className="p-3">Education Score</td><td className="p-3 text-right font-semibold">{educationScore}</td></tr>
                        <tr className="border-b hover:bg-muted/50"><td className="p-3">Occupation Score</td><td className="p-3 text-right font-semibold">{occupationScore}</td></tr>
                        <tr className="border-b hover:bg-muted/50"><td className="p-3">Income Score</td><td className="p-3 text-right font-semibold">{incomeScore}</td></tr>
                        <tr className="bg-muted font-bold"><td className="p-3">Total Score</td><td className="p-3 text-right">{totalScore}</td></tr>
                    </tbody>
                </table>
            </div>
            <DataRow label="SES Class" value={<Badge className="bg-primary text-primary-foreground">{data.sectionD.ses}</Badge>} />
        </div>
    );
};

const FamilyCUTable: React.FC<{ members: FamilyMember[]; totalCU: number }> = ({ members, totalCU }) => (
    <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm bg-card">
        <table className="w-full text-sm">
            <thead>
                <tr className="bg-muted/50 border-b border-border/60">
                    <th className="p-4 text-left font-semibold text-muted-foreground">Name</th>
                    <th className="p-4 text-left font-semibold text-muted-foreground">Age</th>
                    <th className="p-4 text-left font-semibold text-muted-foreground">Sex</th>
                    <th className="p-4 text-left font-semibold text-muted-foreground">Phys. Status</th>
                    <th className="p-4 text-left font-semibold text-muted-foreground">Activity</th>
                    <th className="p-4 text-right font-semibold text-muted-foreground">CU</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
                {members.map(member => (
                    <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium text-foreground">{member.name}</td>
                        <td className="p-4 text-muted-foreground">{member.age}</td>
                        <td className="p-4 text-muted-foreground">{member.sex}</td>
                        <td className="p-4 text-muted-foreground">{member.physiologicalState}</td>
                        <td className="p-4 text-muted-foreground">{member.activityLevel}</td>
                        <td className="p-4 text-right font-bold text-primary">{member.cu.toFixed(1)}</td>
                    </tr>
                ))}
                <tr className="bg-muted/30 font-bold border-t-2 border-border/60">
                    <td className="p-4 text-foreground" colSpan={5}>Total Household CU</td>
                    <td className="p-4 text-right text-lg text-primary">{totalCU.toFixed(2)}</td>
                </tr>
            </tbody>
        </table>
    </div>
);

const foodConsumptionRates: { [key in FoodStockGroup]?: number } = {
    cereals: 0.450, pulses: 0.060, oils: 0.040, vegetables: 0.300, fruits: 0.150, dairy: 0.200, sugars: 0.030
};

const getAdequacy = (days: number): { text: string; color: string; badgeClass: string } => {
    if (days < 3) return { text: 'Critical Shortage', color: 'text-red-600', badgeClass: 'bg-red-100 text-red-700 border-red-200' };
    if (days <= 7) return { text: 'Moderate Shortage', color: 'text-yellow-600', badgeClass: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
    if (days <= 30) return { text: 'Adequate', color: 'text-green-600', badgeClass: 'bg-green-100 text-green-700 border-green-200' };
    return { text: 'Surplus', color: 'text-blue-600', badgeClass: 'bg-blue-100 text-blue-700 border-blue-200' };
};

const FoodStockInventoryTable: React.FC<{ stockData: StockInventoryData['sectionF'], totalCU: number }> = ({ stockData, totalCU }) => {
    const allItemsCount = (Object.values(stockData) as FoodStockItem[][]).reduce((sum, items) => sum + items.length, 0);

    if (allItemsCount === 0) {
        return (
            <Card className="p-12 bg-muted/30 border-dashed text-center">
                <Package className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium">No stock items were recorded for this household.</p>
            </Card>
        );
    }

    return (
        <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm bg-card">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-muted/50 border-b border-border/60">
                        <th className="p-4 text-left font-semibold text-muted-foreground">Item</th>
                        <th className="p-4 text-left font-semibold text-muted-foreground">Qty Purchased</th>
                        <th className="p-4 text-left font-semibold text-muted-foreground">Freq.</th>
                        <th className="p-4 text-left font-semibold text-muted-foreground">Remaining</th>
                        <th className="p-4 text-left font-semibold text-muted-foreground">Daily Need</th>
                        <th className="p-4 text-left font-semibold text-muted-foreground">Days Last</th>
                        <th className="p-4 text-left font-semibold text-muted-foreground">Adequacy</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                    {Object.entries(stockData).map(([group, items]: [string, FoodStockItem[]]) => (
                        items.length > 0 && (
                            <React.Fragment key={group}>
                                <tr className="bg-primary/5">
                                    <td colSpan={7} className="p-3 px-4 font-bold text-primary text-xs uppercase tracking-wider">
                                        {group.charAt(0).toUpperCase() + group.slice(1)}
                                    </td>
                                </tr>
                                {items.map(item => {
                                    const consumptionRate = foodConsumptionRates[group as FoodStockGroup];
                                    const dailyNeed = consumptionRate && totalCU > 0 ? totalCU * consumptionRate : 0;
                                    const daysLast = dailyNeed > 0 ? Math.floor(item.currentBalance / dailyNeed) : Infinity;
                                    const adequacy = getAdequacy(daysLast);
                                    return (
                                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-4 font-medium text-foreground">{item.name}</td>
                                            <td className="p-4 text-muted-foreground">{item.quantityPurchased} {item.unit}</td>
                                            <td className="p-4 text-muted-foreground">{item.purchaseFrequency}</td>
                                            <td className="p-4 text-muted-foreground">{item.currentBalance} {item.unit}</td>
                                            <td className="p-4 text-muted-foreground">{isFinite(dailyNeed) && dailyNeed > 0 ? `${dailyNeed.toFixed(2)} ${item.unit}/day` : 'N/A'}</td>
                                            <td className="p-4 font-semibold text-foreground">{isFinite(daysLast) ? `${daysLast}` : 'N/A'}</td>
                                            <td className="p-4">
                                                <Badge className={cn("text-xs font-medium border shadow-none", adequacy.badgeClass)}>
                                                    {adequacy.text}
                                                </Badge>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </React.Fragment>
                        )
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const HouseholdAdequacy: React.FC<{ data: StockInventoryData }> = ({ data }) => {
    const { dietaryDiversityScore, daysFoodLasts } = data.sectionG;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
                label="Energy Adequacy"
                value={`${daysFoodLasts} days`}
                icon={<TrendingUp className="w-5 h-5" />}
                color="bg-green-100 text-green-600"
            />
            <MetricCard
                label="Dietary Diversity"
                value={`${dietaryDiversityScore}/7`}
                icon={<Award className="w-5 h-5" />}
                color="bg-blue-100 text-blue-600"
            />
            <MetricCard
                label="Protein Adequacy"
                value="Not Calculated"
                icon={<Activity className="w-5 h-5" />}
                color="bg-purple-100 text-purple-600"
            />
        </div>
    );
};
// #endregion

// #region REPORT LAYOUTS
const TwentyFourHourRecallReport: React.FC<{ report: CompletedReport }> = ({ report }) => {
    const data = report.data as AssessmentData;
    const analysis = analyzeReport(data);

    return (
        <>
            <div className="pdf-page bg-background p-6 rounded-xl shadow-lg mx-auto mt-4 max-w-5xl">
                <PDFHeader title="24-Hour Recall Report" report={report} />
                <main className="space-y-4">
                    {/* Respondent Basics */}
                    <ReportSection title="Respondent Basics" icon={<UserIcon className="w-5 h-5" />}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <MetricCard label="Name" value={data.sectionA.name} icon={<UserIcon className="w-4 h-4" />} />
                            <MetricCard label="Age" value={`${data.sectionA.age} years`} icon={<Calendar className="w-4 h-4" />} />
                            <MetricCard label="Sex" value={data.sectionA.sex} icon={<UserIcon className="w-4 h-4" />} />
                        </div>
                    </ReportSection>

                    {/* Socio-Economic Status */}
                    <ReportSection title="Socio-Economic Status" icon={<Home className="w-5 h-5" />}>
                        <DataRow label="Location" value={data.sectionD.location} icon={<MapPin className="w-4 h-4" />} />
                        <DataRow label="SES Class" value={<Badge className="bg-primary text-primary-foreground">{data.sectionE.ses}</Badge>} />
                        <DataRow label="Head of Family" value={data.sectionC.hofName} icon={<Users className="w-4 h-4" />} />
                    </ReportSection>

                    {/* Anthropometry */}
                    <ReportSection title="Anthropometry" icon={<Activity className="w-5 h-5" />}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <MetricCard label="Weight" value={`${data.sectionB.weight} kg`} icon={<Activity className="w-4 h-4" />} />
                            <MetricCard label="Height" value={`${data.sectionB.height} cm`} icon={<Activity className="w-4 h-4" />} />
                            <MetricCard label="BMI" value={`${data.sectionB.bmi.toFixed(1)}`} icon={<TrendingUp className="w-4 h-4" />} />
                        </div>
                        <Badge className={cn(
                            "text-sm px-4 py-2",
                            data.sectionB.bmiCategory === 'Normal' ? "bg-green-100 text-green-700" :
                                data.sectionB.bmiCategory === 'Underweight' ? "bg-yellow-100 text-yellow-700" :
                                    "bg-red-100 text-red-700"
                        )}>
                            {data.sectionB.bmiCategory}
                        </Badge>
                    </ReportSection>

                    {/* Lifestyle */}
                    <ReportSection title="Lifestyle" icon={<Activity className="w-5 h-5" />}>
                        <DataRow label="Activity Level" value={data.sectionG.activityLevel} icon={<Activity className="w-4 h-4" />} />
                        <DataRow label="Physiological State" value={data.sectionG.physiologicalState} />
                        <DataRow label="Water Intake" value={`${data.sectionG.waterIntake} L`} icon={<Droplets className="w-4 h-4" />} />
                    </ReportSection>

                    {/* Clinical Insights */}
                    <ReportSection title="Clinical Insights" icon={<AlertCircle className="w-5 h-5" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="p-4 bg-muted/50">
                                <p className="text-xs text-muted-foreground mb-1">Diet Pattern</p>
                                <p className="font-semibold">{analysis.dietPattern}</p>
                            </Card>
                            <Card className="p-4 bg-muted/50">
                                <p className="text-xs text-muted-foreground mb-1">Hydration Status</p>
                                <p className={cn("font-semibold", analysis.clinical.hydration.status === 'Low' ? 'text-red-600' : 'text-green-600')}>
                                    {analysis.clinical.hydration.text}
                                </p>
                            </Card>
                            <Card className="p-4 bg-muted/50">
                                <p className="text-xs text-muted-foreground mb-1">Activity Impact</p>
                                <p className="font-semibold">{analysis.clinical.activity.text}</p>
                            </Card>
                            <Card className="p-4 bg-muted/50">
                                <p className="text-xs text-muted-foreground mb-1">Physiological Context</p>
                                <p className="font-semibold">{analysis.clinical.physState.text}</p>
                            </Card>
                        </div>
                    </ReportSection>

                    {/* Diet Quality */}
                    <ReportSection title="Diet Quality Scoreboard" icon={<Award className="w-5 h-5" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                                <p className="text-sm text-muted-foreground mb-2">Diet Diversity Score (DDS)</p>
                                <p className="text-4xl font-bold text-green-600">{analysis.foodGroups.ddsScore}</p>
                                <p className="text-xs text-muted-foreground mt-2">Target: &gt; 5/8 for good diversity</p>
                            </Card>
                            <div>
                                <h4 className="font-semibold mb-3">Missing Food Groups</h4>
                                {analysis.foodGroups.missing.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.foodGroups.missing.map(g => (
                                            <Badge key={g} className="bg-red-100 text-red-700 border-red-200">
                                                {g}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <Badge className="bg-green-100 text-green-700 border-green-200">
                                        <CheckCircle2 className="w-4 h-4 mr-1" />
                                        None! Great variety
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </ReportSection>

                    {/* Meal Pattern */}
                    <ReportSection title="Meal Pattern Analysis">
                        <div className="space-y-4">
                            <p className="text-sm">{analysis.mealPattern.frequencyText} {analysis.mealPattern.spacingText}</p>
                            {analysis.mealPattern.skippedMeals.length > 0 && (
                                <Card className="p-4 bg-red-50 border-red-200">
                                    <p className="text-sm text-red-700 flex items-center gap-2">
                                        <XCircle className="w-4 h-4" />
                                        Skipped: {analysis.mealPattern.skippedMeals.join(', ')}
                                    </p>
                                </Card>
                            )}
                            <div className="grid grid-cols-3 gap-3">
                                {['Breakfast', 'Lunch', 'Dinner'].map(meal => (
                                    <Card key={meal} className="p-4 text-center">
                                        <p className="font-bold mb-1">{meal}</p>
                                        <p className={cn(
                                            "text-sm",
                                            (analysis.mealPattern.quality[meal.toLowerCase()] as string) === 'Skipped' ? 'text-red-600' : 'text-green-600'
                                        )}>
                                            {analysis.mealPattern.quality[meal.toLowerCase()] || 'N/A'}
                                        </p>
                                    </Card>
                                ))}
                            </div>
                            {analysis.flags.red.length > 0 && (
                                <Card className="p-4 bg-yellow-50 border-yellow-200">
                                    <p className="text-sm">
                                        <span className="font-bold text-yellow-700">Red Flags (Limit these): </span>
                                        <span className="text-yellow-800">{analysis.flags.red.join(', ')}</span>
                                    </p>
                                </Card>
                            )}
                        </div>
                    </ReportSection>

                    {/* Nutrient Summary */}
                    <ReportSection title="Nutrient Summary" icon={<TrendingUp className="w-5 h-5" />}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <NutrientSummary data={data} />
                            </div>
                            <div className="flex flex-col justify-center">
                                <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Loading chart...</div>}>
                                    <MacroDistributionChart intake={data.sectionJ.nutrientIntake} />
                                </Suspense>
                                <p className="text-xs text-center mt-3 italic text-muted-foreground">{analysis.macroDistribution.summary}</p>
                            </div>
                        </div>
                    </ReportSection>

                    {/* Detailed Nutrient Profile */}
                    <ReportSection title="Detailed Nutrient Profile">
                        <Suspense fallback={<div className="text-center text-sm text-muted-foreground py-8">Loading table...</div>}>
                            <NutrientTable intake={data.sectionJ.nutrientIntake} rdaComparison={data.sectionJ.rdaComparison} />
                        </Suspense>
                    </ReportSection>
                </main>
                <ReportFooter report={report} />
            </div>

            {/* Page 2 - Food Intake & AI */}
            <div className="pdf-page bg-background p-6 rounded-xl shadow-lg mx-auto mt-4 max-w-5xl">
                <PDFHeader title="24-Hour Recall Report" report={report} />
                <main className="space-y-4">
                    <ReportSection title="24-Hour Food Intake">
                        <FoodIntakeTable meals={data.sectionI.meals} />
                    </ReportSection>
                    <ReportSection title="AI Recommendations" icon={<TrendingUp className="w-5 h-5" />}>
                        <AIRecommendations aiResponse={report.aiResponse} />
                    </ReportSection>
                </main>
                <ReportFooter report={report} />
            </div>
        </>
    );
};

const StockInventoryReport: React.FC<{ report: CompletedReport }> = ({ report }) => {
    const data = report.data as StockInventoryData;

    return (
        <>
            <div className="pdf-page bg-background p-6 rounded-xl shadow-lg mx-auto mt-4 max-w-5xl">
                <PDFHeader title="Stock Inventory Report" report={report} />
                <main className="space-y-4">
                    {/* Respondent Details */}
                    <ReportSection title="Respondent Details" icon={<UserIcon className="w-5 h-5" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DataRow label="Name" value={data.sectionA.name} icon={<UserIcon className="w-4 h-4" />} />
                            <DataRow label="Age" value={`${data.sectionA.age} years`} icon={<Calendar className="w-4 h-4" />} />
                            <DataRow label="Sex" value={data.sectionA.sex} />
                            <DataRow label="Education" value={data.sectionA.educationStatus} icon={<GraduationCap className="w-4 h-4" />} />
                        </div>
                    </ReportSection>

                    {/* Head of Family */}
                    <ReportSection title="Head of Family Details" icon={<Users className="w-5 h-5" />}>
                        <DataRow label="Name" value={data.sectionB.hofName} icon={<UserIcon className="w-4 h-4" />} />
                        <DataRow label="Education" value={data.sectionB.hofEducation} icon={<GraduationCap className="w-4 h-4" />} />
                        <DataRow label="Occupation" value={data.sectionB.hofOccupation} icon={<Briefcase className="w-4 h-4" />} />
                    </ReportSection>

                    {/* SES */}
                    <ReportSection title="Socio-Economic Status" icon={<Home className="w-5 h-5" />}>
                        <SESClassification data={data} />
                    </ReportSection>

                    {/* Family Composition */}
                    <ReportSection title="Family Composition (CU Table)" icon={<Users className="w-5 h-5" />}>
                        <FamilyCUTable members={data.sectionE.familyMembers} totalCU={data.sectionE.totalCU} />
                    </ReportSection>
                </main>
                <ReportFooter report={report} />
            </div>

            {/* Page 2 - Stock Inventory */}
            <div className="pdf-page bg-background p-6 rounded-xl shadow-lg mx-auto mt-4 max-w-5xl">
                <PDFHeader title="Stock Inventory Report" report={report} />
                <main><ReportSection title="Food Stock Inventory" icon={<Package className="w-5 h-5" />}>
                    <FoodStockInventoryTable stockData={data.sectionF} totalCU={data.sectionE.totalCU} />
                </ReportSection>
                </main>
                <ReportFooter report={report} />
            </div>

            {/* Page 3 - Adequacy & AI */}
            <div className="pdf-page bg-background p-6 rounded-xl shadow-lg mx-auto mt-4 max-w-5xl">
                <PDFHeader title="Stock Inventory Report" report={report} />
                <main className="space-y-4">
                    <ReportSection title="Household Food Adequacy" icon={<TrendingUp className="w-5 h-5" />}>
                        <HouseholdAdequacy data={data} />
                    </ReportSection>
                    <ReportSection title="AI Summary & Recommendations" icon={<Award className="w-5 h-5" />}>
                        <AIRecommendations aiResponse={report.aiResponse} />
                    </ReportSection>
                </main>
                <ReportFooter report={report} />
            </div>
        </>
    );
};
// #endregion

// #region MAIN VIEWER COMPONENT
interface PDFViewerProps {
    report: CompletedReport;
    onBack: () => void;
    user: User;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ report, onBack, user }) => {
    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrint = () => {
        setIsPrinting(true);
        window.print();
    };

    useEffect(() => {
        const handleAfterPrint = () => {
            setIsPrinting(false);
        };

        window.addEventListener('afterprint', handleAfterPrint);
        return () => {
            window.removeEventListener('afterprint', handleAfterPrint);
        };
    }, []);

    return (
        <div className="pdf-printable-area min-h-screen bg-muted/30 py-6">
            {/* Controls */}
            <div className="pdf-controls max-w-5xl mx-auto flex justify-between items-center mb-6 px-6">
                <Button onClick={onBack} variant="outline" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Reports</span>
                </Button>
                <Button onClick={handlePrint} disabled={isPrinting} className="gap-2 shadow-md">
                    {isPrinting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <Printer className="w-4 h-4" />
                            <span>Print / Save as PDF</span>
                        </>
                    )}
                </Button>
            </div>

            {/* Cover Page */}
            <div className="pdf-page bg-background p-6 rounded-xl shadow-lg mx-auto max-w-5xl" id="pdf-content-page1">
                <CoverPage report={report} user={user} />
            </div>

            {/* Report Content */}
            {report.type === '24-Hour Recall' ? (
                <TwentyFourHourRecallReport report={report} />
            ) : (
                <StockInventoryReport report={report} />
            )}
        </div>
    );
};

export default PDFViewer;
// #endregion
