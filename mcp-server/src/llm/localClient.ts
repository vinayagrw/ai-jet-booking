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
      const llmPrompt = this.buildPrompt(prompt, tools);
      
      console.log('\n=== LLM PROMPT ===');
      console.log(llmPrompt);
      console.log('\n=== END PROMPT ===\n');
      
      console.log('Sending to LLM...');
      const startTime = Date.now();
      
      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        model: 'phi',
        prompt: llmPrompt,
        stream: false,
        format: 'json',
        options: {
          temperature: 0.3,  // Lower temperature for more deterministic responses
          top_p: 0.9,        // Focus on high-probability tokens
          num_ctx: 4096      // Larger context window
        }
      });
      
      const endTime = Date.now();
      console.log(`LLM response received in ${endTime - startTime}ms`);
      
      console.log('\n=== LLM RAW RESPONSE ===');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('=== END RAW RESPONSE ===\n');

      // Try to parse the response as JSON
      try {
        console.log('Attempting to parse LLM response as JSON...');
        const jsonResponse = JSON.parse(response.data.response);
        console.log('Successfully parsed JSON response:', JSON.stringify(jsonResponse, null, 2));
        return {
          text: JSON.stringify(jsonResponse)
        };
      } catch (parseError) {
        console.error('Failed to parse LLM response as JSON, trying to extract JSON...');
        // If parsing fails, try to extract JSON from the text
        const jsonMatch = response.data.response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            console.log('Extracted JSON from response:', jsonMatch[0]);
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
    // Compose tool descriptions
    const toolDescriptions = [
      {
        name: 'listUserBookings',
        description: 'Get all bookings for the current user. Use for: showing bookings, trips, reservations, my bookings, my trips, booking history, past bookings, upcoming trips.'
      },
      {
        name: 'searchJets',
        description: 'Search for available jets. Use for: finding jets, searching flights, available planes, jet availability, show me jets, find me a jet.'
      },
      {
        name: 'createBooking',
        description: 'Create a new booking. Use for: book a jet, make a reservation, schedule a flight, new booking, I want to book.'
      },
      {
        name: 'getBookingStatus',
        description: 'Get status of a specific booking. Use for: check booking status, where is my booking, when is my flight, booking details for [id].'
      }
    ];

    // Format tool descriptions
    const toolDescriptionsText = toolDescriptions
      .map(tool => `- ${tool.name}: ${tool.description}`)
      .join('\n');

    // Provide examples of tool usage
    const examples = [
      {
        input: 'Show my bookings',
        tool: 'listUserBookings',
        params: {},
        explanation: 'User wants to see all their bookings.'
      },
      {
        input: 'What trips do I have?',
        tool: 'listUserBookings',
        params: {},
        explanation: 'User wants to see their trips (synonym for bookings).'
      },
      {
        input: 'Search for jets from New York to Los Angeles',
        tool: 'searchJets',
        params: { departure: 'New York', destination: 'Los Angeles' },
        explanation: 'User wants to search for available jets between two locations.'
      },
      {
        input: 'What is the status of booking ABC123?',
        tool: 'getBookingStatus',
        params: { bookingId: 'ABC123' },
        explanation: 'User is asking about a specific booking status.'
      },
      {
        input: 'Book me a flight to Paris',
        tool: 'createBooking',
        params: { destination: 'Paris' },
        explanation: 'User wants to create a new booking to Paris.'
      },
      {
        input: 'Hello!',
        tool: 'noToolNeeded',
        params: { message: 'Hello! How can I assist you today?' },
        explanation: 'Just a greeting, no tool needed.'
      }
    ];

    // Format examples for the prompt
    const examplesText = examples.map(ex => 
      `Input: "${ex.input}"\n` +
      `Tool: ${ex.tool}\n` +
      `Params: ${JSON.stringify(ex.params, null, 2)}`
    ).join('\n\n');

    return `You are an AI assistant that helps users book private jets. Your task is to analyze the user's request and select the most appropriate tool to handle it.

AVAILABLE TOOLS:
${toolDescriptionsText}

EXAMPLES:
${examplesText}

INSTRUCTIONS:
1. First, understand the user's intent from their request.
2. Choose the most relevant tool from the available tools list.
3. Only include parameters that are explicitly mentioned in the user's request.
4. If the request is about viewing existing bookings/trips, ALWAYS use 'listUserBookings'.
5. If the request is about searching for jets, use 'searchJets'.
6. Only use 'createBooking' when the user explicitly wants to make a new booking.
7. If no tool is needed (e.g., greetings, general questions), use 'noToolNeeded'.
8. Your response MUST be a valid JSON object with 'tool' and 'params' fields.
9. DO NOT make up parameters that weren't in the original request.


CURRENT REQUEST: "${prompt}"

RESPONSE (MUST BE VALID JSON):`;
  }
}