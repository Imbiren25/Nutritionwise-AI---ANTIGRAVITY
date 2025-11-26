
import React from 'react';
import { AppNotification } from '../types';
import Icon from './Icon';

interface NotificationCenterProps {
    notifications: AppNotification[];
    onMarkAsRead: (id: string) => void;
    onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onMarkAsRead, onClose }) => {
    
    const handleActionClick = (notification: AppNotification) => {
        onMarkAsRead(notification.id);
        notification.action?.();
        onClose();
    };
    
    return (
        <div className="absolute top-14 right-0 w-80 bg-[var(--bg-secondary)] rounded-lg shadow-2xl border border-[var(--border-primary)] z-50">
            <div className="p-3 font-semibold border-b border-[var(--border-primary)] text-[var(--text-primary)]">Notifications</div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                    <p className="text-center text-sm text-[var(--text-secondary)] py-8">No new notifications.</p>
                ) : (
                    notifications.map(n => (
                        <div key={n.id} className={`p-3 border-b border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] ${!n.read ? 'bg-[var(--success-bg)]' : ''}`}>
                            <p className="font-bold text-sm text-[var(--text-primary)]">{n.title}</p>
                            <p className="text-xs text-[var(--text-secondary)]">{n.message}</p>
                            {n.action && (
                                <button
                                    onClick={() => handleActionClick(n)}
                                    className="text-xs font-semibold text-[var(--text-link)] hover:underline mt-1"
                                >
                                    View Now
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationCenter;
