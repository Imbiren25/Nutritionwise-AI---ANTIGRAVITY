import React, { useState } from 'react';
import { User } from '../types';
import Icon from './Icon';
import Logo from './Logo';
import WelcomeScreen from './onboarding/WelcomeScreen';
import ConsentModal from './ConsentModal'; // Re-using for onboarding
import PermissionsScreen from './onboarding/PermissionsScreen';
import RoleConfirmationScreen from './onboarding/RoleConfirmationScreen';
import TutorialSlider from './onboarding/TutorialSlider';
import FullPrivacyPolicyModal from './onboarding/FullPrivacyPolicyModal';

interface OnboardingStepperProps {
  onFinish: () => void;
  user: User;
}

// FIX: Moved StepIndicator outside the main component to prevent re-renders and fix prop type errors.
// It now receives currentStep and totalSteps as props to remove dependency on outer scope.
const StepIndicator: React.FC<{ index: number; currentStep: number; totalSteps: number }> = ({ index, currentStep, totalSteps }) => (
  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 mx-1 ${index === currentStep
    ? 'bg-[var(--color-primary)] text-white shadow-lg scale-110'
    : index < currentStep
      ? 'bg-[var(--color-primary)] text-white opacity-60'
      : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'
    }`}>
    {index + 1}
  </div>
);


const OnboardingStepper: React.FC<OnboardingStepperProps> = ({ onFinish, user }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showFullPolicy, setShowFullPolicy] = useState(false);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinish();
    }
  };

  const handleAgreeFromPolicy = () => {
    setShowFullPolicy(false);
    nextStep();
  };

  const steps = [
    { name: 'Welcome', component: <WelcomeScreen onNext={() => nextStep()} /> },
    { name: 'Consent', component: <ConsentModal onAgree={() => nextStep()} onViewFullPolicy={() => setShowFullPolicy(true)} /> },
    { name: 'Permissions', component: <PermissionsScreen onNext={() => nextStep()} /> },
    { name: 'Role', component: <RoleConfirmationScreen user={user} onNext={() => nextStep()} /> },
    { name: 'Tutorial', component: <TutorialSlider onFinish={onFinish} /> },
  ];


  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex flex-col items-center justify-center p-4 font-body">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Logo className="w-8 h-8 text-[var(--color-primary)]" />
          <h1 className="text-3xl font-bold text-[var(--color-primary)] font-heading tracking-tight">Welcome to NutritionWise</h1>
        </div>

        <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 min-h-[500px] flex flex-col border border-border">
          <div className="flex justify-center items-center mb-10 bg-[var(--bg-tertiary)] w-fit mx-auto px-4 py-2 rounded-full">
            {/* FIX: Pass currentStep and totalSteps to the StepIndicator component. */}
            {steps.map((step, index) => <StepIndicator key={step.name} index={index} currentStep={currentStep} totalSteps={steps.length} />)}
          </div>
          <div className="flex-grow flex items-center justify-center w-full">
            {steps[currentStep].component}
          </div>
        </div>
      </div>
      {showFullPolicy && <FullPrivacyPolicyModal onAgree={handleAgreeFromPolicy} onBack={() => setShowFullPolicy(false)} />}
    </div>
  );
};

export default OnboardingStepper;