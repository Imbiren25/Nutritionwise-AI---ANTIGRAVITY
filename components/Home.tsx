import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Page, User, CompletedReport } from '../types';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useAssessment } from '../hooks/useAssessment';
import { Plus, FileText, Calculator, BookOpen, PlayCircle, ChevronRight, AlertCircle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HomeProps {
  setActivePage: (page: Page) => void;
  user: User;
  reports: CompletedReport[];
  onViewReport: (report: CompletedReport) => void;
  assessmentHook: ReturnType<typeof useAssessment>;
}

const Home: React.FC<HomeProps> = ({ setActivePage, user, reports, onViewReport, assessmentHook }) => {
  const recentReports = reports.slice(-3).reverse();
  const isOnline = useOnlineStatus();

  const getDraftStatus = () => {
    try {
      const savedItem = localStorage.getItem('nutritionWiseAssessmentDraft');
      if (!savedItem) return null;

      const { timestamp } = JSON.parse(savedItem);
      const ageInMs = Date.now() - timestamp;
      const oneDayInMs = 24 * 60 * 60 * 1000;

      if (ageInMs > oneDayInMs) {
        return {
          age: Math.floor(ageInMs / oneDayInMs),
          type: '24-Hour Recall'
        };
      }
      return null;
    } catch {
      return null;
    }
  };

  const draftStatus = getDraftStatus();

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Hi, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-lg text-muted-foreground mt-1">
            Ready to make some nutritional insights today?
          </p>
        </div>
        <div className="hidden md:flex items-center text-sm font-medium text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
          <Calendar className="mr-2 h-4 w-4" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Draft Reminder */}
      {draftStatus && (
        <div className="bg-orange-50 border border-orange-100 text-orange-800 p-4 rounded-xl flex items-start space-x-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-orange-900">Incomplete Assessment Found</h3>
            <p className="text-sm mt-1 text-orange-800/80">You have a draft for a <strong>{draftStatus.type}</strong> assessment from {draftStatus.age} day(s) ago.</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActivePage('assessments')}
            className="text-orange-700 hover:text-orange-800 hover:bg-orange-100"
          >
            Continue <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Main Action Card */}
      <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 group">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-black/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>

        <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm border border-white/10">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              New Assessment
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Start a New Analysis</h2>
            <p className="text-primary-foreground/90 text-lg leading-relaxed">
              Begin a comprehensive 24-hour dietary recall or conduct a household stock inventory assessment.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button
              onClick={() => setActivePage('assessments')}
              size="lg"
              variant="secondary"
              className="h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Start Now
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Reports Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Recent Reports</h2>
          <Button variant="ghost" onClick={() => setActivePage('reports')} className="text-primary hover:text-primary/80">
            View All
          </Button>
        </div>

        {recentReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentReports.map(report => (
              <ReportCard
                key={report.id}
                type={report.type}
                name={report.respondentName}
                date={report.completionDate}
                onView={() => onViewReport(report)}
              />
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No reports yet</h3>
              <p className="text-muted-foreground mt-1">Complete your first assessment to see reports here.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Learning & Tools Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Tools & Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <ToolCard
            title="Food Conversions"
            description="Convert raw to cooked weights"
            icon={Calculator}
            color="text-blue-600 bg-blue-50"
            onClick={() => setActivePage('conversion-tool')}
          />
          <ToolCard
            title="Glossary"
            description="Nutrition terms & definitions"
            icon={BookOpen}
            color="text-purple-600 bg-purple-50"
            onClick={() => setActivePage('glossary')}
          />
          <ToolCard
            title="Tutorial"
            description="Learn how to use the app"
            icon={PlayCircle}
            color="text-pink-600 bg-pink-50"
            onClick={() => setActivePage('tutorials')}
          />
        </div>
      </div>

    </div>
  );
};

const ReportCard: React.FC<{ type: string, name: string, date: string, onView: () => void }> = ({ type, name, date, onView }) => (
  <Card className="hover:shadow-md transition-all duration-300 cursor-pointer group border-muted/60" onClick={onView}>
    <CardContent className="p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className={cn(
          "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide",
          type === '24-Hour Recall' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
        )}>
          {type === '24-Hour Recall' ? 'Dietary' : 'Inventory'}
        </div>
        <span className="text-xs text-muted-foreground font-medium">{date}</span>
      </div>

      <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors line-clamp-1">{name}</h3>
      <p className="text-sm text-muted-foreground mb-6">Assessment completed successfully.</p>

      <div className="mt-auto pt-4 border-t flex justify-between items-center">
        <span className="text-xs font-medium text-muted-foreground">PDF Ready</span>
        <span className="text-sm font-semibold text-primary flex items-center group-hover:translate-x-1 transition-transform">
          View Report <ChevronRight className="w-4 h-4 ml-1" />
        </span>
      </div>
    </CardContent>
  </Card>
)

const ToolCard: React.FC<{ title: string, description: string, icon: React.ElementType, color: string, onClick?: () => void }> = ({ title, description, icon: Icon, color, onClick }) => (
  <button onClick={onClick} className="text-left w-full group focus:outline-none">
    <Card className="h-full hover:shadow-md hover:-translate-y-1 transition-all duration-200 border-muted/60 group-focus:ring-2 ring-primary ring-offset-2">
      <CardContent className="p-6 flex items-start space-x-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110", color)}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
  </button>
)

export default Home;
