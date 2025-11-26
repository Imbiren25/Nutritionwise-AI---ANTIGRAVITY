import React, { useState, useMemo, cloneElement } from 'react';
import { useAssessment } from '../hooks/useAssessment';
import Step0_Context from './steps/Step0_Context';
import StepA from './steps/StepA';
import StepB from './steps/StepB';
import StepC from './steps/StepC';
import StepD from './steps/StepD';
import StepE from './steps/StepE';
import StepF from './steps/StepF';
import StepG from './steps/StepG';
import StepH from './steps/StepH';
import StepI from './steps/StepI';
import StepJ from './steps/StepJ';
import StepK from './steps/StepK';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Button } from './ui/Button';
import Badge from './ui/Badge';
import { AIResponse } from '../types';
import { ChevronLeft, ChevronRight, X, AlertCircle, Cloud, CloudOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssessmentStepperProps {
  assessmentHook: ReturnType<typeof useAssessment>;
  onFinish: (aiResponse?: AIResponse) => void;
  onExit: () => void;
  showSnackbar: (message: string, type?: 'success' | 'error') => void;
}

const SyncIndicator = ({ status, lastSynced, onRetry }: { status: string, lastSynced: Date | null, onRetry: () => void }) => {
  if (status === 'saving') {
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
        <RefreshCw className="w-3 h-3 animate-spin" />
        Saving...
      </div>
    );
  }
  if (status === 'saved') {
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 transition-all duration-500">
        <CheckCircle2 className="w-3 h-3" />
        Saved {lastSynced ? 'just now' : ''}
      </div>
    );
  }
  if (status === 'error') {
    return (
      <button onClick={onRetry} className="flex items-center gap-1.5 text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-full border border-destructive/20 hover:bg-destructive/20 transition-colors">
        <AlertCircle className="w-3 h-3" />
        Save Failed (Retry)
      </button>
    );
  }
  if (status === 'offline') {
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full border border-muted-foreground/20">
        <CloudOff className="w-3 h-3" />
        Offline
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/50 px-2 py-1">
      <Cloud className="w-3 h-3" />
      Sync Ready
    </div>
  );
};

const AssessmentStepper: React.FC<AssessmentStepperProps> = ({ assessmentHook, onFinish, onExit, showSnackbar }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isStepValid, setIsStepValid] = useState(true);
  const { data, syncStatus, lastSynced, saveToCloud } = assessmentHook;

  const steps = useMemo(() => [
    { title: "Respondent Context", component: <Step0_Context {...assessmentHook} /> },
    { title: "Respondent Details", component: <StepA {...assessmentHook} /> },
    { title: "Anthropometry", component: <StepB {...assessmentHook} /> },
    { title: "Head of Family Details", component: <StepC {...assessmentHook} /> },
    { title: "Location", component: <StepD {...assessmentHook} /> },
    { title: "Socio-Economic Status", component: <StepE {...assessmentHook} /> },
    { title: "Household Environment", component: <StepF {...assessmentHook} /> },
    { title: "Lifestyle & Physiological Status", component: <StepG {...assessmentHook} /> },
    { title: "Day Type", component: <StepH {...assessmentHook} /> },
    { title: "Food Intake", component: <StepI {...assessmentHook} /> },
    { title: "Nutrient Calculation", component: <StepJ {...assessmentHook} /> },
    { title: "Summary & AI", component: <StepK {...assessmentHook} onFinish={onFinish} showSnackbar={showSnackbar} /> },
  ], [assessmentHook, onFinish, showSnackbar]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsStepValid(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setIsStepValid(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  // Add onValidationChange to the current step component
  const currentStepComponent = useMemo(() => {
    const component = steps[currentStep].component;
    if (React.isValidElement(component)) {
      return cloneElement(component as React.ReactElement<{ onValidationChange?: (isValid: boolean) => void; }>, { onValidationChange: setIsStepValid });
    }
    return component;
  }, [currentStep, steps]);

  const getValidationMessage = () => {
    if (currentStep === 1) {
      const parts = [] as string[];
      if (!data.sectionA.name.trim()) parts.push('Enter name');
      if (data.sectionA.age <= 0 || data.sectionA.age > 120) parts.push('Age 1–120');
      return parts.length ? `Complete required fields: ${parts.join(', ')}.` : 'Complete required fields to continue.';
    }
    if (currentStep === 2) {
      const parts = [] as string[];
      if (data.sectionB.weight <= 0 || data.sectionB.weight > 500) parts.push('Weight 1–500 kg');
      if (data.sectionB.height <= 0 || data.sectionB.height > 300) parts.push('Height 1–300 cm');
      return parts.length ? `Fix inputs: ${parts.join(', ')}.` : 'Fix inputs to continue.';
    }
    if (currentStep === 7) {
      const isMale = data.sectionA.sex === 'Male';
      const ps = data.sectionG.physiologicalState;
      if (isMale && (ps === 'Pregnant' || ps === 'Lactating')) return 'Male cannot be Pregnant or Lactating.';
    }
    return 'Complete this step to continue.';
  };

  return (
    <div className="min-h-screen bg-muted/30 py-4 md:py-8 px-2 md:px-4">
      <div className="max-w-5xl mx-auto">
        <Card className="border-muted/60 shadow-xl relative overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onExit}
            className="absolute top-2 right-2 md:top-4 md:right-4 z-10 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Exit assessment"
          >
            <X className="w-5 h-5" />
          </button>

          <CardHeader className="relative pb-4 px-4 md:px-6">
            {/* Header Top Row: Progress & Sync Status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
              <div className="flex items-center justify-between w-full md:w-auto gap-3">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs font-semibold">
                    Step {currentStep + 1} of {steps.length}
                  </Badge>
                  <SyncIndicator status={syncStatus} lastSynced={lastSynced} onRetry={saveToCloud} />
                </div>
                <span className="text-sm font-semibold text-primary md:hidden">
                  {Math.round(progress)}%
                </span>
              </div>
              <span className="hidden md:block text-sm font-semibold text-primary mr-8">
                {Math.round(progress)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4 md:mb-6 relative w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Step Title */}
            <CardTitle className="text-2xl md:text-3xl mb-1 md:mb-2">{steps[currentStep].title}</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Please fill in the details for this section accurately.
            </CardDescription>
          </CardHeader>

          <CardContent className="relative px-4 md:px-6">
            {/* Step Content */}
            <div className="min-h-[300px] md:min-h-[400px] py-4 md:py-6">
              {currentStepComponent}
            </div>

            {/* Navigation Footer */}
            <div className="border-t border-muted pt-6 mt-8">
              <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  variant="outline"
                  size="lg"
                  className="gap-2 w-full md:w-auto"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex-1 flex justify-center w-full md:w-auto">
                  {!isStepValid && (
                    <div className="flex items-start gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-lg w-full md:max-w-md">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-medium">
                        {getValidationMessage()}
                      </p>
                    </div>
                  )}
                </div>

                {currentStep < steps.length - 1 ? (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid}
                    size="lg"
                    className="gap-2 w-full md:w-auto"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <div className="hidden md:block w-32">{/* Spacer to maintain layout */}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Breadcrumb Steps Indicator - Desktop Only */}
        <div className="hidden lg:flex items-center justify-center gap-2 mt-6 flex-wrap">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <button
                onClick={() => {
                  if (index <= currentStep) {
                    setCurrentStep(index);
                    setIsStepValid(true);
                  }
                }}
                disabled={index > currentStep}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                  index === currentStep && "bg-primary text-primary-foreground shadow-sm",
                  index < currentStep && "bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer",
                  index > currentStep && "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
                )}
              >
                {index + 1}. {step.title}
              </button>
              {index < steps.length - 1 && (
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssessmentStepper;
