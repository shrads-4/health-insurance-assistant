// Simple JS fallback model in case the Python API is unavailable or returns an error
function buildFallbackPrediction({ treatmentType, providerType, state, age, insuranceType }) {
  // Rough base costs (national averages)
  const BASE_COSTS = {
    IVF: 12000,
    IUI: 1500,
    Egg_Freezing: 8000,
    Consultation: 350,
    Testing: 1200,
    Medication_Only: 2500,
    IVF_with_ICSI: 15000,
    IVF_with_PGT: 18000,
    Donor_Egg_IVF: 25000,
    Donor_Sperm_IUI: 2000
  };

  // State multipliers – we primarily support CA, NY, TX in the UI
  const STATE_MULTIPLIERS = {
    CA: 1.25,
    NY: 1.3,
    TX: 1.05
  };

  // Provider multipliers
  const PROVIDER_MULTIPLIERS = {
    Academic_Center: 0.95,
    Private_Clinic: 1.0,
    Hospital_Based: 1.05,
    Community_Clinic: 0.9
  };

  const base = BASE_COSTS[treatmentType] || 10000;
  const stateMult = STATE_MULTIPLIERS[state] || 1.0;
  const providerMult = PROVIDER_MULTIPLIERS[providerType] || 1.0;

  // Mild age effect: +1% cost per year above 35, capped
  const ageNum = Number(age) || 35;
  const ageMult = 1 + Math.min(Math.max(ageNum - 35, 0), 10) * 0.01;

  const mean = base * stateMult * providerMult * ageMult;
  const min = mean * 0.8;
  const max = mean * 1.2;

  return {
    predicted_cost_range: {
      min,
      mean,
      max
    },
    confidence_score: 0.6,
    recommendations: []
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      treatmentType,
      providerType,
      state,
      age,
      insuranceType,
      deductible,
      outOfPocketMax,
      coinsurance,
      deductibleMet,
      coverageLimit
    } = req.body;

    // Validate required fields
    if (!treatmentType || !providerType || !state) {
      return res.status(400).json({ 
        error: 'Missing required fields: treatmentType, providerType, state' 
      });
    }

    // Call Python model API – fall back to simple JS model on error
    const pythonApiUrl = process.env.FERTILITY_MODEL_API_URL || 'http://localhost:5000';
    const predictUrl = `${pythonApiUrl}/predict`;
    
    console.log('Calling Python API:', predictUrl);
    console.log('Request data:', {
      treatment_type: treatmentType,
      provider_type: providerType,
      state: state,
      age: age || 35,
      insurance_type: insuranceType || 'PPO'
    });
    
    let prediction;
    try {
      const modelResponse = await fetch(predictUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          treatment_type: treatmentType,
          provider_type: providerType,
          state: state,
          age: age || 35,
          insurance_type: insuranceType || 'PPO'
        })
      });

      if (!modelResponse.ok) {
        const errorText = await modelResponse.text();
        console.error('Python API error:', errorText);
        // Fall back instead of throwing
        prediction = buildFallbackPrediction({ treatmentType, providerType, state, age, insuranceType });
      } else {
        prediction = await modelResponse.json();
        console.log('Prediction received:', prediction);
      }
    } catch (pythonError) {
      console.error('Python API request failed, using fallback model:', pythonError);
      prediction = buildFallbackPrediction({ treatmentType, providerType, state, age, insuranceType });
    }

    // Calculate insurance coverage
    const baseCost = prediction.predicted_cost_range.mean;
    const minCost = prediction.predicted_cost_range.min;
    const maxCost = prediction.predicted_cost_range.max;

    // Apply insurance logic
    const remainingDeductible = Math.max(0, (deductible || 0) - (deductibleMet || 0));
    
    // Cost after deductible
    const costAfterDeductible = Math.max(0, baseCost - remainingDeductible);
    const deductiblePaid = Math.min(baseCost, remainingDeductible);
    
    // Apply coinsurance
    const coinsurancePaid = (costAfterDeductible * (coinsurance || 20)) / 100;
    const insurancePays = costAfterDeductible - coinsurancePaid;
    
    // Apply out-of-pocket maximum
    const totalOutOfPocket = Math.min(
      deductiblePaid + coinsurancePaid,
      outOfPocketMax || Infinity
    );
    
    // Check coverage limit
    const exceedsCoverageLimit = coverageLimit && baseCost > coverageLimit;
    const uncoveredAmount = exceedsCoverageLimit ? baseCost - coverageLimit : 0;
    const finalOutOfPocket = exceedsCoverageLimit 
      ? uncoveredAmount + Math.min(deductiblePaid + coinsurancePaid, outOfPocketMax || Infinity)
      : totalOutOfPocket;

    return res.status(200).json({
      prediction: {
        baseCost,
        costRange: {
          min: minCost,
          max: maxCost
        },
        confidence: prediction.confidence_score
      },
      insuranceBreakdown: {
        totalCost: baseCost,
        deductiblePaid,
        coinsurancePaid,
        insurancePays,
        totalOutOfPocket,
        remainingDeductible: Math.max(0, remainingDeductible - deductiblePaid),
        exceedsCoverageLimit,
        uncoveredAmount,
        finalOutOfPocket
      },
      recommendations: prediction.recommendations || [],
      metadata: {
        treatmentType,
        providerType,
        state,
        insuranceType
      }
    });

  } catch (error) {
    console.error('Fertility cost prediction error:', error);
    return res.status(500).json({ 
      error: 'Failed to predict costs',
      message: error.message 
    });
  }
}
