import assert from 'node:assert/strict';
import { maskToWildcard, wildcardToMask } from '../public/assets/js/lib/wildcard.js';

test('255.255.255.0 -> 0.0.0.255', () => {
  assert.equal(maskToWildcard('255.255.255.0'), '0.0.0.255');
});

test('0.0.0.255 -> 255.255.255.0', () => {
  assert.equal(wildcardToMask('0.0.0.255'), '255.255.255.0');
});

test('255.255.255.240 -> 0.0.0.15', () => {
  assert.equal(maskToWildcard('255.255.255.240'), '0.0.0.15');
});
