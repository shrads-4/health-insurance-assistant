import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

export default function Home() {
  const [status, setStatus] = useState('');

  const testFirebase = async () => {
    try {
      // Try to add a test document
      const docRef = await addDoc(collection(db, 'test'), {
        message: 'Firebase works!',
        timestamp: new Date()
      });
      setStatus(`Success! Document ID: ${docRef.id}`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

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
