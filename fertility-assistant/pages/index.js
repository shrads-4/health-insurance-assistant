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
    // Redirect to onboarding if user is logged in but hasn't completed onboarding
    if (user && userProfile && !userProfile.onboardingCompleted) {
      router.push('/onboarding');
    }
  }, [user, userProfile, router]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Fertility Insurance Assistant</title>
        <meta name="description" content="Navigate your fertility journey with insurance clarity" />
      </Head>

      <div className={styles.hero}>
        <h1>Welcome to Your Fertility Insurance Assistant</h1>
        <p>Making the insurance side of fertility care easier to understand and more cost-effective.</p>
        
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
      </div>
    </div>
  );
}
