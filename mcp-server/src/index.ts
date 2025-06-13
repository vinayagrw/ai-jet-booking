import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { executeTool } from './tools/index.js';
import { AIConcierge, AdminAssistant, ReportingAgent } from './agents/index.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3010;

// Initialize AI agents
const concierge = new AIConcierge();
const adminAssistant = new AdminAssistant();
const reportingAgent = new ReportingAgent();

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json());

// Load Swagger documentation
const swaggerDocument = YAML.parse(
  fs.readFileSync(path.join(__dirname, '../openapi.yaml'), 'utf8')
);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// MCP endpoint
app.post('/mcp', async (req, res) => {
  try {
    const { tool, params } = req.body;
    
    if (!tool || !params) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: tool and params'
      });
    }

    const result = await executeTool(tool, params);
    res.json(result);
  } catch (error) {
    console.error('Error executing tool:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// AI Concierge endpoint
app.post('/ai/concierge', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: message'
      });
    }

    const result = await concierge.handleRequest(message);
    res.json(result);
  } catch (error) {
    console.error('Error in AI concierge:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Admin Assistant endpoint
app.post('/ai/admin', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: message'
      });
    }

    const result = await adminAssistant.handleRequest(message);
    res.json(result);
  } catch (error) {
    console.error('Error in admin assistant:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Reporting Agent endpoint
app.post('/ai/reports', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: message'
      });
    }

    const result = await reportingAgent.handleRequest(message);
    res.json(result);
  } catch (error) {
    console.error('Error in reporting agent:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`MCP server running on port ${port}`);
  console.log(`API documentation available at http://localhost:${port}/api-docs`);
}); 