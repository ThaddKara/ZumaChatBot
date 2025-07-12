# ZumaChatBot
Zakaria Kara

<img width="770" height="564" alt="Image" src="https://github.com/user-attachments/assets/f6ec2f30-6516-4130-8901-37d69c67e484" />

## Setup 

### DB init and Seed
> npx ts-node ZumaChatBot/server/src/database/init.ts && npx ts-node ZumaChatBot/server/src/database/seed.ts

### Run unit tests
> npx ts-node ZumaChatBot/server/src/tools/mock-tool-test.ts

### Limitations
1. Current message has no knowledge of past messages sent to bot
2. Can only check price by unit not type of unit
3. Some words aren't translated well for example: one bedroom !== 1br
4. Raw queries in services

### TODO
1. Abstract queries to Command/Query patterns
2. Not all data being passed is typed
3. Naming inconsistencies
4. Bloat - lot of endpoints not being used
5. Lot of open ended logic, actions are properly handled in their own services.

A modern AI-powered chatbot built with React TypeScript frontend and Express.js backend.

## Features

- 🤖 **AI Chat Interface**: Clean, modern chat UI with real-time messaging
- 🎨 **Beautiful Design**: Glassmorphism design with smooth animations
- 📱 **Responsive**: Works perfectly on desktop and mobile devices
- ⚡ **Real-time**: Instant message delivery with typing indicators
- 🔧 **TypeScript**: Full type safety for both frontend and backend
- 🚀 **Modern Stack**: React 18, Express.js, and latest dependencies

## Tech Stack

### Frontend
- React 18 with TypeScript
- Axios for API communication
- Lucide React for icons
- Modern CSS with glassmorphism effects

### Backend
- Express.js with TypeScript
- CORS enabled for cross-origin requests
- Helmet for security headers
- Morgan for request logging
- Environment variable support

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd ZumaChatBot
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables:**
   ```bash
   cd server
   cp env.example .env
   ```

4. **Start the development servers:**
   ```bash
   npm run dev
   ```

This will start:
- Backend server on `http://localhost:3001`
- Frontend app on `http://localhost:3000`

## Project Structure

```
ZumaChatBot/
├── client/                 # React TypeScript frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.tsx        # Main app component
│   │   └── index.tsx      # Entry point
│   ├── package.json       # Frontend dependencies
│   └── tsconfig.json      # TypeScript config
├── server/                # Express.js backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   └── index.ts       # Server entry point
│   ├── package.json       # Backend dependencies
│   └── tsconfig.json      # TypeScript config
├── package.json           # Root package.json
└── README.md             # This file
```

## API Endpoints

### Chat Routes
- `POST /api/chat/send` - Send a message to the chatbot
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/clear` - Clear chat history

### Health Routes
- `GET /api/health` - Server health check

## Development

### Available Scripts

**Root level:**
- `npm run install:all` - Install dependencies for all packages
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run test` - Run tests for both frontend and backend

**Backend (server/):**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run backend tests

**Frontend (client/):**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run frontend tests

## Customization

### Adding AI Integration

The chatbot currently uses simple response patterns. To integrate with AI services:

1. **OpenAI Integration:**
   ```typescript
   // In server/src/routes/chat.ts
   import OpenAI from 'openai';
   
   const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY,
   });
   
   // Replace generateBotResponse function
   async function generateBotResponse(userMessage: string): Promise<string> {
     const completion = await openai.chat.completions.create({
       messages: [{ role: "user", content: userMessage }],
       model: "gpt-3.5-turbo",
     });
     return completion.choices[0].message.content || "Sorry, I couldn't process that.";
   }
   ```

2. **Add your API key to .env:**
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

### Styling

The app uses modern CSS with glassmorphism effects. Main styles are in:
- `client/src/index.css` - Global styles
- `client/src/components/*.css` - Component-specific styles

## Deployment

### Backend Deployment
1. Build the TypeScript: `cd server && npm run build`
2. Deploy the `dist/` folder to your server
3. Set environment variables on your hosting platform

### Frontend Deployment
1. Build the React app: `cd client && npm run build`
2. Deploy the `build/` folder to your hosting platform
3. Update the API endpoint in the frontend if needed
