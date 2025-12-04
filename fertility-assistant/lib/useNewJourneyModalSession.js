import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Hook to track whether the New Journey Modal has been shown in the current login session.
 * The modal is only shown once per login session.
 */
export function useNewJourneyModalSession() {
  const { user } = useAuth();
  const [hasShownModal, setHasShownModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginId, setLoginId] = useState(null);

  const prevUserRef = useRef(null);

  useEffect(() => {
    // When user logs out (user exists but was previously set), clear the old keys
    if (!user && prevUserRef.current) {
      const oldUid = prevUserRef.current.uid;
      const storedLoginId = sessionStorage.getItem(`newJourneyModal_${oldUid}_loginId`);
      if (storedLoginId) {
        sessionStorage.removeItem(`newJourneyModal_${oldUid}_loginId`);
        sessionStorage.removeItem(`newJourneyModal_${oldUid}_shown_${storedLoginId}`);
      }
    }
    prevUserRef.current = user;

    if (!user) {
      // Reset when user logs out
      setHasShownModal(false);
      setLoginId(null);
      setIsLoading(false);
      return;
    }

    // Check if we already have a loginId stored for this user in THIS session
    const storedLoginId = sessionStorage.getItem(`newJourneyModal_${user.uid}_loginId`);
    
    let currentLoginId;
    if (storedLoginId) {
      // Reuse the existing login id from this session
      currentLoginId = storedLoginId;
    } else {
      // Create a NEW login id only if one doesn't exist
      currentLoginId = String(Date.now());
      sessionStorage.setItem(`newJourneyModal_${user.uid}_loginId`, currentLoginId);
    }

    setLoginId(currentLoginId);

    // Check if modal has been shown for this user for THIS login id
    const sessionKey = `newJourneyModal_${user.uid}_shown_${currentLoginId}`;
    const modalShown = sessionStorage.getItem(sessionKey);

    setHasShownModal(!!modalShown);
    setIsLoading(false);
  }, [user]);

  const markModalAsShown = () => {
    if (user) {
      const keyBase = loginId || sessionStorage.getItem(`newJourneyModal_${user.uid}_loginId`) || String(Date.now());
      const sessionKey = `newJourneyModal_${user.uid}_shown_${keyBase}`;
      sessionStorage.setItem(sessionKey, 'true');
      setHasShownModal(true);
    }
  };

  return {
    shouldShowModal: !hasShownModal && !isLoading,
    markModalAsShown,
    isLoading
  };
}
