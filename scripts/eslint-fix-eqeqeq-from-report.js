'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const cwd = path.join(__dirname, '..');
const r = spawnSync('npx', ['eslint', 'actions', 'events', 'extensions', 'sharder', '-f', 'json'], {
  cwd,
  encoding: 'utf8',
  maxBuffer: 80 * 1024 * 1024,
});

const raw = r.stdout;
if (!raw) {
  console.error('eslint-fix-eqeqeq-from-report: no stdout', r.stderr);
  process.exit(1);
}

const report = JSON.parse(raw);

function fixLine(line) {
  return line.replace(/(?<![=!])==(?!=)/g, '===').replace(/(?<!=)!=(?!=)/g, '!==');
}

const byFile = new Map();
for (const file of report) {
  for (const m of file.messages) {
    if (m.ruleId !== 'eqeqeq') continue;
    if (!byFile.has(file.filePath)) byFile.set(file.filePath, new Set());
    byFile.get(file.filePath).add(m.line);
  }
}

let files = 0;
for (const [filePath, lines] of byFile) {
  const content = fs.readFileSync(filePath, 'utf8');
  const arr = content.split('\n');
  let changed = false;
  for (const lineNum of lines) {
    const i = lineNum - 1;
    if (i < 0 || i >= arr.length) continue;
    const next = fixLine(arr[i]);
    if (next !== arr[i]) {
      arr[i] = next;
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, arr.join('\n'), 'utf8');
    files++;
  }
}
console.error('eslint-fix-eqeqeq-from-report: touched ' + files + ' files');
