import React, { useEffect, useState, useMemo } from 'react';
import { useAssessment } from '../../hooks/useAssessment';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Card, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import { AlertCircle, Info, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepBProps extends ReturnType<typeof useAssessment> {
  onValidationChange?: (isValid: boolean) => void;
}

const InputField = ({ label, field, placeholder, min, max, step = 0.1, required = false, unit, data, updateData }: any) => {
  // Initialize with empty string if value is 0 or undefined
  const initialValue = data.sectionB[field as keyof typeof data.sectionB];
  const [localValue, setLocalValue] = useState(initialValue && initialValue !== 0 ? initialValue.toString() : '');
  const isTypingRef = React.useRef(false);

  useEffect(() => {
    // Only sync from external data if we're not currently typing
    if (!isTypingRef.current) {
      const val = data.sectionB[field as keyof typeof data.sectionB];
      const currentNumeric = localValue === '' ? 0 : parseFloat(localValue);

      if (val !== undefined && val !== null && val !== currentNumeric) {
        setLocalValue(val === 0 ? '' : val.toString());
      }
    }
    isTypingRef.current = false;
  }, [data.sectionB[field], field]);

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    isTypingRef.current = true;
    setLocalValue(val);

    const numericVal = parseFloat(val);
    if (!isNaN(numericVal)) {
      updateData('sectionB', { ...data.sectionB, [field]: numericVal });
    } else if (val === '') {
      updateData('sectionB', { ...data.sectionB, [field]: 0 });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={field} className="text-sm font-medium">
          {label}
        </Label>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
      <Input
        id={field}
        type="number"
        value={localValue}
        onChange={handleLocalChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="font-medium"
      />
    </div>
  );
};

const StepB: React.FC<StepBProps> = ({ data, updateData, onValidationChange }) => {
  const { age, ageInMonths = 0 } = data.sectionA;
  const { weight, height, muac, birthWeight, birthLength, headCircumference, chestCircumference, waistCircumference, hipCircumference, tsf } = data.sectionB;

  // Determine Age Category
  const ageCategory = useMemo(() => {
    if (age === 0) {
      if (ageInMonths === 0) return 'Newborn';
      return 'Infant';
    }
    if (age < 5) return 'Young Child';
    if (age >= 5 && age < 10) return 'School Age';
    if (age >= 10 && age < 19) return 'Adolescent';
    return 'Adult';
  }, [age, ageInMonths]);

  // Calculate BMI
  const { bmi, bmiCategory } = useMemo(() => {
    if (weight > 0 && height > 0) {
      const heightInMeters = height / 100;
      const newBmi = weight / (heightInMeters * heightInMeters);
      let newBmiCategory = 'N/A';
      if (age >= 19) {
        if (newBmi < 18.5) newBmiCategory = 'Underweight';
        else if (newBmi >= 18.5 && newBmi < 25) newBmiCategory = 'Normal weight';
        else if (newBmi >= 25 && newBmi < 30) newBmiCategory = 'Overweight';
        else newBmiCategory = 'Obesity';
      } else {
        newBmiCategory = 'Calculated via WHO Standards';
      }
      return { bmi: newBmi, bmiCategory: newBmiCategory };
    }
    return { bmi: 0, bmiCategory: 'N/A' };
  }, [weight, height, age]);

  // Validation removed - all inputs are now optional
  useEffect(() => {
    // Always report as valid
    onValidationChange?.(true);
  }, [onValidationChange]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Age Category Info */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">{ageCategory} Anthropometry</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter measurements for {age === 0 ? (ageInMonths === 0 ? 'Newborn (0-28 days)' : `Infant (${ageInMonths} months)`) : `${age} years`}
              </p>
            </div>
            <Badge variant="neutral">{ageCategory}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Input Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NEWBORN */}
        {ageCategory === 'Newborn' && (
          <>
            <InputField label="Birth Weight" field="birthWeight" placeholder="e.g., 3.2" min={0.5} max={6} unit="kg" required data={data} updateData={updateData} />
            <InputField label="Birth Length" field="birthLength" placeholder="e.g., 50" min={30} max={60} unit="cm" required data={data} updateData={updateData} />
            <InputField label="Head Circumference" field="headCircumference" placeholder="e.g., 34" min={20} max={50} unit="cm" required data={data} updateData={updateData} />
            <InputField label="Chest Circumference" field="chestCircumference" placeholder="e.g., 32" min={20} max={50} unit="cm" required data={data} updateData={updateData} />
            <InputField label="MUAC (Optional)" field="muac" placeholder="e.g., 10" min={5} max={20} unit="cm" data={data} updateData={updateData} />
          </>
        )}

        {/* INFANT */}
        {ageCategory === 'Infant' && (
          <>
            <InputField label="Weight" field="weight" placeholder="e.g., 6.5" min={1} max={20} unit="kg" required data={data} updateData={updateData} />
            <InputField label="Length" field="height" placeholder="e.g., 65" min={40} max={90} unit="cm" required data={data} updateData={updateData} />
            <InputField label="Head Circumference" field="headCircumference" placeholder="e.g., 42" min={30} max={55} unit="cm" required data={data} updateData={updateData} />
            <InputField label="MUAC (Optional)" field="muac" placeholder="e.g., 12" min={8} max={20} unit="cm" data={data} updateData={updateData} />
          </>
        )}

        {/* YOUNG CHILD */}
        {ageCategory === 'Young Child' && (
          <>
            <InputField label="Weight" field="weight" placeholder="e.g., 12" min={5} max={40} unit="kg" required data={data} updateData={updateData} />
            <InputField label="Height/Length" field="height" placeholder="e.g., 95" min={60} max={130} unit="cm" required data={data} updateData={updateData} />
            <InputField label="MUAC" field="muac" placeholder="e.g., 14" min={10} max={25} unit="cm" required data={data} updateData={updateData} />
            <InputField label="Head Circumference (Optional)" field="headCircumference" placeholder="e.g., 48" min={40} max={60} unit="cm" data={data} updateData={updateData} />
          </>
        )}

        {/* SCHOOL AGE */}
        {ageCategory === 'School Age' && (
          <>
            <InputField label="Weight" field="weight" placeholder="e.g., 25" min={10} max={80} unit="kg" required data={data} updateData={updateData} />
            <InputField label="Height" field="height" placeholder="e.g., 120" min={90} max={170} unit="cm" required data={data} updateData={updateData} />
            <InputField label="MUAC (Optional)" field="muac" placeholder="e.g., 18" min={12} max={35} unit="cm" data={data} updateData={updateData} />
            <InputField label="Triceps Skinfold (Optional)" field="tsf" placeholder="e.g., 10" min={1} max={40} unit="mm" data={data} updateData={updateData} />
          </>
        )}

        {/* ADOLESCENT */}
        {ageCategory === 'Adolescent' && (
          <>
            <InputField label="Weight" field="weight" placeholder="e.g., 45" min={20} max={120} unit="kg" required data={data} updateData={updateData} />
            <InputField label="Height" field="height" placeholder="e.g., 155" min={120} max={200} unit="cm" required data={data} updateData={updateData} />
            <InputField label="MUAC" field="muac" placeholder="e.g., 22" min={15} max={45} unit="cm" required data={data} updateData={updateData} />
            <InputField label="Waist Circumference" field="waistCircumference" placeholder="e.g., 65" min={40} max={150} unit="cm" data={data} updateData={updateData} />
            <InputField label="Hip Circumference (Optional)" field="hipCircumference" placeholder="e.g., 80" min={50} max={150} unit="cm" data={data} updateData={updateData} />
          </>
        )}

        {/* ADULT */}
        {ageCategory === 'Adult' && (
          <>
            <InputField label="Weight" field="weight" placeholder="e.g., 65" min={30} max={250} unit="kg" required data={data} updateData={updateData} />
            <InputField label="Height" field="height" placeholder="e.g., 170" min={120} max={250} unit="cm" required data={data} updateData={updateData} />
            <InputField label="Waist Circumference" field="waistCircumference" placeholder="e.g., 85" min={50} max={200} unit="cm" data={data} updateData={updateData} />
            <InputField label="Hip Circumference" field="hipCircumference" placeholder="e.g., 100" min={50} max={200} unit="cm" data={data} updateData={updateData} />
            <InputField label="MUAC (Optional)" field="muac" placeholder="e.g., 28" min={15} max={50} unit="cm" data={data} updateData={updateData} />
          </>
        )}
      </div>

      {/* BMI Display */}
      {(ageCategory === 'School Age' || ageCategory === 'Adolescent' || ageCategory === 'Adult') && bmi > 0 && (
        <Card className="border-primary/40 bg-gradient-to-br from-primary/5 to-blue-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1">Calculated BMI</h3>
                <p className="text-sm text-muted-foreground">
                  {ageCategory === 'Adult' ? 'Standard Adult BMI' : 'BMI-for-Age Z-score required'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-primary">{bmi.toFixed(1)}</p>
                <Badge variant={bmiCategory === 'Normal weight' ? 'success' : bmiCategory === 'Underweight' ? 'warning' : 'error'}>{bmiCategory}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StepB;
