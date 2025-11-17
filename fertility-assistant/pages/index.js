import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { user, userProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && userProfile && !userProfile.onboardingCompleted) {
      router.push('/onboarding');
    }
  }, [user, userProfile, router]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Baby Yoda - Fertility Insurance Assistant</title>
        <meta name="description" content="Navigate your fertility journey with insurance clarity" />
      </Head>

      <div className={styles.hero}>
        <h1>Welcome to Baby Yoda 🐸</h1>
        <p>Your fertility insurance assistant - This is the way.</p>
        
        {!user ? (
          <div className={styles.ctaButtons}>
            <Link href="/signup">
              <button className={styles.primaryCta}>Get Started</button>
            </Link>
            <Link href="/login">
              <button className={styles.secondaryCta}>Log In</button>
            </Link>
          </div>
        ) : (
          <>
            {/* Profile Summary Card */}
            {userProfile && (
              <div className={styles.profileSummary}>
                <h3>👋 Welcome back, {userProfile.firstName}!</h3>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Insurance:</span>
                    <span className={styles.summaryValue}>{userProfile.insuranceCarrier}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Deductible Progress:</span>
                    <span className={styles.summaryValue}>
                      ${userProfile.deductibleMet?.toLocaleString() || 0} / ${userProfile.deductible?.toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Coverage Limit:</span>
                    <span className={styles.summaryValue}>
                      {userProfile.coverageLimit ? `$${userProfile.coverageLimit.toLocaleString()}` : 'No limit'}
                    </span>
                  </div>
                </div>
                <Link href="/profile">
                  <button className={styles.viewProfileButton}>View Full Profile →</button>
                </Link>
              </div>
            )}

            <div className={styles.features}>
              <div className={styles.feature}>
                <h3>📅 Journey Timeline</h3>
                <p>Track your treatments and plan ahead</p>
                <Link href="/timeline">
                  <button className={styles.button}>View Timeline</button>
                </Link>
              </div>

              <div className={styles.feature}>
                <h3>🔍 Coverage Decoder</h3>
                <p>Translate your benefits into plain English</p>
                <Link href="/coverage">
                  <button className={styles.button}>Decode Coverage</button>
                </Link>
              </div>

              <div className={styles.feature}>
                <h3>💰 Cost Simulator</h3>
                <p>Optimize timing and reduce out-of-pocket costs</p>
                <Link href="/cost-simulation">
                  <button className={styles.button}>Simulate Costs</button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
