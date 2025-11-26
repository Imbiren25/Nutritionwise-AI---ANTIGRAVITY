
import { useState, useEffect, useCallback, useRef } from 'react';

const INACTIVITY_TIMEOUT = 3 * 60 * 1000; // 3 minutes
const WARNING_TIMEOUT = 30 * 1000; // 30 seconds

interface UseInactivityTimerProps {
  onLogout: () => void;
}

export const useInactivityTimer = ({ onLogout }: UseInactivityTimerProps) => {
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> for browser compatibility.
  // FIX: Initialize useRef with null to fix "Expected 1 arguments, but got 0" error.
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> for browser compatibility.
  // FIX: Initialize useRef with null to fix "Expected 1 arguments, but got 0" error.
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startWarningTimer = useCallback(() => {
    warningTimerRef.current = setTimeout(onLogout, WARNING_TIMEOUT);
    setIsWarningVisible(true);
  }, [onLogout]);

  const startInactivityTimer = useCallback(() => {
    inactivityTimerRef.current = setTimeout(startWarningTimer, INACTIVITY_TIMEOUT - WARNING_TIMEOUT);
  }, [startWarningTimer]);

  const resetTimers = useCallback(() => {
    // FIX: Add guards to prevent calling clearTimeout with undefined.
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }
    setIsWarningVisible(false);
    startInactivityTimer();
  }, [startInactivityTimer]);

  const stay = useCallback(() => {
    resetTimers();
  }, [resetTimers]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];

    const handleActivity = () => {
      resetTimers();
    };

    events.forEach(event => window.addEventListener(event, handleActivity));
    startInactivityTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      // FIX: Add guards to prevent calling clearTimeout with undefined.
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }
    };
  }, [resetTimers, startInactivityTimer]);

  return { isWarningVisible, stay };
};