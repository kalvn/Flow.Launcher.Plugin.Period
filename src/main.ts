import process from 'node:process';
import type { Arguments } from './types.js';
import { copy } from './actions/copy.js';
import { query } from './actions/query.js';

const args: Arguments = JSON.parse(process.argv[2] ?? '{}');
const { method, parameters, settings } = args;

if (method === 'query') {
  const input = parameters[0] as string;

  query(input, settings);
}

if (method === 'copy') {
  const result = parameters[0] as string;

  copy(result);
}
