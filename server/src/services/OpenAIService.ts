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
    const prompt = `
You are an intelligent assistant that selects the most appropriate tools to handle user requests.
Available tools: ${toolNames.join(', ')}

Given the following user request, identify which tool(s) should be used. 
For each selected tool, respond with the tool name, followed by a vertical bar (|), then a confidence score between 0 and 1 (where 1 means absolute confidence).
If multiple tools are relevant, separate them with commas.

User request: "${userInput}"

Respond ONLY with a comma-separated list in the format:
tool_name|confidence, tool_name|confidence

Example: user_wants_to_get_pricing_for_room|0.95, user_is_unsure|0.2
`;
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      });
      const content = completion.choices[0].message.content?.trim() || '';
      return content.split(',').map(t => t.trim()).filter(Boolean);
    } catch (error) {
      console.error('OpenAI extractTools error:', error);
      return [];
    }
  }
}