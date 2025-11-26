
import React from 'react';
import Icon from './Icon';
import Modal from './ui/Modal';
import Card from './ui/Card';
import Button from './ui/Button';

interface ConsentModalProps {
    onAgree: () => void;
    onViewFullPolicy: () => void;
}

const ConsentModal: React.FC<ConsentModalProps> = ({ onAgree, onViewFullPolicy }) => {
    return (
        <Modal open={true} onClose={onViewFullPolicy} title="" actions={null}>
            <div className="space-y-6">
                {/* Header with Icon */}
                <div className="flex items-center gap-3 border-b border-[var(--border-primary)] pb-4 -mx-4 px-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-success-light)] flex items-center justify-center text-[var(--color-success-dark)]">
                        <Icon name="clipboard" className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] font-heading">Data Privacy & Consent</h2>
                </div>

                {/* Content */}
                <div className="text-sm text-[var(--text-secondary)] space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    <p className="leading-relaxed">
                        Before you begin, please review how NutritionWise handles your data in compliance with the <span className="font-semibold text-[var(--text-primary)]">DPDP Act 2023</span> and <span className="font-semibold text-[var(--text-primary)]">WHO Digital Health Standards</span>.
                    </p>

                    <ul className="space-y-3">
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-accent)] mt-2 flex-shrink-0" />
                            <span><strong className="text-[var(--text-primary)]">Purpose of App:</strong> To help medical students learn and conduct nutritional assessments.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-accent)] mt-2 flex-shrink-0" />
                            <span><strong className="text-[var(--text-primary)]">Data Collected:</strong> We collect personal info (name, college), assessment data (diet, anthropometry), and device info. We <strong className="text-[var(--error-text)]">DO NOT</strong> collect GPS coordinates.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-accent)] mt-2 flex-shrink-0" />
                            <span><strong className="text-[var(--text-primary)]">Why Data is Needed:</strong> To calculate nutrient intake, compare with RDA, generate reports, and provide AI-powered guidance.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-accent)] mt-2 flex-shrink-0" />
                            <span><strong className="text-[var(--text-primary)]">Storage & Duration:</strong> Data is stored securely on your device and in encrypted cloud storage. Drafts are deleted after 30 days.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-accent)] mt-2 flex-shrink-0" />
                            <span><strong className="text-[var(--text-primary)]">Who Has Access:</strong> Only you can access your identifiable data. Anonymized data may be used for academic purposes.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-accent)] mt-2 flex-shrink-0" />
                            <span><strong className="text-[var(--text-primary)]">Your Rights:</strong> You have the right to access, correct, and delete your data, and withdraw consent at any time.</span>
                        </li>
                    </ul>

                    <div className="bg-[var(--bg-tertiary)] p-4 rounded-xl border border-[var(--border-primary)] mt-4">
                        <p className="font-medium text-[var(--text-primary)] text-xs leading-relaxed">
                            By clicking "I Agree, Continue", you provide your consent to the collection and processing of your data as described above for the academic purpose of this nutritional assessment.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-2 border-t border-[var(--border-primary)] -mx-4 px-4 mt-4">
                    <button
                        onClick={onViewFullPolicy}
                        className="text-[var(--color-primary)] font-semibold text-sm hover:underline px-4 py-2"
                    >
                        View Full Policy
                    </button>
                    <button
                        onClick={onAgree}
                        className="w-full sm:w-auto bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        I Agree, Continue
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConsentModal;
