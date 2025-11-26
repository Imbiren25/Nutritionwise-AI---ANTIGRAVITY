import React from 'react';
import Icon from '../Icon';
import Modal from '../ui/Modal';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface FullPrivacyPolicyModalProps {
    onAgree: () => void;
    onBack: () => void;
}

const PolicySection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h3 className="text-xl font-bold pt-4 text-[var(--text-primary)]">{title}</h3>
        <div className="space-y-2 mt-1">{children}</div>
    </div>
);

const FullPrivacyPolicyModal: React.FC<FullPrivacyPolicyModalProps> = ({ onAgree, onBack }) => {
    return (
        <Modal open={true} onClose={onBack} title="NutritionWise — Privacy Policy">
            <Card>
                <div className="text-sm text-[var(--text-secondary)] space-y-3 overflow-y-auto pr-4 max-h-[70vh]">
                    <p>
                        Compliant with the Digital Personal Data Protection Act (DPDP Act) 2023 & WHO Digital Health Standards
                    </p>
                    <p><strong>Last Updated:</strong> Nov, 2025</p>

                    <PolicySection title="1. INTRODUCTION">
                        <p>NutritionWise (“the App”, “we”, “our”) is an educational mobile application designed for students in medicine, nursing, and allied health sciences to learn and practice nutritional assessment.</p>
                        <p>We are committed to protecting your privacy and handling your data responsibly, securely, and transparently.</p>
                        <p>By using NutritionWise, you agree to the practices described in this Privacy Policy.</p>
                    </PolicySection>

                    <PolicySection title="2. PURPOSE OF THE APP">
                         <p>NutritionWise is designed exclusively for academic learning and skill development. It is not a clinical tool, does not diagnose medical conditions, and does not replace professional healthcare advice.</p>
                        <p>The App helps you:</p>
                        <ul className="list-disc list-inside pl-4">
                            <li>Conduct nutritional assessments</li>
                            <li>Calculate nutrient intake</li>
                            <li>Generate standardized academic reports</li>
                            <li>Receive AI-powered educational guidance</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="3. DATA WE COLLECT">
                        <p>We collect only the data required to provide the App’s educational features.</p>
                        <h4 className="font-semibold mt-2 text-[var(--text-primary)] opacity-90">3.1 Information You Provide</h4>
                        <ul className="list-disc list-inside pl-4">
                            <li>Name</li>
                            <li>Age & Sex</li>
                            <li>College / Institution & Course</li>
                            <li>Dietary assessment data (24-hour recall, food quantities)</li>
                            <li>Family composition (for CU calculations)</li>
                            <li>Socio-economic status inputs</li>
                            <li>Anthropometry (height, weight, MUAC, BMI)</li>
                        </ul>

                        <h4 className="font-semibold mt-2 text-[var(--text-primary)] opacity-90">3.2 Automatically Collected</h4>
                        <ul className="list-disc list-inside pl-4">
                            <li>Device type</li>
                            <li>App version</li>
                            <li>Crash and performance logs</li>
                        </ul>

                        <h4 className="font-semibold mt-2 text-[var(--text-primary)] opacity-90">3.3 What We Never Collect</h4>
                        <p>We do not collect:</p>
                        <ul className="list-disc list-inside pl-4">
                            <li>GPS coordinates</li>
                            <li>Contacts, messages, or call logs</li>
                            <li>Aadhaar or identity numbers</li>
                            <li>Financial or payment information</li>
                            <li>Medical history or clinical data</li>
                            <li>Biometrics</li>
                        </ul>
                        <p>The App does not track you across other apps or websites.</p>
                    </PolicySection>

                    <PolicySection title="4. WHY WE PROCESS YOUR DATA">
                        <p>We process your data solely for:</p>
                        <ul className="list-disc list-inside pl-4">
                            <li>Computing nutrient intake based on IFCT 2021</li>
                            <li>Comparing intake with ICMR-NIN RDA 2024</li>
                            <li>Generating assessment reports (PDF)</li>
                            <li>Providing AI-powered educational dietary guidance</li>
                            <li>Allowing institutions to access anonymized academic analytics</li>
                            <li>Improving app stability, features, and performance</li>
                        </ul>
                        <p>We do not use your data for advertising, profiling, or commercial targeting.</p>
                    </PolicySection>
                    
                    <PolicySection title="5. HOW WE USE YOUR DATA">
                        <p>Your data is used to:</p>
                        <ul className="list-disc list-inside pl-4">
                           <li>Personalize nutrient calculations</li>
                           <li>Produce SES-adjusted academic reports</li>
                           <li>Generate AI summaries for learning</li>
                           <li>Save your assessments for later review</li>
                           <li>Enable offline-first usage with secure syncing</li>
                           <li>Improve the quality and reliability of the app</li>
                        </ul>
                        <p>AI models access only sanitized non-identifiable input, never personal identifiers.</p>
                    </PolicySection>

                    <PolicySection title="6. DATA STORAGE & SECURITY">
                        <h4 className="font-semibold mt-2 text-[var(--text-primary)] opacity-90">6.1 Local Storage (Your Device)</h4>
                        <p>Draft assessments are stored locally in encrypted form (AES-256).</p>
                        <h4 className="font-semibold mt-2 text-[var(--text-primary)] opacity-90">6.2 Cloud Storage</h4>
                        <p>If logged in:</p>
                        <ul className="list-disc list-inside pl-4">
                            <li>Completed assessments and PDFs are stored in encrypted cloud storage (Google Firestore & Cloud Storage).</li>
                        </ul>
                        <h4 className="font-semibold mt-2 text-[var(--text-primary)] opacity-90">6.3 Retention Policy</h4>
                        <ul className="list-disc list-inside pl-4">
                            <li>Draft assessments: auto-deleted after 30 days</li>
                            <li>Completed assessments: stored until you delete them</li>
                            <li>Deleted accounts: all associated data is removed permanently</li>
                            <li>Crash logs: retained for up to 90 days (anonymous)</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="7. WHO CAN ACCESS YOUR DATA">
                        <h4 className="font-semibold mt-2 text-[var(--text-primary)] opacity-90">7.1 You</h4>
                        <p>Only you can access your identifiable data.</p>
                        <h4 className="font-semibold mt-2 text-[var(--text-primary)] opacity-90">7.2 Institutions (Optional Feature)</h4>
                        <p>Institutions may receive anonymized and aggregated data for academic purposes. Individual student identities are not shared.</p>
                        <h4 className="font-semibold mt-2 text-[var(--text-primary)] opacity-90">7.3 Third Parties</h4>
                        <p>We use the following secure infrastructure providers:</p>
                        <ul className="list-disc list-inside pl-4">
                            <li>Google Firebase (authentication, database, storage)</li>
                            <li>Google Crashlytics (crash reporting)</li>
                            <li>AI providers (Gemini / OpenAI) — with sanitized inputs only</li>
                        </ul>
                        <p>No third party receives your identifiable personal data. We never sell or trade your information.</p>
                    </PolicySection>
                    
                    <PolicySection title="8. DATA PROTECTION MEASURES">
                        <p>We follow WHO-recommended digital health safeguards, including:</p>
                        <ul className="list-disc list-inside pl-4">
                            <li>AES-256 encryption for local data</li>
                            <li>TLS 1.3 for all network communication</li>
                            <li>Role-based access control (RBAC)</li>
                            <li>Firebase App Check (prevents unauthorized access)</li>
                            <li>Strict Firestore access rules (each student sees only their own data)</li>
                            <li>Security monitoring & error detection</li>
                            <li>Regular backend audits</li>
                        </ul>
                    </PolicySection>
                    
                    <PolicySection title="9. YOUR RIGHTS UNDER THE DPDP ACT 2023">
                        <p>You have the right to:</p>
                        <ul className="list-disc list-inside pl-4">
                           <li>Access your personal data</li>
                           <li>Correct inaccurate information</li>
                           <li>Delete your data or account</li>
                           <li>Withdraw consent at any time</li>
                           <li>View what data is stored and how it is used</li>
                        </ul>
                        <p>You can manage these options in: <strong>Profile → Data & Privacy</strong></p>
                        <p>If you choose to delete your account, all your data — including assessments and PDFs — will be permanently erased.</p>
                    </PolicySection>
                    
                    <PolicySection title="10. CHILDREN’S PRIVACY">
                        <p>NutritionWise is intended for students aged 18 and above. We do not knowingly collect data from minors.</p>
                    </PolicySection>

                    <PolicySection title="11. ADS & MONETIZATION (If Enabled)">
                        <p>NutritionWise may offer optional rewarded ads to unlock additional AI summaries.</p>
                        <p>We enforce:</p>
                        <ul className="list-disc list-inside pl-4">
                            <li>Non-personalized ads only</li>
                            <li>Ads do not track your data</li>
                            <li>Watching ads is optional, not mandatory</li>
                            <li>No sharing of assessment or personal information with advertisers</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="12. DATA BREACH & INCIDENT RESPONSE">
                        <p>If we detect a data breach:</p>
                        <ul className="list-disc list-inside pl-4">
                            <li>We will investigate immediately</li>
                            <li>Contain and resolve the issue</li>
                            <li>Notify affected users</li>
                            <li>Follow DPDP legal obligations</li>
                            <li>Strengthen safeguards</li>
                        </ul>
                        <p>Your trust and safety remain our top priority.</p>
                    </PolicySection>
                    
                    <PolicySection title="13. CHANGES TO THIS POLICY">
                        <p>If we update our Privacy Policy:</p>
                        <ul className="list-disc list-inside pl-4">
                            <li>You will be notified in-app</li>
                            <li>You will be asked to review and re-consent</li>
                            <li>Continued use requires accepting the updated policy</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="14. CONTACT INFORMATION">
                        <p>For privacy-related questions or to exercise your DPDP rights:</p>
                        <p>NutritionWise Data Protection Officer<br/>Email: nutritionwise@gmail.com</p>
                    </PolicySection>
                    
                    <PolicySection title="15. CONSENT">
                        <p>By clicking “I Agree, Continue”, you confirm:</p>
                        <ul className="list-disc list-inside pl-4">
                            <li>You have read and understood this Privacy Policy</li>
                            <li>You voluntarily consent to the collection and processing of your data</li>
                            <li>You understand the App is for educational purposes only</li>
                        </ul>
                    </PolicySection>
                </div>
                <div className="mt-6 flex justify-between items-center border-t border-[var(--border-primary)] pt-4">
                    <Button variant="secondary" onClick={onBack}>Back</Button>
                    <Button onClick={onAgree}>I Agree, Continue</Button>
                </div>
            </Card>
        </Modal>
    );
};

export default FullPrivacyPolicyModal;