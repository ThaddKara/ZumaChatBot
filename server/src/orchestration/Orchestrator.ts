import { ToolClassifier } from './ToolClassifier';
import { toolRegistry } from '../tools';

interface OrchestratorHandleOptions {
  sessionId?: number;
  userInput: string;
}

export class Orchestrator {
  private classifier: ToolClassifier;

  constructor(classifier: ToolClassifier) {
    this.classifier = classifier;
  }

  async handle(userInputOrOptions: string | OrchestratorHandleOptions) {
    let userInput: string;
    let sessionId: number | undefined;
    if (typeof userInputOrOptions === 'string') {
      userInput = userInputOrOptions;
      sessionId = undefined;
    } else {
      userInput = userInputOrOptions.userInput;
      sessionId = userInputOrOptions.sessionId;
    }

    const toolNames = await this.classifier.classifyAll(userInput);
    console.log('toolNames', toolNames);
    if (!toolNames.length) {
      return { success: false, message: 'No tools found for this request.' };
    }
    let results = [];

    for (const [i, toolNameAndInput] of toolNames.entries()) {
      const [toolName, inputData] = toolNameAndInput.split('|');
      const tool = toolRegistry[toolName.trim()];
      if (!tool) {
        results.push({ success: false, message: `No tool found for: ${toolName}` });
        continue;
      }
      const result = await tool.execute({context: inputData});
      results.push({ tool: toolName, ...result });
    }
    return { success: true, results };
  }
} 