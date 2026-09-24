import assert from 'node:assert/strict';
import { calculateIpRange } from '../public/assets/js/lib/range.js';

test('192.168.1.10 -> 192.168.1.100 totals 91 addresses', () => {
  const r = calculateIpRange('192.168.1.10', '192.168.1.100');
  assert.equal(r.totalAddresses, 91);
  assert.ok(r.cidrBlocks.length > 0);
  // Verify the blocks sum to the same total.
  const sum = r.cidrBlocks.reduce((acc, b) => acc + b.size, 0);
  assert.equal(sum, 91);
});

test('a range that is exactly one CIDR block summarizes to one block', () => {
  const r = calculateIpRange('192.168.1.0', '192.168.1.255');
  assert.equal(r.cidrBlocks.length, 1);
  assert.equal(r.cidrBlocks[0].notation, '192.168.1.0/24');
});

test('rejects start > end', () => {
  assert.throws(() => calculateIpRange('192.168.1.100', '192.168.1.10'));
});
