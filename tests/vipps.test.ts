// Kjør: npx tsx tests/vipps.test.ts
// Vippsnummeret må være likt for alle kunder, ikke hentes fra nettleserens lokale lagring.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const orders = readFileSync('src/utils/orders.ts', 'utf-8');
assert.match(orders, /export const VIPPS_NUMBER = '142786';/, 'VIPPS_NUMBER skal være 142786');

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : [p];
  });
}
for (const f of files('src')) {
  const src = readFileSync(f, 'utf-8');
  assert.doesNotMatch(src, /nfc_vipps_number/, `${f} leser Vippsnummer fra localStorage`);
  assert.doesNotMatch(src, /'938823014'/, `${f} bruker org.nr som Vippsnummer`);
}
console.log('OK: Vippsnummer 142786 er felles for alle kunder');
