import { readFileSync, writeFileSync } from 'fs';

const file = 'src/components/InitialLoading.jsx';
const raw = readFileSync(file, 'utf8');

// Collapse runs of blank lines (>1) down to at most 1
const clean = raw.replace(/(\r?\n){3,}/g, '\n\n');
writeFileSync(file, clean, 'utf8');
console.log('Done. Lines:', clean.split('\n').length);
