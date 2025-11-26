import React from 'react';
import { SyncStatus } from '../services/syncService';
import Badge from './ui/Badge';
import Icon from './Icon';
import { cn } from '@/lib/utils';

interface SyncStatusIndicatorProps {
    status: SyncStatus;
    lastSynced?: Date | null;
    className?: string;
}

const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({ status, lastSynced, className }) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'saving':
                return {
                    icon: 'loader' as const,
                    label: 'Saving...',
                    variant: 'secondary' as const,
                    iconClassName: 'animate-spin',
                };
            case 'saved':
                return {
                    icon: 'check-circle' as const,
                    label: 'All changes saved',
                    variant: 'default' as const,
                    iconClassName: 'text-green-600',
                };
            case 'error':
                return {
                    icon: 'warning' as const,
                    label: 'Failed to save',
                    variant: 'destructive' as const,
                    iconClassName: 'text-red-600',
                };
            case 'offline':
                return {
                    icon: 'close' as const,
                    label: 'Offline - changes saved locally',
                    variant: 'secondary' as const,
                    iconClassName: 'text-orange-600',
                };
            default:
                return null;
        }
    };

    const config = getStatusConfig();

    if (!config) return null;

    const timeSinceSync = lastSynced
        ? `${Math.floor((Date.now() - lastSynced.getTime()) / 1000)}s ago`
        : '';

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Badge variant={config.variant} className="flex items-center gap-1.5 px-2 py-1">
                <Icon name={config.icon} className={cn('h-3 w-3', config.iconClassName)} />
                <span className="text-xs font-medium">{config.label}</span>
            </Badge>
            {status === 'saved' && lastSynced && (
                <span className="text-xs text-muted-foreground">{timeSinceSync}</span>
            )}
        </div>
    );
};

export default SyncStatusIndicator;
