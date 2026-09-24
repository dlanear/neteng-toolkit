import assert from 'node:assert/strict';
import { calculateSubnetFromInput } from '../public/assets/js/lib/subnet.js';

test('192.168.1.1/24 — standard subnet', () => {
  const r = calculateSubnetFromInput('192.168.1.1/24');
  assert.equal(r.networkAddress, '192.168.1.0');
  assert.equal(r.broadcastAddress, '192.168.1.255');
  assert.equal(r.firstUsable, '192.168.1.1');
  assert.equal(r.lastUsable, '192.168.1.254');
  assert.equal(r.totalAddresses, 256);
  assert.equal(r.usableAddresses, 254);
  assert.equal(r.subnetMask, '255.255.255.0');
  assert.equal(r.wildcardMask, '0.0.0.255');
});

test('10.0.0.0/8 — large classful block', () => {
  const r = calculateSubnetFromInput('10.0.0.0/8');
  assert.equal(r.networkAddress, '10.0.0.0');
  assert.equal(r.broadcastAddress, '10.255.255.255');
  assert.equal(r.totalAddresses, 16777216);
  assert.equal(r.usableAddresses, 16777214);
});

test('172.16.0.0/12', () => {
  const r = calculateSubnetFromInput('172.16.0.0/12');
  assert.equal(r.networkAddress, '172.16.0.0');
  assert.equal(r.broadcastAddress, '172.31.255.255');
  assert.equal(r.totalAddresses, 1048576);
});

test('/31 point-to-point — both addresses usable, no broadcast semantics', () => {
  const r = calculateSubnetFromInput('192.168.1.0/31');
  assert.equal(r.totalAddresses, 2);
  assert.equal(r.usableAddresses, 2);
  assert.equal(r.firstUsable, '192.168.1.0');
  assert.equal(r.lastUsable, '192.168.1.1');
  assert.ok(r.note && r.note.includes('point-to-point'));
});

test('/32 host route — single usable address', () => {
  const r = calculateSubnetFromInput('192.168.1.5/32');
  assert.equal(r.totalAddresses, 1);
  assert.equal(r.usableAddresses, 1);
  assert.equal(r.firstUsable, '192.168.1.5');
  assert.equal(r.lastUsable, '192.168.1.5');
  assert.ok(r.note && r.note.includes('single host'));
});

test('/30 tiny subnet', () => {
  const r = calculateSubnetFromInput('10.0.0.0/30');
  assert.equal(r.totalAddresses, 4);
  assert.equal(r.usableAddresses, 2);
  assert.equal(r.firstUsable, '10.0.0.1');
  assert.equal(r.lastUsable, '10.0.0.2');
});
