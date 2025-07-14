import { ToolBase, ToolInput, ToolResult } from './ToolBase';

export class HelpTool extends ToolBase {
  name = 'help';
  description = 'Provides help or guidance when the user is unsure what to do.';

  async execute(input: ToolInput): Promise<ToolResult> {
    const message = 'How can I assist you? You can ask about room availability, pricing, pet policy, or more.';
    return {
      success: true,
      data: {},
      message,
      action: 'none',
    };
  }
} 