// Kjør: npx tsx tests/orderId.test.ts
import assert from 'node:assert/strict';
import { generateOrderId, ORDER_ID_PATTERN } from '../src/utils/security';

const ids = new Set<string>();
for (let i = 0; i < 20000; i++) {
  const id = generateOrderId();
  assert.match(id, ORDER_ID_PATTERN, `ugyldig format: ${id}`);
  ids.add(id);
}
assert.equal(ids.size, 20000, 'ordrenumre kolliderte');
// Gamle 6-sifrede numre skal ikke godtas som sikre
assert.doesNotMatch('NFC-123456', ORDER_ID_PATTERN);
console.log('OK: 20000 unike ordrenumre i riktig format');
