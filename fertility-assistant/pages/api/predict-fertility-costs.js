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

    // Call Python model API
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
      throw new Error(`Model prediction failed: ${errorText}`);
    }

    const prediction = await modelResponse.json();
    console.log('Prediction received:', prediction);

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
