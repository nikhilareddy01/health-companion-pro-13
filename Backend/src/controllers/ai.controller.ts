import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

// Initialize the Google Gen AI client if API key is present
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY') {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn('[Backend] WARNING: GEMINI_API_KEY is missing or set to placeholder. Running in MOCK mode.');
}

// 1. Controller to Parse prescription image
export const parsePrescription = async (req: Request, res: Response) => {
  try {
    const { image, mimeType } = req.body;

    if (!image || !mimeType) {
      return res.status(400).json({ error: 'image (base64 string) and mimeType are required' });
    }

    // If running in Mock Mode
    if (!ai) {
      console.log('[Backend] GEMINI_API_KEY not set. Returning mock parsed prescription.');
      return res.status(200).json({
        mocked: true,
        medicines: [
          {
            name: 'Metformin',
            dose: '500mg',
            time: 'Morning',
            instructions: 'Take 1 tablet with breakfast'
          },
          {
            name: 'Vitamin D3',
            dose: '1000 IU',
            time: 'Afternoon',
            instructions: 'Take 1 tablet after lunch'
          },
          {
            name: 'Atorvastatin',
            time: 'Night',
            dose: '10mg',
            instructions: 'Take 1 tablet before bed'
          }
        ]
      });
    }

    // Clean base64 string if it contains prefix
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    const prescriptionSchema = {
      type: "OBJECT",
      properties: {
        medicines: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              dose: { type: "STRING" },
              time: { type: "STRING", enum: ["Morning", "Afternoon", "Night"] },
              instructions: { type: "STRING" }
            },
            required: ["name", "dose", "time", "instructions"]
          }
        }
      },
      required: ["medicines"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        },
        {
          text: `You are an expert pharmacist and doctor. Read this prescription image carefully and extract all medication details.
          For each medicine, identify:
          1. Name of the medicine
          2. Dosage (e.g. 500mg, 1 tablet, 10ml)
          3. Time of day: Classify as either "Morning", "Afternoon", or "Night" (e.g. once daily in morning -> Morning, twice daily -> Morning & Night (create separate objects), at bed -> Night).
          4. Specific instructions (e.g. take with food, take on empty stomach).
          
          Return the data in a strict structured JSON matching the schema.`
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: prescriptionSchema,
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Received empty response from Gemini');
    }

    const parsedData = JSON.parse(responseText);
    res.status(200).json(parsedData);
  } catch (error: any) {
    console.error('[Backend] Error parsing prescription:', error);
    res.status(500).json({ error: error.message || 'Error occurred while parsing prescription' });
  }
};

// 2. Controller to Generate personalized health recommendations
export const getHealthRecommendations = async (req: Request, res: Response) => {
  try {
    const { profileDetails, medicines, goals } = req.body;

    // If running in Mock Mode
    if (!ai) {
      console.log('[Backend] GEMINI_API_KEY not set. Returning mock health recommendations.');
      return res.status(200).json({
        mocked: true,
        recommendation: "Your blood sugar trend is stable. Keep a low-glycemic breakfast and a 20-minute walk after meals today to maintain optimal levels.",
        lifestyleTips: [
          "Take a 15-20 minute brisk walk after your main meals to improve insulin sensitivity.",
          "Keep a consistent sleep schedule to support hormonal balance.",
          "Set water reminders to ensure you drink at least 2.5L throughout the day."
        ],
        dietPlan: {
          breakfast: "Oats with chia seeds, handful of berries, and unsweetened almond milk.",
          lunch: "Grilled chicken or tofu salad with mixed greens, olive oil dressing, and quinoa.",
          dinner: "Lentil soup or baked salmon served with steamed broccoli and brown rice."
        },
        warnings: [
          "Monitor for any dizziness or fatigue if you start new medications.",
          "Avoid skipping meals while on Metformin to prevent potential hypoglycemia.",
          "Keep sugar tablets or fruit juice nearby in case of sudden drops in blood sugar."
        ]
      });
    }

    const recommendationSchema = {
      type: "OBJECT",
      properties: {
        recommendation: { type: "STRING" },
        lifestyleTips: {
          type: "ARRAY",
          items: { type: "STRING" }
        },
        dietPlan: {
          type: "OBJECT",
          properties: {
            breakfast: { type: "STRING" },
            lunch: { type: "STRING" },
            dinner: { type: "STRING" }
          },
          required: ["breakfast", "lunch", "dinner"]
        },
        warnings: {
          type: "ARRAY",
          items: { type: "STRING" }
        }
      },
      required: ["recommendation", "lifestyleTips", "dietPlan", "warnings"]
    };

    const prompt = `You are an expert personalized health assistant. Analyze the user's current medical state, medication schedule, and fitness goals to provide a comprehensive, clinical, yet encouraging health plan for today.
    
    Here is the user's data:
    1. Health details & profile: ${JSON.stringify(profileDetails || {})}
    2. Current medicines schedule: ${JSON.stringify(medicines || [])}
    3. User's health goals: ${JSON.stringify(goals || [])}
    
    Based on this information, provide:
    1. A single-sentence main summary/recommendation for today.
    2. A list of 3 actionable lifestyle tips tailored to their goals and conditions (e.g. exercise, hydration, stress management).
    3. A customized meal plan (breakfast, lunch, dinner) aligned with their health profile (e.g., low glycemic if diabetes is mentioned, low sodium if hypertension is mentioned).
    4. A list of critical safety warnings or drug interaction reminders if any.
    
    Ensure the response matches the JSON schema strictly.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: recommendationSchema,
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Received empty response from Gemini');
    }

    const parsedData = JSON.parse(responseText);
    res.status(200).json(parsedData);
  } catch (error: any) {
    console.error('[Backend] Error generating recommendations:', error);
    res.status(500).json({ error: error.message || 'Error occurred while generating recommendations' });
  }
};

// 3. Controller to handle conversational AI Health Chat
export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const { history } = req.body;

    if (!history || !Array.isArray(history)) {
      return res.status(400).json({ error: 'history array is required' });
    }

    // Fallback if no AI client is initialized
    if (!ai) {
      console.log('[Backend] GEMINI_API_KEY not set. Returning mock chatbot reply.');
      const lastMessage = history[history.length - 1]?.parts?.[0]?.text?.toLowerCase() || '';
      let reply = "I hear you. Tell me more about what symptoms you are experiencing and how you feel today?";
      
      if (lastMessage.includes('headache') || lastMessage.includes('fever')) {
        reply = "For a fever or headache, please get plenty of bed rest and drink water. I recommend soft food diets like a warm vegetable or chicken broth, herbal teas (ginger or peppermint), and a bit of toast. *Disclaimer: I am an AI companion, not a doctor. If your temperature exceeds 103°F or if you have a stiff neck, seek medical attention immediately.*";
      } else if (lastMessage.includes('stomach') || lastMessage.includes('nausea') || lastMessage.includes('vomit') || lastMessage.includes('pain')) {
        reply = "To settle your stomach, stick to the BRAT diet (Bananas, Rice, Applesauce, Toast). Sip warm ginger water or peppermint tea slowly. Avoid fatty, sugary, or dairy items for now. *Disclaimer: I am an AI virtual companion. Please consult a health professional if you have severe or persistent stomach pain.*";
      } else if (lastMessage.includes('throat') || lastMessage.includes('cough') || lastMessage.includes('cold')) {
        reply = "To soothe a sore throat or cough, try warm honey water, hot broths, or decaf tea. Steer clear of cold drinks and dry, scratchy foods. *Disclaimer: If you develop any chest congestion or breathing difficulties, contact a doctor right away.*";
      } else if (lastMessage.includes('hello') || lastMessage.includes('hi')) {
        reply = "Hello! I am Aura, your AI Health Companion. How are you feeling today?";
      } else if (lastMessage.includes('diet') || lastMessage.includes('food') || lastMessage.includes('eat') || lastMessage.includes('meal')) {
        reply = "Healthy eating is essential! Try keeping a diet rich in vegetables, clean proteins (chicken, fish, legumes), and whole grains (quinoa, oats). If you're managing a specific condition like diabetes or high blood pressure, let me know so I can tailor my diet suggestions!";
      }

      return res.status(200).json({ text: reply });
    }

    const systemInstruction = `You are Aura Health Companion, an expert AI clinical health companion. Your job is to:
    1. Ask the user how they are feeling today and listen to their health concerns or symptoms.
    2. Provide empathetic, helpful medical insights, tips, and natural remedies.
    3. Suggest specific food diets (such as low glycemic for diabetes, low sodium for hypertension, light soups for fevers) based on their symptoms or goals.
    4. ALWAYS include a brief professional disclaimer reminding them that you are an AI assistant, not a doctor. If they mention life-threatening symptoms (chest pain, stroke symptoms, severe breathing difficulties), urge them to seek emergency services immediately.
    
    Keep your responses concise, friendly, and structured. Use paragraphs or bullet points for readability.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: history,
      config: {
        systemInstruction,
      }
    });

    res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error('[Backend] Error in AI Chat:', error);
    res.status(500).json({ error: error.message || 'Error occurred during AI Chat conversation' });
  }
};
