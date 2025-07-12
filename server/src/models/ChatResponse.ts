export interface ChatResponse {
  success: boolean;
  botResponse: string;
  messageId: number;
  timestamp: string;
  session_id?: number;
} 