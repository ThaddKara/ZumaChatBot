import { CheckingAvailability } from './CheckingAvailability';
import { CheckPetPolicy } from './CheckPetPolicy';
import { GetPricing } from './GetPricing';

// Local mock classifier classes
class MockCheckAvailabilityClassifier {
  openai = {};
  async classifyBedrooms(userInput: string) {
    if (userInput.includes('studio')) return 'studio';
    if (userInput.includes('1br')) return '1br';
    if (userInput.includes('2br')) return '2br';
    return 'unknown';
  }
}

class MockCheckPetPolicyClassifier {
  openai = {};
  async classifyPetType(userInput: string) {
    if (userInput.includes('cat')) return 'cat';
    if (userInput.includes('dog')) return 'dog';
    return 'unknown';
  }
}

class MockGetPricingClassifier {
  openai = {};
  async classifyPricingContext(userInput: string) {
    if (userInput.includes('301')) return { unitId: '301', moveInDate: null };
    if (userInput.includes('201')) return { unitId: '201', moveInDate: null };
    return { unitId: null, moveInDate: null };
  }
}

function assert(condition: any, message: string) {
  if (!condition) throw new Error('Assertion failed: ' + message);
}

async function run() {
  console.log('--- CheckingAvailability (mocked) ---');
  const ca = new CheckingAvailability(new MockCheckAvailabilityClassifier() as any);
  const caResult = await ca.execute({ context: 'I want a 1br', date: '2025-08-01' });
  console.log('Result:', caResult);
  assert(caResult.success === true, 'CheckingAvailability should succeed');
  assert(caResult.data.room.type === '1br', 'Room type should be 1br');

  console.log('\n--- CheckPetPolicy (mocked) ---');
  const cpp = new CheckPetPolicy(new MockCheckPetPolicyClassifier() as any);
  const cppResult = await cpp.execute({ context: 'Are dogs allowed in 201?', room_name: '201' });
  console.log('Result:', cppResult);
  assert(cppResult.success === true, 'CheckPetPolicy should succeed');
  assert(cppResult.data.petType === 'dog', 'Pet type should be dog');

  console.log('\n--- GetPricing (mocked) ---');
  const gp = new GetPricing(new MockGetPricingClassifier() as any);
  const gpResult = await gp.execute({ context: 'What is the price for 301?', room_name: '301' });
  console.log('Result:', gpResult);
  assert(gpResult.success === true, 'GetPricing should succeed');
  assert(gpResult.data.room.name === '301', 'Room name should be 301');

  console.log('\nAll assertions passed!');
}

run().catch(err => {
  console.error('Error running mock-tool-test:', err);
  process.exit(1);
}); 