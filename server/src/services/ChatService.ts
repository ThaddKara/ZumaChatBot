import db from '../database/db';
import { Message, ChatSession, ChatRequest, ChatResponse } from '../models';

export class ChatService {
  // Create a new chat session
  static createSession(userId?: number, sessionName: string = 'New Chat'): number {
    const stmt = db.prepare(`
      INSERT INTO chat_sessions (user_id, session_name) 
      VALUES (?, ?)
    `);
    const result = stmt.run(userId || null, sessionName);
    return result.lastInsertRowid as number;
  }

  // Save a message to the database
  static saveMessage(sessionId: number, content: string, senderType: 'user' | 'bot', metadata?: any): number {
    const stmt = db.prepare(`
      INSERT INTO messages (session_id, content, sender_type, metadata) 
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(sessionId, content, senderType, metadata ? JSON.stringify(metadata) : null);
    return result.lastInsertRowid as number;
  }

  // Get chat history for a session
  static getChatHistory(sessionId: number, limit: number = 50): Message[] {
    const stmt = db.prepare(`
      SELECT * FROM messages 
      WHERE session_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `);
    return stmt.all(sessionId, limit).reverse() as Message[];
  }

  // Get all sessions for a user
  static getUserSessions(userId?: number): ChatSession[] {
    const stmt = db.prepare(`
      SELECT * FROM chat_sessions 
      WHERE user_id = ? OR user_id IS NULL
      ORDER BY updated_at DESC
    `);
    return stmt.all(userId || null) as ChatSession[];
  }

  // Clear chat history for a session
  static clearSession(sessionId: number): boolean {
    const stmt = db.prepare('DELETE FROM messages WHERE session_id = ?');
    const result = stmt.run(sessionId);
    return result.changes > 0;
  }

  // Delete a session and all its messages
  static deleteSession(sessionId: number): boolean {
    const stmt = db.prepare('DELETE FROM chat_sessions WHERE id = ?');
    const result = stmt.run(sessionId);
    return result.changes > 0;
  }

  // Update session name
  static updateSessionName(sessionId: number, sessionName: string): boolean {
    const stmt = db.prepare(`
      UPDATE chat_sessions 
      SET session_name = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    const result = stmt.run(sessionName, sessionId);
    return result.changes > 0;
  }

  // Clear all messages for a user (across all sessions)
  static clearAllMessagesForUser(userId: number): boolean {
    // Get all session IDs for this user
    const sessionStmt = db.prepare('SELECT id FROM chat_sessions WHERE user_id = ?');
    const sessions = sessionStmt.all(userId) as { id: number }[];
    if (!sessions.length) return false;
    const sessionIds = sessions.map(s => s.id);
    // Delete messages for all sessions
    const deleteStmt = db.prepare(`DELETE FROM messages WHERE session_id IN (${sessionIds.map(() => '?').join(',')})`);
    const result = deleteStmt.run(...sessionIds);
    return result.changes > 0;
  }
} 