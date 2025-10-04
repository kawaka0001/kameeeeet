# Meet - Video Conferencing App

Wasm-powered video conferencing application built with Next.js and LiveKit.

## Features

- 🎥 Multi-party video conferencing (up to 100 participants)
- 💬 Real-time chat
- 🖥️ Screen sharing
- 🎨 Virtual backgrounds
- 📱 Mobile responsive
- 🔗 URL-based room joining (no account required)

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, TailwindCSS
- **WebRTC**: LiveKit
- **Deployment**: Vercel

## Getting Started

### Prerequisites

1. Node.js 18+ installed
2. LiveKit account (free tier available at [livekit.io](https://livekit.io))

### Setup

1. Clone the repository:
```bash
git clone https://github.com/kawaka0001/kameeeeet.git
cd kameeeeet
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-server.livekit.cloud
```

To get LiveKit credentials:
- Sign up at [livekit.io](https://livekit.io)
- Create a new project
- Copy your API Key, API Secret, and WebSocket URL

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Import the project in Vercel

3. Set environment variables in Vercel:
   - `LIVEKIT_API_KEY`
   - `LIVEKIT_API_SECRET`
   - `NEXT_PUBLIC_LIVEKIT_URL`

4. Deploy!

## Project Structure

```
meet/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── token/          # LiveKit token generation API
│   │   ├── room/
│   │   │   └── [roomName]/     # Video conference room page
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   └── globals.css         # Global styles
│   ├── components/             # Reusable UI components
│   │   ├── JoinForm.tsx        # Room join form
│   │   ├── VideoRoom.tsx       # Video conference component
│   │   └── ErrorDisplay.tsx    # Error display component
│   ├── lib/                    # Utility libraries
│   │   ├── env.ts              # Environment variable validation
│   │   └── logger.ts           # Structured logging
│   └── types/                  # TypeScript type definitions
│       └── index.ts            # Shared types
├── CLAUDE.md                    # AI development guidelines
├── ZEAMI.md                     # Best practices
└── package.json
```

## Architecture

### Type Safety
- All API responses are typed
- Environment variables are validated at runtime
- Component props are strictly typed

### Logging
- Structured JSON logging in production
- Pretty console logs in development
- Context-aware error tracking

### Error Handling
- Unified error handling across the app
- User-friendly error messages
- Comprehensive error logging

## Usage

1. Go to the home page
2. Click "Join Test Room" or navigate to `/room/{any-room-name}`
3. Enter your name
4. Join the room
5. Share the URL with others to join the same room

## Future Enhancements

- [ ] Wasm modules for virtual backgrounds
- [ ] Advanced media filters
- [ ] Recording functionality
- [ ] Chat persistence
- [ ] Room scheduling
- [ ] Admin controls

## License

MIT
