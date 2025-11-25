import { useState } from 'react';
import styles from '../styles/Timeline.module.css';

export default function Timeline({ events }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const enhancedSampleData = events || [
    {
      id: 1,
      date: '2024-09-15',
      type: 'consultation',
      status: 'completed',
      title: 'Initial Consultation',
      description: 'Comprehensive fertility assessment with Dr. Sarah Johnson',
      provider: {
        name: 'Fertility Center of Excellence',
        network: 'in-network',
        rating: 4.8,
        location: 'San Francisco, CA'
      },
      costs: {
        totalCost: 350,
        insurancePaid: 280,
        patientPaid: 70,
        deductibleApplied: 70
      },
      notes: 'Discussed treatment options including IVF, IUI, and egg freezing. Recommended comprehensive testing panel.',
      documents: ['consultation-summary.pdf', 'treatment-plan.pdf'],
      nextSteps: ['Schedule hormone testing', 'Complete insurance pre-authorization']
    },
    {
      id: 2,
      date: '2024-10-02',
      type: 'testing',
      status: 'completed',
      title: 'Comprehensive Testing Panel',
      description: 'Hormone levels, AMH, ultrasound, and genetic screening',
      provider: {
        name: 'Fertility Center of Excellence',
        network: 'in-network',
        rating: 4.8,
        location: 'San Francisco, CA'
      },
      costs: {
        totalCost: 1200,
        insurancePaid: 960,
        patientPaid: 240,
        deductibleApplied: 240
      },
      notes: 'All test results within normal ranges. AMH levels indicate good ovarian reserve.',
      documents: ['lab-results.pdf', 'ultrasound-report.pdf'],
      nextSteps: ['Review results with doctor', 'Discuss treatment protocol']
    },
    {
      id: 3,
      date: '2024-10-20',
      type: 'consultation',
      status: 'completed',
      title: 'Results Review & Treatment Planning',
      description: 'Reviewed test results and finalized IVF protocol',
      provider: {
        name: 'Fertility Center of Excellence',
        network: 'in-network',
        rating: 4.8,
        location: 'San Francisco, CA'
      },
      costs: {
        totalCost: 200,
        insurancePaid: 160,
        patientPaid: 40,
        deductibleApplied: 40
      },
      notes: 'Recommended starting with IVF cycle in January to maximize insurance benefits after deductible reset.',
      documents: ['treatment-protocol.pdf'],
      nextSteps: ['Order medications', 'Schedule baseline appointment']
    },
    {
      id: 4,
      date: '2024-11-15',
      type: 'medication',
      status: 'completed',
      title: 'Medication Consultation',
      description: 'Fertility medication training and prescription pickup',
      provider: {
        name: 'Specialty Pharmacy Network',
        network: 'in-network',
        rating: 4.5,
        location: 'Mail Order'
      },
      costs: {
        totalCost: 2800,
        insurancePaid: 2240,
        patientPaid: 560,
        deductibleApplied: 560
      },
      notes: 'Received Gonal-F, Cetrotide, and trigger shot. Completed injection training session.',
      documents: ['medication-guide.pdf', 'injection-instructions.pdf'],
      nextSteps: ['Begin stimulation protocol', 'Daily monitoring appointments']
    },
    {
      id: 5,
      date: '2025-01-08',
      type: 'ivf',
      status: 'planned',
      title: 'IVF Cycle 1 - Stimulation Start',
      description: 'Begin ovarian stimulation protocol',
      provider: {
        name: 'Fertility Center of Excellence',
        network: 'in-network',
        rating: 4.8,
        location: 'San Francisco, CA'
      },
      costs: {
        totalCost: 12000,
        insurancePaid: 9600,
        patientPaid: 2400,
        deductibleApplied: 2000
      },
      notes: 'Starting with fresh deductible year. Estimated 10-12 days of stimulation.',
      documents: [],
      nextSteps: ['Daily injections', 'Monitoring appointments', 'Egg retrieval']
    },
    {
      id: 6,
      date: '2025-01-20',
      type: 'procedure',
      status: 'planned',
      title: 'Egg Retrieval',
      description: 'Surgical egg retrieval procedure',
      provider: {
        name: 'Fertility Center of Excellence',
        network: 'in-network',
        rating: 4.8,
        location: 'San Francisco, CA'
      },
      costs: {
        totalCost: 3500,
        insurancePaid: 2800,
        patientPaid: 700,
        deductibleApplied: 0
      },
      notes: 'Procedure scheduled for early morning. Partner will provide sample same day.',
      documents: [],
      nextSteps: ['Recovery', 'Embryo development monitoring', 'Transfer planning']
    },
    {
      id: 7,
      date: '2025-01-25',
      type: 'procedure',
      status: 'planned',
      title: 'Embryo Transfer',
      description: 'Fresh embryo transfer - Day 5 blastocyst',
      provider: {
        name: 'Fertility Center of Excellence',
        network: 'in-network',
        rating: 4.8,
        location: 'San Francisco, CA'
      },
      costs: {
        totalCost: 2200,
        insurancePaid: 1760,
        patientPaid: 440,
        deductibleApplied: 0
      },
      notes: 'Planning single embryo transfer. Remaining embryos will be frozen.',
      documents: [],
      nextSteps: ['Two week wait', 'Beta HCG test', 'Follow-up appointment']
    },
    {
      id: 8,
      date: '2025-02-08',
      type: 'testing',
      status: 'planned',
      title: 'Pregnancy Test (Beta HCG)',
      description: 'Blood test to confirm pregnancy',
      provider: {
        name: 'Fertility Center of Excellence',
        network: 'in-network',
        rating: 4.8,
        location: 'San Francisco, CA'
      },
      costs: {
        totalCost: 85,
        insurancePaid: 68,
        patientPaid: 17,
        deductibleApplied: 0
      },
      notes: 'First beta test 14 days post-transfer. Second test may be needed.',
      documents: [],
      nextSteps: ['Results review', 'Next steps planning']
    }
  ];

  const getTypeIcon = (type) => {
    const icons = {
      consultation: '👩‍⚕️',
      testing: '🔬',
      medication: '💊',
      ivf: '🧬',
      procedure: '🏥',
      iui: '💉'
    };
    return icons[type] || '📋';
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: '#ADC178',
      'in-progress': '#F4A261',
      planned: '#E9C46A',
      cancelled: '#E76F51'
    };
    return colors[status] || '#ADC178';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.timeline}>
      {enhancedSampleData.map((event, index) => (
        <div key={event.id} className={styles.timelineItem}>
          <div 
            className={styles.timelineDot}
            style={{ backgroundColor: getStatusColor(event.status) }}
          >
            <span className={styles.typeIcon}>{getTypeIcon(event.type)}</span>
          </div>
          {index !== enhancedSampleData.length - 1 && <div className={styles.timelineConnector}></div>}
          <div className={styles.timelineContent}>
            <div className={styles.timelineHeader}>
              <div className={styles.timelineDate}>{formatDate(event.date)}</div>
              <div className={`${styles.statusBadge} ${styles[event.status]}`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </div>
            </div>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            
            <div className={styles.providerInfo}>
              <span className={styles.providerName}>{event.provider.name}</span>
              <span className={styles.networkStatus}>
                {event.provider.network === 'in-network' ? '✅ In-Network' : '⚠️ Out-of-Network'}
              </span>
              <span className={styles.rating}>⭐ {event.provider.rating}</span>
            </div>

            <div className={styles.costBreakdown}>
              <div className={styles.costRow}>
                <span>Total Cost:</span>
                <span>{formatCurrency(event.costs.totalCost)}</span>
              </div>
              <div className={styles.costRow}>
                <span>Insurance Paid:</span>
                <span className={styles.insurancePaid}>{formatCurrency(event.costs.insurancePaid)}</span>
              </div>
              <div className={styles.costRow}>
                <span>Your Cost:</span>
                <span className={styles.patientPaid}>{formatCurrency(event.costs.patientPaid)}</span>
              </div>
            </div>

            <button 
              className={styles.detailsButton}
              onClick={() => setSelectedEvent(event)}
            >
              View Details
            </button>
          </div>
        </div>
      ))}

      {/* Detail Modal */}
      {selectedEvent && (
        <div className={styles.modalOverlay} onClick={() => setSelectedEvent(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{selectedEvent.title}</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setSelectedEvent(null)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.modalSection}>
                <h3>Treatment Details</h3>
                <p><strong>Date:</strong> {formatDate(selectedEvent.date)}</p>
                <p><strong>Type:</strong> {selectedEvent.type}</p>
                <p><strong>Status:</strong> {selectedEvent.status}</p>
                <p><strong>Description:</strong> {selectedEvent.description}</p>
                {selectedEvent.notes && (
                  <p><strong>Notes:</strong> {selectedEvent.notes}</p>
                )}
              </div>

              <div className={styles.modalSection}>
                <h3>Provider Information</h3>
                <p><strong>Name:</strong> {selectedEvent.provider.name}</p>
                <p><strong>Network:</strong> {selectedEvent.provider.network}</p>
                <p><strong>Rating:</strong> ⭐ {selectedEvent.provider.rating}</p>
                <p><strong>Location:</strong> {selectedEvent.provider.location}</p>
              </div>

              <div className={styles.modalSection}>
                <h3>Cost Breakdown</h3>
                <div className={styles.detailedCosts}>
                  <div className={styles.costItem}>
                    <span>Total Treatment Cost:</span>
                    <span>{formatCurrency(selectedEvent.costs.totalCost)}</span>
                  </div>
                  <div className={styles.costItem}>
                    <span>Insurance Coverage:</span>
                    <span className={styles.insurancePaid}>
                      {formatCurrency(selectedEvent.costs.insurancePaid)}
                    </span>
                  </div>
                  <div className={styles.costItem}>
                    <span>Deductible Applied:</span>
                    <span>{formatCurrency(selectedEvent.costs.deductibleApplied)}</span>
                  </div>
                  <div className={styles.costItem}>
                    <span>Your Out-of-Pocket:</span>
                    <span className={styles.patientPaid}>
                      {formatCurrency(selectedEvent.costs.patientPaid)}
                    </span>
                  </div>
                </div>
              </div>

              {selectedEvent.documents && selectedEvent.documents.length > 0 && (
                <div className={styles.modalSection}>
                  <h3>Documents</h3>
                  <ul className={styles.documentList}>
                    {selectedEvent.documents.map((doc, index) => (
                      <li key={index}>📄 {doc}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedEvent.nextSteps && selectedEvent.nextSteps.length > 0 && (
                <div className={styles.modalSection}>
                  <h3>Next Steps</h3>
                  <ul className={styles.nextStepsList}>
                    {selectedEvent.nextSteps.map((step, index) => (
                      <li key={index}>• {step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
