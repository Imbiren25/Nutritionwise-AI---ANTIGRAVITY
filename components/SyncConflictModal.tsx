import React from 'react';
import Icon from './Icon';

interface SyncConflictModalProps {
    onResolve: (strategy: 'local' | 'server') => void;
}

const SyncConflictModal: React.FC<SyncConflictModalProps> = ({ onResolve }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--bg-secondary)] rounded-xl shadow-xl p-8 w-full max-w-md animate-fade-in">
                <div className="text-center">
                    <Icon name="checklist" className="w-12 h-12 text-accent-orange mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Sync Conflict</h2>
                    <p className="text-[var(--text-secondary)] mt-2 mb-6">Changes have been made both locally and on the server. Please choose which version of your assessment draft to keep.</p>
                </div>
                <div className="space-y-4">
                    <button
                        onClick={() => onResolve('local')}
                        className="w-full text-left p-4 border rounded-lg hover:bg-[var(--bg-tertiary)] hover:border-[var(--text-accent)] transition-colors"
                    >
                        <p className="font-bold text-[var(--text-accent)]">Keep My Local Version</p>
                        <p className="text-sm text-[var(--text-secondary)]">Your most recent changes on this device will be saved to the server.</p>
                    </button>
                    <button
                        onClick={() => onResolve('server')}
                        className="w-full text-left p-4 border rounded-lg hover:bg-[var(--bg-tertiary)] hover:border-[var(--text-accent)] transition-colors"
                    >
                         <p className="font-bold text-[var(--text-accent)]">Use the Server Version</p>
                        <p className="text-sm text-[var(--text-secondary)]">Your local changes will be discarded and replaced with the version from the cloud.</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SyncConflictModal;