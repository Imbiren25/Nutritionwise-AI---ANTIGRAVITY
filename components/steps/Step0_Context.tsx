import React from 'react';
import { useAssessment } from '../../hooks/useAssessment';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Card, CardContent } from '../ui/Card';
import { User, Users, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const Step0_Context: React.FC<ReturnType<typeof useAssessment>> = ({ data, updateData }) => {
  const { isSelf } = data.respondentContext;

  const handleSelection = (isSelfSelection: boolean) => {
    updateData('respondentContext', {
      isSelf: isSelfSelection,
      relationToRespondent: isSelfSelection ? 'Self' : ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 rounded-r-lg">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
            First, let's establish the context
          </p>
          <p className="text-xs text-blue-800 dark:text-blue-200">
            Is this dietary recall for you, or are you conducting it for someone else?
          </p>
        </div>
      </div>

      {/* Selection Cards */}
      <div>
        <Label className="mb-3">Who is this recall for?</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            className={cn(
              "cursor-pointer transition-all border-2",
              isSelf ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/50"
            )}
            onClick={() => handleSelection(true)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <User className={cn("w-8 h-8", isSelf ? "text-primary" : "text-muted-foreground")} />
                <div>
                  <p className="font-semibold text-lg mb-1">For Myself</p>
                  <p className="text-sm text-muted-foreground">I am entering my own dietary intake</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "cursor-pointer transition-all border-2",
              !isSelf ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/50"
            )}
            onClick={() => handleSelection(false)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Users className={cn("w-8 h-8", !isSelf ? "text-primary" : "text-muted-foreground")} />
                <div>
                  <p className="font-semibold text-lg mb-1">For Someone Else</p>
                  <p className="text-sm text-muted-foreground">Child, patient, family member, etc.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Conditional Relation Input */}
      {!isSelf && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-2">
          <Label htmlFor="relationToRespondent">Your Relation to Respondent</Label>
          <Input
            id="relationToRespondent"
            value={data.respondentContext.relationToRespondent}
            onChange={(e) => updateData('respondentContext', { relationToRespondent: e.target.value })}
            placeholder="e.g., Mother, Father, Health Worker"
          />
        </div>
      )}
    </div>
  );
};

export default Step0_Context;