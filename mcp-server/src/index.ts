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

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar', 'x-auth-token']
};

// Middleware
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json());

// Authentication middleware
app.use((req, res, next) => {
  // Skip auth for public endpoints
  if (req.path === '/health' || req.path.startsWith('/api-docs') || req.path.startsWith('/mcp/health')) {
    return next();
  }
  
  // For AI Concierge endpoint, check for token in multiple locations
  if (req.path === '/ai/concierge') {
    // Use our helper function to get the token
    const token = getTokenFromRequest(req) || 
                 (req.headers.authorization?.startsWith('Bearer ') ? 
                  req.headers.authorization.split(' ')[1] : 
                  undefined);
    
    if (token) {
      // Attach token to request for downstream use
      req.token = token;
      return next();
    }
    
    // Fallback to API key for backward compatibility
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    if (apiKey === process.env.API_KEY) {
      return next();
    }
  }
  
  // Check for Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false,
      error: 'Authentication required. Please log in first.',
      code: 'MISSING_AUTH_TOKEN'
    });
  }
  
  // Extract and validate token
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Invalid token format',
      code: 'INVALID_TOKEN_FORMAT'
    });
  }
  
  // Forward the token to the backend by attaching it to the request
  // The token will be used by the tools when making requests to the backend
  res.locals.token = token;
  next();
});

// Handle preflight requests
app.options('*', cors(corsOptions));

// Load Swagger documentation
const swaggerDocument = YAML.parse(
  fs.readFileSync(path.join(__dirname, '../openapi.yaml'), 'utf8')
);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Helper function to extract token from request
function getTokenFromRequest(req: any): string | undefined {
  if (req.token) return req.token;
  const header = req.headers['x-auth-token'];
  return Array.isArray(header) ? header[0] : header;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// MCP endpoint
app.post('/mcp', async (req, res) => {
  try {
    const { tool, params } = req.body;
    const token = getTokenFromRequest(req);
    
    if (!tool || !params) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: tool and params'
      });
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication token is required',
        code: 'UNAUTHORIZED'
      });
    }

    const result = await executeTool(tool, params, { token });
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
    const token = getTokenFromRequest(req);
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: message'
      });
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication token is required',
        code: 'UNAUTHORIZED'
      });
    }

    // Create a context with the token and response object
    const context = { 
      ...req, 
      token,
      res: {
        ...req.res,
        locals: {
          ...req.res?.locals,
          token
        }
      }
    };
    
    const result = await concierge.handleRequest(message, context);
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

// Admin endpoint
app.post('/ai/admin', async (req, res) => {
  try {
    const { message } = req.body;
    const token = getTokenFromRequest(req);
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: message'
      });
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication token is required',
        code: 'UNAUTHORIZED'
      });
    }

    const result = await adminAssistant.handleRequest(message, { ...req, token });
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

// Reporting endpoint
app.post('/ai/reports', async (req, res) => {
  try {
    const { message } = req.body;
    const token = getTokenFromRequest(req);
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: message'
      });
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication token is required',
        code: 'UNAUTHORIZED'
      });
    }

    const result = await reportingAgent.handleRequest(message, { ...req, token });
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
