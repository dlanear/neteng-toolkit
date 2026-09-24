import assert from 'node:assert/strict';
import { ipToBinary, binaryToIp, isValidBinaryIp } from '../public/assets/js/lib/binary.js';

test('192.168.1.10 -> binary', () => {
  assert.equal(ipToBinary('192.168.1.10'), '11000000.10101000.00000001.00001010');
});

test('binary -> 192.168.1.10', () => {
  assert.equal(binaryToIp('11000000.10101000.00000001.00001010'), '192.168.1.10');
});

test('isValidBinaryIp rejects malformed binary', () => {
  assert.equal(isValidBinaryIp('11000000.999.00000001.00001010'), false);
  assert.equal(isValidBinaryIp('not.binary.at.all'), false);
});
