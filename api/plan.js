// Serverless endpoint for Vercel deployment
// Connects to Google Gemini API securely when GEMINI_API_KEY environment variable is present.
// If GEMINI_API_KEY is not set or errors occur, returns isDemo: true so the client uses the rich fallback engine.

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Please send a POST request.' });
  }

  try {
    const { destination, budget, days, interests } = req.body || {};

    if (!destination || !days || !budget) {
      return res.status(400).json({ error: 'Destination, budget, and days are required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Graceful fallback when no key is configured
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(200).json({
        isDemo: true,
        source: 'demo-fallback',
        message: 'No GEMINI_API_KEY configured in environment. Using demo itinerary fallback.'
      });
    }

    const interestStr = Array.isArray(interests) && interests.length > 0 
      ? interests.join(', ') 
      : 'Heritage, Food, Local culture';

    const prompt = `You are EXPLORE AI, an expert travel planner for Indian destinations.
Create a detailed ${days}-day itinerary for ${destination} with an estimated budget of INR ${budget}.
Traveler interests: ${interestStr}.
Format your response as a valid JSON object with:
{
  "summary": "A concise 2-sentence experiential trip summary",
  "estimatedBudgetTotal": "₹${budget}",
  "budgetBreakdown": [
    {"category": "Accommodation", "amount": "₹${Math.round(budget * 0.38)}", "tip": "Budget to mid-range stays"},
    {"category": "Food & Dining", "amount": "₹${Math.round(budget * 0.25)}", "tip": "Authentic regional eateries"},
    {"category": "Local Transit", "amount": "₹${Math.round(budget * 0.15)}", "tip": "Autos, e-rickshaws, metro"},
    {"category": "Activities & Entry", "amount": "₹${Math.round(budget * 0.12)}", "tip": "Monuments and guided walks"},
    {"category": "Buffer & Miscellaneous", "amount": "₹${Math.round(budget * 0.10)}", "tip": "Contingency reserve"}
  ],
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "morning": "Morning activity",
      "afternoon": "Afternoon activity",
      "evening": "Evening activity",
      "practicalTip": "Practical tip for the day"
    }
  ],
  "disclaimer": "Sample estimate only. Always verify ticket prices, hours, and transport schedules with official sources."
}
Only output pure JSON.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      console.warn('Gemini API call failed, falling back to demo engine.');
      return res.status(200).json({
        isDemo: true,
        source: 'demo-fallback-api-error',
        message: 'Gemini API not reachable. Using demo itinerary fallback.'
      });
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidateText) {
      try {
        const parsed = JSON.parse(candidateText);
        return res.status(200).json({
          isDemo: false,
          source: 'gemini-1.5-flash',
          plan: parsed
        });
      } catch (parseError) {
        return res.status(200).json({
          isDemo: true,
          source: 'demo-fallback-parse-error'
        });
      }
    }

    return res.status(200).json({
      isDemo: true,
      source: 'demo-fallback-empty'
    });
  } catch (error) {
    console.error('Error in /api/plan:', error);
    return res.status(200).json({
      isDemo: true,
      source: 'demo-fallback-server-exception',
      error: error.message
    });
  }
}
