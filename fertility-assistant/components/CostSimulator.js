import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase_config';
import styles from '../styles/CostSimulator.module.css';

export default function CostSimulator() {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [inputs, setInputs] = useState({
    treatmentType: 'IVF',
    providerType: 'Private_Clinic',
    state: 'CA',
    age: 35,
    insuranceType: 'PPO'
  });
  const [predictions, setPredictions] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [activeTab, setActiveTab] = useState('predictions');
  const [error, setError] = useState(null);
  const [profileDoc, setProfileDoc] = useState(null);

  // Load user profile data on mount
  useEffect(() => {
    if (userProfile) {
      // Calculate age from date of birth
      let calculatedAge = 35; // default
      if (userProfile.dateOfBirth) {
        const birthDate = new Date(userProfile.dateOfBirth);
        const today = new Date();
        calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
      }

      setInputs(prev => ({
        ...prev,
        age: calculatedAge,
        // You can extract state from user profile if available
        // state: userProfile.state || 'CA'
      }));
    }
  }, [userProfile]);

  // Extra safety: fetch latest profile document directly
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          setProfileDoc(snap.data());
        }
      } catch (e) {
        console.error('Error fetching profile for simulator:', e);
      }
    })();
  }, [user]);

  const treatmentOptions = [
    { value: 'IVF', label: 'IVF (In Vitro Fertilization)' },
    { value: 'IUI', label: 'IUI (Intrauterine Insemination)' },
    { value: 'Egg_Freezing', label: 'Egg Freezing' },
    { value: 'IVF_with_ICSI', label: 'IVF with ICSI' },
    { value: 'IVF_with_PGT', label: 'IVF with PGT Testing' },
    { value: 'Donor_Egg_IVF', label: 'Donor Egg IVF' },
    { value: 'Donor_Sperm_IUI', label: 'Donor Sperm IUI' },
    { value: 'Consultation', label: 'Initial Consultation' },
    { value: 'Testing', label: 'Fertility Testing Panel' },
    { value: 'Medication_Only', label: 'Medication Only' }
  ];

  const providerOptions = [
    { value: 'Academic_Center', label: 'Academic Medical Center' },
    { value: 'Private_Clinic', label: 'Private Fertility Clinic' },
    { value: 'Hospital_Based', label: 'Hospital-Based Clinic' },
    { value: 'Community_Clinic', label: 'Community Clinic' }
  ];

  const insuranceOptions = [
    { value: 'PPO', label: 'PPO' },
    { value: 'HMO', label: 'HMO' },
    { value: 'EPO', label: 'EPO' },
    { value: 'POS', label: 'POS' },
    { value: 'High_Deductible', label: 'High Deductible Health Plan' },
    { value: 'None', label: 'No Insurance / Self-Pay' }
  ];

  // const stateOptions = [
  //   'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA',
  //   'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA',
  //   'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY',
  //   'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX',
  //   'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  // ];
  const stateOptions = [ // TODO: Expand to full list by scraping more data
    'CA', 'NY', 'TX'
  ];

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setInputs({ ...inputs, [e.target.name]: value });
  };

  const predictCosts = async () => {
    // If we have no profile at all, warn but allow proceeding with defaults if the user insists (or just block with a softer message)
    // Actually, we'll just check for values.
    
    // Check if user has insurance information (soft check)
    // if (!safeProfile.deductible && !safeProfile.outOfPocketMax) {
    //   setError('Please add your insurance information in your profile to see accurate cost estimates');
    //   return;
    // }

    setError(null);
    setPredicting(true);

    try {
      // Call prediction API
      const response = await fetch('/api/predict-fertility-costs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          treatmentType: inputs.treatmentType,
          providerType: inputs.providerType,
          state: inputs.state,
          age: inputs.age,
          insuranceType: inputs.insuranceType,
          // Insurance details from profile or extracted data
          deductible: effectiveDeductible,
          deductibleMet: effectiveDeductibleMet,
          outOfPocketMax: effectiveOutOfPocketMax,
          coinsurance: effectiveCoinsurance,
          coverageLimit: safeProfile.coverageLimit || null
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPredictions(data);
        generateScenarios(data);
      } else {
        setError(data.error || 'Failed to predict costs');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      setError('Failed to connect to prediction service. Please try again.');
    }

    setPredicting(false);
  };

  const generateScenarios = (predictionData) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const isNearYearEnd = currentMonth >= 10; // November or December

    const scenariosList = [];
    const baseCost = predictionData.prediction.baseCost;
    const insuranceBreakdown = predictionData.insuranceBreakdown;

    // Scenario 1: Start Now
    scenariosList.push({
      id: 'now',
      name: 'Start Treatment Now',
      description: 'Begin treatment immediately with current insurance status',
      timing: 'immediate',
      totalCost: baseCost,
      outOfPocket: insuranceBreakdown.finalOutOfPocket,
      insurancePays: insuranceBreakdown.insurancePays,
      breakdown: insuranceBreakdown,
      pros: [
        'No waiting time',
        'Begin treatment immediately',
        `Estimated cost range: $${predictionData.prediction.costRange.min.toLocaleString()} - $${predictionData.prediction.costRange.max.toLocaleString()}`
      ],
      cons: isNearYearEnd ? [
        'Limited time before deductible resets',
        'May not maximize insurance benefits if costs span into next year'
      ] : [
        `$${insuranceBreakdown.remainingDeductible.toLocaleString()} remaining deductible`
      ]
    });

    // Scenario 2: Wait Until January (if near year end)
    if (isNearYearEnd && effectiveDeductible) {
      const januaryBreakdown = calculateInsuranceCost(
        baseCost,
        effectiveDeductible,
        0, // Fresh deductible
        effectiveOutOfPocketMax,
        effectiveCoinsurance,
        safeProfile.coverageLimit
      );

      const savings = insuranceBreakdown.finalOutOfPocket - januaryBreakdown.finalOutOfPocket;

      scenariosList.push({
        id: 'january',
        name: 'Wait Until January',
        description: 'Start after deductible resets with fresh insurance year',
        timing: 'january-reset',
        totalCost: baseCost,
        outOfPocket: januaryBreakdown.finalOutOfPocket,
        insurancePays: januaryBreakdown.insurancePays,
        breakdown: januaryBreakdown,
        savings: savings,
        pros: [
          'Fresh deductible year',
          savings > 0 ? `Potential savings: $${savings.toLocaleString()}` : 'Full year to utilize benefits',
          'Better cost predictability'
        ],
        cons: [
          'Treatment delayed by weeks/months',
          'Age factor considerations',
          'Provider availability may change'
        ]
      });
    }

    // Scenario 3: Alternative Provider Type
    if (inputs.providerType === 'Private_Clinic') {
      const alternativeCost = baseCost * 0.85; // Academic centers ~15% less
      const altBreakdown = calculateInsuranceCost(
        alternativeCost,
        effectiveDeductible,
        effectiveDeductibleMet,
        effectiveOutOfPocketMax,
        effectiveCoinsurance,
        safeProfile.coverageLimit
      );

      scenariosList.push({
        id: 'alternative-provider',
        name: 'Academic Medical Center',
        description: 'Consider academic centers for potential cost savings',
        timing: 'alternative',
        totalCost: alternativeCost,
        outOfPocket: altBreakdown.finalOutOfPocket,
        insurancePays: altBreakdown.insurancePays,
        breakdown: altBreakdown,
        savings: insuranceBreakdown.finalOutOfPocket - altBreakdown.finalOutOfPocket,
        pros: [
          `Save approximately $${(insuranceBreakdown.finalOutOfPocket - altBreakdown.finalOutOfPocket).toLocaleString()}`,
          'Research-backed protocols',
          'Comprehensive support services'
        ],
        cons: [
          'May have longer wait times',
          'Teaching environment',
          'Potentially less flexible scheduling'
        ]
      });
    }

    setScenarios(scenariosList);
  };

  const calculateInsuranceCost = (cost, deductible, deductibleMet, outOfPocketMax, coinsurance, coverageLimit) => {
    const remainingDeductible = Math.max(0, deductible - deductibleMet);
    const costAfterDeductible = Math.max(0, cost - remainingDeductible);
    const deductiblePaid = Math.min(cost, remainingDeductible);
    const coinsurancePaid = (costAfterDeductible * coinsurance) / 100;
    const insurancePays = costAfterDeductible - coinsurancePaid;
    const totalOutOfPocket = Math.min(deductiblePaid + coinsurancePaid, outOfPocketMax);

    const exceedsCoverageLimit = coverageLimit && cost > coverageLimit;
    const uncoveredAmount = exceedsCoverageLimit ? cost - coverageLimit : 0;
    const finalOutOfPocket = exceedsCoverageLimit
      ? uncoveredAmount + totalOutOfPocket
      : totalOutOfPocket;
    return {
      totalCost: cost,
      deductiblePaid,
      coinsurancePaid,
      insurancePays,
      totalOutOfPocket,
      remainingDeductible: Math.max(0, remainingDeductible - deductiblePaid),
      exceedsCoverageLimit,
      uncoveredAmount,
      finalOutOfPocket
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Derive insurance values from profile or extracted plan data
  const safeProfile = profileDoc || userProfile || {};
  const extracted = safeProfile.extractedInsuranceData || {};

  const toNumber = (val) => {
    if (val === null || val === undefined || val === '') return null;
    const n = parseFloat(val);
    return Number.isNaN(n) ? null : n;
  };

  const effectiveDeductible =
    toNumber(safeProfile.deductible) ??
    toNumber(extracted.deductible?.individual) ??
    0;

  const effectiveDeductibleMet =
    toNumber(safeProfile.deductibleMet) ?? 0;

  const effectiveOutOfPocketMax =
    toNumber(safeProfile.outOfPocketMax) ??
    toNumber(extracted.outOfPocketMax?.individual) ??
    0;

  // Coinsurance may not be parsed yet from the plan; fall back to profile or 20%
  const effectiveCoinsurance =
    toNumber(safeProfile.coinsurance) ?? 20;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Fertility Treatment Cost Simulator</h1>
        <p className={styles.subtitle}>
          Get AI-powered cost predictions based on your insurance coverage
        </p>
      </div>

      {/* Input Form */}
      <div className={styles.formSection}>
        <h2>Treatment Details</h2>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="treatmentType">Treatment Type</label>
            <select
              id="treatmentType"
              name="treatmentType"
              value={inputs.treatmentType}
              onChange={handleChange}
            >
              {treatmentOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="providerType">Provider Type</label>
            <select
              id="providerType"
              name="providerType"
              value={inputs.providerType}
              onChange={handleChange}
            >
              {providerOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="state">State</label>
            <select
              id="state"
              name="state"
              value={inputs.state}
              onChange={handleChange}
            >
              {stateOptions.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={inputs.age}
              onChange={handleChange}
              min="18"
              max="50"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="insuranceType">Insurance Type</label>
            <select
              id="insuranceType"
              name="insuranceType"
              value={inputs.insuranceType}
              onChange={handleChange}
            >
              {insuranceOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Display current insurance info */}
        <div className={styles.insuranceInfo}>
          <h3>Your Insurance Coverage</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Plan:</span>
              <span className={styles.infoValue}>
                {safeProfile.insuranceCarrier || 'Not specified'} - {safeProfile.planName || 'N/A'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Deductible:</span>
              <span className={styles.infoValue}>
                {formatCurrency(effectiveDeductible)}
                {effectiveDeductibleMet > 0 &&
                  ` (${formatCurrency(effectiveDeductibleMet)} met)`
                }
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Out-of-Pocket Max:</span>
              <span className={styles.infoValue}>
                {formatCurrency(effectiveOutOfPocketMax)}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Coinsurance:</span>
              <span className={styles.infoValue}>{effectiveCoinsurance}%</span>
            </div>
            {safeProfile.coverageLimit && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Fertility Coverage Limit:</span>
                <span className={styles.infoValue}>
                  {formatCurrency(safeProfile.coverageLimit)}
                </span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            ⚠️ {error}
          </div>
        )}

        <button
          className={styles.predictButton}
          onClick={predictCosts}
          disabled={predicting}
        >
          {predicting ? '🔄 Calculating Costs...' : '💰 Calculate Treatment Costs'}
        </button>
      </div>

      {/* Results */}
      {predictions && (
        <div className={styles.resultsContainer}>
          <div className={styles.tabContainer}>
            <button
              className={`${styles.tab} ${activeTab === 'predictions' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('predictions')}
            >
              Cost Breakdown
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'scenarios' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('scenarios')}
            >
              Scenarios & Timing
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'recommendations' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('recommendations')}
            >
              Recommendations
            </button>
          </div>

          {/* Cost Breakdown Tab */}
          {activeTab === 'predictions' && (
            <div className={styles.predictionSection}>
              <div className={styles.costSummary}>
                <div className={styles.mainCost}>
                  <h2>Estimated Treatment Cost</h2>
                  <div className={styles.costRange}>
                    <span className={styles.rangeLabel}>Range:</span>
                    <span className={styles.rangeValue}>
                      {formatCurrency(predictions.prediction.costRange.min)} - {formatCurrency(predictions.prediction.costRange.max)}
                    </span>
                  </div>
                  <div className={styles.avgCost}>
                    <span className={styles.avgLabel}>Average:</span>
                    <span className={styles.avgValue}>
                      {formatCurrency(predictions.prediction.baseCost)}
                    </span>
                  </div>
                  <div className={styles.confidence}>
                    <span className={styles.confLabel}>Confidence:</span>
                    <span className={styles.confValue}>
                      {(predictions.prediction.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className={styles.yourCost}>
                  <h2>Your Estimated Out-of-Pocket Cost</h2>
                  <div className={styles.finalCost}>
                    {formatCurrency(predictions.insuranceBreakdown.finalOutOfPocket)}
                  </div>
                  {predictions.insuranceBreakdown.exceedsCoverageLimit && (
                    <div className={styles.warning}>
                      ⚠️ This treatment exceeds your fertility coverage limit
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.breakdownDetails}>
                <h3>Cost Breakdown</h3>
                <table className={styles.breakdownTable}>
                  <tbody>
                    <tr>
                      <td>Total Treatment Cost:</td>
                      <td>{formatCurrency(predictions.insuranceBreakdown.totalCost)}</td>
                    </tr>
                    <tr>
                      <td>Your Deductible Payment:</td>
                      <td className={styles.deductible}>
                        -{formatCurrency(predictions.insuranceBreakdown.deductiblePaid)}
                      </td>
                    </tr>
                    <tr>
                      <td>Your Coinsurance ({effectiveCoinsurance}%):</td>
                      <td className={styles.coinsurance}>
                        -{formatCurrency(predictions.insuranceBreakdown.coinsurancePaid)}
                      </td>
                    </tr>
                    {predictions.insuranceBreakdown.exceedsCoverageLimit && (
                      <tr>
                        <td>Amount Exceeding Coverage Limit:</td>
                        <td className={styles.uncovered}>
                          -{formatCurrency(predictions.insuranceBreakdown.uncoveredAmount)}
                        </td>
                      </tr>
                    )}
                    <tr className={styles.insuranceRow}>
                      <td>Insurance Pays:</td>
                      <td className={styles.insurancePays}>
                        +{formatCurrency(predictions.insuranceBreakdown.insurancePays)}
                      </td>
                    </tr>
                    <tr className={styles.totalRow}>
                      <td><strong>Your Total Out-of-Pocket:</strong></td>
                      <td><strong>{formatCurrency(predictions.insuranceBreakdown.finalOutOfPocket)}</strong></td>
                    </tr>
                  </tbody>
                </table>

                <div className={styles.remainingInfo}>
                  <p>
                    💡 Remaining Deductible: {formatCurrency(predictions.insuranceBreakdown.remainingDeductible)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Scenarios Tab */}
          {activeTab === 'scenarios' && (
            <div className={styles.scenariosSection}>
              <h2>Treatment Timing & Cost Scenarios</h2>
              <p className={styles.scenarioIntro}>
                Compare different timing options to optimize your costs
              </p>

              <div className={styles.scenariosGrid}>
                {scenarios.map((scenario) => (
                  <div key={scenario.id} className={styles.scenarioCard}>
                    <div className={styles.scenarioHeader}>
                      <h3>{scenario.name}</h3>
                      {scenario.savings > 0 && (
                        <div className={styles.savingsBadge}>
                          💰 Save {formatCurrency(scenario.savings)}
                        </div>
                      )}
                    </div>

                    <p className={styles.scenarioDescription}>{scenario.description}</p>

                    <div className={styles.scenarioCosts}>
                      <div className={styles.costItem}>
                        <span>Total Cost:</span>
                        <span>{formatCurrency(scenario.totalCost)}</span>
                      </div>
                      <div className={styles.costItem}>
                        <span>Insurance Pays:</span>
                        <span className={styles.positive}>
                          {formatCurrency(scenario.insurancePays)}
                        </span>
                      </div>
                      <div className={`${styles.costItem} ${styles.highlight}`}>
                        <span><strong>Your Cost:</strong></span>
                        <span><strong>{formatCurrency(scenario.outOfPocket)}</strong></span>
                      </div>
                    </div>

                    <div className={styles.prosConsContainer}>
                      <div className={styles.prosSection}>
                        <h4>✅ Pros</h4>
                        <ul>
                          {scenario.pros.map((pro, idx) => (
                            <li key={idx}>{pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.consSection}>
                        <h4>⚠️ Cons</h4>
                        <ul>
                          {scenario.cons.map((con, idx) => (
                            <li key={idx}>{con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className={styles.recommendationsSection}>
              <h2>Cost-Saving Recommendations</h2>

              {predictions.recommendations && predictions.recommendations.length > 0 ? (
                <div className={styles.recommendationsList}>
                  {predictions.recommendations.map((rec, idx) => (
                    <div key={idx} className={styles.recommendationCard}>
                      <div className={styles.recHeader}>
                        <span className={styles.recIcon}>
                          {rec.type === 'provider' && '🏥'}
                          {rec.type === 'location' && '📍'}
                          {rec.type === 'treatment' && '💊'}
                        </span>
                        <h3>{rec.type.charAt(0).toUpperCase() + rec.type.slice(1)} Recommendation</h3>
                      </div>
                      <p className={styles.recMessage}>{rec.message}</p>
                      {rec.potential_savings > 0 && (
                        <div className={styles.potentialSavings}>
                          💰 Potential Savings: {formatCurrency(rec.potential_savings)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noRecommendations}>
                  <p>✨ You're already optimizing your costs well! No additional recommendations at this time.</p>
                </div>
              )}

              <div className={styles.additionalTips}>
                <h3>💡 General Tips for Reducing Costs</h3>
                <ul>
                  <li>Ask about multi-cycle discount packages (often 10-20% savings)</li>
                  <li>Consider timing treatments to maximize insurance benefits within your plan year</li>
                  <li>Inquire about shared-risk or refund programs</li>
                  <li>Look into medication discount programs and mail-order pharmacies</li>
                  <li>Check if your employer offers fertility benefits or reimbursement</li>
                  <li>Explore HSA/FSA options for tax-advantaged savings</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
