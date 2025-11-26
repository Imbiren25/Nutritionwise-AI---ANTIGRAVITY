import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { ScrollArea } from './ui/ScrollArea';
import { ArrowLeft, Shield, Lock, FileText, Eye, Database, AlertCircle } from 'lucide-react';

interface PrivacyPolicyProps {
    onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold font-heading text-foreground">Privacy Policy</h1>
                        <p className="text-muted-foreground">Last Updated: 17/11/2025</p>
                    </div>
                </div>
                <Button onClick={onBack} variant="outline" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Profile
                </Button>
            </div>

            <Card className="border-muted/60 shadow-lg">
                <ScrollArea className="h-[calc(100vh-200px)]">
                    <CardContent className="p-8 space-y-8">
                        {/* 1. Introduction */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-bold font-heading flex items-center gap-2 text-primary">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">1</span>
                                Introduction
                            </h2>
                            <p className="text-muted-foreground leading-relaxed pl-8">
                                Welcome to NutritionWise. This policy outlines our commitment to protecting your privacy in compliance with India's Digital Personal Data Protection (DPDP) Act 2023 and WHO Digital Health Guidelines.
                            </p>
                        </section>

                        {/* 2. Data We Collect */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-bold font-heading flex items-center gap-2 text-primary">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">2</span>
                                Data We Collect
                            </h2>
                            <div className="pl-8 space-y-3">
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <span className="font-semibold text-foreground min-w-[180px]">Personal Information:</span>
                                        <span>Name, Email, College, Batch.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-semibold text-foreground min-w-[180px]">Assessment Information:</span>
                                        <span>Anthropometry, family details, diet recall, stock inventory, and socio-economic details.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-semibold text-foreground min-w-[180px]">Device Information:</span>
                                        <span>Device model, OS version, app version, and anonymized crash logs.</span>
                                    </li>
                                </ul>
                                <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-800 text-sm flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <p><strong>We explicitly DO NOT collect:</strong> Precise GPS coordinates, your IP address, contact lists, photos, or biometrics.</p>
                                </div>
                            </div>
                        </section>

                        {/* 3. Purpose of Data Collection */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-bold font-heading flex items-center gap-2 text-primary">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">3</span>
                                Purpose of Data Collection
                            </h2>
                            <div className="pl-8 space-y-3">
                                <p className="text-muted-foreground">Your data is used exclusively for the following academic and educational purposes:</p>
                                <ul className="list-disc list-outside ml-4 space-y-1 text-muted-foreground">
                                    <li>To perform nutrition assessment calculations (RDA, CU, SES).</li>
                                    <li>To provide AI-powered diet guidance and generate assessment reports.</li>
                                    <li>To facilitate academic learning for medical and health-science students.</li>
                                </ul>
                                <div className="p-4 bg-green-50 border border-green-100 rounded-lg text-green-800 text-sm flex items-start gap-2">
                                    <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <p>Your data will <strong>never</strong> be used for marketing, advertising, resale to third parties, or for predicting health risks.</p>
                                </div>
                            </div>
                        </section>

                        {/* 4. User Consent */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-bold font-heading flex items-center gap-2 text-primary">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">4</span>
                                User Consent
                            </h2>
                            <p className="text-muted-foreground leading-relaxed pl-8">
                                We obtain your explicit consent before you start your first assessment. This consent is specific, informed, and revocable at any time from your profile.
                            </p>
                        </section>

                        {/* 5. Data Retention Policy */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-bold font-heading flex items-center gap-2 text-primary">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">5</span>
                                Data Retention Policy
                            </h2>
                            <div className="pl-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-muted/30 rounded-lg border border-muted">
                                    <p className="font-semibold text-foreground mb-1">Assessment Drafts</p>
                                    <p className="text-sm text-muted-foreground">Automatically deleted after 30 days of inactivity.</p>
                                </div>
                                <div className="p-4 bg-muted/30 rounded-lg border border-muted">
                                    <p className="font-semibold text-foreground mb-1">Completed Assessments</p>
                                    <p className="text-sm text-muted-foreground">Retained until you manually delete them.</p>
                                </div>
                                <div className="p-4 bg-muted/30 rounded-lg border border-muted">
                                    <p className="font-semibold text-foreground mb-1">AI Logs</p>
                                    <p className="text-sm text-muted-foreground">Not stored.</p>
                                </div>
                                <div className="p-4 bg-muted/30 rounded-lg border border-muted">
                                    <p className="font-semibold text-foreground mb-1">Crash Logs</p>
                                    <p className="text-sm text-muted-foreground">Anonymized and retained for 90 days.</p>
                                </div>
                            </div>
                        </section>

                        {/* 6. Your Rights Under the DPDP Act */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-bold font-heading flex items-center gap-2 text-primary">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">6</span>
                                Your Rights Under the DPDP Act
                            </h2>
                            <div className="pl-8 space-y-3">
                                <p className="text-muted-foreground">You have the following rights regarding your data:</p>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <Eye className="w-4 h-4 mt-1 text-primary" />
                                        <span><strong>Right to Access:</strong> You can view your data within the app.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <FileText className="w-4 h-4 mt-1 text-primary" />
                                        <span><strong>Right to Correction:</strong> You can edit your profile information.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Database className="w-4 h-4 mt-1 text-primary" />
                                        <span><strong>Right to Erasure:</strong> You can delete all your data using the "Delete All My Data" feature in your profile.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Shield className="w-4 h-4 mt-1 text-primary" />
                                        <span><strong>Right to Withdraw Consent:</strong> Deleting your data serves as a withdrawal of consent.</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* 7. Health Disclaimer */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-bold font-heading flex items-center gap-2 text-primary">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">7</span>
                                Health Disclaimer
                            </h2>
                            <div className="pl-8">
                                <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg text-orange-800 text-sm leading-relaxed">
                                    NutritionWise is an educational tool and not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified health provider with any questions you may have regarding a medical condition.
                                </div>
                            </div>
                        </section>
                    </CardContent>
                </ScrollArea>
            </Card>
        </div>
    );
};

export default PrivacyPolicy;
