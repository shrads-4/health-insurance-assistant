import formidable from 'formidable';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the uploaded file
    const form = formidable({});
    const [fields, files] = await form.parse(req);

    const file = files.file[0];
    const fileBytes = fs.readFileSync(file.filepath);

    // Determine mime type
    let mimeType = file.mimetype;
    if (!mimeType || mimeType === 'application/octet-stream') {
      const ext = file.originalFilename.toLowerCase().split('.').pop();
      const mimeTypes = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'pdf': 'application/pdf'
      };
      mimeType = mimeTypes[ext] || 'image/jpeg';
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (!validTypes.includes(mimeType)) {
      fs.unlinkSync(file.filepath);
      return res.status(400).json({
        error: 'Invalid file type. Please upload an image (JPEG, PNG, WebP) or PDF file.'
      });
    }

    // Initialize Gemini client
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Create the prompt for extracting insurance information
    const prompt = `Analyze this insurance ${mimeType === 'application/pdf' ? 'document (Summary of Benefits and Coverage or insurance card)' : 'card image'} and extract the following information in JSON format:
{
  "insuranceCarrier": "The insurance company name (e.g., Aetna, Blue Cross, etc.)",
  "planName": "The plan type/name if available",
  "memberId": "Member ID or policy number",
  "groupNumber": "Group number if available",
  "deductible": {
    "individual": "Individual deductible amount (number only, no $ or commas)",
    "family": "Family deductible amount if shown (number only, no $ or commas)"
  },
  "outOfPocketMax": {
    "individual": "Individual out-of-pocket maximum (number only, no $ or commas)",
    "family": "Family out-of-pocket maximum if shown (number only, no $ or commas)"
  },
  "phoneNumbers": {
    "claims": "Claims phone number",
    "customerService": "Customer service or general phone number",
    "preAuth": "Pre-authorization or pre-certification phone number if available"
  },
  "additionalInfo": "Any other relevant information like coverage details, rx info, etc."
}

Important:
- Extract only the information that is visible on the card
- For monetary values, provide only numbers without $ or commas
- If a field is not visible, use null
- Be precise with the insurance carrier name
- Look for deductibles labeled as "In Network" or similar`;

    // Call Gemini API with file (image or PDF) and prompt
    const filePart = {
      inlineData: {
        data: fileBytes.toString('base64'),
        mimeType: mimeType,
      },
    };

    const response = await model.generateContent([prompt, filePart]);

    // Clean up temp file
    fs.unlinkSync(file.filepath);

    // Extract the response text
    const responseText = response.response.text();

    // Parse JSON from response (Gemini often wraps JSON in markdown code blocks)
    let extractedData;
    try {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) ||
                       responseText.match(/```\n([\s\S]*?)\n```/);

      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[1]);
      } else {
        extractedData = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', responseText);
      return res.status(500).json({
        error: 'Failed to parse extracted data',
        rawResponse: responseText
      });
    }

    return res.status(200).json({
      success: true,
      data: extractedData,
      fileName: file.originalFilename,
    });

  } catch (error) {
    console.error('Insurance card extraction error:', error);
    return res.status(500).json({
      error: 'Failed to extract insurance information',
      details: error.message
    });
  }
}
