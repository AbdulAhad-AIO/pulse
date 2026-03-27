import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateTrendSummary(trendTitle: string, trendDescription: string) {
  try {
    const message = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `Provide a clear, plain-English summary of this trend:
Title: ${trendTitle}
Description: ${trendDescription}

Summary (2-3 sentences):`,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return message.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}

export async function generateTrendInsights(
  trendTitle: string,
  trendDescription: string,
  communityComments?: string[]
) {
  try {
    const commentsContext = communityComments
      ? `\n\nCommunity insights:\n${communityComments.slice(0, 5).join('\n')}`
      : '';

    const message = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `Analyze this trend and provide comprehensive insights:
Title: ${trendTitle}
Description: ${trendDescription}${commentsContext}

Provide a JSON response with:
{
  "why_happening": "Why this trend is happening (2-3 sentences)",
  "predictions": [
    {"description": "Prediction 1", "probability": 0.85, "timeframe": "3 months"},
    {"description": "Prediction 2", "probability": 0.72, "timeframe": "6 months"},
    {"description": "Prediction 3", "probability": 0.65, "timeframe": "12 months"}
  ],
  "persona_impacts": {
    "business_owner": {"impact": "Impact description", "opportunities": ["opp1", "opp2"]},
    "job_seeker": {"impact": "Impact description", "opportunities": ["opp1", "opp2"]},
    "consumer": {"impact": "Impact description", "opportunities": ["opp1", "opp2"]}
  },
  "actionable_steps": ["Step 1", "Step 2", "Step 3"]
}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = message.choices[0].message.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating insights:', error);
    throw error;
  }
}

export async function answerTrendQuestion(
  question: string,
  trendData: string,
  communityComments: string[]
) {
  try {
    const message = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a knowledgeable assistant analyzing trends and providing insights. Answer questions using the provided trend data and community feedback.',
        },
        {
          role: 'user',
          content: `Trend Information: ${trendData}
          
Top Community Comments:
${communityComments.join('\n')}

User Question: ${question}

Provide a concise, helpful answer (3-4 sentences).`,
        },
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    return message.choices[0].message.content || '';
  } catch (error) {
    console.error('Error answering question:', error);
    throw error;
  }
}
