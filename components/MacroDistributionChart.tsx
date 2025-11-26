import React from 'react';
import { NutrientIntake } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface MacroDistributionChartProps {
    intake: NutrientIntake;
}

const MacroDistributionChart: React.FC<MacroDistributionChartProps> = ({ intake }) => {
    const proteinCal = intake.protein * 4;
    const fatCal = intake.fat * 9;
    const carbsCal = intake.carbs * 4;
    const totalCal = proteinCal + fatCal + carbsCal;

    if (totalCal === 0) return <p className="text-center text-muted-foreground">No data available</p>;

    const data = [
        { name: 'Carbohydrates', value: carbsCal, color: '#3B82F6' }, // Blue
        { name: 'Protein', value: proteinCal, color: '#10B981' },     // Green
        { name: 'Fats', value: fatCal, color: '#F59E0B' },            // Yellow
    ];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (percent < 0.05) return null; // Don't show label for small slices

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={10} fontWeight="bold">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="w-full h-64 flex flex-col items-center">
            <h3 className="text-sm font-semibold text-foreground mb-2">Macronutrient Energy Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={70}
                        innerRadius={30}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={2}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="hsl(var(--card))" strokeWidth={2} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => `${value.toFixed(0)} kcal`}
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--card-foreground))',
                            borderRadius: 'var(--radius)'
                        }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ fontSize: '12px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="text-[10px] text-muted-foreground mt-1 text-center">
                Target: Carbs (60%), Protein (15-20%), Fat (20-25%)
            </div>
        </div>
    );
};

export default MacroDistributionChart;
