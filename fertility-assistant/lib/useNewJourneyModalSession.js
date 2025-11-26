import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!user) {
      // Reset when user logs out
      setHasShownModal(false);
      setIsLoading(false);
      return;
    }

    // Create a login-specific id for this sign-in instance. This ensures
    // the modal shows once per login (even if the same user signs out and signs
    // back in during the same tab session).
    const newLoginId = String(Date.now());
    setLoginId(newLoginId);

    // Save the current login id for inspection/debug (optional)
    sessionStorage.setItem(`newJourneyModal_${user.uid}_loginId`, newLoginId);

    // Check if modal has been shown for this user for THIS login id
    const sessionKey = `newJourneyModal_${user.uid}_shown_${newLoginId}`;
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
