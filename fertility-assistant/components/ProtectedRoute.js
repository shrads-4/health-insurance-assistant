import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children, requireOnboarding = false }) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Only act after loading is complete
    if (loading) return;

    // Give a small delay for auth to fully settle
    const timer = setTimeout(() => {
      if (!user) {
        router.push('/login');
      } else if (requireOnboarding && userProfile && !userProfile.onboardingCompleted) {
        // If onboarding is required but not completed
        if (router.pathname !== '/onboarding') {
          router.push('/onboarding');
        }
      } else {
        setIsReady(true);
      }
    }, 300); // 300ms delay to let auth settle

    return () => clearTimeout(timer);
  }, [user, userProfile, loading, router, requireOnboarding]);

  if (loading || !isReady) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        color: '#4A5D2E'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🌱</p>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return user ? children : null;
}
