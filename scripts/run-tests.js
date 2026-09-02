/* One-shot test runner for the whole repo.

   Runs every tests/*.test.js through the current Node, then every
   server/test_*.py through the project venv, in deterministic order.
   No shell is involved: file paths are passed to spawnSync directly, so a
   file name with spaces or special characters cannot inject commands.

       node scripts/run-tests.js

   All tests run even when one fails; the summary and exit code cover the
   whole run. Exit code 0 only when every configured test passed.
*/
'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const testsDir = path.join(root, 'tests');
const serverDir = path.join(root, 'server');
const venvPython = path.join(
  serverDir,
  '.venv',
  process.platform === 'win32' ? 'Scripts' : 'bin',
  process.platform === 'win32' ? 'python.exe' : 'python'
);

const jsTests = fs.readdirSync(testsDir)
  .filter((file) => file.endsWith('.test.js'))
  .sort()
  .map((file) => ({
    label: `tests/${file}`,
    file: path.join(testsDir, file),
    cwd: root,
    command: process.execPath,
  }));

const pythonTests = fs.existsSync(venvPython)
  ? fs.readdirSync(serverDir)
      .filter((file) => file.startsWith('test_') && file.endsWith('.py'))
      .sort()
      .map((file) => ({
        label: `server/${file}`,
        file: path.join(serverDir, file),
        cwd: serverDir,
        command: venvPython,
      }))
  : null;

let passed = 0;
let failed = 0;

function runGroup(title, tests) {
  console.log(`\n== ${title} ==`);
  for (const test of tests) {
    const result = spawnSync(test.command, [test.file], {
      cwd: test.cwd,
      encoding: 'utf8',
      timeout: 120000,
      maxBuffer: 16 * 1024 * 1024,
    });
    const ok = !result.error && result.status === 0 && !result.signal;
    if (ok) {
      passed += 1;
      console.log(`PASS ${test.label}`);
      continue;
    }
    failed += 1;
    console.log(`FAIL ${test.label}`);
    if (result.error) console.log(`  ${result.error.message}`);
    if (result.signal) console.log(`  terminated by ${result.signal}`);
    if (result.stdout) console.log(result.stdout.trimEnd());
    if (result.stderr) console.log(result.stderr.trimEnd());
  }
}

runGroup('JS tests', jsTests);

if (pythonTests) {
  runGroup('Python tests', pythonTests);
} else {
  console.log('\n== Python tests ==');
  console.log(`SKIP ${venvPython} not found (create server/.venv and install requirements first)`);
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 || pythonTests === null ? 1 : 0);
