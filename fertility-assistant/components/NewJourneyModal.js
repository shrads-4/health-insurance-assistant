import { useState, useEffect } from 'react';
import styles from '../styles/NewJourneyModal.module.css';

export default function NewJourneyModal({ isOpen, onClose, onSubmit, isSaving = false }) {
  const [formData, setFormData] = useState({
    treatmentType: '',
    status: '',
    date: '',
    totalCost: '',
    insurancePaid: '',
    location: '',
    notes: '',
    treatmentState: '',
  });

  const [errors, setErrors] = useState({});

  const treatmentOptions = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'diagnostic-testing', label: 'Diagnostic Testing' },
    { value: 'schedule-treatment', label: 'Schedule 1st Treatment' },
    { value: 'insurance-review', label: 'Insurance Review' },
    { value: 'financial-counseling', label: 'Financial Counseling' },
    { value: 'cycle-monitoring', label: 'Cycle Monitoring' },
    { value: 'medication', label: 'Medication' },
    { value: 'procedure', label: 'Procedure (e.g., Egg Retrieval, IUI)' },
    { value: 'embryo-transfer', label: 'Embryo Transfer' },
    { value: 'early-pregnancy-testing', label: 'Early Pregnancy Testing' },
    { value: 'unsuccessful-new-cycle', label: 'Unsuccessful - New Cycle / Adjust Plan' },
  ];

  const statusOptions = [
    { value: 'planned', label: 'Planned' },
    { value: 'completed', label: 'Completed' },
    { value: 'postponed', label: 'Postponed' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.treatmentType) newErrors.treatmentType = 'Treatment type is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.treatmentState) newErrors.treatmentState = 'State is required';
    if (!formData.totalCost || isNaN(formData.totalCost) || parseFloat(formData.totalCost) < 0) {
      newErrors.totalCost = 'Valid total cost is required';
    }
    if (formData.insurancePaid === '' || isNaN(formData.insurancePaid) || parseFloat(formData.insurancePaid) < 0) {
      newErrors.insurancePaid = 'Valid insurance paid amount is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTrueCost = () => {
    const total = parseFloat(formData.totalCost) || 0;
    const insurance = parseFloat(formData.insurancePaid) || 0;
    return Math.max(0, total - insurance);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submissionData = {
        ...formData,
        totalCost: parseFloat(formData.totalCost),
        insurancePaid: parseFloat(formData.insurancePaid),
        trueCost: calculateTrueCost(),
        timestamp: new Date().toISOString(),
      };
      
      onSubmit(submissionData);
      // Reset form
      setFormData({
        treatmentType: '',
        status: '',
        date: '',
        totalCost: '',
        insurancePaid: '',
        location: '',
        notes: '',
        treatmentState: '',
      });
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay - clicking outside closes modal */}
      <div 
        className={styles.overlay}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalContent}>
          <h2 className={styles.title}>Any new steps in your journey?</h2>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Treatment Type Dropdown */}
            <div className={styles.formGroup}>
              <label htmlFor="treatmentType" className={styles.label}>
                Treatment Type <span className={styles.required}>*</span>
              </label>
              <select
                id="treatmentType"
                name="treatmentType"
                value={formData.treatmentType}
                onChange={handleInputChange}
                className={`${styles.select} ${errors.treatmentType ? styles.error : ''}`}
              >
                <option value="">Select a treatment type...</option>
                {treatmentOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.treatmentType && (
                <span className={styles.errorMessage}>{errors.treatmentType}</span>
              )}
            </div>

            {/* Status Selector */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Status <span className={styles.required}>*</span>
              </label>
              <div className={styles.statusGroup}>
                {statusOptions.map(option => (
                  <label key={option.value} className={styles.checkboxLabel}>
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={formData.status === option.value}
                      onChange={handleInputChange}
                      className={styles.radio}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.status && (
                <span className={styles.errorMessage}>{errors.status}</span>
              )}
            </div>

            {/* Date Field */}
            <div className={styles.formGroup}>
              <label htmlFor="date" className={styles.label}>
                Date <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.date ? styles.error : ''}`}
              />
              {errors.date && (
                <span className={styles.errorMessage}>{errors.date}</span>
              )}
            </div>

            {/* Location Field */}
            <div className={styles.formGroup}>
              <label htmlFor="location" className={styles.label}>
                Location <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="e.g., Fertility Center of Excellence, San Francisco, CA"
                value={formData.location}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.location ? styles.error : ''}`}
              />
              {errors.location && (
                <span className={styles.errorMessage}>{errors.location}</span>
              )}
            </div>

            {/* Treatment State Dropdown */}
            <div className={styles.formGroup}>
              <label htmlFor="treatmentState" className={styles.label}>
                State <span className={styles.required}>*</span>
              </label>
              <select
                id="treatmentState"
                name="treatmentState"
                value={formData.treatmentState}
                onChange={handleInputChange}
                className={`${styles.select} ${errors.treatmentState ? styles.error : ''}`}
              >
                <option value="">Select a state...</option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
              </select>
              {errors.treatmentState && (
                <span className={styles.errorMessage}>{errors.treatmentState}</span>
              )}
            </div>

            {/* Cost Section */}
            <div className={styles.costSection}>
              <h3 className={styles.costSectionTitle}>Treatment Costs</h3>
              
              <div className={styles.costRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="totalCost" className={styles.label}>
                    Total Cost <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWithCurrency}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="number"
                      id="totalCost"
                      name="totalCost"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={formData.totalCost}
                      onChange={handleInputChange}
                      className={`${styles.input} ${errors.totalCost ? styles.error : ''}`}
                    />
                  </div>
                  {errors.totalCost && (
                    <span className={styles.errorMessage}>{errors.totalCost}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="insurancePaid" className={styles.label}>
                    Insurance Paid <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWithCurrency}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="number"
                      id="insurancePaid"
                      name="insurancePaid"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={formData.insurancePaid}
                      onChange={handleInputChange}
                      className={`${styles.input} ${errors.insurancePaid ? styles.error : ''}`}
                    />
                  </div>
                  {errors.insurancePaid && (
                    <span className={styles.errorMessage}>{errors.insurancePaid}</span>
                  )}
                </div>
              </div>

              {/* True Cost Display */}
              <div className={styles.trueCostBox}>
                <span className={styles.trueCostLabel}>Your Cost:</span>
                <span className={styles.trueCostValue}>
                  ${calculateTrueCost().toFixed(2)}
                </span>
              </div>
            
            {/* Notes (optional) */}
            <div className={styles.formGroup}>
              <label htmlFor="notes" className={styles.label}>
                Notes <span className={styles.optional}>(optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Any notes about this step..."
                value={formData.notes}
                onChange={handleInputChange}
                className={styles.textarea}
                rows={4}
              />
            </div>
            </div>

            {/* Form Actions */}
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.confirmButton}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
