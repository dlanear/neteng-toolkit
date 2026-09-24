// Minimal dependency-free test runner. Each *.test.js file in this directory
// exports an array of { name, fn } test cases (see ipv4.test.js for the
// `test()` helper). Run with: node tests/run.js
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let passed = 0;
let failed = 0;
const failures = [];

globalThis.__tests__ = [];
globalThis.test = (name, fn) => globalThis.__tests__.push({ name, fn });

const files = readdirSync(__dirname).filter((f) => f.endsWith('.test.js'));

for (const file of files) {
  globalThis.__tests__ = [];
  await import(join(__dirname, file));
  for (const { name, fn } of globalThis.__tests__) {
    try {
      await fn();
      passed++;
      console.log(`  \u2713 ${file} :: ${name}`);
    } catch (err) {
      failed++;
      failures.push({ file, name, err });
      console.log(`  \u2717 ${file} :: ${name}`);
      console.log(`      ${err.message}`);
    }
  }
}

console.log(`\n${passed} passed, ${failed} failed (${files.length} test files)`);
if (failed > 0) process.exit(1);
