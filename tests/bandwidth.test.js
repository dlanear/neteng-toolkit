import assert from 'node:assert/strict';
import { calculateTransferTime, calculateRequiredBandwidth } from '../public/assets/js/lib/bandwidth.js';

test('100 MB over 100 Mbps takes 8 seconds', () => {
  const r = calculateTransferTime(100, 'MB', 100, 'Mbps');
  assert.equal(r.seconds, 8);
});

test('reverse mode: 100 MB in 8 seconds requires 100 Mbps', () => {
  const r = calculateRequiredBandwidth(100, 'MB', 8);
  assert.equal(r.mbps, 100);
});

test('rejects zero or negative size', () => {
  assert.throws(() => calculateTransferTime(0, 'MB', 100, 'Mbps'));
});
