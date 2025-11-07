import { useState } from 'react';
import styles from '../styles/CoverageDecoder.module.css';

export default function CoverageDecoder() {
  const [planText, setPlanText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!planText.trim()) {
      alert('Please enter your insurance plan information');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/coverage-decoder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planText }),
      });
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      setResult('Error analyzing coverage. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputSection}>
        <label htmlFor="planText">Paste your insurance plan details or benefits summary:</label>
        <textarea
          id="planText"
          className={styles.textarea}
          value={planText}
          onChange={(e) => setPlanText(e.target.value)}
          placeholder="Example: Plan covers IVF up to $15,000 lifetime max, requires pre-authorization, 80/20 coinsurance after deductible..."
          rows={8}
        />
        <button 
          className={styles.button} 
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Decode My Coverage'}
        </button>
      </div>

      {result && (
        <div className={styles.resultSection}>
          <h3>Plain English Summary:</h3>
          <div className={styles.result}>{result}</div>
        </div>
      )}
    </div>
  );
}
