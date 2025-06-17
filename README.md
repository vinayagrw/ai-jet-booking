# 🛩️ AI-Powered Private Jet Booking MVP

A weekend-built proof-of-concept that combines traditional flight booking with conversational AI. The system allows users to search, book, and manage private jet travel using natural language, powered by a local LLM and Dust MCP agents.

## ⚙️ System Architecture

```
Frontend (Next.js + Tailwind CSS)
│
├── Login/Register, Dashboard, AI Chatbot
│
▼
BFF (API Layer - Node.js)
│
├── Auth Routes: /api/auth/*
├── Booking Routes: /api/bookings/*
├── MCP Proxy: /api/agent/chat
│
▼
Dust MCP Server (Local Node.js)
│
├── Agent: ai_concierge
├── Tools: searchJets, getBookingStatus, createBooking
│
▼
Local LLM (Ollama w/ Mistral or LM Studio)
```

## 🤖 AI, LLM & NLP Capabilities

### AI Chatbot (Frontend)
- Embedded in the UI as a persistent chat window
- Accepts natural language queries like:
  - "Book a light jet from Mumbai to Goa this Friday"
  - "Show me my last 3 bookings"
  - "Cancel my flight tomorrow at 9AM"
- Chat assistant performs:
  - Intent detection (via NLP)
  - Workflow orchestration (via MCP)
  - Context-aware follow-ups

### Local LLM (Ollama / LM Studio)
- Used for:
  - Natural language understanding
  - Summarization
  - Action clarification
- Runs fully offline, no external API keys required

### Dust MCP Agent
- Agent: `ai_concierge`
- Tools:
  - `searchJets` — queries real-time or mock fleet data
  - `createBooking` — reserves flights
  - `getBookingStatus` — retrieves current status
  - `updateFleetJet` — admin-only, modify jet info
- Receives messages and decides which tool to call based on LLM-derived intent

## 🧩 Key Features

### User Functionality
- ✅ Login & registration (JWT-based)
- 📋 Booking dashboard showing current & past bookings
- 💬 AI-powered chat for:
  - Jet search and booking
  - Status lookup
  - Flight changes and cancellations

### Admin Functionality
- ✈️ Add/edit jets with NLP commands
- 🧾 Manage memberships & fractional shares
- 📊 Analytics and reporting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL 13+
- [Ollama](https://ollama.ai) or LM Studio (for local LLM)

### 1. Set up the Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Set up MCP Server
```bash
cd mcp-server
npm install
npm run dev
```

### 3. Start Local LLM
```bash
ollama run mistral
```

### 4. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🗂️ Project Structure

```
/
├── frontend/           # Next.js frontend application
│   ├── components/     # React components
│   ├── pages/          # Next.js pages
│   └── styles/         # Global styles
│
├── backend/           # FastAPI backend
│   ├── app/            # Application code
│   ├── migrations/     # Database migrations
│   └── tests/          # Backend tests
│
├── mcp-server/        # Dust MCP server
│   ├── agents/         # MCP agents
│   └── tools/          # Custom tools
│
└── README.md          # This file
```

## 🤖 Sample User Flows

### Booking a Jet
1. User registers and logs in
2. Opens chat and says: "Find me a jet from Delhi to Jaipur next Friday"
3. Agent returns fleet options
4. User says: "Book the second one"
5. Booking confirmation shown and added to dashboard

### Admin Workflow
1. Admin logs in
2. Uses chat to add new jet: "Add Falcon 900 jet with ID F-9001, seats 12, rate ₹130k/hr"
3. MCP confirms fleet addition

### Analytics Query
1. Admin types: "Show average hours used by Platinum members last 30 days"
2. Agent compiles report from DB and replies with summary

## 📬 Workflow Automation
- Email triggers for:
  - Booking confirmations
  - Membership renewals
  - Payment receipts
- Smart notifications using SMTP or SES via MCP orchestration

## 🛠 Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python, SQLAlchemy
- **AI**: Local LLM (Mistral), Dust MCP
- **Database**: PostgreSQL
- **Auth**: JWT

## 📄 License

MIT - See [LICENSE](LICENSE) for more details.

## 🤖 AI & Automation

### Dust MCP
- **Agent**: `ai_concierge`
- **Tools**: 
  - `searchJets` - Find available jets based on criteria
  - `createBooking` - Create new flight bookings
  - `updateFleetJet` - Update jet fleet information
  - `getBookingStatus` - Check status of existing bookings
- **Function**: Routes user intent to appropriate tools and executes workflows.

### Local LLM Integration
- Powered by [Ollama](https://ollama.com) or LM Studio
- Natural language understanding for multi-turn conversations
- Context-aware responses to user queries

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ for frontend and MCP server
- Python 3.8+ for backend services
- PostgreSQL 13+ for database
- [Ollama](https://ollama.com) or LM Studio (running `mistral` model)

### 1. Start Dust MCP Server
```bash
cd mcp-server/
npm install
npm run dev
```

### 2. Start Backend
```bash
cd backend/
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Start Frontend
```bash
cd jet-chat-ui/
npm install
npm run dev
```

## 🎬 Example Workflow

1. User opens the chat interface
2. Enters: "Book a mid-size jet from Delhi to Jaipur"
3. AI agent responds with available options
4. User confirms: "Yes, book it"
5. System processes booking and displays confirmation
6. Booking appears in user's dashboard

## Project Structure

```
ai-jet-booking/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js app directory (Entry Point)
│   │   │   ├── page.tsx     # Home page
│   │   │   ├── jets/        # Jets listing and details
│   │   │   │   ├── page.tsx # Jets listing page
│   │   │   │   └── [id]/    # Individual jet details
│   │   │   │       └── page.tsx
│   │   │   ├── bookings/    # Booking management
│   │   │   │   └── page.tsx
│   │   │   └── admin/       # Admin dashboard
│   │   │       └── page.tsx
│   │   │
│   │   ├── components/      # React components
│   │   │   ├── JetCard.tsx  # Jet display card
│   │   │   ├── SearchFilters.tsx
│   │   │   ├── BookingForm.tsx
│   │   │   └── AdminDashboard.tsx
│   │   │
│   │   ├── services/        # API service functions
│   │   │   ├── jetService.ts    # Jet-related API calls
│   │   │   ├── bookingService.ts
│   │   │   └── authService.ts
│   │   │
│   │   ├── types/          # TypeScript type definitions
│   │   │   └── index.ts     # Shared type definitions
│   │   │
│   │   └── utils/          # Utility functions
│   │       ├── api.ts       # API configuration
│   │       └── auth.ts      # Authentication utilities
│   │
│   ├── public/             # Static assets
│   │   └── images/         # Image assets
│   │
│   └── package.json        # Frontend dependencies
│
├── backend/                 # FastAPI backend application
│   ├── main.py             # FastAPI application entry point
│   │   ├── FastAPI app initialization
│   │   ├── Middleware setup
│   │   ├── Router registration
│   │   └── Event handlers
│   │
│   ├── routers/            # API route handlers
│   │   ├── jets.py         # Jet-related endpoints
│   │   │   ├── GET /jets/          # List all jets
│   │   │   ├── GET /jets/{id}      # Get jet details
│   │   │   ├── POST /jets/         # Create new jet
│   │   │   └── PUT /jets/{id}      # Update jet
│   │   │
│   │   ├── bookings.py     # Booking endpoints
│   │   │   ├── GET /bookings/      # List bookings
│   │   │   ├── POST /bookings/     # Create booking
│   │   │   └── PUT /bookings/{id}  # Update booking
│   │   │
│   │   └── auth.py         # Authentication endpoints
│   │       ├── POST /auth/login    # User login
│   │       └── POST /auth/register # User registration
│   │
│   ├── models/             # Database models
│   │   ├── jet.py          # Jet model
│   │   │   ├── Jet class
│   │   │   └── JetCategory class
│   │   │
│   │   ├── booking.py      # Booking model
│   │   │   └── Booking class
│   │   │
│   │   └── user.py         # User model
│   │       └── User class
│   │
│   ├── schemas.py          # Pydantic schemas
│   │   ├── Jet schemas
│   │   ├── Booking schemas
│   │   └── User schemas
│   │
│   ├── crud.py             # Database operations
│   │   ├── Jet CRUD operations
│   │   ├── Booking CRUD operations
│   │   └── User CRUD operations
│   │
│   ├── database.py         # Database configuration
│   │   ├── Database connection
│   │   └── Session management
│   │
│   ├── utils/              # Utility functions
│   │   ├── auth_utils.py   # Authentication utilities
│   │   └── logger.py       # Logging configuration
│   │
│   └── alembic/            # Database migrations
│       ├── versions/       # Migration files
│       └── env.py          # Migration environment
│
├── .venv/                  # Python virtual environment
├── .vscode/               # VS Code configuration
├── run_all.sh             # Script to run both frontend and backend
└── README.md              # Project documentation
```

## Application Flow

### Frontend Flow
1. Entry Point: `frontend/src/app/page.tsx`
   - Renders home page
   - Provides navigation to other sections

2. Jet Listing: `frontend/src/app/jets/page.tsx`
   - Uses `JetCard` component to display jets
   - Implements `SearchFilters` for filtering
   - Calls `jetService` for data fetching

3. Jet Details: `frontend/src/app/jets/[id]/page.tsx`
   - Displays detailed jet information
   - Shows booking form
   - Uses `bookingService` for booking operations

### Backend Flow
1. Entry Point: `backend/main.py`
   - Initializes FastAPI application
   - Sets up middleware and routers
   - Configures event handlers

2. Request Flow:
   - Request → Router → CRUD Operation → Database
   - Response → Schema Validation → Client

3. Authentication Flow:
   - Request → Auth Router → Auth Utils → JWT Generation
   - Protected Routes → JWT Validation → User Verification

## Features

- Modern, responsive UI built with Next.js and Tailwind CSS
- Real-time jet availability and booking system
- Advanced search and filtering capabilities
- Secure authentication and authorization
- Detailed jet specifications and images
- Booking management system
- Admin dashboard for jet management

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- React Query
- Axios
- React Hook Form
- Zod

### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- Pydantic
- Python 3.11+

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 15+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-jet-booking.git
cd ai-jet-booking
```

2. Set up the backend:
```bash
# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Set up the database
./create_database.sh

# Run migrations
alembic upgrade head
```

3. Set up the frontend:
```bash
cd frontend
npm install
```

4. Start the development servers:
```bash
# From the root directory
./run_all.sh
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
uvicorn main:app --reload
```

### Database Migrations
```bash
cd backend
alembic revision --autogenerate -m "description"
alembic upgrade head
```

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
pytest
```

## Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
```

### Backend Deployment
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PostgreSQL](https://www.postgresql.org/)

## Application UI

### Home Page
![Home Page](.gitbook/home.png)

### Admin Dashboard
![Admin Dashboard](.gitbook/admin.png)

### User Account
![User Account](.gitbook/account.png)