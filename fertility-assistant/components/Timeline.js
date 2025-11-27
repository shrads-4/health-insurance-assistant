import { useState, useEffect } from 'react';
import styles from '../styles/Timeline.module.css';
import NewJourneyModal from './NewJourneyModal';
import { useNewJourneyModalSession } from '../lib/useNewJourneyModalSession';
import { useAuth } from '../context/AuthContext';
import { TREATMENT_STAGE_DATA, getTimelineBarWidth } from '../lib/treatmentStageData';

export default function Timeline({ events, onEventsUpdate }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isNewJourneyModalOpen, setIsNewJourneyModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { shouldShowModal, markModalAsShown, isLoading } = useNewJourneyModalSession();
  const { user, userProfile } = useAuth();
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedPredictedStep, setExpandedPredictedStep] = useState(null);
  const [predictedStepShowMedical, setPredictedStepShowMedical] = useState({});
  const [predictedStepShowPlainTooltip, setPredictedStepShowPlainTooltip] = useState({});

  // Show modal on first visit
  useEffect(() => {
    if (shouldShowModal && !isLoading) {
      setIsNewJourneyModalOpen(true);
    }
  }, [shouldShowModal, isLoading]);

  // Cleanup: close modal when component unmounts
  useEffect(() => {
    return () => {
      setIsNewJourneyModalOpen(false);
    };
  }, []);

  // Load saved events from localStorage (persisted entries)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('newJourneyEntries') || '[]');
      // Merge with optional `events` prop if provided, preferring saved client entries first
      const initial = (saved || []).concat(events || []);
      // Ensure newest-first ordering (most recent first)
      initial.sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date));
      setTimelineEvents(initial);
    } catch (err) {
      console.error('Error loading timeline events:', err);
      setTimelineEvents(events || []);
    }
  }, [events]);

  // Notify parent of updates
  useEffect(() => {
    if (onEventsUpdate) {
      onEventsUpdate(timelineEvents);
    }
  }, [timelineEvents, onEventsUpdate]);

  const handleNewJourneySubmit = async (formData) => {
    setIsSaving(true);
    try {
      // Create the entry object
      const newJourneyEntry = {
        id: Date.now(),
        ...formData,
        type: formData.treatmentType,
        uid: user?.uid,
        timestamp: new Date().toISOString(),
      };

      console.log('New Journey Entry:', newJourneyEntry);

      // Prepend to timeline events so it becomes the first/current step
      setTimelineEvents(prev => [newJourneyEntry, ...prev]);

      // Save to localStorage (client-side backup)
      const existingEntries = JSON.parse(localStorage.getItem('newJourneyEntries') || '[]');
      existingEntries.unshift(newJourneyEntry);
      localStorage.setItem('newJourneyEntries', JSON.stringify(existingEntries));

      // Try to save to database via API (best-effort)
      if (user?.uid) {
        try {
          await fetch('/api/journey-entry', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await user.getIdToken()}`,
            },
            body: JSON.stringify({
              ...newJourneyEntry,
            }),
          });
        } catch (error) {
          console.error('Error saving to database:', error);
        }
      }

      // Mark modal as shown and close
      markModalAsShown();
      setIsNewJourneyModalOpen(false);
      // By default show only current step after adding
      setShowHistory(false);
      console.log('New journey entry saved successfully');
    } catch (error) {
      console.error('Error in handleNewJourneySubmit:', error);
      alert('Error saving journey entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseNewJourneyModal = () => {
    if (!isSaving) {
      setIsNewJourneyModalOpen(false);
      markModalAsShown(); // Mark as shown even if user closes without submitting
    }
  };
  

  const getTypeIcon = (type) => {
    const icons = {
        consultation: '👩‍⚕️',
        'diagnostic-testing': '🔬',
        'schedule-treatment': '🗓️',
        'insurance-review': '🧾',
        'financial-counseling': '�',
        'cycle-monitoring': '📈',
        medication: '💊',
        procedure: '🏥',
        'embryo-transfer': '🧬',
        'early-pregnancy-testing': '🧪',
        'unsuccessful-new-cycle': '�'
    };
    return icons[type] || '📋';
  };

    // Map of possible next steps for each stage. Each entry is an array of
    // suggested next-step objects: { key, title, description }
    const NEXT_STEP_MAP = {
      consultation: [
        { key: 'diagnostic-testing', title: 'Diagnostic Testing', description: 'Hormone panels, AMH, ultrasound and genetic screening to assess readiness.' },
        { key: 'schedule-treatment', title: 'Schedule 1st Treatment', description: 'Book initial treatment appointments and medication preparation.' },
        { key: 'insurance-review', title: 'Insurance Review', description: 'Check plan details and initiate coverage authorization if needed.' },
        { key: 'financial-counseling', title: 'Financial Counseling', description: 'Discuss payment plans and estimate out-of-pocket costs.' }
      ],
      'diagnostic-testing': [
        { key: 'cycle-monitoring', title: 'Cycle Monitoring', description: 'Monitor response to prepare for treatment (repeats possible).' },
        { key: 'embryo-transfer', title: 'Prepare for Treatment', description: 'Prepare protocols for treatment or IVF cycle.' },
        { key: 'insurance-review', title: 'Insurance Authorization', description: 'Request authorizations needed for procedures or testing.' },
        { key: 'schedule-treatment', title: 'Treatment Planning Meeting', description: 'Meet the team and finalize the medication and procedure plan.' }
      ],
      'cycle-monitoring': [
        { key: 'schedule-treatment', title: 'Prepare for Treatment', description: 'Finalize timing and schedule egg retrieval or insemination.' },
        { key: 'medication', title: 'Adjust Medication', description: 'Titrate medications based on response and monitoring.' },
        { key: 'diagnostic-testing', title: 'Reassess Protocol', description: 'Re-evaluate with additional tests or team consult.' },
        { key: 'insurance-review', title: 'Insurance Checkpoint', description: 'Re-check coverage and update authorization as needed.' }
      ],
      'schedule-treatment': [
        { key: 'medication', title: 'Begin Medication', description: 'Start stimulation or preparatory medications and monitoring.' },
        { key: 'consultation', title: 'Pre-treatment Consultation', description: 'Confirm protocol, consent, and logistics.' },
        { key: 'financial-counseling', title: 'Complete Consent & Payment', description: 'Finalize consent forms and payment arrangements.' },
        { key: 'insurance-review', title: 'Insurance Pre-authorization', description: 'Verify coverage for scheduled procedures.' }
      ],
      medication: [
        { key: 'cycle-monitoring', title: 'Cycle Monitoring', description: 'Track response and adjust dosing as needed.' },
        { key: 'procedure', title: 'Side Effects Management', description: 'Manage reactions and consult pharmacy or clinic.' },
        { key: 'medication', title: 'Track Adherence', description: 'Set reminders and logs for medication adherence.' },
        { key: 'insurance-review', title: 'Insurance Coverage Review', description: 'Request refill authorization or coverage review.' }
      ],
      procedure: [
        { key: 'embryo-transfer', title: 'Fertilization/Embryology', description: 'Embryo monitoring and lab follow-up after retrieval.' },
        { key: 'early-pregnancy-testing', title: 'Recovery Protocol', description: 'Follow-up and recovery planning with post-procedure care.' },
        { key: 'schedule-treatment', title: 'Schedule Transfer/Implantation', description: 'Plan embryo transfer and uterine preparation.' },
        { key: 'insurance-review', title: 'Claims Submission', description: 'Submit claims and review coverage for the phase.' }
      ],
      'embryo-transfer': [
        { key: 'early-pregnancy-testing', title: 'Post-Transfer Monitoring', description: 'Bloodwork and ultrasounds to confirm pregnancy.' },
        { key: 'medication', title: 'Medication Adjustment', description: 'Adjust support medications and monitor hormones.' },
        { key: 'insurance-review', title: 'Insurance Follow-up', description: 'Track out-of-pocket costs and claims.' },
        { key: 'financial-counseling', title: 'Emotional Support', description: 'Connect to counseling and support resources.' }
      ],
      'early-pregnancy-testing': [
        { key: 'consultation', title: 'Confirm Pregnancy', description: 'If positive, schedule first prenatal appointment.' },
        { key: 'early-pregnancy-testing', title: 'Repeat Bloodwork', description: 'Monitor hCG and progress over time.' },
        { key: 'insurance-review', title: 'Review Coverage', description: 'Transition to prenatal benefits and coverage review.' },
        { key: 'financial-counseling', title: 'Continuing Support', description: 'Provide resources and next steps depending on result.' }
      ],
      'unsuccessful-new-cycle': [
        { key: 'consultation', title: 'Reassess Protocol', description: 'Discuss next cycle or protocol adjustments with physician.' },
        { key: 'insurance-review', title: 'Insurance Review for New Cycle', description: 'Confirm benefits remaining and reauthorize as needed.' },
        { key: 'financial-counseling', title: 'Emotional Support & Counseling', description: 'Set up sessions for coping and planning.' },
        { key: 'schedule-treatment', title: 'Explore Alternatives', description: 'Discuss donor options, adoption, or other options.' }
      ],
      'financial-counseling': [
        { key: 'schedule-treatment', title: 'Schedule Treatment', description: 'Book your first treatment appointment.' },
        { key: 'insurance-review', title: 'Insurance Review', description: 'Confirm coverage and authorization status.' },
        { key: 'consultation', title: 'Medical Consultation', description: 'Discuss treatment plan with specialist.' },
        { key: 'diagnostic-testing', title: 'Schedule Testing', description: 'Arrange baseline diagnostic testing.' }
      ],
      'insurance-review': [
        { key: 'financial-counseling', title: 'Financial Planning', description: 'Review costs and discuss payment options.' },
        { key: 'consultation', title: 'Coverage Consultation', description: 'Clarify what is and is not covered.' },
        { key: 'schedule-treatment', title: 'Schedule Treatment', description: 'Once authorized, schedule your appointment.' },
        { key: 'diagnostic-testing', title: 'Proceed to Testing', description: 'Move forward with recommended testing.' }
      ]
    };

    const getNextSteps = (currentType) => {
      return NEXT_STEP_MAP[currentType] || [];
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

  const getCoverageStatus = (eventState) => {
    // If user profile doesn't have a state yet, or event doesn't have treatmentState, no coverage info
    const userState = userProfile?.location?.state;
    if (!userState || !eventState) {
      return null;
    }
    
    const isCovered = eventState === userState;
    return {
      isCovered,
      label: isCovered ? 'Treatment covered' : 'Not covered',
      color: isCovered ? '#ADC178' : '#E76F51'
    };
  };

  // Resolve an event's canonical type key. Some events may use `type`, `treatmentType`,
  // or only have a `title`. Normalize to a lowercase key that matches NEXT_STEP_MAP keys.
  const getEventType = (evt) => {
    if (!evt) return null;
    const candidates = [evt.type, evt.treatmentType, evt.key, evt.title];
    for (const c of candidates) {
      if (!c) continue;
      const val = String(c).trim();
      if (!val) continue;
      // normalize: lowercase and replace spaces with hyphens
      return val.toLowerCase().replace(/\s+/g, '-');
    }
    return null;
  };

  // When showing history, render oldest-first (reversed); otherwise show only current step
  const listToRender = showHistory ? [...timelineEvents].reverse() : (timelineEvents[0] ? [timelineEvents[0]] : []);

  // Determine the canonical type for the most recent event (used for predicted suggestions)
  const currentType = timelineEvents[0] ? getEventType(timelineEvents[0]) : null;

  return (
    <>
      <NewJourneyModal
        isOpen={isNewJourneyModalOpen}
        onClose={handleCloseNewJourneyModal}
        onSubmit={handleNewJourneySubmit}
        isSaving={isSaving}
      />
      
      <div className={styles.timeline}>
        {/* View journey history control (only shown if there is at least one saved event) */}
        {timelineEvents.length > 0 && (
          <div className={styles.viewHistoryContainer}>
                <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
                  <button
                    className={styles.viewHistoryButton}
                    onClick={() => setShowHistory(prev => !prev)}
                  >
                    {showHistory ? 'Show current step' : '← View journey history'}
                  </button>
                  <button
                    className={styles.addButton}
                    onClick={() => setIsNewJourneyModalOpen(true)}
                    aria-label="Add timeline step"
                  >
                    +
                  </button>
                </div>
          </div>
        )}

        {listToRender.map((event, index) => (
        <div key={event.id || `${event.timestamp}-${index}`} className={styles.timelineItem}>
          <div 
            className={`${styles.timelineDot} ${index === 0 && !showHistory ? styles.current : ''}`}
            style={{ backgroundColor: getStatusColor(event.status) }}
          >
            <span className={styles.typeIcon}>{getTypeIcon(event.type)}</span>
          </div>
          {index !== (listToRender.length - 1) && <div className={styles.timelineConnector}></div>}
          <div className={styles.timelineContent}>
            <div className={styles.timelineHeader}>
              <div className={styles.timelineDate}>{formatDate(event.date)}</div>
              <div className={`${styles.statusBadge} ${styles[event.status]}`}>
                {String(event.status).charAt(0).toUpperCase() + String(event.status).slice(1)}
              </div>
            </div>
            <h3>{event.title || (event.type ? (event.type.charAt(0).toUpperCase() + event.type.slice(1)) : 'New Step')}</h3>
            <p>{event.description || event.notes || ''}</p>
            
            <div className={styles.providerInfo}>
              <span className={styles.providerName}>{event.location || ''}</span>
              {getCoverageStatus(event.treatmentState) && (
                <span 
                  className={styles.coverageBadge}
                  style={{ 
                    backgroundColor: getCoverageStatus(event.treatmentState).color,
                    color: '#fff'
                  }}
                >
                  {getCoverageStatus(event.treatmentState).label}
                </span>
              )}
            </div>

            <div className={styles.costBreakdown}>
              <div className={styles.costRow}>
                <span>Total Cost:</span>
                <span>{formatCurrency(event.totalCost || event.costs?.totalCost || 0)}</span>
              </div>
              <div className={styles.costRow}>
                <span>Insurance Paid:</span>
                <span className={styles.insurancePaid}>{formatCurrency(event.insurancePaid || event.costs?.insurancePaid || 0)}</span>
              </div>
              <div className={styles.costRow}>
                <span>Your Cost:</span>
                <span className={styles.patientPaid}>{formatCurrency(event.trueCost || event.costs?.patientPaid || ( (event.totalCost || 0) - (event.insurancePaid || 0) ))}</span>
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

      {/* Predicted next steps (displayed after the most recent saved step, only when viewing current step) */}
      {currentType && !showHistory && (
        <div className={styles.predictedContainer}>
          {getNextSteps(currentType).slice(0,4).map((step, idx) => {
            const stageData = TREATMENT_STAGE_DATA[step.key];
            const timelineWidth = stageData ? getTimelineBarWidth(stageData.timeRangeMin, stageData.timeRangeMax) : 80;
            const isShowingMedical = predictedStepShowMedical[step.key] || false;
            const isShowingPlainTooltip = predictedStepShowPlainTooltip[step.key] || false;
            
            return (
              <div key={step.key} className={`${styles.timelineItem} ${styles.predictedItem}`}>
                <div className={`${styles.timelineDot} ${styles.predictedDot}`} style={{ backgroundColor: '#E8F0D8' }}>
                  <span className={styles.typeIcon}>{getTypeIcon(step.key)}</span>
                </div>
                <div className={styles.timelineConnector}></div>
                <div className={`${styles.timelineContent} ${styles.predictedContent}`}>
                  <div className={styles.timelineHeader}>
                    <div className={styles.timelineDate}>—</div>
                    <div className={`${styles.statusBadge} ${styles.planned}`}>Suggested</div>
                  </div>
                  <h3>{stageData?.title || step.title}</h3>
                  
                  {/* Short form description - always shown */}
                  <div className={styles.predictedDescription}>
                    <div className={styles.descriptionText}>
                      {stageData?.plainEnglish || step.description}
                    </div>
                  </div>

                  {/* Medical description - shown when toggled */}
                  {isShowingMedical && stageData && (
                    <div className={styles.predictedDescription}>
                      <div className={styles.descriptionText}>
                        <strong>Medical Details:</strong> {stageData.medical}
                      </div>
                    </div>
                  )}

                  {/* Controls and Timeline */}
                  <div className={styles.predictedControlsSection}>
                    <div className={styles.predictedControls}>
                      <button 
                        className={styles.toggleButton}
                        onClick={() => setPredictedStepShowMedical(prev => ({
                          ...prev,
                          [step.key]: !prev[step.key]
                        }))}
                      >
                        {isShowingMedical ? '✓ Medical Details' : 'See More'}
                      </button>
                      
                      <div className={styles.confusedButtonContainer}>
                        <button 
                          className={styles.confusedButton}
                          onMouseEnter={() => setPredictedStepShowPlainTooltip(prev => ({
                            ...prev,
                            [step.key]: true
                          }))}
                          onMouseLeave={() => setPredictedStepShowPlainTooltip(prev => ({
                            ...prev,
                            [step.key]: false
                          }))}
                        >
                          ❓ I'm Confused
                        </button>
                        {isShowingPlainTooltip && stageData && (
                          <div className={styles.tooltipHorizontal}>
                            {stageData.simpleAnalogy || stageData.plainEnglish}
                          </div>
                        )}
                      </div>
                    </div>

                    {stageData && (
                      <div className={styles.timelineInfo}>
                        <div className={styles.timelineLabel}>
                          Expected Timeline: <strong>{stageData.timeDescription}</strong>
                        </div>
                        <div 
                          className={styles.timelineBar}
                          style={{ width: `${timelineWidth}px` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedEvent && (
        <div className={styles.modalOverlay} onClick={() => setSelectedEvent(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{selectedEvent.title || 'Journey Step'}</h2>
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
                {selectedEvent.notes && (
                  <p><strong>Notes:</strong> {selectedEvent.notes}</p>
                )}
              </div>

              <div className={styles.modalSection}>
                <h3>Location</h3>
                <p>{selectedEvent.location || '—'}</p>
              </div>

              <div className={styles.modalSection}>
                <h3>Cost Breakdown</h3>
                <div className={styles.detailedCosts}>
                  <div className={styles.costItem}>
                    <span>Total Treatment Cost:</span>
                    <span>{formatCurrency(selectedEvent.totalCost || selectedEvent.costs?.totalCost || 0)}</span>
                  </div>
                  <div className={styles.costItem}>
                    <span>Insurance Coverage:</span>
                    <span className={styles.insurancePaid}>
                      {formatCurrency(selectedEvent.insurancePaid || selectedEvent.costs?.insurancePaid || 0)}
                    </span>
                  </div>
                  <div className={styles.costItem}>
                    <span>Your Out-of-Pocket:</span>
                    <span className={styles.patientPaid}>
                      {formatCurrency(selectedEvent.trueCost || selectedEvent.costs?.patientPaid || ((selectedEvent.totalCost || 0) - (selectedEvent.insurancePaid || 0)))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
