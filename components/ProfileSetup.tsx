import React, { useState } from 'react';
import { User } from '../types';
import Icon from './Icon';
import Logo from './Logo';

interface ProfileSetupProps {
    user: User;
    onComplete: (updatedUser: Partial<User>) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ user, onComplete }) => {
    const [formData, setFormData] = useState({
        college: user.college || '',
        course: user.course || '',
        batch: user.batch || '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate network delay
        setTimeout(() => {
            onComplete(formData);
        }, 500);
    };

    const isFormValid = formData.college.trim() && formData.course.trim() && formData.batch.trim();

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Logo className="w-16 h-16 mx-auto" />
                    <h1 className="text-3xl font-bold text-[var(--text-accent)] mt-2">Complete Your Profile</h1>
                    <p className="text-[var(--text-secondary)]">Welcome, {user.name}! Just one more step.</p>
                </div>
                <div className="bg-[var(--bg-secondary)] shadow-xl rounded-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="college" className="block text-sm font-medium text-[var(--text-primary)]">College / Institution</label>
                            <input id="college" type="text" value={formData.college} onChange={e => setFormData({ ...formData, college: e.target.value })} className="form-input block w-full shadow-sm mt-1" required />
                        </div>
                        <div>
                            <label htmlFor="course" className="block text-sm font-medium text-[var(--text-primary)]">Course</label>
                            <input id="course" type="text" value={formData.course} onChange={e => setFormData({ ...formData, course: e.target.value })} className="form-input block w-full shadow-sm mt-1" placeholder="e.g., MBBS, B.Sc. Nursing" required />
                        </div>
                        <div>
                            <label htmlFor="batch" className="block text-sm font-medium text-[var(--text-primary)]">Batch Year</label>
                            <input id="batch" type="text" value={formData.batch} onChange={e => setFormData({ ...formData, batch: e.target.value })} className="form-input block w-full shadow-sm mt-1" placeholder="e.g., 2025" required />
                        </div>
                        <button type="submit" disabled={!isFormValid || loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-[var(--button-primary-text)] bg-[var(--button-primary-bg)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--text-accent)] disabled:bg-[var(--button-secondary-bg)] disabled:cursor-not-allowed transition-colors">
                            {loading ? 'Saving...' : 'Complete Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSetup;