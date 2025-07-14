import OpenAI from 'openai';

export class CheckAvailabilityClassifier {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async classifyBedrooms(userInput: string): Promise<'studio' | '1br' | '2br' | 'any' | string> {
    const prompt = `Classify the following user request. If the user specifies a specific unit or room, return only the unit number (e.g., 101, 202). Otherwise, classify the request as one of: studio, 1 bedroom, 2 bedroom, or any.\nRequest: "${userInput}"\nResponse:`;
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 5,
        temperature: 0,
      });
      const content = completion.choices[0].message.content?.trim().toLowerCase();
      if (content?.includes('studio')) return 'studio';
      if (content?.includes('1br') || content?.includes('one') || content?.includes('1 bedroom')) return '1br';
      if (content?.includes('2br') || content?.includes('two') || content?.includes('2 bedroom')) return '2br';
      if (content?.includes('any')) return 'any';
      return content || 'any';
    } catch (error) {
      console.error('CheckAvailabilityClassifier error:', error);
      return 'any';
    }
  }
} 