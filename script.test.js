const { execSync } = require('child_process');
const assert = require('assert');

const output = execSync('node script.js', { encoding: 'utf8' });
assert.ok(output.includes('Hello, World!'), 'Output does not contain expected text');
console.log('Test passed');
