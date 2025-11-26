
import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import Badge from './ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { Activity, TrendingUp, TrendingDown, Info, Zap } from 'lucide-react';
import { useDeviceMode } from '../hooks/useDeviceMode';

export interface NutrientRow {
  name: string;
  percentage: number;
  intake: number;
  rda: number;
  unit: string;
  category: string;
  fill: string;
}

interface NutrientChartProps {
  data: NutrientRow[];
}

const getDeficiencyClassification = (percentage: number): { text: string; variant: 'success' | 'error' | 'warning' | 'info' | 'neutral'; color: string } => {
  if (percentage < 50) return { text: 'Severe deficit', variant: 'error', color: 'var(--color-error)' };
  if (percentage < 70) return { text: 'Moderate deficit', variant: 'error', color: 'var(--color-error)' };
  if (percentage < 90) return { text: 'Mild deficit', variant: 'warning', color: 'var(--color-warning)' };
  if (percentage <= 120) return { text: 'Adequate', variant: 'success', color: 'var(--color-success)' };
  return { text: 'Excess', variant: 'info', color: 'var(--color-info)' };
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const classification = getDeficiencyClassification(data.percentage);

    return (
      <div className="bg-popover border-2 border-border p-4 rounded-xl shadow-2xl backdrop-blur-sm z-50 max-w-[200px] md:max-w-xs">
        <p className="font-bold text-lg mb-2 text-foreground truncate">{label}</p>
        <div className="space-y-1.5">
          <div className="flex justify-between gap-4">
            <span className="text-sm text-muted-foreground">Intake:</span>
            <span className="font-semibold text-foreground">{data.intake} {data.unit}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm text-muted-foreground">RDA:</span>
            <span className="font-semibold text-foreground">{data.rda} {data.unit}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm text-muted-foreground">Diff:</span>
            <span className={`font-semibold ${data.percentage >= 100 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {data.percentage >= 100 ? '+' : ''}{Math.round((data.intake - data.rda) * 10) / 10} {data.unit}
            </span>
          </div>
          <div className="pt-2 mt-2 border-t border-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
              <span className="text-sm font-bold" style={{ color: data.fill }}>
                {data.percentage}% Met
              </span>
              <Badge variant={classification.variant} className="text-[10px] md:text-xs w-fit">
                {classification.text}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const RadarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border p-3 rounded-lg shadow-lg z-50">
        <p className="font-semibold mb-1">{payload[0].payload.name}</p>
        <p className="text-sm text-muted-foreground">
          Achievement: <span className="font-bold text-foreground">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

const NutrientChart: React.FC<NutrientChartProps> = ({ data }) => {
  const [selectedNutrient, setSelectedNutrient] = useState<string | null>(null);
  const deviceMode = useDeviceMode();
  const isMobile = deviceMode === 'mobile';

  // Radar chart data
  const radarData = data.map(n => ({
    name: n.name,
    value: Math.min(n.percentage, 150), // Cap at 150% for better visualization
    fullMark: 150
  }));

  // Summary statistics
  const avgAdequacy = Math.round(data.reduce((sum, n) => sum + n.percentage, 0) / data.length);
  const deficientCount = data.filter(n => n.percentage < 90).length;
  const adequateCount = data.filter(n => n.percentage >= 90 && n.percentage <= 120).length;
  const excessCount = data.filter(n => n.percentage > 120).length;

  const macronutrients = data.filter(n => n.category === 'Macronutrients');
  const micronutrients = data.filter(n => n.category !== 'Macronutrients');

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="pt-4 md:pt-6 p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">Avg Adequacy</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{avgAdequacy}%</p>
              </div>
              <Activity className="w-6 h-6 md:w-8 md:h-8 text-primary opacity-20 self-end md:self-center" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-green-500/10">
          <CardContent className="pt-4 md:pt-6 p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">Adequate</p>
                <p className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{adequateCount}</p>
              </div>
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-green-500 opacity-20 self-end md:self-center" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-yellow-500/10">
          <CardContent className="pt-4 md:pt-6 p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">Deficient</p>
                <p className="text-2xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{deficientCount}</p>
              </div>
              <TrendingDown className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 opacity-20 self-end md:self-center" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
          <CardContent className="pt-4 md:pt-6 p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">Excess</p>
                <p className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{excessCount}</p>
              </div>
              <Info className="w-6 h-6 md:w-8 md:h-8 text-blue-500 opacity-20 self-end md:self-center" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Charts */}
      <Tabs defaultValue="bar" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          <TabsTrigger value="radar">Radar View</TabsTrigger>
          <TabsTrigger value="detailed">Detailed</TabsTrigger>
        </TabsList>

        <TabsContent value="bar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nutrient Adequacy Profile</CardTitle>
            </CardHeader>
            <CardContent className="p-2 md:p-6">
              <div className="h-[400px] md:h-[500px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 20, right: 10, left: isMobile ? 0 : 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" domain={[0, 150]} unit="%" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={isMobile ? 80 : 120}
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      interval={0}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.2)' }} />
                    <ReferenceLine x={90} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                    <ReferenceLine x={100} stroke="var(--color-success)" strokeWidth={2} strokeDasharray="5 5" label={{ value: 'Target', position: 'top', fill: 'var(--color-success)', fontSize: 10, fontWeight: 'bold' }} />
                    <ReferenceLine x={120} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                    <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={isMobile ? 16 : 24}>
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fill}
                          opacity={selectedNutrient === null || selectedNutrient === entry.name ? 1 : 0.3}
                          cursor="pointer"
                          onClick={() => setSelectedNutrient(selectedNutrient === entry.name ? null : entry.name)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Overall Nutrient Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] md:h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} outerRadius={isMobile ? "60%" : "80%"}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="name" tick={{ fill: 'hsl(var(--foreground))', fontSize: isMobile ? 10 : 12 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 150]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                      <Radar name="Adequacy %" dataKey="value" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.6} />
                      <Tooltip content={<RadarTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nutrient Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      Macronutrients
                    </h4>
                    <div className="space-y-2">
                      {macronutrients.map((nutrient) => {
                        const classification = getDeficiencyClassification(nutrient.percentage);
                        return (
                          <div key={nutrient.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                            <span className="text-sm font-medium">{nutrient.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{nutrient.percentage}%</span>
                              <Badge variant={classification.variant} className="text-[10px] px-1.5 py-0.5">{classification.text}</Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      Micronutrients
                    </h4>
                    <div className="space-y-2">
                      {micronutrients.map((nutrient) => {
                        const classification = getDeficiencyClassification(nutrient.percentage);
                        return (
                          <div key={nutrient.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                            <span className="text-sm font-medium">{nutrient.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{nutrient.percentage}%</span>
                              <Badge variant={classification.variant} className="text-[10px] px-1.5 py-0.5">{classification.text}</Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Nutrient Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-2 md:p-6">
              <div className="space-y-3">
                {data.map((row) => {
                  const { text, variant } = getDeficiencyClassification(row.percentage);
                  const isSelected = selectedNutrient === row.name;

                  return (
                    <div
                      key={row.name}
                      className={`p-3 md:p-4 rounded-xl border-2 transition-all cursor-pointer ${isSelected
                        ? 'border-primary bg-primary/5 shadow-lg scale-[1.01] md:scale-[1.02]'
                        : 'border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/50'
                        }`}
                      onClick={() => setSelectedNutrient(isSelected ? null : row.name)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 md:w-2 h-10 md:h-12 rounded-full" style={{ backgroundColor: row.fill }} />
                          <div>
                            <p className="font-bold text-base md:text-lg">{row.name}</p>
                            <p className="text-[10px] md:text-xs text-muted-foreground">{row.category}</p>
                          </div>
                        </div>
                        <Badge variant={variant} className="text-xs px-2 py-0.5 md:px-3 md:py-1">
                          {text}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-3">
                        <div className="text-center p-1.5 md:p-2 rounded-lg bg-background/50">
                          <p className="text-[10px] md:text-xs text-muted-foreground mb-1">Intake</p>
                          <p className="font-bold text-sm md:text-base text-foreground">{row.intake} <span className="text-[10px] font-normal">{row.unit}</span></p>
                        </div>
                        <div className="text-center p-1.5 md:p-2 rounded-lg bg-background/50">
                          <p className="text-[10px] md:text-xs text-muted-foreground mb-1">Target</p>
                          <p className="font-bold text-sm md:text-base text-foreground">{row.rda} <span className="text-[10px] font-normal">{row.unit}</span></p>
                        </div>
                        <div className="text-center p-1.5 md:p-2 rounded-lg bg-background/50">
                          <p className="text-[10px] md:text-xs text-muted-foreground mb-1">Achieved</p>
                          <p className="font-bold text-sm md:text-base" style={{ color: row.fill }}>{row.percentage}%</p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="relative h-2 md:h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className="absolute h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(row.percentage, 100)}%`,
                            backgroundColor: row.fill
                          }}
                        />
                        {row.percentage > 100 && (
                          <div
                            className="absolute h-full rounded-full opacity-50"
                            style={{
                              width: `${Math.min(row.percentage - 100, 50)}%`,
                              left: '100%',
                              backgroundColor: row.fill
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NutrientChart;