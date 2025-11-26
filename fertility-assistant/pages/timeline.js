import Head from 'next/head';
import Timeline from '../components/Timeline';
import ProtectedRoute from '../components/ProtectedRoute';
import styles from '../styles/Timeline.module.css';

export default function TimelinePage() {
  return (
    <ProtectedRoute>
      <div>
        <Head>
          <title>Fertility Journey Timeline - Baby Yoda</title>
          <meta name="description" content="Track your fertility treatment journey with detailed cost breakdowns and provider information" />
        </Head>
        
        <div className={styles.pageHeader}>
          <h1>📅 Your Fertility Journey Timeline</h1>
          <p className={styles.pageDescription}>
            Track your complete fertility treatment journey from initial consultation to successful outcomes. 
            Monitor costs, insurance coverage, and important milestones along the way.
          </p>
          
          <div className={styles.timelineStats}>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>8</span>
              <span className={styles.statLabel}>Total Appointments</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>$18,935</span>
              <span className={styles.statLabel}>Total Treatment Cost</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>$3,827</span>
              <span className={styles.statLabel}>Your Out-of-Pocket</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>80%</span>
              <span className={styles.statLabel}>Insurance Coverage</span>
            </div>
          </div>

          <div className={styles.legendContainer}>
            <h3>Treatment Types:</h3>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={styles.legendIcon}>👩‍⚕️</span>
                <span>Consultation</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendIcon}>🔬</span>
                <span>Testing</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendIcon}>💊</span>
                <span>Medication</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendIcon}>🧬</span>
                <span>IVF Treatment</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendIcon}>🏥</span>
                <span>Procedures</span>
              </div>
            </div>
          </div>
        </div>
        
        <Timeline />
      </div>
    </ProtectedRoute>
  );
}
