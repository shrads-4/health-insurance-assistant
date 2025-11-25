import Head from 'next/head';
import CostSimulator from '../components/CostSimulator';
import ProtectedRoute from '../components/ProtectedRoute';
import styles from '../styles/CostSimulator.module.css';

export default function CostSimulationPage() {
  return (
    <ProtectedRoute>
      <div>
        <Head>
          <title>Cost Simulator & Timing Optimizer - Baby Yoda</title>
          <meta name="description" content="Compare fertility treatment costs, optimize timing, and find the best providers for your insurance plan" />
        </Head>
        
        <div className={styles.pageHeader}>
          <h1>💰 Cost Simulator & Timing Optimizer</h1>
          <p className={styles.pageDescription}>
            Make informed decisions about your fertility treatment costs. Compare scenarios, 
            optimize timing for maximum insurance benefits, and find the best providers in your network.
          </p>
          
          <div className={styles.featureHighlights}>
            <div className={styles.highlight}>
              <span className={styles.highlightIcon}>📊</span>
              <div>
                <h3>Multi-Scenario Analysis</h3>
                <p>Compare costs for different timing and treatment approaches</p>
              </div>
            </div>
            <div className={styles.highlight}>
              <span className={styles.highlightIcon}>⏰</span>
              <div>
                <h3>Timing Optimization</h3>
                <p>Maximize your insurance benefits with strategic timing</p>
              </div>
            </div>
            <div className={styles.highlight}>
              <span className={styles.highlightIcon}>🏥</span>
              <div>
                <h3>Provider Comparison</h3>
                <p>Find the best value providers in your insurance network</p>
              </div>
            </div>
          </div>

          <div className={styles.usageGuide}>
            <h3>How to Use This Tool:</h3>
            <ol>
              <li><strong>Enter your insurance details</strong> - Include your deductible, coinsurance, and out-of-pocket maximum</li>
              <li><strong>Select your treatment type</strong> - Choose from IVF, IUI, consultations, or testing</li>
              <li><strong>Review scenarios</strong> - Compare different timing options and their cost implications</li>
              <li><strong>Compare providers</strong> - See how different clinics affect your out-of-pocket costs</li>
              <li><strong>Make informed decisions</strong> - Use the insights to plan your fertility journey strategically</li>
            </ol>
          </div>
        </div>
        
        <CostSimulator />
      </div>
    </ProtectedRoute>
  );
}
