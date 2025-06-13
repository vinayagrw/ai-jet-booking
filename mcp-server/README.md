# Jet Booking MCP Server with Local LLM Integration

This is a Dust MCP server that powers a private jet booking platform with AI capabilities. It integrates with a local LLM (via Ollama) to provide natural language interfaces for booking, fleet management, and reporting.

## Prerequisites

1. **Node.js** (v18 or later)
2. **pnpm** (v8 or later)
3. **Ollama** (for local LLM)

## Setup

1. **Install Ollama:**
   - Download from [ollama.ai](https://ollama.ai)
   - Install and start the Ollama service
   - Pull the Mistral model:
     ```bash
     ollama pull mistral
     ```

2. **Install Dependencies:**
   ```bash
   pnpm install
   ```

3. **Build the Project:**
   ```bash
   pnpm build
   ```

4. **Start the Server:**
   ```bash
   pnpm dev
   ```

The server will start on port 3010 by default.

## API Endpoints

### 1. MCP Tools
```
POST /mcp
```
Execute any MCP tool directly with structured parameters.

### 2. AI Concierge
```
POST /ai/concierge
```
Natural language interface for booking and searching jets.

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


Lets do this test .

build a chat option in UI where use can interatct with MCP server and take corrective acction 

1. Ask user to enter credentials if its not arealdy logged in to intiate any task.  and then do sing in if use dosent have account then ask user to register and give options to do registration 

2. once logged in then show list of exisitng booking 

