import React, { useState } from 'react';
import { CompletedReport, StockInventoryData, AssessmentData } from '../types';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import Badge from './ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { cn } from '@/lib/utils';
import {
  FileText,
  Calendar,
  TrendingUp,
  Award,
  ArrowRight,
  Plus,
  AlertCircle,
  Package,
  Activity,
  Search,
  Edit2,
  Trash2
} from 'lucide-react';
import { Input } from './ui/Input';

interface ReportsProps {
  reports: CompletedReport[];
  onViewReport: (report: CompletedReport) => void;
  onEditReport: (report: CompletedReport) => void;
  onDeleteReport: (reportId: string) => void;
  onNavigate: () => void;
}

const TwentyFourHourReportCard: React.FC<{ report: CompletedReport; onViewReport: (report: CompletedReport) => void; onEditReport: (report: CompletedReport) => void; onDeleteReport: (reportId: string) => void; }> = ({ report, onViewReport, onEditReport, onDeleteReport }) => {
  const data = report.data as AssessmentData;
  const bmi = data.sectionB?.bmi || 0;
  const bmiCategory = data.sectionB?.bmiCategory || 'N/A';
  const energy = data.sectionJ?.nutrientIntake?.energy || 0;

  const bmiColor = bmiCategory === 'Normal' ? 'text-green-600 bg-green-50 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' :
    bmiCategory === 'Overweight' || bmiCategory === 'Underweight' ? 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20' :
      'text-red-600 bg-red-50 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30 overflow-hidden h-full flex flex-col"
    >
      <div className="p-5 flex-1 flex flex-col cursor-pointer" onClick={() => onViewReport(report)}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl group-hover:scale-110 transition-transform shadow-sm">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground line-clamp-1">
                {report.respondentName}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {report.completionDate}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-[10px] px-2 h-5">
            24-Hour
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto">
          <div className="p-2.5 rounded-lg bg-muted/40 border border-muted/60">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">BMI Score</p>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">{bmi.toFixed(1)}</span>
              <Badge className={cn("text-[10px] px-1.5 py-0 h-4", bmiColor)}>
                {bmiCategory}
              </Badge>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-muted/40 border border-muted/60">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Energy Intake</p>
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-lg font-bold text-foreground">{Math.round(energy)}</span>
              <span className="text-xs text-muted-foreground">kcal</span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 py-3 bg-muted/20 border-t border-muted/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs gap-1.5 hover:bg-primary/10 hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              onEditReport(report);
            }}
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs gap-1.5 hover:bg-destructive/10 hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteReport(report.id);
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </Button>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground group-hover:text-primary cursor-pointer" onClick={() => onViewReport(report)}>
          <span>View</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Card>
  );
};

const StockReportCard: React.FC<{ report: CompletedReport; onViewReport: (report: CompletedReport) => void; onEditReport: (report: CompletedReport) => void; onDeleteReport: (reportId: string) => void; }> = ({ report, onViewReport, onEditReport, onDeleteReport }) => {
  const data = report.data as StockInventoryData;
  const { totalCU } = data.sectionE;
  const { dietaryDiversityScore, foodInsecurityRisk } = data.sectionG;

  const riskColors = {
    Low: 'text-green-600 bg-green-50 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
    Moderate: 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20',
    Severe: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
  };
  const riskColor = riskColors[foodInsecurityRisk] || 'text-muted-foreground bg-muted border-border';

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30 overflow-hidden h-full flex flex-col"
    >
      <div className="p-5 flex-1 flex flex-col cursor-pointer" onClick={() => onViewReport(report)}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl group-hover:scale-110 transition-transform shadow-sm">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground line-clamp-1">
                Stock Assessment
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {report.completionDate}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-[10px] px-2 h-5">
            Stock
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto">
          <div className="p-2.5 rounded-lg bg-muted/40 border border-muted/60">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Food Security</p>
            <Badge className={cn("text-[10px] px-1.5 py-0.5 h-auto w-fit", riskColor)}>
              {foodInsecurityRisk}
            </Badge>
          </div>
          <div className="p-2.5 rounded-lg bg-muted/40 border border-muted/60">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Diet Diversity</p>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-lg font-bold text-foreground">{dietaryDiversityScore}</span>
              <span className="text-xs text-muted-foreground">/ 7</span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 py-3 bg-muted/20 border-t border-muted/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs gap-1.5 hover:bg-primary/10 hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              onEditReport(report);
            }}
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs gap-1.5 hover:bg-destructive/10 hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteReport(report.id);
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </Button>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground group-hover:text-primary cursor-pointer" onClick={() => onViewReport(report)}>
          <span>View</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Card>
  );
};

const Reports: React.FC<ReportsProps> = ({ reports, onViewReport, onEditReport, onDeleteReport, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.respondentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' ||
      (activeTab === '24h' && report.type === '24-Hour Recall') ||
      (activeTab === 'stock' && report.type === 'Stock Inventory');
    return matchesSearch && matchesTab;
  });

  const hasFirebase = Boolean((import.meta as any).env.VITE_FIREBASE_API_KEY);

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <FileText className="w-10 h-10 text-primary/60" />
        </div>
        <h2 className="text-3xl font-bold font-heading mb-3 text-foreground">No Reports Yet</h2>
        <p className="text-muted-foreground max-w-md mb-8 text-lg leading-relaxed">
          Start your first nutrition assessment to generate detailed reports and AI insights.
        </p>
        <Button
          onClick={onNavigate}
          size="lg"
          className="gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span>Start Assessment</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">
            My Reports
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>{reports.length} Assessment{reports.length !== 1 ? 's' : ''} Completed</span>
          </p>
        </div>
        <Button
          onClick={onNavigate}
          className="gap-2 shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Assessment</span>
        </Button>
      </div>

      {/* Firebase Warning */}
      {!hasFirebase && (
        <Card className="border-yellow-200 bg-yellow-50/50">
          <div className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                Cloud sync is unavailable
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Configure Firebase in Settings to enable online backups.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Controls & Grid */}
      <Tabs defaultValue="all" className="space-y-6" onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="24h">24-Hour Recall</TabsTrigger>
            <TabsTrigger value="stock">Stock Inventory</TabsTrigger>
          </TabsList>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              className="pl-9 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredReports.map((report) => (
              report.type === 'Stock Inventory'
                ? <StockReportCard key={report.id} report={report} onViewReport={onViewReport} onEditReport={onEditReport} onDeleteReport={onDeleteReport} />
                : <TwentyFourHourReportCard key={report.id} report={report} onViewReport={onViewReport} onEditReport={onEditReport} onDeleteReport={onDeleteReport} />
            ))}
          </div>
          {filteredReports.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No reports found matching your criteria.
            </div>
          )}
        </TabsContent>

        <TabsContent value="24h" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredReports.map((report) => (
              <TwentyFourHourReportCard key={report.id} report={report} onViewReport={onViewReport} onEditReport={onEditReport} onDeleteReport={onDeleteReport} />
            ))}
          </div>
          {filteredReports.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No 24-Hour Recall reports found.
            </div>
          )}
        </TabsContent>

        <TabsContent value="stock" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredReports.map((report) => (
              <StockReportCard key={report.id} report={report} onViewReport={onViewReport} onEditReport={onEditReport} onDeleteReport={onDeleteReport} />
            ))}
          </div>
          {filteredReports.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No Stock Inventory reports found.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
