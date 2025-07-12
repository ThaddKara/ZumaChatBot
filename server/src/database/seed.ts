import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Database file path
const dbPath = path.join(dataDir, 'zuma_chatbot.db');

// Create database instance
const db = new Database(dbPath);

console.log('🌱 Seeding ZumaChatBot database with initial data...');

// Enable foreign keys and WAL mode
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Seed data
const seedData = db.transaction(() => {
  // Insert sample users
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (id, username, email) 
    VALUES (?, ?, ?)
  `);

  const users = [
    { id: 1, username: 'demo_user', email: 'demo@example.com' },
    { id: 2, username: 'test_user', email: 'test@example.com' },
    { id: 3, username: 'admin', email: 'admin@zuma.com' }
  ];

  users.forEach(user => {
    insertUser.run(user.id, user.username, user.email);
  });

  console.log(`✅ Inserted ${users.length} users`);

  // Insert sample chat sessions
  const insertSession = db.prepare(`
    INSERT OR IGNORE INTO chat_sessions (id, user_id, session_name) 
    VALUES (?, ?, ?)
  `);

  const sessions = [
    { id: 1, user_id: 1, session_name: 'Getting Started with Zuma' },
    { id: 2, user_id: 1, session_name: 'Project Discussion' },
    { id: 3, user_id: 2, session_name: 'Technical Questions' },
    { id: 4, user_id: null, session_name: 'Anonymous Chat' }
  ];

  sessions.forEach(session => {
    insertSession.run(session.id, session.user_id, session.session_name);
  });

  console.log(`✅ Inserted ${sessions.length} chat sessions`);

  // Insert sample messages
  const insertMessage = db.prepare(`
    INSERT OR IGNORE INTO messages (id, session_id, content, sender_type, timestamp) 
    VALUES (?, ?, ?, ?, ?)
  `);

  const messages = [
    // Session 1 - Getting Started
    { id: 1, session_id: 1, content: "Hello! I'm new here. How can Zuma help me?", sender_type: 'user', timestamp: '2024-01-15 10:00:00' },
    { id: 2, session_id: 1, content: "Hello! I'm Zuma, your AI assistant. I can help you with various tasks like answering questions, brainstorming ideas, or just having a conversation. What would you like to explore today?", sender_type: 'bot', timestamp: '2024-01-15 10:00:05' },
    { id: 3, session_id: 1, content: "That sounds great! Can you help me with coding questions?", sender_type: 'user', timestamp: '2024-01-15 10:01:00' },
    { id: 4, session_id: 1, content: "Absolutely! I can help you with coding questions, debugging, explaining concepts, and even reviewing code. What programming language or framework are you working with?", sender_type: 'bot', timestamp: '2024-01-15 10:01:05' },

    // Session 2 - Project Discussion
    { id: 5, session_id: 2, content: "I'm working on a React project and need some advice", sender_type: 'user', timestamp: '2024-01-15 14:30:00' },
    { id: 6, session_id: 2, content: "I'd be happy to help with your React project! React is a great choice for building user interfaces. What specific aspect are you looking for advice on? State management, component structure, performance optimization, or something else?", sender_type: 'bot', timestamp: '2024-01-15 14:30:10' },
    { id: 7, session_id: 2, content: "I'm having trouble with state management. Should I use Redux or Context API?", sender_type: 'user', timestamp: '2024-01-15 14:31:00' },
    { id: 8, session_id: 2, content: "Great question! For smaller applications, Context API is often sufficient and simpler to set up. Redux is better for larger applications with complex state management needs. What's the size and complexity of your project?", sender_type: 'bot', timestamp: '2024-01-15 14:31:15' },

    // Session 3 - Technical Questions
    { id: 9, session_id: 3, content: "What's the difference between SQLite and PostgreSQL?", sender_type: 'user', timestamp: '2024-01-16 09:15:00' },
    { id: 10, session_id: 3, content: "SQLite is a lightweight, file-based database perfect for small to medium applications, embedded systems, and development. PostgreSQL is a full-featured, server-based database ideal for large-scale applications with complex queries, concurrent users, and advanced features like JSON support and full-text search. What's your use case?", sender_type: 'bot', timestamp: '2024-01-16 09:15:20' },

    // Session 4 - Anonymous Chat
    { id: 11, session_id: 4, content: "Hi there! Just wanted to say hello", sender_type: 'user', timestamp: '2024-01-16 16:45:00' },
    { id: 12, session_id: 4, content: "Hello! Thanks for stopping by. I'm here to chat and help with whatever you need. How's your day going?", sender_type: 'bot', timestamp: '2024-01-16 16:45:05' },
    { id: 13, session_id: 4, content: "Pretty good! Just exploring different AI tools", sender_type: 'user', timestamp: '2024-01-16 16:46:00' },
    { id: 14, session_id: 4, content: "That's exciting! AI tools are evolving rapidly. I'm glad you're exploring them. Is there anything specific about AI that interests you or any particular tools you'd like to discuss?", sender_type: 'bot', timestamp: '2024-01-16 16:46:10' }
  ];

  messages.forEach(message => {
    insertMessage.run(
      message.id, 
      message.session_id, 
      message.content, 
      message.sender_type, 
      message.timestamp
    );
  });

  console.log(`✅ Inserted ${messages.length} messages`);

  // Insert sample rooms
  const insertRoom = db.prepare(`
    INSERT OR IGNORE INTO room (id, name, type, available, price) 
    VALUES (?, ?, ?, ?, ?)
  `);

  const rooms = [
    { id: 1, name: '101', type: 'studio', available: true, price: 1200 },
    { id: 2, name: '102', type: '1br', available: false, price: 1500 },
    { id: 3, name: '201', type: '2br', available: true, price: 2000 },
    { id: 4, name: '202', type: 'studio', available: true, price: 1250 }
  ];

  rooms.forEach(room => {
    insertRoom.run(room.id, room.name, room.type, room.available ? 1 : 0, room.price);
  });

  console.log(`✅ Inserted ${rooms.length} rooms`);

  // Insert sample tour schedules
  const insertTour = db.prepare(`
    INSERT OR IGNORE INTO tourschedule (id, user_id, room_id, scheduled_at, status) 
    VALUES (?, ?, ?, ?, ?)
  `);

  const tours = [
    { id: 1, user_id: 1, room_id: 1, scheduled_at: '2024-07-15 11:00:00', status: 'confirmed' },
    { id: 2, user_id: 2, room_id: 3, scheduled_at: '2024-07-16 14:00:00', status: 'pending' },
    { id: 3, user_id: 1, room_id: 4, scheduled_at: '2024-07-17 09:30:00', status: 'cancelled' }
  ];

  tours.forEach(tour => {
    insertTour.run(tour.id, tour.user_id, tour.room_id, tour.scheduled_at, tour.status);
  });

  console.log(`✅ Inserted ${tours.length} tour schedules`);
});

// Run the transaction
seedData();

console.log('✅ Database seeded successfully!');
console.log(`📁 Database file: ${dbPath}`);

// Display some statistics
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
const sessionCount = db.prepare('SELECT COUNT(*) as count FROM chat_sessions').get() as { count: number };
const messageCount = db.prepare('SELECT COUNT(*) as count FROM messages').get() as { count: number };
const roomCount = db.prepare('SELECT COUNT(*) as count FROM room').get() as { count: number };
const tourCount = db.prepare('SELECT COUNT(*) as count FROM tourschedule').get() as { count: number };

console.log('\n📊 Database Statistics:');
console.log(`👥 Users: ${userCount.count}`);
console.log(`💬 Chat Sessions: ${sessionCount.count}`);
console.log(`💭 Messages: ${messageCount.count}`);
console.log(`🏠 Rooms: ${roomCount.count}`);
console.log(`📅 Tour Schedules: ${tourCount.count}`);

// Close the database connection
db.close(); 