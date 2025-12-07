import Head from 'next/head';
import CostSimulator from '../components/CostSimulator';
import ProtectedRoute from '../components/ProtectedRoute';
import styles from '../styles/CostSimulator.module.css';

export default function CostSimulationPage() {
  return (
    <ProtectedRoute>
      <div>
        <Head>
          <title>AI-Powered Cost Simulator - Baby Yoda</title>
          <meta name="description" content="Get accurate fertility treatment cost predictions powered by AI, personalized to your insurance and location" />
        </Head>
        
        <div className={styles.pageHeader}>
          <h1>🤖 AI-Powered Cost Simulation Tool</h1>
          <p className={styles.pageDescription}>
            Get personalized treatment cost estimates using real-world data and machine learning. 
            Our AI model analyzes your insurance coverage, location, and provider choices to give 
            you accurate predictions with money-saving recommendations.
          </p>
          
          <div className={styles.featureHighlights}>
            <div className={styles.highlight}>
              <span className={styles.highlightIcon}>🧠</span>
              <div>
                <h3>AI Cost Predictions</h3>
                <p>Machine learning model trained on real fertility pricing data</p>
              </div>
            </div>
            <div className={styles.highlight}>
              <span className={styles.highlightIcon}>📍</span>
              <div>
                <h3>Location-Based Pricing</h3>
                <p>Accurate costs for your state and provider type</p>
              </div>
            </div>
            <div className={styles.highlight}>
              <span className={styles.highlightIcon}>💡</span>
              <div>
                <h3>Smart Recommendations</h3>
                <p>Personalized tips to reduce your out-of-pocket costs</p>
              </div>
            </div>
          </div>

          <div className={styles.usageGuide}>
            <h3>How It Works:</h3>
            <ol>
              <li><strong>Your profile is pre-loaded</strong> - We automatically use your insurance details from onboarding</li>
              <li><strong>Select your treatment</strong> - Choose the procedure you're planning (IVF, IUI, egg freezing, etc.)</li>
              <li><strong>Pick your preferences</strong> - Select provider type, location, and insurance plan</li>
              <li><strong>Get AI predictions</strong> - Our model calculates personalized cost estimates with insurance breakdown</li>
              <li><strong>Review scenarios</strong> - Compare timing options and alternative providers to maximize savings</li>
            </ol>
          </div>
        </div>
        
        <CostSimulator />
      </div>
    </ProtectedRoute>
  );
}
