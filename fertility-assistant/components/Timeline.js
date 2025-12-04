import { useState, useEffect, useRef } from 'react';
import styles from '../styles/Timeline.module.css';
import NewJourneyModal from './NewJourneyModal';
import { useNewJourneyModalSession } from '../lib/useNewJourneyModalSession';
import { useAuth } from '../context/AuthContext';
import { TREATMENT_STAGE_DATA, getTimelineBarWidth } from '../lib/treatmentStageData';

export default function Timeline({ events, onEventsUpdate }) {
    const STAGE_COLORS = {
      consultation: '#F4D35E',
      'diagnostic-testing': '#A5C9CA',
      'schedule-treatment': '#F6A87A',
      'insurance-review': '#6E7F80',
      'financial-counseling': '#F08C54',
      'cycle-monitoring': '#7BAFD4',
      medication: '#8FA05F',
      procedure: '#ADC178',
      'embryo-transfer': '#5B8FAE',
      'early-pregnancy-testing': '#4A5D2E',
      'unsuccessful-new-cycle': '#3C3C3C',
      'genetic-screening': '#A5C9CA',
      'insurance-authorization': '#6E7F80',
      'treatment-planning-meeting': '#F6A87A',
      'prepare-for-treatment': '#ADC178',
      'adjust-medication': '#8FA05F',
      'reassess-treatment-protocol': '#F6A87A',
      'insurance-checkpoint': '#6E7F80',
      'begin-medication': '#8FA05F',
      'pre-treatment-consultation': '#F4D35E',
      'complete-consent-forms': '#F6A87A',
      'insurance-pre-authorization': '#6E7F80',
      'dose-adjustment': '#8FA05F',
      'side-effects-management': '#8FA05F',
      'track-medication-adherence': '#8FA05F',
      'insurance-coverage-review': '#6E7F80',
      'recovery-protocol': '#ADC178',
      'fertilization-embryology': '#5B8FAE',
      'schedule-transfer-implantation': '#5B8FAE',
      'insurance-claims-submission': '#6E7F80',
      'post-transfer-monitoring': '#5B8FAE',
      'medication-adjustment': '#8FA05F',
      'insurance-follow-up': '#6E7F80',
      'emotional-support-engagement': '#F08C54',
      'confirm-pregnancy': '#4A5D2E',
      'repeat-bloodwork': '#4A5D2E',
      'review-coverage-for-pregnancy': '#6E7F80',
      'provide-continuing-support': '#F08C54',
      'reassess-protocol-with-physician': '#F4D35E',
      'insurance-review-for-new-cycle': '#6E7F80',
      'emotional-support-counseling': '#F08C54',
      'explore-alternative-treatments': '#F6A87A'
    };

  // Define predicted next steps for each stage
  const PREDICTED_NEXT_STEPS = {
    consultation: [
      { type: 'diagnostic-testing', title: 'Diagnostic Testing' },
      { type: 'schedule-treatment', title: 'Schedule 1st Treatment' },
      { type: 'insurance-review', title: 'Insurance Review' },
      { type: 'financial-counseling', title: 'Financial Counseling' }
    ],
    'diagnostic-testing': [
      { type: 'cycle-monitoring', title: 'Cycle Monitoring' },
      { type: 'genetic-screening', title: 'Genetic Screening' },
      { type: 'insurance-authorization', title: 'Insurance Authorization' },
      { type: 'treatment-planning-meeting', title: 'Treatment Planning Meeting' }
    ],
    'cycle-monitoring': [
      { type: 'prepare-for-treatment', title: 'Prepare for Treatment' },
      { type: 'adjust-medication', title: 'Adjust Medication' },
      { type: 'reassess-treatment-protocol', title: 'Reassess Treatment Protocol' },
      { type: 'insurance-checkpoint', title: 'Insurance Checkpoint' }
    ],
    'schedule-treatment': [
      { type: 'begin-medication', title: 'Begin Medication' },
      { type: 'pre-treatment-consultation', title: 'Pre-treatment Consultation' },
      { type: 'complete-consent-forms', title: 'Complete Consent Forms' },
      { type: 'insurance-pre-authorization', title: 'Insurance Pre-authorization' }
    ],
    medication: [
      { type: 'cycle-monitoring', title: 'Cycle Monitoring' },
      { type: 'side-effects-management', title: 'Side Effects Management' },
      { type: 'track-medication-adherence', title: 'Track Medication Adherence' },
      { type: 'insurance-coverage-review', title: 'Insurance Coverage Review' }
    ],
    procedure: [
      { type: 'recovery-protocol', title: 'Recovery Protocol' },
      { type: 'fertilization-embryology', title: 'Fertilization/Embryology (IVF)' },
      { type: 'schedule-transfer-implantation', title: 'Schedule Transfer/Implantation' },
      { type: 'insurance-claims-submission', title: 'Insurance Claims Submission' }
    ],
    'embryo-transfer': [
      { type: 'post-transfer-monitoring', title: 'Post-Transfer Monitoring' },
      { type: 'medication-adjustment', title: 'Medication Adjustment' },
      { type: 'insurance-follow-up', title: 'Insurance Follow-up' },
      { type: 'emotional-support-engagement', title: 'Emotional Support Engagement' }
    ],
    'early-pregnancy-testing': [
      { type: 'confirm-pregnancy', title: 'Confirm Pregnancy (hCG test)' },
      { type: 'repeat-bloodwork', title: 'Repeat Bloodwork' },
      { type: 'review-coverage-for-pregnancy', title: 'Review Coverage for Pregnancy' },
      { type: 'provide-continuing-support', title: 'Provide Continuing Support' }
    ],
    'unsuccessful-new-cycle': [
      { type: 'reassess-protocol-with-physician', title: 'Reassess Protocol with Physician' },
      { type: 'insurance-review-for-new-cycle', title: 'Insurance Review for New Cycle' },
      { type: 'emotional-support-counseling', title: 'Emotional Support & Counseling' },
      { type: 'explore-alternative-treatments', title: 'Explore Alternative Treatments' }
    ]
  };

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isNewJourneyModalOpen, setIsNewJourneyModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { shouldShowModal, markModalAsShown, isLoading } = useNewJourneyModalSession();
  const { user, userProfile } = useAuth();
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedPredictedStep, setExpandedPredictedStep] = useState(null);
  const [predictedStepShowMedical, setPredictedStepShowMedical] = useState({});
  // Helpers used by the horizontal layout
  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    // Parse date as local time to avoid timezone offset issues
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  const getStatusColor = (status) => {
    const statusColors = {
      planned: '#F4D35E',
      scheduled: '#7BAFD4',
      completed: '#ADC178',
      'in-progress': '#F6A87A',
      cancelled: '#C4C4C4',
      pending: '#F08C54'
    };
    const normalizedStatus = status?.toLowerCase().replace(/\s+/g, '-');
    return statusColors[normalizedStatus] || '#E8F0D8';
  };
  const getTypeIcon = (type) => {
    const icons = {
      consultation: '👩‍⚕️',
      'diagnostic-testing': '🔬',
      'schedule-treatment': '🗓️',
      'insurance-review': '🧾',
      'financial-counseling': '💰',
      'cycle-monitoring': '📈',
      medication: '💊',
      procedure: '🏥',
      'embryo-transfer': '🧬',
      'early-pregnancy-testing': '🧪',
      'unsuccessful-new-cycle': '🔄',
      'genetic-screening': '🧬',
      'insurance-authorization': '✅',
      'treatment-planning-meeting': '📋',
      'prepare-for-treatment': '🏥',
      'adjust-medication': '⚖️',
      'reassess-treatment-protocol': '🔍',
      'insurance-checkpoint': '🛡️',
      'begin-medication': '💊',
      'pre-treatment-consultation': '👨‍⚕️',
      'complete-consent-forms': '📝',
      'insurance-pre-authorization': '🧾',
      'dose-adjustment': '📊',
      'side-effects-management': '🩺',
      'track-medication-adherence': '✔️',
      'insurance-coverage-review': '📋',
      'recovery-protocol': '🛌',
      'fertilization-embryology': '🔬',
      'schedule-transfer-implantation': '📅',
      'insurance-claims-submission': '📤',
      'post-transfer-monitoring': '📊',
      'medication-adjustment': '⚖️',
      'insurance-follow-up': '📞',
      'emotional-support-engagement': '💚',
      'confirm-pregnancy': '🎉',
      'repeat-bloodwork': '💉',
      'review-coverage-for-pregnancy': '🤰',
      'provide-continuing-support': '🤝',
      'reassess-protocol-with-physician': '👨‍⚕️',
      'insurance-review-for-new-cycle': '🔄',
      'emotional-support-counseling': '💬',
      'explore-alternative-treatments': '🔎'
    };
    return icons[type] || '📋';
  };
  const getEventType = (evt) => {
    if (!evt) return null;
    const candidates = [evt.type, evt.treatmentType, evt.key, evt.title];
    for (const c of candidates) {
      if (!c) continue;
      const val = String(c).trim();
      if (!val) continue;
      return val.toLowerCase().replace(/\s+/g, '-');
    }
    return null;
  };
  const timelineScrollRef = useRef(null);

  const scrollByAmount = (amount) => {
    const el = timelineScrollRef.current;
    if (!el) return;
    el.scrollTo({ left: el.scrollLeft + amount, behavior: 'smooth' });
  };

  // Show modal on first visit in session
  useEffect(() => {
    if (shouldShowModal && !isLoading) {
      setIsNewJourneyModalOpen(true);
    }
  }, [shouldShowModal, isLoading]);

  // Load saved events and merge with optional props
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('newJourneyEntries') || '[]');
      const initial = (saved || []).concat(events || []);
      // Sort by date (earliest first) instead of timestamp
      initial.sort((a, b) => new Date(a.date || a.timestamp) - new Date(b.date || b.timestamp));
      setTimelineEvents(initial);
    } catch (err) {
      console.error('Error loading timeline events:', err);
      setTimelineEvents(events || []);
    }
  }, [events]);

  // Notify parent of updates
  useEffect(() => {
    if (onEventsUpdate) onEventsUpdate(timelineEvents);
  }, [timelineEvents, onEventsUpdate]);

  const handleCloseNewJourneyModal = () => {
    if (!isSaving) {
      setIsNewJourneyModalOpen(false);
      markModalAsShown();
    }
  };

  const handleNewJourneySubmit = async (formData) => {
    setIsSaving(true);
    try {
      const newJourneyEntry = {
        id: Date.now(),
        ...formData,
        type: formData.treatmentType,
        uid: user?.uid,
        timestamp: new Date().toISOString(),
      };
      
      // Update state immediately for live visual update
      const existingEntries = JSON.parse(localStorage.getItem('newJourneyEntries') || '[]');
      existingEntries.push(newJourneyEntry);
      localStorage.setItem('newJourneyEntries', JSON.stringify(existingEntries));
      
      // Sort by date and update state immediately
      const updatedEvents = [...existingEntries, ...(events || [])];
      updatedEvents.sort((a, b) => new Date(a.date || a.timestamp) - new Date(b.date || b.timestamp));
      setTimelineEvents(updatedEvents);
      
      // Close modal and show history immediately
      markModalAsShown();
      setIsNewJourneyModalOpen(false);
      setShowHistory(false);
      
      // Save to database in background
      if (user?.uid) {
        try {
          await fetch('/api/journey-entry', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await user.getIdToken()}`,
            },
            body: JSON.stringify(newJourneyEntry),
          });
        } catch (e) {
          console.error('Error saving to database:', e);
        }
      }
    } catch (error) {
      console.error('Error in handleNewJourneySubmit:', error);
      alert('Error saving journey entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSubmit = async (formData) => {
    setIsSaving(true);
    try {
      const updatedEntry = {
        ...selectedEvent,
        ...formData,
        type: formData.treatmentType,
      };
      
      // Update localStorage
      const existingEntries = JSON.parse(localStorage.getItem('newJourneyEntries') || '[]');
      const updatedEntries = existingEntries.map(entry => 
        entry.id === selectedEvent.id ? updatedEntry : entry
      );
      localStorage.setItem('newJourneyEntries', JSON.stringify(updatedEntries));
      
      // Update state immediately
      const updatedEvents = [...updatedEntries, ...(events || [])];
      updatedEvents.sort((a, b) => new Date(a.date || a.timestamp) - new Date(b.date || b.timestamp));
      setTimelineEvents(updatedEvents);
      setSelectedEvent(updatedEntry);
      
      // Close edit modal
      setIsEditing(false);
      
      // Update database in background
      if (user?.uid) {
        try {
          await fetch('/api/journey-entry', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await user.getIdToken()}`,
            },
            body: JSON.stringify(updatedEntry),
          });
        } catch (e) {
          console.error('Error updating database:', e);
        }
      }
    } catch (error) {
      console.error('Error in handleEditSubmit:', error);
      alert('Error updating journey entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this step: "${selectedEvent.type || selectedEvent.title}"?\n\nThis action cannot be undone.`
    );
    
    if (!confirmDelete) return;
    
    try {
      // Remove from localStorage
      const existingEntries = JSON.parse(localStorage.getItem('newJourneyEntries') || '[]');
      const updatedEntries = existingEntries.filter(entry => entry.id !== selectedEvent.id);
      localStorage.setItem('newJourneyEntries', JSON.stringify(updatedEntries));
      
      // Update state immediately
      const updatedEvents = [...updatedEntries, ...(events || [])];
      updatedEvents.sort((a, b) => new Date(a.date || a.timestamp) - new Date(b.date || b.timestamp));
      setTimelineEvents(updatedEvents);
      
      // Close details card
      setSelectedEvent(null);
      
      // Delete from database in background
      if (user?.uid) {
        try {
          await fetch('/api/journey-entry', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await user.getIdToken()}`,
            },
            body: JSON.stringify({ id: selectedEvent.id }),
          });
        } catch (e) {
          console.error('Error deleting from database:', e);
        }
      }
    } catch (error) {
      console.error('Error in handleDelete:', error);
      alert('Error deleting journey entry. Please try again.');
    }
  };

  const totalCost = timelineEvents.reduce((sum, e) => sum + (e.totalCost || 0), 0);
  const insurancePaid = timelineEvents.reduce((sum, e) => sum + (e.insurancePaid || 0), 0);
  const outOfPocket = totalCost - insurancePaid;
  const coveragePercent = totalCost > 0 ? Math.round((insurancePaid / totalCost) * 100) : 0;

  // Get events to display based on showHistory
  const getDisplayEvents = () => {
    if (showHistory) {
      return timelineEvents;
    }
    
    // Find the last completed step
    let lastCompletedIndex = -1;
    for (let i = timelineEvents.length - 1; i >= 0; i--) {
      if ((timelineEvents[i].status || '').toLowerCase() === 'completed') {
        lastCompletedIndex = i;
        break;
      }
    }
    
    // If found, return from that point onwards; otherwise return all events
    if (lastCompletedIndex >= 0) {
      return timelineEvents.slice(lastCompletedIndex);
    }
    
    return timelineEvents.length > 0 ? timelineEvents : [];
  };

  return (
    <>
      <NewJourneyModal
        isOpen={isNewJourneyModalOpen}
        onClose={handleCloseNewJourneyModal}
        onSubmit={handleNewJourneySubmit}
        isSaving={isSaving}
      />

      <NewJourneyModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSubmit={handleEditSubmit}
        isSaving={isSaving}
        initialData={selectedEvent}
      />

      {/* Horizontal Timeline Map */}
      <div className={styles.horizontalTimelineWrapper}>
          {/* Scroll controls */}
          <button className={styles.scrollLeft} aria-label="Scroll left" onClick={() => scrollByAmount(-300)}>◀</button>
          <button className={styles.scrollRight} aria-label="Scroll right" onClick={() => scrollByAmount(300)}>▶</button>
          
          <div className={styles.horizontalTimeline} ref={timelineScrollRef}>
            {getDisplayEvents().map((event, index, arr) => {
              const isCurrent = !showHistory && index === 0; // First node in current view is the current step
              const isLastBeforePredicted = !showHistory && index === arr.length - 1; // Last node before predicted steps
              const isLastInHistory = showHistory && index === arr.length - 1; // Last node in history view
              const isSelected = selectedEvent && selectedEvent.id === event.id;
              const typeKey = getEventType(event);
              const connectorColor = STAGE_COLORS[typeKey] || getStatusColor(event.status);
              const hasNext = index < arr.length - 1;
              const hasPrev = index > 0;
              const isAbove = index % 2 === 0;
              return (
                <div
                  key={event.id || `${event.timestamp}-${index}`}
                  className={
                    `${styles.timelineNode} ${isAbove ? styles.nodeAbove : styles.nodeBelow} ${isCurrent ? styles.currentNode : ''} ${isSelected ? styles.selectedNode : ''}`
                  }
                  onMouseEnter={() => setExpandedPredictedStep(event.id)}
                  onMouseLeave={() => setExpandedPredictedStep(null)}
                  onClick={() => setSelectedEvent(isSelected ? null : event)}
                >
                  {/* Content stack: label, circle, icon - positioned above or below */}
                  <div className={styles.nodeContent}>
                    <div className={styles.nodeLabel}>{event.title || event.type}</div>
                    <div className={styles.nodeCircle} style={{ backgroundColor: connectorColor }} />
                    <span className={styles.typeIcon}>{getTypeIcon(event.type)}</span>
                    
                    {/* Tooltip for simple explanation - attached to nodeContent */}
                    {expandedPredictedStep === event.id && (
                      <div className={styles.nodeTooltip}>
                        {TREATMENT_STAGE_DATA[getEventType(event)]?.simpleAnalogy || event.description}
                      </div>
                    )}
                  </div>
                  
                  {/* Vertical connector from main line to content */}
                  <div 
                    className={`${styles.verticalConnector} ${isCurrent ? styles.currentVerticalConnector : ''}`}
                    style={{ background: connectorColor }} 
                  />
                  
                  {/* Small circle on main horizontal line */}
                  <div className={styles.mainLineNode} style={{ backgroundColor: connectorColor }} />
                  
                  {/* Horizontal connector - always render for last nodes and current node */}
                  {(hasNext || isCurrent || isLastBeforePredicted || isLastInHistory) && (
                    <div 
                      className={`${styles.nodeConnector} ${isCurrent ? styles.currentConnector : ''} ${isLastBeforePredicted ? styles.lastBeforePredictedConnector : ''}`}
                      style={{ background: connectorColor }} 
                    />
                  )}
                </div>
              );
            })}
            
            {/* Predicted Next Steps - only show when current step is displayed (not history view) */}
            {!showHistory && getDisplayEvents().length > 0 && (() => {
              const displayedEvents = getDisplayEvents();
              const lastDisplayedEvent = displayedEvents[displayedEvents.length - 1];
              const lastEventType = getEventType(lastDisplayedEvent);
              const predictedSteps = PREDICTED_NEXT_STEPS[lastEventType];
              
              if (!predictedSteps) return null;
              
              return predictedSteps.map((predictedStep, pIndex) => {
                const predictedColor = STAGE_COLORS[predictedStep.type] || '#E8F0D8';
                const lighterColor = predictedColor + '40'; // Add transparency for subtle effect
                const isPredictedAbove = (displayedEvents.length + pIndex) % 2 === 0; // Continue alternating pattern
                
                return (
                  <div
                    key={`predicted-${pIndex}`}
                    className={`${styles.timelineNode} ${isPredictedAbove ? styles.nodeAbove : styles.nodeBelow} ${styles.predictedNode}`}
                    onMouseEnter={() => setExpandedPredictedStep(`predicted-${pIndex}`)}
                    onMouseLeave={() => setExpandedPredictedStep(null)}
                  >
                    {/* Content stack for predicted step */}
                    <div className={styles.nodeContent}>
                      <div className={styles.nodeLabel}>{predictedStep.title}</div>
                      <div className={styles.nodeCircle} style={{ backgroundColor: predictedColor, opacity: 0.5 }} />
                      <span className={styles.typeIcon}>{getTypeIcon(predictedStep.type)}</span>
                      
                      {/* Tooltip for predicted step */}
                      {expandedPredictedStep === `predicted-${pIndex}` && (
                        <div className={styles.nodeTooltip}>
                          {TREATMENT_STAGE_DATA[predictedStep.type]?.simpleAnalogy || 'Potential next step in your journey'}
                        </div>
                      )}
                    </div>
                    
                    {/* Vertical connector - lighter */}
                    <div 
                      className={styles.verticalConnector}
                      style={{ background: lighterColor }} 
                    />
                    
                    {/* Small circle on main line - lighter */}
                    <div className={styles.mainLineNode} style={{ backgroundColor: predictedColor, opacity: 0.5 }} />
                    
                    {/* Horizontal connector - lighter, only if not last predicted step */}
                    {pIndex < predictedSteps.length - 1 && (
                      <div 
                        className={styles.nodeConnector}
                        style={{ background: lighterColor }} 
                      />
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>

      {/* Toggle history button */}
      {timelineEvents.length > 1 && (
        <div className={styles.viewHistoryContainer}>
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
      )}

      {/* Details below timeline map, collapsible */}
      {selectedEvent && (
        <div className={styles.detailsSection}>
          <div className={styles.detailsHeader}>
            <h3>{selectedEvent.type || selectedEvent.title || 'Journey Step'}</h3>
            <div className={styles.headerButtons}>
              <button
                className={styles.deleteButton}
                onClick={handleDelete}
                aria-label="Delete step"
              >
                🗑️
              </button>
              <button
                className={styles.editButton}
                onClick={() => setIsEditing(true)}
                aria-label="Edit step"
              >
                ✏️
              </button>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedEvent(null)}
              >
                ×
              </button>
            </div>
          </div>
          <div className={styles.detailsBody}>
            <div>
              <strong>Status:</strong>{' '}
              <span 
                className={styles.statusBadge}
                style={{ backgroundColor: getStatusColor(selectedEvent.status) }}
              >
                {selectedEvent.status}
              </span>
            </div>
            <div><strong>Date:</strong> {formatDate(selectedEvent.date)}</div>
            <div><strong>Location:</strong> {selectedEvent.location || '—'}</div>
            <div><strong>Total Cost:</strong> {formatCurrency(selectedEvent.totalCost || selectedEvent.costs?.totalCost || 0)}</div>
            <div><strong>Insurance Coverage:</strong> {formatCurrency(selectedEvent.insurancePaid || selectedEvent.costs?.insurancePaid || 0)}</div>
            <div><strong>Your Out-of-Pocket:</strong> {formatCurrency(selectedEvent.trueCost || selectedEvent.costs?.patientPaid || ((selectedEvent.totalCost || 0) - (selectedEvent.insurancePaid || 0)))}</div>
          </div>
          
          {/* Medical Description Section */}
          {TREATMENT_STAGE_DATA[getEventType(selectedEvent)]?.medical && (
            <div className={styles.medicalDescriptionSection}>
              <div className={styles.medicalDescriptionHeader}>Medical Overview</div>
              <div className={styles.medicalDescriptionContent}>
                {TREATMENT_STAGE_DATA[getEventType(selectedEvent)].medical}
              </div>
            </div>
          )}
          
          {selectedEvent.notes && (
            <div className={styles.notesSection}>
              <div className={styles.notesHeader}>Notes</div>
              <div className={styles.notesContent}>{selectedEvent.notes}</div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
