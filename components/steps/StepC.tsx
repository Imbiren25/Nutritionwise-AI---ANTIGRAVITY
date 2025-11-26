import React from 'react';
import { useAssessment } from '../../hooks/useAssessment';
import { AssessmentData } from '../../types';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/Select';
import { Info, Users } from 'lucide-react';

const educationLevels: AssessmentData['sectionC']['hofEducation'][] = ['Illiterate', 'Primary', 'Secondary', 'Higher Secondary', 'Graduate & Above', 'Professional'];
const occupationLevels: AssessmentData['sectionC']['hofOccupation'][] = ['Unemployed', 'Unskilled', 'Semi-skilled', 'Skilled', 'Clerical/Shop', 'Semi-professional', 'Professional'];

const occupationCatalog: Record<AssessmentData['sectionC']['hofOccupation'], string[]> = {
  Unemployed: ['Looking for work', 'Student', 'Homemaker', 'Retired'],
  'Unskilled': ['Daily wage laborer', 'Construction helper', 'Housekeeping staff', 'Farm laborer', 'Loader'],
  'Semi-skilled': ['Driver', 'Tailor', 'Electrician helper', 'Mechanic helper', 'Security guard'],
  Skilled: ['Carpenter', 'Plumber', 'Electrician', 'Cook/Chef', 'Mechanic', 'Beautician', 'Computer operator'],
  'Clerical/Shop': ['Cashier', 'Shop assistant', 'Sales executive', 'Receptionist', 'Data entry', 'Office clerk'],
  'Semi-professional': ['School teacher', 'Nurse', 'Technician', 'Pharmacist', 'Accountant', 'Small business owner'],
  Professional: ['Doctor', 'Engineer', 'Lawyer', 'Professor', 'Architect', 'CA/CS', 'Software developer', 'Bank manager'],
};

const StepC: React.FC<ReturnType<typeof useAssessment>> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 rounded-r-lg">
        <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
            Why we ask this?
          </p>
          <p className="text-xs text-blue-800 dark:text-blue-200">
            Details about the Head of Family are used to calculate the Socio-Economic Status (SES) of the household, which is a key factor in understanding nutritional context.
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HOF Name */}
        <div className="space-y-2">
          <Label htmlFor="hofName">Head of Family's Name</Label>
          <Input
            id="hofName"
            value={data.sectionC.hofName}
            onChange={(e) => updateData('sectionC', { hofName: e.target.value })}
            placeholder="Enter HOF's name"
          />
        </div>

        {/* Relation */}
        <div className="space-y-2">
          <Label htmlFor="hofRelation">Relation to Respondent</Label>
          <Input
            id="hofRelation"
            value={data.sectionC.hofRelation}
            onChange={(e) => updateData('sectionC', { hofRelation: e.target.value })}
            placeholder="e.g., Father, Mother, Self"
          />
        </div>

        {/* HOF Education */}
        <div className="space-y-2">
          <Label htmlFor="hofEducation">HOF Education</Label>
          <Select
            value={data.sectionC.hofEducation}
            onValueChange={(value) => updateData('sectionC', { hofEducation: value as AssessmentData['sectionC']['hofEducation'] })}
          >
            <SelectTrigger id="hofEducation">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {educationLevels.map(level => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* HOF Occupation */}
        <div className="space-y-2">
          <Label htmlFor="hofOccupation">HOF Occupation</Label>
          <Select
            value={data.sectionC.hofOccupation}
            onValueChange={(value) => updateData('sectionC', { hofOccupation: value as AssessmentData['sectionC']['hofOccupation'] })}
          >
            <SelectTrigger id="hofOccupation" className="h-auto py-3 items-start [&>span]:text-left">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {occupationLevels.map((level) => (
                <SelectItem key={level} value={level} className="py-3">
                  <div className="flex flex-col items-start text-left gap-1 max-w-[280px] sm:max-w-md">
                    <span className="font-medium">{level}</span>
                    <span className="text-xs text-muted-foreground opacity-80 line-clamp-2 leading-tight whitespace-normal">
                      {occupationCatalog[level]?.join(', ')}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default StepC;