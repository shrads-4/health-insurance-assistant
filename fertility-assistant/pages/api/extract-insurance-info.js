import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { documentText } = req.body;

  if (!documentText) {
    return res.status(400).json({ error: 'Document text is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert at extracting insurance information from health insurance documents.
Please analyze the following insurance document text and extract the following information:

1. Insurance Carrier (company name)
2. Plan Name (specific plan identifier)
3. Deductible Amount (in dollars, individual if specified)
4. Out-of-Pocket Maximum (in dollars, individual if specified)
5. Coinsurance Percentage (the percentage the patient pays after deductible)
6. Coverage Limits for fertility/infertility treatments (in dollars or cycles)

IMPORTANT INSTRUCTIONS:
- Extract only the information that is clearly stated in the document
- For dollar amounts, return only the number without $ or commas (e.g., "5000" not "$5,000")
- For percentages, return only the number without % (e.g., "20" not "20%")
- If information is not found or unclear, use null
- For coverage limits, look for specific fertility/infertility treatment limits
- If there are different amounts for in-network vs out-of-network, prefer in-network values

Return the information in the following JSON format only (no additional text):
{
  "insuranceCarrier": "carrier name or null",
  "planName": "plan name or null",
  "deductible": number or null,
  "outOfPocketMax": number or null,
  "coinsurance": number or null,
  "coverageLimit": number or null,
  "notes": "any important notes about fertility coverage or null"
}

Document text:
${documentText.substring(0, 50000)}
`;

    console.log('Sending insurance extraction request to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    console.log('Raw Gemini response:', text);

    // Parse the JSON response
    let extractedInfo;
    try {
      extractedInfo = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      console.error('Response text:', text);

      // Return a fallback response
      return res.status(200).json({
        insuranceCarrier: null,
        planName: null,
        deductible: null,
        outOfPocketMax: null,
        coinsurance: null,
        coverageLimit: null,
        notes: 'Failed to automatically extract information. Please review your document manually.',
        rawResponse: text
      });
    }

    // Validate and sanitize the extracted data
    const sanitizedInfo = {
      insuranceCarrier: extractedInfo.insuranceCarrier || null,
      planName: extractedInfo.planName || null,
      deductible: parseFloat(extractedInfo.deductible) || null,
      outOfPocketMax: parseFloat(extractedInfo.outOfPocketMax) || null,
      coinsurance: parseFloat(extractedInfo.coinsurance) || null,
      coverageLimit: parseFloat(extractedInfo.coverageLimit) || null,
      notes: extractedInfo.notes || null
    };

    console.log('Extracted insurance information:', sanitizedInfo);
    return res.status(200).json(sanitizedInfo);

  } catch (error) {
    console.error('Gemini API error:', error);
    return res.status(500).json({
      error: 'Failed to extract insurance information',
      details: error.message
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};
