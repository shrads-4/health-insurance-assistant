import styles from '../styles/Timeline.module.css';

export default function Timeline({ events }) {
  const sampleEvents = events || [
    { id: 1, date: '2025-01-15', title: 'Initial Consultation', description: 'Met with fertility specialist', cost: '$250' },
    { id: 2, date: '2025-02-10', title: 'Testing Phase', description: 'Hormone testing and ultrasound', cost: '$800' },
    { id: 3, date: '2025-03-05', title: 'IVF Cycle 1', description: 'Started first IVF cycle', cost: '$12,000' },
  ];

  return (
    <div className={styles.timeline}>
      {sampleEvents.map((event, index) => (
        <div key={event.id} className={styles.timelineItem}>
          <div className={styles.timelineDot}></div>
          {index !== sampleEvents.length - 1 && <div className={styles.timelineConnector}></div>}
          <div className={styles.timelineContent}>
            <div className={styles.timelineDate}>{event.date}</div>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <div className={styles.timelineCost}>Estimated Cost: {event.cost}</div>
            <button className={styles.detailsButton}>View Details</button>
          </div>
        </div>
      ))}
    </div>
  );
}
