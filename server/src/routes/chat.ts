import { Router, Request, Response } from 'express';
import { ChatService } from '../services/ChatService';
import { ChatRequest } from '../models';
import { Orchestrator } from '../orchestration/Orchestrator';
import { ToolClassifier } from '../orchestration/ToolClassifier';
import { OpenAIService } from '../services/OpenAIService';

const router = Router();

const openaiService = new OpenAIService(process.env.OPENAI_API_KEY!);
const classifier = new ToolClassifier(openaiService);
const orchestrator = new Orchestrator(classifier);

// Use orchestrator for bot response
type OrchestratorResult = { success: boolean; results?: any[]; message?: string };

async function generateBotResponse(userMessage: string, sessionId?: number): Promise<string> {
  try {
    const result: OrchestratorResult = await orchestrator.handle({ userInput: userMessage, sessionId });
    if (result.success && result.results && result.results.length > 0) {
      // Concatenate all tool messages
      return result.results.map(r => r.message).filter(Boolean).join(' ');
    } else if (result.message) {
      return result.message;
    } else {
      return "I'm not sure how to help with that.";
    }
  } catch (err) {
    return "Sorry, I encountered an error processing your request.";
  }
}

// Send a message
router.post('/send', async (req: Request<{}, {}, ChatRequest>, res: Response) => {
  try {
    const { message, session_id, user_id, ...inputData } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    // Create session if not provided
    let currentSessionId = session_id;
    if (!currentSessionId) {
      currentSessionId = ChatService.createSession(user_id);
    }

    // Generate and save bot response using orchestrator
    const botResponse = await generateBotResponse(message, currentSessionId);
    const botMessageId = ChatService.saveMessage(currentSessionId, botResponse, 'bot');

    return res.json({
      success: true,
      botResponse,
      messageId: botMessageId,
      timestamp: new Date().toISOString(),
      session_id: currentSessionId
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Failed to process message' });
  }
});

// Get chat history
router.get('/history/:sessionId', (req: Request, res: Response) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    const limit = parseInt(req.query.limit as string) || 50;
    
    if (isNaN(sessionId)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    const messages = ChatService.getChatHistory(sessionId, limit);
    
    return res.json({
      success: true,
      messages,
      session_id: sessionId
    });
  } catch (error) {
    console.error('History error:', error);
    return res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Get user sessions
router.get('/sessions', (req: Request, res: Response) => {
  try {
    const userId = req.query.user_id ? parseInt(req.query.user_id as string) : undefined;
    const sessions = ChatService.getUserSessions(userId);
    
    return res.json({
      success: true,
      sessions
    });
  } catch (error) {
    console.error('Sessions error:', error);
    return res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Create new session
router.post('/sessions', (req: Request, res: Response) => {
  try {
    const { user_id, session_name } = req.body;
    const sessionId = ChatService.createSession(user_id, session_name || 'New Chat');
    
    return res.json({
      success: true,
      session_id: sessionId,
      session_name: session_name || 'New Chat'
    });
  } catch (error) {
    console.error('Create session error:', error);
    return res.status(500).json({ error: 'Failed to create session' });
  }
});

// Clear session messages
router.delete('/sessions/:sessionId/messages', (req: Request, res: Response) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    
    if (isNaN(sessionId)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    const success = ChatService.clearSession(sessionId);
    
    if (success) {
      return res.json({ success: true, message: 'Chat history cleared' });
    } else {
      return res.status(404).json({ error: 'Session not found' });
    }
  } catch (error) {
    console.error('Clear session error:', error);
    return res.status(500).json({ error: 'Failed to clear session' });
  }
});

// Delete session
router.delete('/sessions/:sessionId', (req: Request, res: Response) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    
    if (isNaN(sessionId)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    const success = ChatService.deleteSession(sessionId);
    
    if (success) {
      return res.json({ success: true, message: 'Session deleted' });
    } else {
      return res.status(404).json({ error: 'Session not found' });
    }
  } catch (error) {
    console.error('Delete session error:', error);
    return res.status(500).json({ error: 'Failed to delete session' });
  }
});

// Clear all messages for a user
router.delete('/clear', async (req: Request, res: Response) => {
  try {
    // Accept user_id from query or body
    const userId = req.query.user_id
      ? parseInt(req.query.user_id as string)
      : req.body && req.body.user_id
        ? parseInt(req.body.user_id)
        : undefined;
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'user_id is required to clear chat' });
    }
    const success = ChatService.clearAllMessagesForUser(userId);
    if (success) {
      return res.json({ success: true, message: 'All chat messages cleared for user' });
    } else {
      return res.status(404).json({ error: 'No sessions/messages found for user' });
    }
  } catch (error) {
    console.error('Clear all user messages error:', error);
    return res.status(500).json({ error: 'Failed to clear user messages' });
  }
});

export const chatRoutes = router; 