import OpenAI from 'openai';

export class OpenAIService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async classifyTool(userInput: string, toolNames: string[]): Promise<string> {
    const prompt = `Given the following user request, classify which tool to use from: ${toolNames.join(', ')}.\nRequest: "${userInput}"\nTool:`;
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      });
      return completion.choices[0].message.content?.trim() || '';
    } catch (error) {
      console.error('OpenAI classifyTool error:', error);
      return '';
    }
  }

  async extractTools(userInput: string, toolNames: string[]): Promise<string[]> {
    const prompt = `Given the following user request, list all tools to use from: ${toolNames.join(', ')}.\nRequest: "${userInput}"\nRespond with a comma-separated list of tool names. For each tool, provide the corresponding context separated by a |.`;
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      });
      const content = completion.choices[0].message.content?.trim() || '';
      return content.split('\n').map(t => t.trim()).filter(Boolean);
    } catch (error) {
      console.error('OpenAI extractTools error:', error);
      return [];
    }
  }
}