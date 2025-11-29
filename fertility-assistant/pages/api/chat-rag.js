import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, context, conversationHistory = [] } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
        const systemPrompt = `You are a helpful fertility insurance assistant
        named Baby Yoda. Your goal is to help users understand their insurance
        benefits, find cost-saving opportunities, and navigate fertility treatment
        coverage.
        Key principles:
        - Keep responses concise and to-the-point (2-3 short paragraphs max)
        - Explain insurance terms in plain English
        - Highlight cost-saving strategies (timing, in-network providers, pre-authorization, and so on)
        - Point out coverage details that might be overlooked
        - Be empathetic and supportive about fertility journeys
        - If you don't know something, say so clearly
        - Avoid repetition and unnecessary elaboration
        ${context ? `\nRelevant Insurance Plan Information:\n${context}\n` : ''}
        Previous conversation:
        ${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
        User: ${message}
        Assistant:`;

        console.log('Sending request to Gemini...');
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        console.log('Gemini response received successfully');
        return res.status(200).json({ 
        response: text,
        timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Gemini API error:', error);
        console.error('Error details:', {
            message: error.message,
            status: error.status,
            statusText: error.statusText
        });
        return res.status(500).json({
            error: 'Failed to generate response',
            details: error.message,
            hint: error.status === 400 ? 'Check API key validity' : 'API request failed'
        });
    }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};