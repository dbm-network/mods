#!/usr/bin/env node
/**
 * Add radix 10 to single-argument parseInt(...) calls in JS files.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const roots = ['actions', 'events', 'extensions', 'sharder'].map((r) => path.join(__dirname, '..', r));

function walkDir(dir, acc) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name);
    if (name.isDirectory()) walkDir(p, acc);
    else if (name.isFile() && name.name.endsWith('.js')) acc.push(p);
  }
  return acc;
}

function fixParseIntCalls(source) {
  const needle = 'parseInt(';
  let out = '';
  let i = 0;
  while (i < source.length) {
    const idx = source.indexOf(needle, i);
    if (idx === -1) {
      out += source.slice(i);
      break;
    }
    out += source.slice(i, idx);
    let j = idx + needle.length;
    let depth = 1;
    const argStart = j;
    while (j < source.length && depth > 0) {
      const c = source[j];
      if (c === '(') depth++;
      else if (c === ')') depth--;
      j++;
    }
    const inner = source.slice(argStart, j - 1);
    let d = 0;
    let topLevelComma = false;
    for (let k = 0; k < inner.length; k++) {
      const ch = inner[k];
      if (ch === '(') d++;
      else if (ch === ')') d--;
      else if (ch === ',' && d === 0) {
        topLevelComma = true;
        break;
      }
    }
    if (!topLevelComma && inner.trim().length > 0) {
      out += 'parseInt(' + inner + ', 10)';
    } else {
      out += source.slice(idx, j);
    }
    i = j;
  }
  return out;
}

let changed = 0;
for (const root of roots) {
  const files = walkDir(root, []);
  for (const file of files) {
    const before = fs.readFileSync(file, 'utf8');
    const after = fixParseIntCalls(before);
    if (after !== before) {
      fs.writeFileSync(file, after, 'utf8');
      changed++;
    }
  }
}
console.error('eslint-fix-radix-parseint: updated ' + changed + ' files');
