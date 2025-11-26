import React, { useEffect, useState } from 'react';
import { useAssessment } from '../../hooks/useAssessment';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Card, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import { Info, Loader2, TrendingUp } from 'lucide-react';

// Simplified Kuppuswamy scale logic for Urban areas
const getKuppuswamyScore = (education: string, occupation: string, income: number): { total: number; ses: string } => {
  const eduMap: { [key: string]: number } = { 'Professional': 7, 'Graduate & Above': 6, 'Higher Secondary': 4, 'Secondary': 3, 'Primary': 2, 'Illiterate': 1 };
  const occMap: { [key: string]: number } = { 'Professional': 10, 'Semi-professional': 6, 'Clerical/Shop': 5, 'Skilled': 4, 'Semi-skilled': 3, 'Unskilled': 2, 'Unemployed': 1 };

  const educationScore = eduMap[education] || 1;
  const occupationScore = occMap[occupation] || 1;

  let incomeScore = 1;
  if (income > 75000) incomeScore = 12;
  else if (income > 37500) incomeScore = 10;
  else if (income > 28000) incomeScore = 6;
  else if (income > 18500) incomeScore = 4;
  else if (income > 9500) incomeScore = 3;
  else if (income > 0) incomeScore = 2;

  const totalScore = educationScore + occupationScore + incomeScore;

  let ses = 'N/A';
  if (totalScore >= 26) ses = 'Upper (Class I)';
  else if (totalScore >= 16) ses = 'Upper Middle (Class II)';
  else if (totalScore >= 11) ses = 'Middle (Class III)';
  else if (totalScore >= 5) ses = 'Lower Middle (Class IV)';
  else if (totalScore > 0) ses = 'Lower (Class V)';

  return { total: totalScore, ses };
};

// Simplified BG Prasad scale logic for Rural/Tribal areas
const getBgPrasadSes = (income: number): string => {
  const perCapitaIncome = income / 5;
  if (perCapitaIncome > 6500) return 'Upper (Class I)';
  if (perCapitaIncome > 3200) return 'Upper Middle (Class II)';
  if (perCapitaIncome > 1900) return 'Middle (Class III)';
  if (perCapitaIncome > 950) return 'Lower Middle (Class IV)';
  if (perCapitaIncome > 0) return 'Lower (Class V)';
  return 'N/A';
};

const StepE: React.FC<ReturnType<typeof useAssessment>> = ({ data, updateData }) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const { income } = data.sectionE;
  const { hofEducation, hofOccupation } = data.sectionC;
  const { location } = data.sectionD;

  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => {
      let ses = 'N/A';
      const isRural = location === 'Rural' || location === 'Tribal';

      if (isRural) {
        ses = getBgPrasadSes(income);
      } else {
        ses = getKuppuswamyScore(hofEducation, hofOccupation, income).ses;
      }

      updateData('sectionE', { ses: ses });
      setIsCalculating(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [income, hofEducation, hofOccupation, location]);

  const scaleUsed = location === 'Rural' || location === 'Tribal' ? 'BG Prasad (Rural)' : 'Kuppuswamy (Urban)';

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="flex gap-3 p-4 bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 rounded-r-lg">
        <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
            How this works
          </p>
          <p className="text-xs text-green-800 dark:text-green-200">
            Based on your location selection (<span className="font-semibold">{location}</span>), the <span className="font-semibold">{scaleUsed}</span> scale is used. SES is auto-calculated using HOF details and family income.
          </p>
        </div>
      </div>

      {/* Income Input */}
      <div className="space-y-2">
        <Label htmlFor="income">Total Monthly Family Income (INR)</Label>
        <Input
          type="number"
          id="income"
          value={data.sectionE.income || ''}
          onChange={(e) => updateData('sectionE', { income: parseFloat(e.target.value) || 0 })}
          placeholder="e.g., 25000"
        />
      </div>

      {/* SES Result Card */}
      {((data.sectionE.income ?? 0) > 0) && (
        <Card className="border-primary/40 bg-gradient-to-br from-primary/5 to-green-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Calculated SES Class</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {scaleUsed} scale
                </p>
              </div>
              {isCalculating ? (
                <div className="flex items-center gap-2 text-primary">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Calculating...</span>
                </div>
              ) : (
                <Badge className="text-base px-4 py-2">{data.sectionE.ses}</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StepE;