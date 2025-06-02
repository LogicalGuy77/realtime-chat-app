# Real-Time Chat Application

A modern, responsive chat application with real-time messaging, user authentication, and persistent data storage.

## Demo Video
[![Watch the video](https://img.youtube.com/vi/uW6bc6scixM/0.jpg)](https://www.youtube.com/watch?v=uW6bc6scixM)

## Bottleneck Analysis
[📖 Read on Medium: *Scaling Challenges in Real-Time Chat Applications – A Bottleneck Analysis*](https://medium.com/@harshitweb3/scaling-challenges-in-real-time-chat-applications-a-bottleneck-analysis-c3250346d756)

![bottleneck](https://github.com/user-attachments/assets/5779f2be-2014-4541-be0c-0c622b5d4a3c)

## Project Overview

This project is a full-featured chat application built with a modern tech stack, enabling users to communicate in real-time through a clean, intuitive interface. The application uses a monorepo structure managed by Turborepo for efficient code organization and development workflow.

![image](https://github.com/user-attachments/assets/6e9fbbe5-7e69-490d-9885-5f8d6097a235)


## Features

- **User Authentication**: Secure signup and login with JWT
- **Real-time Messaging**: Instant message delivery using WebSockets
- **Room Management**: Create and join chat rooms with unique codes
- **Message History**: Persistent storage of messages using Prisma
- **Responsive Design**: Optimized for both desktop and mobile devices
- **User Presence**: See who's online in a chat room
- **Room Sharing**: Share room codes to invite others

## Tech Stack

### Frontend
- **Next.js**: React framework for building the user interface
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for smooth transitions

### Backend
- **Express**: HTTP server for REST API endpoints
- **WebSocket**: Real-time bidirectional communication
- **JWT**: Secure authentication tokens
- **Prisma**: Type-safe database ORM
- **PostgreSQL**: Relational database for data persistence

### Infrastructure
- **Turborepo**: Monorepo management
- **pnpm**: Fast, disk space efficient package manager

## Project Structure

```
Chat-App/
├── apps/
│   ├── project/              # Next.js frontend application
│   ├── http-backend/         # Express API server
│   └── websocket-backend/    # WebSocket server for real-time communication
├── packages/
│   ├── ui/                   # Shared UI components
│   ├── common/               # Shared utilities and types
│   ├── common-backend/       # Backend utilities and config
│   ├── database/             # Prisma schema and database config
│   ├── eslint-config/        # ESLint configurations
│   └── typescript-config/    # TypeScript configurations
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v22 or later)
- pnpm
- PostgreSQL database

### Environment Variables

Create the following `.env` files:

```
# In apps/project/.env
NEXT_PUBLIC_HTTP_BACKEND="http://localhost:3002"
NEXT_PUBLIC_WS_BACKEND="ws://localhost:8080"

# In packages/database/.env
DATABASE_URL="postgresql://username:password@localhost:5432/chatapp"

# In packages/common-backend/.env
JWT_SECRET="your-secret-key"
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/realtime-chatapp.git
cd realtime-chatapp/Chat-App

# Install dependencies
pnpm install

# Setup database
pnpm db:push

# Run development servers
pnpm dev
```

## Usage Guide

### User Registration and Login
1. Navigate to the signup page to create a new account
2. Fill in your details (name, email, password)
3. After registration, you'll be automatically logged in
4. For returning users, navigate to the signin page

### Creating a Chat Room
1. From the dashboard, click "Generate Code" to create a unique room code
2. Enter a name for your room
3. Click "Create & Enter Room"
4. Share the 5-digit room code with others to let them join

### Joining a Chat Room
1. From the dashboard, enter the 5-digit room code in the "Join a Room" section
2. Click "Join Room" to enter the chat

### Messaging
1. Type your message in the input field at the bottom of the chat
2. Press Enter or click the send button to send your message
3. Messages are delivered in real-time to all users in the room

## API Documentation

### Authentication Endpoints
- POST `/api/auth/signup`: Register a new user
- POST `/api/auth/signin`: Authenticate and receive JWT token

### Room Endpoints
- POST `/api/room/create`: Create a new chat room
- POST `/api/room/join`: Join an existing chat room
- GET `/api/room/all`: Get all rooms for the current user

### WebSocket Events
- `connect`: Initialize WebSocket connection
- `joinRoom`: Join a specific chat room
- `leaveRoom`: Leave a chat room
- `message`: Send a message to a room

