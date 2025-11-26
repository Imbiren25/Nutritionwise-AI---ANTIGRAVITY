import React from 'react';
import { useAssessment } from '../../hooks/useAssessment';
import { AssessmentData } from '../../types';
import { Label } from '../ui/Label';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

type DayType = AssessmentData['sectionH']['dayType'];
const dayTypes: DayType[] = ['Festival', 'Sick', 'Travel', 'Fasting', 'Party', 'Medication'];

const StepH: React.FC<ReturnType<typeof useAssessment>> = ({ data, updateData }) => {
    const handleTypicalDayChange = (isTypical: 'Yes' | 'No') => {
        if (isTypical === 'Yes') {
            updateData('sectionH', { isTypicalDay: 'Yes', dayType: 'Normal' });
        } else {
            updateData('sectionH', { isTypicalDay: 'No', dayType: 'Festival' });
        }
    };

    return (
        <div className="space-y-6">
            {/* Main Question */}
            <div className="space-y-3">
                <Label className="text-base">Was yesterday a typical eating day?</Label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => handleTypicalDayChange('Yes')}
                        className={cn(
                            "py-4 px-6 text-lg font-semibold rounded-lg transition-all border-2",
                            data.sectionH.isTypicalDay === 'Yes'
                                ? "bg-primary text-primary-foreground border-primary shadow-md"
                                : "bg-background border-muted hover:border-muted-foreground/50"
                        )}
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => handleTypicalDayChange('No')}
                        className={cn(
                            "py-4 px-6 text-lg font-semibold rounded-lg transition-all border-2",
                            data.sectionH.isTypicalDay === 'No'
                                ? "bg-primary text-primary-foreground border-primary shadow-md"
                                : "bg-background border-muted hover:border-muted-foreground/50"
                        )}
                    >
                        No
                    </button>
                </div>
            </div>

            {/* Conditional Day Type Selection */}
            {data.sectionH.isTypicalDay === 'No' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
                    <Label className="text-base">If not, what was the reason?</Label>
                    <div className="flex flex-wrap gap-3">
                        {dayTypes.map((day) => (
                            <button
                                key={day}
                                onClick={() => updateData('sectionH', { dayType: day })}
                                className={cn(
                                    "px-5 py-2.5 text-sm font-medium rounded-lg transition-all border-2",
                                    data.sectionH.dayType === day
                                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                        : "bg-background border-muted hover:border-muted-foreground/50"
                                )}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Info Text */}
            <div className="flex items-start gap-2 p-4 bg-muted/50 rounded-lg">
                <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                    This helps the AI understand the context of the food intake (e.g., higher calories during a festival).
                </p>
            </div>
        </div>
    );
};

export default StepH;