import OpenAI from 'openai';

export class CheckAvailabilityClassifier {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async classifyBedrooms(userInput: string): Promise<'studio' | '1br' | '2br' | 'unknown'> {
    const prompt = `Classify the number of bedrooms from the following user request as one of: studio, 1br, 2br.\nRequest: "${userInput}"\nBedrooms:`;
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 5,
        temperature: 0,
      });
      const content = completion.choices[0].message.content?.trim().toLowerCase();
      if (content?.includes('studio')) return 'studio';
      if (content?.includes('1br') || content?.includes('one')) return '1br';
      if (content?.includes('2br') || content?.includes('two')) return '2br';
      return 'unknown';
    } catch (error) {
      console.error('CheckAvailabilityClassifier error:', error);
      return 'unknown';
    }
  }
} 