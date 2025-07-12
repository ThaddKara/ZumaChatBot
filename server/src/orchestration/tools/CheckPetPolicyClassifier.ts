import OpenAI from 'openai';

export class CheckPetPolicyClassifier {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async classifyPetType(userInput: string): Promise<'cat' | 'dog' | 'unknown'> {
    const prompt = `Classify the type of pet from the following user request as one of: cat, dog.\nRequest: "${userInput}"\nPet type:`;
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 5,
        temperature: 0,
      });
      const content = completion.choices[0].message.content?.trim().toLowerCase();
      if (content?.includes('cat')) return 'cat';
      if (content?.includes('dog')) return 'dog';
      return 'unknown';
    } catch (error) {
      console.error('CheckPetPolicyClassifier error:', error);
      return 'unknown';
    }
  }
} 