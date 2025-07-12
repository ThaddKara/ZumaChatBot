import { OpenAIService } from '../services/OpenAIService';
import { toolRegistry } from '../tools';

export class ToolClassifier {
  private openaiService: OpenAIService;

  constructor(openaiService: OpenAIService) {
    this.openaiService = openaiService;
  }

  async classify(userInput: string): Promise<string> {
    const toolNames = Object.keys(toolRegistry);
    return this.openaiService.classifyTool(userInput, toolNames);
  }

  async classifyAll(userInput: string): Promise<string[]> {
    const toolNames = Object.keys(toolRegistry);
    return this.openaiService.extractTools(userInput, toolNames);
  }
} 