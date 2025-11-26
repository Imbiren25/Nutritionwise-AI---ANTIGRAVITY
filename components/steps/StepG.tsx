import React, { useState, useEffect } from 'react';
import { useAssessment } from '../../hooks/useAssessment';
import { AssessmentData } from '../../types';
import { Label } from '../ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Activity, Droplets, AlertTriangle, Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import Badge from '../ui/Badge';

type ActivityLevel = 'Light Exercise' | 'Moderate Exercise' | 'Vigorous' | 'Very Intense';

const activityLevels: { level: ActivityLevel; description: string; met: string }[] = [
  { level: 'Light Exercise', description: 'Slow walk, yoga, stretching', met: 'MET 1.6–2.9' },
  { level: 'Moderate Exercise', description: 'Brisk walk, swimming, jogging', met: 'MET 3–5.9' },
  { level: 'Vigorous', description: 'Running, HIIT, sports', met: 'MET 6–8.9' },
  { level: 'Very Intense', description: 'Sprinting, CrossFit, powerlifting', met: 'MET ≥9' },
];

const physiologicalStates: AssessmentData['sectionG']['physiologicalState'][] = ['NPNL', 'Pregnant', 'Lactating'];

interface StepGProps extends ReturnType<typeof useAssessment> {
  onValidationChange?: (isValid: boolean) => void;
}

const StepG: React.FC<StepGProps> = ({ data, updateData, onValidationChange }) => {
  const [error, setError] = useState('');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(() => {
    const raw = data.sectionG.foodAllergies?.trim();
    if (!raw || raw.toLowerCase() === 'none') return [];
    return raw.split(',').map(s => s.trim()).filter(Boolean);
  });
  const allowedAllergies = ['Peanuts', 'Gluten', 'Milk/Lactose', 'Egg', 'Soy', 'Fish', 'Shellfish', 'Tree nuts', 'Sesame', 'Wheat', 'None'];

  const [selectedConditions, setSelectedConditions] = useState<string[]>(() => {
    const raw = data.sectionG.medicalConditions?.trim();
    if (!raw || raw.toLowerCase() === 'none') return [];
    return raw.split(',').map(s => s.trim()).filter(Boolean);
  });
  const allowedConditions = ['Diabetes', 'Hypertension', 'Kidney disease', 'Heart disease', 'Asthma', 'Thyroid disorder', 'Obesity', 'Anemia', 'Liver disease', 'None'];

  useEffect(() => {
    const isFemale = data.sectionA.sex === 'Female';
    const ps = data.sectionG.physiologicalState;
    if (!isFemale && ps !== 'NPNL') {
      updateData('sectionG', { physiologicalState: 'NPNL' });
      setError('');
      onValidationChange?.(true);
      return;
    }
    setError('');
    onValidationChange?.(true);
  }, [data.sectionA.sex, data.sectionG.physiologicalState, onValidationChange]);

  const toggleSelection = (
    current: string[],
    item: string,
    setter: (val: string[]) => void,
    field: 'foodAllergies' | 'medicalConditions'
  ) => {
    if (item === 'None') {
      setter([]);
      updateData('sectionG', { [field]: 'None' });
      return;
    }
    const next = current.includes(item)
      ? current.filter(a => a !== item)
      : [...current.filter(a => a !== 'None'), item];
    setter(next);
    updateData('sectionG', { [field]: next.length ? next.join(', ') : 'None' });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Household Environment</h2>
        <p className="text-muted-foreground">
          Details about lifestyle, health conditions, and daily habits.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Water Intake Card */}
        <Card className="md:col-span-2 border-primary/20 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Droplets className="w-5 h-5 text-blue-500" />
              Daily Water Intake
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-primary">
                    {(data.sectionG.waterIntake || 0).toFixed(1)} <span className="text-sm font-normal text-muted-foreground">Liters</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Approx. {Math.round((data.sectionG.waterIntake || 0) * 4.2)} cups
                  </p>
                </div>
                <Badge variant="secondary" className="mb-2">
                  Target: 2.5 - 3.5 L
                </Badge>
              </div>

              <div className="relative h-6 w-full">
                <input
                  type="range"
                  min={0.5}
                  max={5}
                  step={0.1}
                  value={data.sectionG.waterIntake || 0}
                  onChange={(e) => updateData('sectionG', { waterIntake: parseFloat(e.target.value) || 0 })}
                  className="absolute w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary z-10"
                />
                <div
                  className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full pointer-events-none"
                  style={{ width: `${((data.sectionG.waterIntake || 0) - 0.5) / 4.5 * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>0.5 L</span>
                <span>2.75 L</span>
                <span>5.0 L</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Physiological State (Female Only) */}
        {data.sectionA.sex === 'Female' && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Physiological Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {physiologicalStates.map((state) => (
                  <button
                    key={state}
                    type="button"
                    onClick={() => updateData('sectionG', { physiologicalState: state })}
                    className={cn(
                      "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all hover:bg-muted/50",
                      data.sectionG.physiologicalState === state
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-muted bg-card text-muted-foreground"
                    )}
                  >
                    {data.sectionG.physiologicalState === state && (
                      <div className="absolute top-2 right-2">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    <span className="font-semibold">{state === 'NPNL' ? 'Normal' : state}</span>
                    {state === 'NPNL' && <span className="text-xs opacity-70 mt-1">Non-Pregnant/Lactating</span>}
                  </button>
                ))}
              </div>
              {error && (
                <div className="mt-4 flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Food Allergies */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Food Allergies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {allowedAllergies.map(name => {
                const isSelected = selectedAllergies.includes(name) || (name === 'None' && selectedAllergies.length === 0);
                return (
                  <button
                    key={name}
                    onClick={() => toggleSelection(selectedAllergies, name, setSelectedAllergies, 'foodAllergies')}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background text-foreground border-border hover:bg-muted"
                    )}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Medical Conditions */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Medical Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {allowedConditions.map(name => {
                const isSelected = selectedConditions.includes(name) || (name === 'None' && selectedConditions.length === 0);
                return (
                  <button
                    key={name}
                    onClick={() => toggleSelection(selectedConditions, name, setSelectedConditions, 'medicalConditions')}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                      isSelected
                        ? "bg-destructive text-destructive-foreground border-destructive shadow-sm"
                        : "bg-background text-foreground border-border hover:bg-muted"
                    )}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Exercise Level */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Activity Level</h3>
            <Badge variant="neutral" className="hidden sm:flex items-center gap-1">
              <Info className="w-3 h-3" />
              Based on daily routine
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activityLevels.map(({ level, description, met }) => (
              <div
                key={level}
                onClick={() => updateData('sectionG', { activityLevel: level })}
                className={cn(
                  "relative group cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md",
                  data.sectionG.activityLevel === level
                    ? "border-primary bg-primary/5"
                    : "border-muted bg-card hover:border-primary/50"
                )}
              >
                <div className="flex flex-col h-full justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Activity className={cn(
                        "w-5 h-5",
                        data.sectionG.activityLevel === level ? "text-primary" : "text-muted-foreground"
                      )} />
                      {data.sectionG.activityLevel === level && (
                        <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <h4 className={cn(
                      "font-semibold leading-tight",
                      data.sectionG.activityLevel === level ? "text-primary" : "text-foreground"
                    )}>
                      {level}
                    </h4>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                      {met}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepG;