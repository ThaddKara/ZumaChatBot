import OpenAI from 'openai';

export interface PricingContext {
  unitId: string | null;
  moveInDate: string | null;
}

export class GetPricingClassifier {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async classifyPricingContext(userInput: string): Promise<PricingContext> {
    const prompt = `Extract the unit id and move-in date from the following user request.\nRequest: "${userInput}"\nRespond in the format: unitId: <unitId or none>, moveInDate: <moveInDate or none>.`;
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 30,
        temperature: 0,
      });
      const content = completion.choices[0].message.content?.trim().toLowerCase() || '';
      const unitIdMatch = content.match(/unitid:\s*([\w-]+)/);
      const moveInDateMatch = content.match(/moveindate:\s*([\w-]+)/);
      return {
        unitId: unitIdMatch ? unitIdMatch[1] : null,
        moveInDate: moveInDateMatch ? moveInDateMatch[1] : null
      };
    } catch (error) {
      console.error('GetPricingClassifier error:', error);
      return { unitId: null, moveInDate: null };
    }
  }
} 