import React, { useState } from 'react';
import { useAssessment } from '../../hooks/useAssessment';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { Input } from '../ui//Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { MapPin, Loader2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type LocationType = 'Urban - Non Slum' | 'Urban - Slum' | 'Rural' | 'Tribal' | 'Peri-Urban';

const locations: LocationType[] = ['Urban - Non Slum', 'Urban - Slum', 'Rural', 'Tribal', 'Peri-Urban'];

const StepD: React.FC<ReturnType<typeof useAssessment>> = ({ data, updateData }) => {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState('');
  const [isDetectingPin, setIsDetectingPin] = useState(false);
  const isOnline = useOnlineStatus();

  const handleAutoDetect = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Geolocation is not supported by your browser.');
      return;
    }
    setLoadingLocation(true);
    setLocationMessage('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Latitude:', position.coords.latitude, 'Longitude:', position.coords.longitude);
        updateData('sectionD', { location: 'Rural' });
        setLocationMessage('Location detected! Defaulted to Rural for demonstration.');
        setLoadingLocation(false);
      },
      () => {
        setLocationMessage('Unable to retrieve your location. Please select manually.');
        setLoadingLocation(false);
      }
    );
  };

  const classifyFromPinData = (district: string, block: string, officeType: string): LocationType => {
    const d = district.toLowerCase();
    const metros = ['delhi', 'mumbai', 'bengaluru', 'bangalore', 'chennai', 'hyderabad', 'kolkata', 'pune', 'ahmedabad'];
    const isMetro = metros.some(m => d.includes(m));
    if (isMetro && block && block.length > 0) return 'Peri-Urban';
    if (isMetro) return 'Urban - Non Slum';
    if (/head|sub/i.test(officeType)) return 'Urban - Non Slum';
    return 'Rural';
  };

  const detectByPin = async () => {
    const pin = pinCode.trim();
    if (!/^\d{6}$/.test(pin)) {
      setPinError('Enter a valid 6-digit PIN');
      return;
    }
    setPinError('');
    if (!isOnline) {
      setLocationMessage('Offline. Select location manually below.');
      return;
    }
    setIsDetectingPin(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const json = await res.json();
      const offices = Array.isArray(json) && json[0] && Array.isArray(json[0].PostOffice) ? json[0].PostOffice : [];
      if (!offices.length) {
        setPinError('PIN not found. Check and try again.');
      } else {
        const o = offices[0];
        const district = o.District || '';
        const state = o.State || '';
        const block = o.Block || '';
        const officeType = o.BranchType || '';
        const suggested = classifyFromPinData(district, block, officeType);
        updateData('sectionD', { location: suggested });
        setLocationMessage(`Detected ${district}, ${state}. Suggested: ${suggested}. You can change below.`);
      }
    } catch {
      setPinError('Could not detect from PIN. Try again later.');
    } finally {
      setIsDetectingPin(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="flex gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-r-lg">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
            Why we ask this?
          </p>
          <p className="text-xs text-amber-800 dark:text-amber-200">
            Location classification determines the socio-economic context and which scoring system (e.g., Kuppuswamy for Urban, BG Prasad for Rural) is appropriate.
          </p>
        </div>
      </div>

      {/* Auto-detect Location */}
      <div className="space-y-3">
        <Button
          onClick={handleAutoDetect}
          disabled={loadingLocation}
          variant="outline"
          className="w-full gap-2"
          size="lg"
        >
          {loadingLocation ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <MapPin className="w-5 h-5" />
          )}
          Use My Current Location
        </Button>
        {locationMessage && (
          <p className="text-xs text-center text-muted-foreground bg-muted/50 p-2 rounded">{locationMessage}</p>
        )}
      </div>

      {/* PIN Code Detection */}
      <div className="space-y-2">
        <Label htmlFor="pin">PIN Code (India)</Label>
        <div className="flex gap-2">
          <Input
            id="pin"
            inputMode="numeric"
            value={pinCode}
            onChange={e => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className={cn(pinError && "border-destructive")}
            placeholder="e.g., 560001"
            maxLength={6}
          />
          <Button
            type="button"
            onClick={detectByPin}
            disabled={isDetectingPin}
            variant="secondary"
          >
            {isDetectingPin ? 'Detecting…' : 'Detect via PIN'}
          </Button>
        </div>
        {pinError && <p className="text-xs text-destructive">{pinError}</p>}
      </div>

      {/* Divider */}
      <div className="relative flex py-3 items-center">
        <div className="flex-grow border-t border-muted"></div>
        <span className="flex-shrink mx-4 text-muted-foreground text-xs uppercase font-medium">OR SELECT MANUALLY</span>
        <div className="flex-grow border-t border-muted"></div>
      </div>

      {/* Manual Selection */}
      <div className="space-y-3">
        <Label>Location Classification</Label>
        {locations.map((location) => (
          <label
            key={location}
            className={cn(
              "flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all",
              data.sectionD.location === location
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-muted-foreground/50 hover:bg-muted/50"
            )}
          >
            <input
              type="radio"
              name="location"
              value={location}
              checked={data.sectionD.location === location}
              onChange={(e) => updateData('sectionD', { location: e.target.value as LocationType })}
              className="h-4 w-4 text-primary border-muted-foreground focus:ring-primary"
            />
            <span className="ml-3 text-sm font-medium">{location}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default StepD;