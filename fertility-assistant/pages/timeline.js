import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Timeline from '../components/Timeline';
import ProtectedRoute from '../components/ProtectedRoute';
import styles from '../styles/Timeline.module.css';

export default function TimelinePage() {
  const [timelineStats, setTimelineStats] = useState({
    appointmentCount: 0,
    totalCost: 0,
    outOfPocket: 0,
    insurageCoverage: 0,
  });

  // List of step types that count as "appointments"
  const appointmentTypes = [
    'consultation',
    'diagnostic-testing',
    'schedule-treatment',
    'cycle-monitoring',
    'procedure',
    'embryo-transfer',
    'early-pregnancy-testing'
  ];

  const handleTimelineEventsUpdate = useCallback((events) => {
    if (!events || events.length === 0) {
      setTimelineStats({
        appointmentCount: 0,
        totalCost: 0,
        outOfPocket: 0,
        insurageCoverage: 0,
      });
      return;
    }

    // Count appointments
    const appointmentCount = events.filter(e => appointmentTypes.includes(e.type)).length;

    // Sum costs
    let totalCost = 0;
    let insurancePaid = 0;

    events.forEach(event => {
      totalCost += event.totalCost || 0;
      insurancePaid += event.insurancePaid || 0;
    });

    const outOfPocket = totalCost - insurancePaid;
    const insurageCoverage = totalCost > 0 ? Math.round((insurancePaid / totalCost) * 100) : 0;

    setTimelineStats({
      appointmentCount,
      totalCost,
      outOfPocket,
      insurageCoverage,
    });
  }, []);

  return (
    <ProtectedRoute requireOnboarding={true}>
      <div>
        <Head>
          <title>Fertility Journey Timeline - Baby Yoda</title>
          <meta name="description" content="Track your fertility treatment journey with detailed cost breakdowns and provider information" />
        </Head>
        
        <Timeline onEventsUpdate={handleTimelineEventsUpdate} />

        <div className={styles.pageHeader}>
          <h1>📅 Your Fertility Journey Timeline</h1>
          <p className={styles.pageDescription}>
            Track your complete fertility treatment journey from initial consultation to successful outcomes. 
            Monitor costs, insurance coverage, and important milestones along the way.
          </p>
          
          <div className={styles.timelineStats}>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{timelineStats.appointmentCount}</span>
              <span className={styles.statLabel}>Total Appointments</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>${timelineStats.totalCost.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
              <span className={styles.statLabel}>Total Treatment Cost</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>${timelineStats.outOfPocket.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
              <span className={styles.statLabel}>Your Out-of-Pocket</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{timelineStats.insurageCoverage}%</span>
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
      </div>
    </ProtectedRoute>
  );
}
