export type ToolAction =
  | 'propose_tour'
  | 'ask_clarification'
  | 'handoff_human'
  | 'none';

export interface ToolInput {
  [key: string]: any;
}

export interface ToolResult {
  success: boolean;
  data: any;
  message?: string;
  action: ToolAction;
}

export abstract class ToolBase {
  abstract name: string;
  abstract description: string;
  abstract execute(input: ToolInput): Promise<ToolResult>;
} 