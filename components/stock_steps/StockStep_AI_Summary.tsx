import React, { useState, useCallback } from 'react';
import { useStockInventory } from '../../hooks/useStockInventory';
import { generateStockSummary } from '../../services/geminiService';
import { AIResponse } from '../../types';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import OfflineWarningModal from '../OfflineWarningModal';
import { analyticsService } from '../../services/analyticsService';
import { auth, saveReport, firebaseReady } from '../../services/firebase';
import { useAiUsage } from '../../hooks/useAiUsage';
import AdConsentModal from '../AdConsentModal';
import AdRewardModal from '../AdRewardModal';
import AdPlayerSimulation from '../AdPlayerSimulation';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import Badge from '../ui/Badge';
import { Sparkles, Loader2, FileCheck, AlertTriangle, Utensils, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockStep_AI_SummaryProps extends ReturnType<typeof useStockInventory> {
  onFinish: (aiResponse?: AIResponse) => void;
  showSnackbar: (message: string, type?: 'success' | 'error') => void;
}

const SummaryCard: React.FC<{ title: string, data: { [key: string]: string | number } }> = ({ title, data }) => (
  <Card className="border-muted/60">
    <CardHeader className="pb-3">
      <CardTitle className="text-base">{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex justify-between text-sm">
          <span className="text-muted-foreground">{key}</span>
          <span className="font-semibold">{value}</span>
        </div>
      ))}
    </CardContent>
  </Card>
);

const AIResponseDisplay: React.FC<{ response: AIResponse }> = ({ response }) => {
  const suggestionEntries = Object.entries(response.food_suggestions).filter((entry): entry is [string, string[]] => {
    const [, suggestions] = entry;
    return Array.isArray(suggestions) && suggestions.length > 0;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden border-primary/20 shadow-sm">
          <div className="bg-primary/5 p-4 border-b border-primary/10 flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileCheck className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-bold text-primary">Household Summary</h3>
          </div>
          <div className="p-5">
            <p className="text-sm leading-relaxed text-muted-foreground">{response.summary}</p>
          </div>
        </Card>

        <Card className="overflow-hidden border-destructive/20 shadow-sm">
          <div className="bg-destructive/5 p-4 border-b border-destructive/10 flex items-center gap-2">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </div>
            <h3 className="font-bold text-destructive">Key Areas for Improvement</h3>
          </div>
          <div className="p-5">
            <ul className="space-y-3">
              {response.key_nutrient_gaps.map((gap, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <Badge variant="error" className="mt-0.5 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] flex-shrink-0">
                    {index + 1}
                  </Badge>
                  <span className="text-muted-foreground">{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {suggestionEntries.length > 0 && (
        <Card className="overflow-hidden shadow-sm">
          <div className="bg-orange-50/50 p-4 border-b border-orange-100 flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="font-bold text-orange-900">Food Purchase Suggestions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground w-1/3">Nutrient / Food Group</th>
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Suggestions</th>
                </tr>
              </thead>
              <tbody>
                {suggestionEntries.map(([nutrient, suggestions], idx) => (
                  <tr key={nutrient} className={cn("border-b last:border-0 transition-colors hover:bg-muted/50", idx % 2 === 0 ? "bg-background" : "bg-muted/10")}>
                    <td className="p-4 align-top font-medium capitalize text-foreground">{nutrient.replace('_', ' ')}</td>
                    <td className="p-4 align-top">
                      <div className="space-y-2">
                        {suggestions.map((food, i) => (
                          <div key={i} className="text-sm text-muted-foreground">
                            • {food}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden border-blue-200 shadow-sm">
          <div className="bg-blue-50/50 p-4 border-b border-blue-100 flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Utensils className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="font-bold text-blue-900">Meal & Stock Ideas</h3>
          </div>
          <div className="p-4">
            <ul className="space-y-3">
              {response.meal_wise_improvements.map((rec, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  <span className="text-muted-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="overflow-hidden border-green-200 shadow-sm">
          <div className="bg-green-50/50 p-4 border-b border-green-100 flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="font-bold text-green-900">Affordable Swaps</h3>
          </div>
          <div className="p-4">
            <ul className="space-y-3">
              {response.affordable_swaps.map((rec, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                  <span className="text-muted-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <div className="bg-muted/30 p-4 rounded-lg border border-dashed text-center">
        <p className="text-xs italic text-muted-foreground">{response.disclaimer}</p>
      </div>
    </div>
  );
};

const StockStep_AI_Summary: React.FC<StockStep_AI_SummaryProps> = ({ data, onFinish, showSnackbar }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [showAdConsentModal, setShowAdConsentModal] = useState(false);
  const [showAdRewardModal, setShowAdRewardModal] = useState(false);
  const [showAdPlayer, setShowAdPlayer] = useState(false);
  const isOnline = useOnlineStatus();
  const { canGenerateFree, canGenerateRewarded, incrementFree, incrementRewarded, getUsageStats } = useAiUsage();

  const proceedWithGeneration = useCallback(async (isRewarded = false) => {
    setLoading(true);
    setError(null);
    setAiResponse(null);
    analyticsService.logEvent('ai_summary_requested', { type: 'stock', rewarded: isRewarded });

    setTimeout(async () => {
      try {
        const summaryResponse = await generateStockSummary(data);
        setAiResponse(summaryResponse);
        if (isRewarded) {
          incrementRewarded();
        } else {
          incrementFree();
        }
        analyticsService.logEvent('ai_summary_completed', { duration: 2000, type: 'stock', rewarded: isRewarded });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(errorMessage);
        analyticsService.logEvent('ai_failed', { details: errorMessage, type: 'stock' });
      } finally {
        setLoading(false);
      }
    }, 1500);
  }, [data, incrementFree, incrementRewarded]);

  const handleGenerateSummary = useCallback(() => {
    if (!isOnline) {
      setShowOfflineModal(true);
      return;
    }

    if (canGenerateFree()) {
      proceedWithGeneration(false);
    } else if (canGenerateRewarded()) {
      const consentGiven = localStorage.getItem('rewardedAdConsentGiven') === 'true';
      if (!consentGiven) {
        setShowAdConsentModal(true);
      } else {
        setShowAdRewardModal(true);
      }
    } else {
      showSnackbar('AI summary limit reached for today.', 'error');
    }
  }, [isOnline, canGenerateFree, canGenerateRewarded, proceedWithGeneration, showSnackbar]);

  const handleAdConsent = () => {
    localStorage.setItem('rewardedAdConsentGiven', 'true');
    setShowAdConsentModal(false);
    setShowAdRewardModal(true);
  };

  const handleWatchAd = () => {
    setShowAdRewardModal(false);
    setShowAdPlayer(true);
  };

  const handleAdComplete = () => {
    setShowAdPlayer(false);
    showSnackbar('AI unlocked! Generating summary…', 'success');
    proceedWithGeneration(true);
  };

  const handleConfirmFinish = () => {
    onFinish(aiResponse || undefined);
    try {
      const uid = auth?.currentUser?.uid;
      if (firebaseReady && uid) {
        const report = {
          id: crypto.randomUUID(),
          type: 'Stock Inventory' as const,
          respondentName: data.sectionA.name,
          completionDate: new Date().toISOString(),
          data,
          aiResponse: aiResponse || undefined
        };
        saveReport(uid, report).then(() => {
          showSnackbar('Report saved to cloud', 'success');
        }).catch(() => {
          showSnackbar('Failed to save report', 'error');
        });
      }
    } catch { }
  };

  const usageStats = getUsageStats();

  return (
    <>
      {showOfflineModal && <OfflineWarningModal onClose={() => setShowOfflineModal(false)} />}
      {showAdConsentModal && <AdConsentModal onAgree={handleAdConsent} onCancel={() => setShowAdConsentModal(false)} />}
      {showAdRewardModal && <AdRewardModal onWatchAd={handleWatchAd} onCancel={() => setShowAdRewardModal(false)} />}
      {showAdPlayer && <AdPlayerSimulation onComplete={handleAdComplete} onClose={() => setShowAdPlayer(false)} />}

      <div className="space-y-6">
        <Card className="border-primary/60 bg-gradient-to-br from-orange-500/10 to-amber-500/10">
          <CardContent className="text-center pt-6">
            <FileCheck className="w-12 h-12 text-primary mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-primary mb-2">Assessment Complete!</h3>
            <p className="text-muted-foreground">
              Review the household summary below. You can generate an AI analysis or finish and save.
            </p>
          </CardContent>
        </Card>

        {!aiResponse && !error && !loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SummaryCard title="Household CU" data={{ "Total CU": data.sectionE.totalCU.toFixed(2) }} />
              <SummaryCard title="Dietary Diversity" data={{ "Score": `${data.sectionG.dietaryDiversityScore} / 10` }} />
              <SummaryCard title="Food Security" data={{
                "Stock Lasts (days)": data.sectionG.daysFoodLasts,
                "Insecurity Risk": data.sectionG.foodInsecurityRisk,
              }} />
            </div>

            <div className="text-center pt-4">
              <Button onClick={handleGenerateSummary} disabled={loading} size="lg" className="gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate AI Summary & Recommendations
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                You have used {usageStats.totalUsed} of {usageStats.totalAllowed} AI summaries today.
              </p>
            </div>
          </div>
        )}

        {loading && (
          <Card className="border-primary/40 bg-primary/5">
            <CardContent className="text-center py-12">
              <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
              <p className="font-semibold text-lg mb-2">AI is analyzing the household data...</p>
              <p className="text-sm text-muted-foreground">This might take up to 30 seconds.</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-destructive/60 bg-destructive/10">
            <CardContent className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <p className="font-semibold text-lg text-destructive mb-2">AI Failed to Generate Summary</p>
              <p className="text-sm mb-4">{error}</p>
              <Button onClick={handleGenerateSummary} disabled={loading} variant="destructive">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {aiResponse && <AIResponseDisplay response={aiResponse} />}

        <div className="text-center border-t border-muted pt-6">
          <Button onClick={handleConfirmFinish} size="lg" className="shadow-lg">
            <FileCheck className="w-5 h-5 mr-2" />
            Finish & Save Assessment
          </Button>
        </div>
      </div>
    </>
  );
};

export default StockStep_AI_Summary;