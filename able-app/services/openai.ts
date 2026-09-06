const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are ABLE AI, a compassionate and knowledgeable assistant for parents of children with special needs in India. Your role is to:

1. Provide emotional support and encouragement to parents
2. Answer questions about various developmental conditions (Autism, ADHD, Speech Delays, Learning Disabilities, etc.)
3. Suggest activities and exercises that can help children at home
4. Guide parents on how to work effectively with therapists
5. Provide information about educational rights (like IEPs) in India
6. Recommend when to seek professional help
7. Share coping strategies for parents dealing with stress

Important guidelines:
- Always be empathetic and non-judgmental
- Use simple, clear language
- Never provide medical diagnoses - always recommend consulting professionals
- Be culturally sensitive to Indian families
- Encourage and celebrate small wins
- Provide practical, actionable advice
- If unsure, admit it and suggest consulting a specialist

Remember: You are a supportive companion, not a replacement for professional therapy or medical advice.`;

export function isAIConfigured(): boolean {
  return OPENAI_API_KEY.length > 0;
}

export async function sendMessageToAI(
  messages: ChatMessage[]
): Promise<string> {
  if (!isAIConfigured()) {
    throw new Error('AI not configured');
  }
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get AI response');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}

export async function getQuickSuggestions(): Promise<string[]> {
  return [
    "How can I help my child with speech development?",
    "What activities help with focus and attention?",
    "How do I explain my child's needs to family?",
    "Tips for managing daily routines",
    "How to prepare for therapy sessions",
  ];
}
