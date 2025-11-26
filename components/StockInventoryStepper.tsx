import React, { useState, useMemo, cloneElement } from 'react';
import { useStockInventory } from '../hooks/useStockInventory';
import StepA from './steps/StepA';
import StepC from './steps/StepC';
import StepD from './steps/StepD';
import StepE from './steps/StepE';
import StockStep_Family from './stock_steps/StockStep_Family';
import StockStep_FoodStock from './stock_steps/StockStep_FoodStock';
import StockStep_Summary from './stock_steps/StockStep_Summary';
import StockStep_AI_Summary from './stock_steps/StockStep_AI_Summary';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Button } from './ui/Button';
import Badge from './ui/Badge';
import { AIResponse, AssessmentData } from '../types';
import { ChevronLeft, ChevronRight, X, RefreshCw, CheckCircle2, AlertCircle, CloudOff, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockInventoryStepperProps {
  inventoryHook: ReturnType<typeof useStockInventory>;
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

const StockInventoryStepper: React.FC<StockInventoryStepperProps> = ({ inventoryHook, onFinish, onExit, showSnackbar }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isStepValid, setIsStepValid] = useState(true);
  const { syncStatus, lastSynced, saveToCloud } = inventoryHook;

  // Adapt the generic step components to work with the useStockInventory hook
  const adaptedHook = useMemo(() => {
    const adaptedData: AssessmentData = {
      respondentContext: { isSelf: true, relationToRespondent: 'Self' },
      sectionA: inventoryHook.data.sectionA,
      sectionB: { weight: 0, height: 0, muac: 0, bmi: 0, bmiCategory: 'N/A' },
      sectionC: inventoryHook.data.sectionB,
      sectionD: inventoryHook.data.sectionC,
      sectionE: inventoryHook.data.sectionD,
      sectionF: {
        waterSource: 'Tap', cookingFuel: 'LPG', dietaryPattern: 'Vegetarian',
        marketAccess: 'Daily', storageFacilities: 'None', electricity: 'Reliable',
        perishablesFrequency: 'Daily', foodSafetyConcerns: '',
      },
      sectionG: {
        activityLevel: 'Light Exercise', physiologicalState: 'NPNL', occupation: '',
        waterIntake: 0, foodAllergies: '', medicalConditions: '',
      },
      sectionH: { isTypicalDay: 'Yes', dayType: 'Normal' },
      sectionI: { meals: { earlyMorning: [], breakfast: [], midMorning: [], lunch: [], eveningSnack: [], dinner: [], lateNight: [] } },
      sectionJ: {
        nutrientIntake: { energy: 0, protein: 0, fat: 0, carbs: 0, iron: 0, calcium: 0, vitaminA: 0, b12: 0, zinc: 0, fiber: 0 },
        rdaComparison: { energy: 0, protein: 0, fat: 0, carbs: 0, iron: 0, calcium: 0, vitaminA: 0, b12: 0, zinc: 0, fiber: 0 },
      },
    };

    const adaptedUpdateData = <K extends keyof AssessmentData>(section: K, sectionData: Partial<AssessmentData[K]>) => {
      switch (section) {
        case 'sectionA':
          inventoryHook.updateData('sectionA', sectionData);
          break;
        case 'sectionC':
          inventoryHook.updateData('sectionB', sectionData as Partial<AssessmentData['sectionC']>);
          break;
        case 'sectionD':
          inventoryHook.updateData('sectionC', sectionData as Partial<AssessmentData['sectionD']>);
          break;
        case 'sectionE':
          inventoryHook.updateData('sectionD', sectionData as Partial<AssessmentData['sectionE']>);
          break;
        default:
          break;
      }
    };

    return {
      data: adaptedData,
      updateData: adaptedUpdateData,
      resetAssessment: () => { },
      saveToCloud: async () => { },
      syncStatus: inventoryHook.syncStatus,
      lastSynced: inventoryHook.lastSynced,
    };
  }, [inventoryHook]);

  const steps = useMemo(() => [
    { title: "Respondent Details", component: <StepA {...adaptedHook} /> },
    { title: "Head of Family Details", component: <StepC {...adaptedHook} /> },
    { title: "Family Composition (CU)", component: <StockStep_Family {...inventoryHook} /> },
    { title: "Location", component: <StepD {...adaptedHook} /> },
    { title: "Socio-Economic Status", component: <StepE {...adaptedHook} /> },
    { title: "Household Food Stock (raw)", component: <StockStep_FoodStock {...inventoryHook} /> },
    { title: "Adequacy Summary", component: <StockStep_Summary {...inventoryHook} /> },
    { title: "AI Summary & Recommendations", component: <StockStep_AI_Summary {...inventoryHook} onFinish={onFinish} showSnackbar={showSnackbar} /> },
  ], [adaptedHook, inventoryHook, onFinish, showSnackbar]);

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

  const currentStepComponent = useMemo(() => {
    const component = steps[currentStep].component;
    if (React.isValidElement(component)) {
      return cloneElement(component as React.ReactElement<{ onValidationChange?: (isValid: boolean) => void }>, { onValidationChange: setIsStepValid });
    }
    return component;
  }, [currentStep, steps]);

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Card className="border-muted/60 shadow-xl relative overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onExit}
            className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Exit stock inventory"
          >
            <X className="w-5 h-5" />
          </button>

          <CardHeader className="relative pb-4">
            {/* Header Top Row: Progress & Sync Status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-xs font-semibold">
                  Step {currentStep + 1} of {steps.length}
                </Badge>
                <SyncIndicator status={syncStatus} lastSynced={lastSynced} onRetry={saveToCloud} />
              </div>
              <span className="text-sm font-semibold text-primary mr-8">
                {Math.round(progress)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-6 relative w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Step Title */}
            <CardTitle className="text-3xl mb-2">{steps[currentStep].title}</CardTitle>
            <CardDescription className="text-base">
              Please provide accurate information for this section.
            </CardDescription>
          </CardHeader>

          <CardContent className="relative">
            {/* Step Content */}
            <div className="min-h-[400px] py-6">
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
                  <div className="hidden md:block w-32" />
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

export default StockInventoryStepper;