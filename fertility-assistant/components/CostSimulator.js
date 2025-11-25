import { useState } from 'react';
import styles from '../styles/CostSimulator.module.css';

export default function CostSimulator() {
  const [inputs, setInputs] = useState({
    deductible: 2000,
    deductibleMet: 0,
    outOfPocketMax: 6000,
    coinsurance: 20,
    cycleCount: 1,
    cycleCost: 12000,
    treatmentType: 'ivf',
    startTiming: 'now'
  });
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('scenarios');

  // Provider comparison data
  const providerData = [
    {
      id: 1,
      name: 'Fertility Center of Excellence',
      network: 'in-network',
      rating: 4.8,
      location: 'San Francisco, CA',
      distance: '2.3 miles',
      costs: {
        ivf: 12000,
        iui: 1500,
        consultation: 350,
        testing: 1200
      },
      successRates: {
        ivf: '65%',
        iui: '15%'
      },
      waitTime: '2-3 weeks'
    },
    {
      id: 2,
      name: 'Bay Area Reproductive Health',
      network: 'in-network',
      rating: 4.6,
      location: 'Palo Alto, CA',
      distance: '8.1 miles',
      costs: {
        ivf: 11500,
        iui: 1400,
        consultation: 300,
        testing: 1100
      },
      successRates: {
        ivf: '62%',
        iui: '14%'
      },
      waitTime: '1-2 weeks'
    },
    {
      id: 3,
      name: 'Pacific Fertility Institute',
      network: 'out-of-network',
      rating: 4.9,
      location: 'San Jose, CA',
      distance: '15.2 miles',
      costs: {
        ivf: 15000,
        iui: 2000,
        consultation: 450,
        testing: 1500
      },
      successRates: {
        ivf: '70%',
        iui: '18%'
      },
      waitTime: '3-4 weeks'
    }
  ];

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setInputs({ ...inputs, [e.target.name]: value });
  };

  const calculateScenario = (scenarioInputs) => {
    const { deductible, deductibleMet, outOfPocketMax, coinsurance, cycleCount, cycleCost, provider } = scenarioInputs;
    
    const remainingDeductible = Math.max(0, deductible - deductibleMet);
    const totalCycleCost = cycleCost * cycleCount;
    
    // Apply deductible first
    let costAfterDeductible = Math.max(0, totalCycleCost - remainingDeductible);
    let deductiblePaid = Math.min(totalCycleCost, remainingDeductible);
    
    // Apply coinsurance to remaining amount
    let coinsurancePaid = (costAfterDeductible * coinsurance) / 100;
    
    // Calculate total out of pocket before max
    let totalBeforeMax = deductiblePaid + coinsurancePaid;
    
    // Apply out-of-pocket maximum
    let totalOutOfPocket = Math.min(totalBeforeMax, outOfPocketMax);
    let outOfPocketMaxSavings = totalBeforeMax - totalOutOfPocket;
    
    return {
      totalCycleCost,
      deductiblePaid,
      coinsurancePaid,
      totalOutOfPocket,
      outOfPocketMaxSavings,
      provider: provider || null
    };
  };

  const generateScenarios = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const isNearYearEnd = currentMonth >= 10; // November or December
    
    const scenarios = [];
    
    // Scenario 1: Start Now
    const nowScenario = calculateScenario({
      ...inputs,
      cycleCost: inputs.cycleCost,
      provider: null
    });
    
    scenarios.push({
      id: 'now',
      name: 'Start Now',
      description: `Begin treatment immediately with current deductible status`,
      timing: 'immediate',
      ...nowScenario,
      pros: [
        'No waiting time',
        'Begin treatment immediately',
        'Current provider availability'
      ],
      cons: isNearYearEnd ? [
        'Limited time before deductible resets',
        'May not maximize insurance benefits'
      ] : [
        'Using current year deductible'
      ]
    });
    
    // Scenario 2: Wait Until January (if applicable)
    if (isNearYearEnd) {
      const januaryScenario = calculateScenario({
        ...inputs,
        deductibleMet: 0, // Fresh year
        cycleCost: inputs.cycleCost
      });
      
      const savings = nowScenario.totalOutOfPocket - januaryScenario.totalOutOfPocket;
      
      scenarios.push({
        id: 'january',
        name: 'Wait Until January',
        description: 'Start treatment after deductible resets',
        timing: 'january-reset',
        ...januaryScenario,
        savings: savings,
        pros: [
          'Fresh deductible year',
          `Potential savings: $${savings.toLocaleString()}`,
          'Full year to utilize benefits'
        ],
        cons: [
          'Delay in treatment',
          'Potential provider scheduling changes',
          'Age factor considerations'
        ]
      });
    }
    
    // Scenario 3: Multiple Cycles
    if (inputs.cycleCount === 1) {
      const multipleCyclesScenario = calculateScenario({
        ...inputs,
        cycleCount: 2,
        cycleCost: inputs.cycleCost
      });
      
      scenarios.push({
        id: 'multiple',
        name: 'Plan for 2 Cycles',
        description: 'Budget for potential multiple treatment cycles',
        timing: 'multiple-cycles',
        ...multipleCyclesScenario,
        pros: [
          'Better financial planning',
          'Maximize out-of-pocket benefits',
          'Higher success probability'
        ],
        cons: [
          'Higher upfront costs',
          'Extended treatment timeline'
        ]
      });
    }
    
    return scenarios;
  };

  const calculateCosts = () => {
    const scenarios = generateScenarios();
    setResults({ scenarios });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateProviderCosts = (provider) => {
    const treatmentCost = provider.costs[inputs.treatmentType] || inputs.cycleCost;
    const networkMultiplier = provider.network === 'in-network' ? 1 : 1.5;
    const adjustedCost = treatmentCost * networkMultiplier;
    
    return calculateScenario({
      ...inputs,
      cycleCost: adjustedCost,
      provider: provider
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <h3>Treatment & Insurance Information</h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="treatmentType">Treatment Type</label>
            <select
              id="treatmentType"
              name="treatmentType"
              value={inputs.treatmentType}
              onChange={handleChange}
            >
              <option value="ivf">IVF Cycle</option>
              <option value="iui">IUI Cycle</option>
              <option value="consultation">Consultation</option>
              <option value="testing">Testing Panel</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="deductible">Annual Deductible ($)</label>
            <input
              type="number"
              id="deductible"
              name="deductible"
              value={inputs.deductible}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="deductibleMet">Deductible Already Met ($)</label>
            <input
              type="number"
              id="deductibleMet"
              name="deductibleMet"
              value={inputs.deductibleMet}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="outOfPocketMax">Out-of-Pocket Maximum ($)</label>
            <input
              type="number"
              id="outOfPocketMax"
              name="outOfPocketMax"
              value={inputs.outOfPocketMax}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="coinsurance">Your Coinsurance (%)</label>
            <input
              type="number"
              id="coinsurance"
              name="coinsurance"
              value={inputs.coinsurance}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cycleCost">Estimated Cost Per Cycle ($)</label>
            <input
              type="number"
              id="cycleCost"
              name="cycleCost"
              value={inputs.cycleCost}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cycleCount">Number of Cycles</label>
            <input
              type="number"
              id="cycleCount"
              name="cycleCount"
              value={inputs.cycleCount}
              onChange={handleChange}
              min="1"
              max="5"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="startTiming">Preferred Start Timing</label>
            <select
              id="startTiming"
              name="startTiming"
              value={inputs.startTiming}
              onChange={handleChange}
            >
              <option value="now">Start Immediately</option>
              <option value="january">Wait Until January</option>
              <option value="flexible">Flexible Timing</option>
            </select>
          </div>
        </div>

        <button className={styles.button} onClick={calculateCosts}>
          Compare Scenarios & Providers
        </button>
      </div>

      {results && (
        <div className={styles.resultsContainer}>
          <div className={styles.tabContainer}>
            <button 
              className={`${styles.tab} ${activeTab === 'scenarios' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('scenarios')}
            >
              Timing Scenarios
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'providers' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('providers')}
            >
              Provider Comparison
            </button>
          </div>

          {activeTab === 'scenarios' && (
            <div className={styles.scenariosSection}>
              <h3>Cost Scenarios & Timing Optimization</h3>
              <div className={styles.scenariosGrid}>
                {results.scenarios.map((scenario) => (
                  <div key={scenario.id} className={styles.scenarioCard}>
                    <div className={styles.scenarioHeader}>
                      <h4>{scenario.name}</h4>
                      {scenario.savings > 0 && (
                        <div className={styles.savingsBadge}>
                          Save {formatCurrency(scenario.savings)}
                        </div>
                      )}
                    </div>
                    <p className={styles.scenarioDescription}>{scenario.description}</p>
                    
                    <div className={styles.costBreakdown}>
                      <div className={styles.costRow}>
                        <span>Total Treatment Cost:</span>
                        <span>{formatCurrency(scenario.totalCycleCost)}</span>
                      </div>
                      <div className={styles.costRow}>
                        <span>Deductible Applied:</span>
                        <span>{formatCurrency(scenario.deductiblePaid)}</span>
                      </div>
                      <div className={styles.costRow}>
                        <span>Coinsurance:</span>
                        <span>{formatCurrency(scenario.coinsurancePaid)}</span>
                      </div>
                      {scenario.outOfPocketMaxSavings > 0 && (
                        <div className={styles.costRow}>
                          <span>Out-of-Pocket Max Savings:</span>
                          <span className={styles.savings}>-{formatCurrency(scenario.outOfPocketMaxSavings)}</span>
                        </div>
                      )}
                      <div className={`${styles.costRow} ${styles.totalRow}`}>
                        <span>Your Total Cost:</span>
                        <span>{formatCurrency(scenario.totalOutOfPocket)}</span>
                      </div>
                    </div>

                    <div className={styles.prosConsContainer}>
                      <div className={styles.prosSection}>
                        <h5>Pros:</h5>
                        <ul>
                          {scenario.pros.map((pro, index) => (
                            <li key={index}>✅ {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.consSection}>
                        <h5>Cons:</h5>
                        <ul>
                          {scenario.cons.map((con, index) => (
                            <li key={index}>⚠️ {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'providers' && (
            <div className={styles.providersSection}>
              <h3>Provider Cost Comparison</h3>
              <div className={styles.providersGrid}>
                {providerData.map((provider) => {
                  const providerCosts = calculateProviderCosts(provider);
                  return (
                    <div key={provider.id} className={styles.providerCard}>
                      <div className={styles.providerHeader}>
                        <h4>{provider.name}</h4>
                        <div className={styles.providerBadges}>
                          <span className={`${styles.networkBadge} ${styles[provider.network.replace('-', '')]}`}>
                            {provider.network === 'in-network' ? '✅ In-Network' : '⚠️ Out-of-Network'}
                          </span>
                          <span className={styles.ratingBadge}>⭐ {provider.rating}</span>
                        </div>
                      </div>
                      
                      <div className={styles.providerDetails}>
                        <p><strong>Location:</strong> {provider.location}</p>
                        <p><strong>Distance:</strong> {provider.distance}</p>
                        <p><strong>Wait Time:</strong> {provider.waitTime}</p>
                        <p><strong>Success Rate ({inputs.treatmentType.toUpperCase()}):</strong> {provider.successRates[inputs.treatmentType] || 'N/A'}</p>
                      </div>

                      <div className={styles.providerCosts}>
                        <div className={styles.costRow}>
                          <span>Base Treatment Cost:</span>
                          <span>{formatCurrency(provider.costs[inputs.treatmentType] || inputs.cycleCost)}</span>
                        </div>
                        {provider.network === 'out-of-network' && (
                          <div className={styles.costRow}>
                            <span>Out-of-Network Adjustment:</span>
                            <span className={styles.warning}>+50%</span>
                          </div>
                        )}
                        <div className={`${styles.costRow} ${styles.totalRow}`}>
                          <span>Your Total Out-of-Pocket:</span>
                          <span>{formatCurrency(providerCosts.totalOutOfPocket)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
