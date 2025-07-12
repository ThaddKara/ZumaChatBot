export interface Message {
  id?: number;
  session_id: number;
  content: string;
  sender_type: 'user' | 'bot';
  timestamp?: string;
  metadata?: string; // JSON string
} 