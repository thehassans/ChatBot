# Magnetic Nobot - AI-Powered Customer Support Platform

A real-time customer support platform similar to Crisp Chat, featuring AI-powered chatbots that respond like real humans.

## Features

### Core Features
- **Multi-Channel Shared Inbox**: Centralized dashboard for WhatsApp, Messenger, Web Widget, and Email
- **Live Chat Widget**: Lightweight, embeddable JavaScript widget with typing indicators
- **Real-Time Engine**: WebSocket-based messaging with sub-100ms latency
- **Customer CRM**: Sidebar showing user metadata, location, device, pages viewed
- **AI-Powered Bots**: Gemini Flash 2.5 powered responses that feel human
- **E-commerce**: Service packages with cart and checkout system

### Services Offered
1. **WhatsApp Bot** - $49/month
2. **Messenger Bot** - $49/month
3. **All-in-One Suite** - $99/month (WhatsApp + Messenger + Widget + Email)

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **Real-Time**: Socket.io WebSocket server
- **AI**: Google Gemini Flash 2.5 API
- **Auth**: JWT with bcrypt password hashing

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Gemini API Key (from Google AI Studio)

### Installation

1. **Clone and install dependencies**
```bash
cd NoBOTSERVICE
npm install
```

2. **Configure environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

3. **Seed the database**
```bash
npx ts-node scripts/seed.ts
```

4. **Start the development servers**

Terminal 1 - Next.js App:
```bash
npm run dev
```

Terminal 2 - WebSocket Server:
```bash
npm run server
```

5. **Access the application**
- Main site: http://localhost:3000
- Admin panel: http://localhost:3000/admin

### Default Admin Credentials
- Email: admin@magneticnobot.com
- Password: admin123

**⚠️ Change these credentials after first login!**

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── admin/         # Admin endpoints
│   │   │   ├── checkout/      # Checkout endpoint
│   │   │   └── workspaces/    # Workspace management
│   │   ├── admin/             # Admin dashboard
│   │   ├── dashboard/         # User dashboard
│   │   ├── checkout/          # Checkout page
│   │   └── login/             # Login page
│   ├── components/            # React components
│   │   ├── layout/            # Layout components
│   │   └── ui/                # UI components
│   └── lib/                   # Utilities and models
│       ├── models/            # MongoDB models
│       ├── auth.ts            # Auth utilities
│       ├── db.ts              # Database connection
│       ├── store.ts           # Zustand store
│       └── utils.ts           # Helper functions
├── server/                    # WebSocket server
│   └── index.ts               # Socket.io server
├── public/
│   └── widget.js              # Embeddable chat widget
└── scripts/
    └── seed.ts                # Database seeding script
```

## User Flow

### Customer Journey
1. Visit the main site
2. Browse services (WhatsApp Bot, Messenger Bot, All-in-One)
3. Add services to cart
4. Checkout (auto-creates user account)
5. Wait for admin approval
6. Once approved, access dashboard to set up the service

### Service Setup (3 Steps)
1. **Training Data**: Provide website URL, text file, or markdown for AI training
2. **Connect Channels**: Link WhatsApp/Messenger based on purchased service
3. **Business Info**: Enter business name, support email, timezone

### Admin Workflow
1. Login to admin panel
2. Review pending orders
3. Approve or reject orders
4. Configure Gemini API key
5. Set global bot settings (reply delay, typing duration)

## Embedding the Chat Widget

Add this code to your website:

```html
<script src="https://your-domain.com/widget.js"></script>
<script>
  MagneticNobot.init({
    workspaceId: 'YOUR_WORKSPACE_ID',
    primaryColor: '#5a66f2',
    agentName: 'Support Agent',
    greeting: 'Hi! How can we help you today?',
    position: 'right'
  });
</script>
```

## AI Bot Behavior

The AI bot is configured to:
- Act as a real human support agent (never admits to being AI)
- Respond in 2-4 sentences, natural conversational style
- Only use knowledge from the training data provided
- Hand off to human support when needed
- Never share sensitive information
- No emojis, plain text responses

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Checkout
- `POST /api/checkout` - Process order and create user

### Admin
- `GET /api/admin/orders` - List all orders
- `PATCH /api/admin/orders` - Approve/reject order
- `GET /api/admin/settings` - Get admin settings
- `PUT /api/admin/settings` - Update admin settings

### Workspaces
- `GET /api/workspaces` - List user workspaces
- `POST /api/workspaces/[id]/training` - Submit training data

## WebSocket Events

### Client → Server
- `join:workspace` - Join workspace room
- `join:conversation` - Join conversation room
- `message:send` - Send a message
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator

### Server → Client
- `message:new` - New message received
- `message:sent` - Message sent confirmation
- `typing:start` - Someone started typing
- `typing:stop` - Someone stopped typing
- `conversation:update` - Conversation updated

## Security

- JWT-based authentication with HTTP-only cookies
- Password hashing with bcrypt (12 rounds)
- Workspace-based data isolation
- Admin role verification for sensitive endpoints
- Input sanitization and validation

## Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/magnetic-nobot

# JWT
JWT_SECRET=your-secret-key

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

## License

MIT License - feel free to use for personal or commercial projects.

## Support

For questions or issues, please open an issue on GitHub.
