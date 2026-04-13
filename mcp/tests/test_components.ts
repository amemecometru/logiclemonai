import { Box, Text } from '@opentui/core';

console.log('✓ Box and Text imported successfully');

// Test creating actual components
const box = Box({ width: 10, height: 3, backgroundColor: '#000000', border: '1px solid #ffff00' });
const text = Text({ content: 'TEST', fg: '#ffff00' });
console.log('✓ Actual OpenTUI components created');
console.log('Box type:', typeof box);
console.log('Text type:', typeof text);
