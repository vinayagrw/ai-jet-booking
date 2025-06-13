import { LocalLLMClient } from './llm/localClient.js';

async function testSimple() {
  const llm = new LocalLLMClient();

  console.log('Testing simple prompt...');
  const response = await llm.generateWithTools('Say hello', {});
  console.log('Response:', response);

  console.log('\nTesting with one tool...');
  const response2 = await llm.generateWithTools('I want to search for jets from Delhi to Mumbai', {
    searchJets: {
      description: 'Search for available jets based on criteria',
      parameters: {
        departure: 'string',
        arrival: 'string',
        date: 'string'
      }
    }
  });
  console.log('Response:', response2);
}

// Run the test
testSimple().catch(console.error); 