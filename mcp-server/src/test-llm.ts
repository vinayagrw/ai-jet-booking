import { AIConcierge, AdminAssistant, ReportingAgent } from './agents/index.js';
import { createUser } from './tools/createUser.js';
import { authenticate } from './tools/auth.js';

const TEST_USER = {
  email: 'testuser1@example.com',
  password: 'TestPassword123!',
  name: 'Test User'
};

async function testLLM() {
  // Register user
  console.log('Registering test user...');
  const userResult = await createUser.handler(TEST_USER);
  console.log('User registration:', userResult);

  // Authenticate user
  console.log('Authenticating test user...');
  const authResult = await authenticate.handler({ email: TEST_USER.email, password: TEST_USER.password });
  console.log('Authentication:', authResult);

  console.log('Testing AI Concierge...');
  const concierge = new AIConcierge();
  
  // Test booking flow
  console.log('\n1. Initial greeting:');
  const greeting = await concierge.handleRequest('Hi, I want to book a jet');
  console.log(JSON.stringify(greeting, null, 2));

  console.log('\n2. Search for jets:');
  const search = await concierge.handleRequest('I need a heavy jet from Delhi to Mumbai next Friday for 4 passengers');
  console.log(JSON.stringify(search, null, 2));

  console.log('\n3. Create booking:');
  const booking = await concierge.handleRequest('Book the Gulfstream G650 for me');
  console.log(JSON.stringify(booking, null, 2));

  // Test Admin Assistant
  console.log('\nTesting Admin Assistant...');
  const admin = new AdminAssistant();

  console.log('\n1. Fleet management:');
  const fleet = await admin.handleRequest('Update the status of jet1 to maintenance');
  console.log(JSON.stringify(fleet, null, 2));

  console.log('\n2. Membership management:');
  const membership = await admin.handleRequest('Create a premium membership for user123');
  console.log(JSON.stringify(membership, null, 2));

  // Test Reporting Agent
  console.log('\nTesting Reporting Agent...');
  const reporter = new ReportingAgent();

  console.log('\n1. Booking report:');
  const bookingReport = await reporter.handleRequest('Show me the booking report for last month');
  console.log(JSON.stringify(bookingReport, null, 2));

  console.log('\n2. Revenue report:');
  const revenueReport = await reporter.handleRequest('What was our revenue last quarter?');
  console.log(JSON.stringify(revenueReport, null, 2));
}

// Run the tests
testLLM().catch(console.error); 