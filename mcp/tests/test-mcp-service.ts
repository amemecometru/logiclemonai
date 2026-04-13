import { MCPService } from './src/services/mcpService.ts';

async function test() {
  console.log('Testing MCP Service connection...');
  const service = new MCPService();
  
  try {
    const initialized = await service.initialize();
    console.log('Initialized:', initialized);
    
    if (initialized) {
      console.log('Testing deepResearch with simulated payment...');
      const result = await service.deepResearch('https://example.com', {
        extractor: 'llm-extraction',
        paymentSessionId: 'cs_test_fake123',
        saveToDrive: true
      });
      
      console.log('Result:', JSON.stringify(result, null, 2));
    }
    
    await service.shutdown();
    console.log('Test completed');
  } catch (error) {
    console.error('Test error:', error);
    await service.shutdown();
  }
}

test();
