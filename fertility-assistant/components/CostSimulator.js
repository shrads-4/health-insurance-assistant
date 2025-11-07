import { useState } from 'react';
import styles from '../styles/CostSimulator.module.css';

export default function CostSimulator() {
  const [inputs, setInputs] = useState({
    deductible: 2000,
    deductibleMet: 0,
    coinsurance: 20,
    cycleCount: 1,
    cycleCost: 12000,
  });
  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: Number(e.target.value) });
  };

  const calculateCosts = () => {
    const { deductible, deductibleMet, coinsurance, cycleCount, cycleCost } = inputs;
    const remainingDeductible = Math.max(0, deductible - deductibleMet);
    const totalCycleCost = cycleCost * cycleCount;
    
    // Apply deductible first
    let costAfterDeductible = Math.max(0, totalCycleCost - remainingDeductible);
    let deductiblePaid = Math.min(totalCycleCost, remainingDeductible);
    
    // Apply coinsurance to remaining amount
    let coinsurancePaid = (costAfterDeductible * coinsurance) / 100;
    
    // Total out of pocket
    let totalOutOfPocket = deductiblePaid + coinsurancePaid;
    
    setResults({
      totalCycleCost,
      deductiblePaid,
      coinsurancePaid,
      totalOutOfPocket,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <h3>Enter Your Information</h3>
        <div className={styles.formGrid}>
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
            <label htmlFor="cycleCost">Cost Per Cycle ($)</label>
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
            />
          </div>
        </div>

        <button className={styles.button} onClick={calculateCosts}>
          Calculate My Costs
        </button>
      </div>

      {results && (
        <div className={styles.resultsSection}>
          <h3>Cost Breakdown</h3>
          
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Treatment Cost:</span>
            <span className={styles.resultValue}>${results.totalCycleCost.toLocaleString()}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Deductible You'll Pay:</span>
            <span className={styles.resultValue}>${results.deductiblePaid.toLocaleString()}</span>
          </div>

          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Coinsurance You'll Pay:</span>
            <span className={styles.resultValue}>${results.coinsurancePaid.toLocaleString()}</span>
          </div>

          <div className={`${styles.resultItem} ${styles.totalCost}`}>
            <span className={styles.resultLabel}>Your Total Out-of-Pocket:</span>
            <span className={styles.resultValue}>${results.totalOutOfPocket.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
