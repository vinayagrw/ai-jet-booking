# 🤖 AI Concierge MCP Server

The Model Control Protocol (MCP) Server is the orchestrator of AI capabilities in the Jet Booking platform. It acts as the bridge between natural language understanding (via local LLM) and concrete actions in the booking system.

## 🧠 Core Responsibilities

- **Intent Recognition**: Understands user requests using Mistral LLM
- **Workflow Orchestration**: Sequences API calls and tool executions
- **Context Management**: Maintains conversation state and user preferences
- **Tool Execution**: Safely executes privileged operations
- **Error Handling**: Gracefully recovers from failures

## 🛠️ Agent & Tools

### `ai_concierge` Agent
- **Purpose**: Primary conversational agent for handling user requests
- **Capabilities**:
  - Natural language understanding
  - Context-aware responses
  - Multi-turn conversation handling
  - Tool selection and execution

### Available Tools

#### 1. `searchJets`
- **Purpose**: Find available jets based on criteria
- **Parameters**:
  - `origin` (string): Departure location (IATA code or city name)
  - `destination` (string): Arrival location
  - `date` (string): ISO date string (YYYY-MM-DD)
  - `passengers` (number): Number of passengers
  - `jetType` (string, optional): Specific jet model or category

#### 2. `createBooking`
- **Purpose**: Create a new flight booking
- **Parameters**:
  - `userId` (string): ID of the booking user
  - `jetId` (string): Selected jet ID
  - `departureTime` (string): ISO datetime string
  - `passengers` (array): List of passenger objects
  - `specialRequests` (string, optional): Special requirements

#### 3. `getBookingStatus`
- **Purpose**: Retrieve booking details
- **Parameters**:
  - `bookingId` (string): Booking reference number
  - `userId` (string): ID of the requesting user

#### 4. `updateFleetJet` (Admin only)
- **Purpose**: Add or modify jet in the fleet
- **Parameters**:
  - `action` (string): 'add' or 'update'
  - `jetData` (object): Jet details including model, capacity, etc.

## 🌐 API Endpoints

### 1. Chat Endpoint
```
POST /api/chat
```
Process natural language messages and return AI responses.

**Request Body**:
```json
{
  "message": "Find me a jet from Mumbai to Delhi tomorrow",
  "conversationId": "optional-conversation-id",
  "userId": "user-123"
}
```

### 2. Tool Execution Endpoint
```
POST /api/tools/execute
```
Direct tool execution (for testing and admin purposes).

## 🔄 Local LLM Integration

The MCP server integrates with a local LLM (Mistral via Ollama) for natural language understanding. The LLM is used for:

1. **Intent Classification**: Determining user's goal
2. **Parameter Extraction**: Pulling out relevant details
3. **Response Generation**: Creating natural language responses

### LLM Configuration
- **Model**: `mistral` (default)
- **Temperature**: 0.7 (for balanced creativity)
- **Max Tokens**: 1000

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm 8+
- Ollama with Mistral model

### Installation
1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Configure environment variables (`.env`):
   ```env
   PORT=3010
   OLLAMA_BASE_URL=http://localhost:11434
   JWT_SECRET=your-jwt-secret
   LOG_LEVEL=info
   ```

3. Start the server:
   ```bash
   pnpm dev
   ```

## 🧪 Testing

Run tests:
```bash
pnpm test
```

## 📦 Production Deployment

### Using PM2
```bash
pm2 start dist/index.js --name "mcp-server"
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3010
OLLAMA_BASE_URL=http://localhost:11434
JWT_SECRET=your-secure-secret
LOG_LEVEL=info
MAX_REQUEST_SIZE=10mb
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📚 Documentation

- [Dust MCP Documentation](https://docs.dust.tt/)
- [Ollama API Reference](https://github.com/ollama/ollama)
- [Mistral Model Card](https://huggingface.co/mistralai/Mistral-7B-v0.1)

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ and pnpm v8+
- [Ollama](https://ollama.ai) with Mistral model
  ```bash
  # Install Ollama
  # Then pull the Mistral model
  ollama pull mistral
  ```

### Installation
1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Build the project:
   ```bash
   pnpm build
   ```

3. Start the server:
   ```bash
   pnpm dev
   ```

The server will be available at `http://localhost:3010`

## 📚 API Documentation

### Core Endpoints

#### 1. MCP Tools
```
POST /mcp
```
Execute MCP tools with structured parameters.

#### 2. AI Concierge
```
POST /ai/concierge
```
Natural language interface for all booking operations.

#### 3. Health Check
```
GET /health
```
Check server status and LLM connectivity.

## 🛠️ Development

### Environment Variables
Create a `.env` file with:
```env
PORT=3010
OLLAMA_BASE_URL=http://localhost:11434
LOG_LEVEL=info
```

### Available Scripts
- `dev`: Start development server
- `build`: Build for production
- `start`: Run production build
- `test`: Run tests
- `lint`: Run linter
- `format`: Format code

### 3. Admin Assistant
```
POST /ai/admin
```
Natural language interface for fleet and membership management.

### 4. Reporting Agent
```
POST /ai/reports
```
Natural language interface for generating reports.

### 5. Health Check
```
GET /health
```
Check if the server is running.

### 6. API Documentation
```
GET /api-docs
```
Interactive Swagger UI documentation.

## Example Usage

### 1. Using AI Concierge
```bash
curl -X POST http://localhost:3010/ai/concierge \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Book a heavy jet from Delhi to Mumbai next Friday, send invoice."
  }'
```

### 2. Using Admin Assistant
```bash
curl -X POST http://localhost:3010/ai/admin \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Add a new jet Falcon 8X with ₹180k/hr and 12 seats."
  }'
```

### 3. Using Reporting Agent
```bash
curl -X POST http://localhost:3010/ai/reports \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the busiest routes in the last 30 days?"
  }'
```

## Project Structure

```
mcp-server/
├── src/
│   ├── tools/           # MCP tool implementations
│   ├── agents/          # AI agent definitions
│   ├── llm/             # Local LLM client
│   └── data/            # Sample data
├── tests/               # Test files
└── README.md
```

## Development

1. **Adding New Tools:**
   - Create a new file in `src/tools/`
   - Export the tool function
   - Add it to `src/tools/index.ts`

2. **Adding New Agents:**
   - Create a new agent class in `src/agents/`
   - Add the agent to `src/index.ts`

3. **Testing:**
   ```bash
   pnpm test
   ```

## License

MIT 


