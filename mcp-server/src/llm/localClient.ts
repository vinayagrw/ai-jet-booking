import axios from 'axios';

interface LLMResponse {
  text: string;
  error?: string;
}

export class LocalLLMClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
  }

  async generateWithTools(
    prompt: string,
    tools: Record<string, any>
  ): Promise<LLMResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        model: 'phi',
        prompt: this.buildPrompt(prompt, tools),
        stream: false,
        format: 'json'
      });

      // Try to parse the response as JSON
      try {
        const jsonResponse = JSON.parse(response.data.response);
        return {
          text: JSON.stringify(jsonResponse)
        };
      } catch (parseError) {
        // If parsing fails, try to extract JSON from the text
        const jsonMatch = response.data.response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const jsonResponse = JSON.parse(jsonMatch[0]);
            return {
              text: JSON.stringify(jsonResponse)
            };
          } catch (e) {
            console.error('Failed to parse extracted JSON:', e);
          }
        }
        
        // If all parsing attempts fail, return the raw response
        return {
          text: response.data.response
        };
      }
    } catch (error) {
      console.error('LLM Error:', error);
      return {
        text: '',
        error: error instanceof Error ? error.message : 'Failed to generate response'
      };
    }
  }

  private buildPrompt(prompt: string, tools: Record<string, any>): string {
    if (Object.keys(tools).length === 0) {
      return prompt;
    }

    const toolDescriptions = Object.entries(tools)
      .map(([name, tool]) => {
        return `
Tool: ${name}
Description: ${tool.description}
Parameters: ${JSON.stringify(tool.parameters, null, 2)}
`;
      })
      .join('\n');

    return `
You are an AI assistant that helps users by using available tools. Here are the tools you can use:

${toolDescriptions}

User request: ${prompt}

IMPORTANT: You must respond with a valid JSON object in this exact format:
{
  "tool": "tool_name",
  "params": {
    // tool parameters based on the user's request
  }
}

Do not include any other text or explanation. Only return the JSON object.
If no tool is suitable, respond with:
{
  "error": "No suitable tool found for this request"
}
`;
  }
} 