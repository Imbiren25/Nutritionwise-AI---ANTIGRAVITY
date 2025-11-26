import React, { useState, useEffect } from 'react';
import { useAssessment } from '../../hooks/useAssessment';
import { AssessmentData } from '../../types';
import NumericStepper from '../NumericStepper';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const maritalStatuses: AssessmentData['sectionA']['maritalStatus'][] = ['Single', 'Married', 'Widowed', 'Divorced'];
const educationLevels: AssessmentData['sectionA']['educationStatus'][] = ['Illiterate', 'Primary', 'Secondary', 'Higher Secondary', 'Graduate & Above'];

interface StepAProps extends ReturnType<typeof useAssessment> {
  onValidationChange?: (isValid: boolean) => void;
}

const StepA: React.FC<StepAProps> = ({ data, updateData, onValidationChange }) => {
  const [errors, setErrors] = useState({ name: '', age: '' });
  const [touched, setTouched] = useState<{ name: boolean; age: boolean }>({ name: false, age: false });

  useEffect(() => {
    const validate = () => {
      const newErrors = { name: '', age: '' };
      let isValid = true;

      if (!data.sectionA.name.trim()) {
        newErrors.name = 'Name is required.';
        isValid = false;
      }

      if (data.sectionA.age < 0 || data.sectionA.age > 120) {
        newErrors.age = 'Age must be between 0 and 120.';
        isValid = false;
      }

      setErrors(newErrors);
      onValidationChange?.(isValid);
    };
    validate();
  }, [data.sectionA, onValidationChange]);

  const handleAgeChange = (newAge: number) => {
    let age = newAge;
    if (age < 0) age = 0;
    updateData('sectionA', { age });
    setTouched(prev => ({ ...prev, age: true }));
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="flex gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-r-lg">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
            Why we ask this?
          </p>
          <p className="text-xs text-amber-800 dark:text-amber-200">
            Basic details help establish the respondent's identity and demographic profile, which is essential for matching them with the correct Recommended Daily Allowances (RDA) for nutrients.
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={data.sectionA.name}
            onChange={(e) => {
              updateData('sectionA', { name: e.target.value });
              setTouched(prev => ({ ...prev, name: true }));
            }}
            onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
            className={cn(touched.name && errors.name && "border-destructive focus-visible:ring-destructive")}
            placeholder="Enter respondent's full name"
          />
          {touched.name && errors.name && (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="w-3 h-3" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age">
            Age (in years) <span className="text-destructive">*</span>
          </Label>
          <NumericStepper
            value={data.sectionA.age}
            onChange={handleAgeChange}
            min={0}
            max={120}
          />
          {touched.age && errors.age ? (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="w-3 h-3" />
              {errors.age}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Age must be between 0-120. Enter 0 for infants.
            </p>
          )}
        </div>

        {/* Age in Months (conditional) */}
        {data.sectionA.age === 0 && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <Label htmlFor="ageInMonths">Age (in months)</Label>
            <NumericStepper
              value={data.sectionA.ageInMonths || 0}
              onChange={(val) => updateData('sectionA', { ageInMonths: val })}
              min={0}
              max={11}
            />
            <p className="text-xs text-muted-foreground">
              Enter 0 for newborns (0-28 days).
            </p>
          </div>
        )}

        {/* Sex */}
        <div className="space-y-2">
          <Label htmlFor="sex">Sex</Label>
          <Select
            value={data.sectionA.sex}
            onValueChange={(value) => updateData('sectionA', { sex: value as 'Male' | 'Female' | 'Other' })}
          >
            <SelectTrigger id="sex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Marital Status */}
        <div className="space-y-2">
          <Label htmlFor="maritalStatus">Marital Status</Label>
          <Select
            value={data.sectionA.maritalStatus}
            onValueChange={(value) => updateData('sectionA', { maritalStatus: value as AssessmentData['sectionA']['maritalStatus'] })}
          >
            <SelectTrigger id="maritalStatus">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {maritalStatuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Education Status */}
        <div className="space-y-2">
          <Label htmlFor="educationStatus">Education Status</Label>
          <Select
            value={data.sectionA.educationStatus}
            onValueChange={(value) => updateData('sectionA', { educationStatus: value as AssessmentData['sectionA']['educationStatus'] })}
          >
            <SelectTrigger id="educationStatus">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {educationLevels.map(level => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default StepA;