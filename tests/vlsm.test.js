import assert from 'node:assert/strict';
import { calculateVLSM } from '../public/assets/js/lib/vlsm.js';

test('192.168.10.0/24 with 100/50/25/10 host requirements fits and allocates correctly', () => {
  const result = calculateVLSM('192.168.10.0/24', [
    { name: 'Department A', hosts: 100 },
    { name: 'Department B', hosts: 50 },
    { name: 'Department C', hosts: 25 },
    { name: 'Department D', hosts: 10 },
  ]);

  assert.equal(result.success, true);
  assert.equal(result.allocations.length, 4);

  const a = result.allocations[0];
  assert.equal(a.name, 'Department A');
  assert.equal(a.cidr, 25); // /25 = 126 usable, smallest block for 100 hosts
  assert.equal(a.network, '192.168.10.0');

  const b = result.allocations[1];
  assert.equal(b.cidr, 26); // /26 = 62 usable, smallest block for 50 hosts
  assert.equal(b.network, '192.168.10.128');

  const c = result.allocations[2];
  assert.equal(c.cidr, 27); // /27 = 30 usable, smallest block for 25 hosts
  assert.equal(c.network, '192.168.10.192');

  const d = result.allocations[3];
  assert.equal(d.cidr, 28); // /28 = 14 usable, smallest block for 10 hosts
  assert.equal(d.network, '192.168.10.224');
});

test('reports failure clearly when requirements do not fit', () => {
  const result = calculateVLSM('192.168.10.0/28', [
    { name: 'Too Big', hosts: 100 },
  ]);
  assert.equal(result.success, false);
  assert.match(result.error, /cannot fit/);
});
