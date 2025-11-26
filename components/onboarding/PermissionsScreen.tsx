import React, { useState } from 'react';
import Icon from '../Icon';

interface PermissionsScreenProps {
  onNext: () => void;
}

const PermissionsScreen: React.FC<PermissionsScreenProps> = ({ onNext }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [anyPermissionGranted, setAnyPermissionGranted] = useState(false);

  const handleGrantPermissions = () => {
    setIsProcessing(true);

    const locationPromise = new Promise<boolean>((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          () => resolve(true),
          () => resolve(false)
        );
      } else {
        resolve(false);
      }
    });

    const notificationPromise = new Promise<boolean>((resolve) => {
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          resolve(permission === 'granted');
        });
      } else {
        resolve(false);
      }
    });

    Promise.all([locationPromise, notificationPromise]).then(([locationSuccess, notificationSuccess]) => {
      if (locationSuccess || notificationSuccess) {
        setAnyPermissionGranted(true);
      }
      // After permissions are handled (granted or denied), we move on.
      setTimeout(() => {
        onNext();
      }, 1500); // Give user time to see "Granted!" message
    });
  };

  const renderButton = () => {
    if (isProcessing) {
      return (
        <div className={`w-full px-6 py-3 text-[var(--button-primary-text)] font-semibold rounded-lg shadow-lg flex items-center justify-center ${anyPermissionGranted ? 'bg-success-green' : 'bg-[var(--button-primary-bg)]'}`}>
          {anyPermissionGranted ? (
            <>
              <Icon name="checklist" className="w-5 h-5 mr-2" />
              Permissions Granted!
            </>
          ) : (
            <>
              <Icon name="loader" className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          )}
        </div>
      );
    }

    return (
      <button
        onClick={handleGrantPermissions}
        className="w-full px-6 py-3 bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] font-semibold rounded-lg hover:opacity-90 transition-colors shadow-lg"
      >
        Grant Permissions
      </button>
    );
  };

  return (
    <div className="text-center animate-fade-in w-full max-w-md">
      <Icon name="checklist" className="w-16 h-16 text-[var(--text-accent)] mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Permissions</h2>
      <p className="text-[var(--text-secondary)] mt-2 mb-6">
        NutritionWise uses the following permissions to enhance your experience:
      </p>
      <div className="text-left bg-[var(--bg-tertiary)] p-4 rounded-lg space-y-3 mb-8">
        <div>
          <h3 className="font-semibold text-[var(--text-accent)]">Location (Optional)</h3>
          <p className="text-sm text-[var(--text-primary)]">To automatically determine your location category (Urban/Rural) for accurate SES scoring. Your precise GPS is never stored.</p>
        </div>
        <div>
          <h3 className="font-semibold text-[var(--text-accent)]">Notifications (Optional)</h3>
          <p className="text-sm text-[var(--text-primary)]">To alert you when your AI summary or PDF reports are ready.</p>
        </div>
      </div>
      
      {renderButton()}

      <button onClick={onNext} className="text-sm text-[var(--text-secondary)] hover:underline mt-4">
        Skip for now
      </button>
    </div>
  );
};

export default PermissionsScreen;