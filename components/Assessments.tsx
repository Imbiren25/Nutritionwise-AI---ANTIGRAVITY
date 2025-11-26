import React from 'react';
import Icon from './Icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { FeatureFlags } from '../types';
import { cn } from '@/lib/utils';
import { ClipboardList, Package, Clock } from 'lucide-react';

interface AssessmentsProps {
  onStartAssessment: (type: '24-hour' | 'stock') => void;
  featureFlags: FeatureFlags;
}

const Assessments: React.FC<AssessmentsProps> = ({ onStartAssessment, featureFlags }) => {
  return (
    <div className="max-w-5xl mx-auto pb-8 px-4">
      {/* Header Section */}
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary mb-4">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
          Ready to Start
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Start New Assessment
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the type of assessment you want to begin. Each assessment provides detailed insights and analysis.
        </p>
      </div>

      {/* Assessment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <AssessmentCard
          title="24-Hour Recall"
          description="Conduct a detailed dietary intake assessment for an individual. Includes anthropometry, food intake logging, and comprehensive nutrient analysis."
          icon={<ClipboardList className="h-6 w-6" />}
          onClick={() => onStartAssessment('24-hour')}
          gradient="from-blue-500/10 to-cyan-500/10"
          iconBg="bg-blue-500/10"
          iconColor="text-blue-600"
          disabled={!featureFlags.enable_24hr}
        />
        <AssessmentCard
          title="Stock Inventory"
          description="Assess a household's food stock, calculate consumption units (CU), and determine food security and dietary diversity levels."
          icon={<Package className="h-6 w-6" />}
          onClick={() => onStartAssessment('stock')}
          gradient="from-orange-500/10 to-amber-500/10"
          iconBg="bg-orange-500/10"
          iconColor="text-orange-600"
          disabled={!featureFlags.enable_stock}
        />
      </div>

      {/* Previous Drafts Section */}
      <div className="mt-16">
        <div className="text-center mb-8 space-y-2">
          <h3 className="text-2xl font-bold text-foreground">Previous Drafts</h3>
          <p className="text-muted-foreground">
            Resume an assessment you started earlier
          </p>
        </div>

        {/* Empty State */}
        <Card className="border-dashed border-2 bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">No Active Drafts</h4>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              When you save a draft during an assessment, it will appear here for you to continue later.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface AssessmentCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  gradient: string;
  iconBg: string;
  iconColor: string;
  disabled?: boolean;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({
  title,
  description,
  icon,
  onClick,
  gradient,
  iconBg,
  iconColor,
  disabled
}) => {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-muted/60 transition-all duration-300",
        !disabled && "hover:shadow-xl hover:scale-[1.02] cursor-pointer hover:border-primary/50",
        disabled && "opacity-60 cursor-not-allowed"
      )}
      onClick={!disabled ? onClick : undefined}
    >
      {/* Gradient Background */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", gradient)} />

      <CardHeader className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconBg)}>
            <div className={iconColor}>
              {icon}
            </div>
          </div>
          {disabled && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
              Coming Soon
            </span>
          )}
        </div>
        <CardTitle className="text-2xl mb-2">{title}</CardTitle>
        <CardDescription className="text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) onClick();
          }}
          disabled={disabled}
          className="w-full"
          size="lg"
        >
          {disabled ? 'Coming Soon' : 'Start Assessment'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Assessments;