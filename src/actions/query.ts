import { parse, type ParseResult } from '../domain/parser.js';
import type { JsonRpcResult, Settings } from '../types.js';
import { sendJsonRpcResponse } from '../utils/flowLauncher.js';

export function query (input: string | undefined, settings: Settings): void {
  let res: ParseResult[] = [];

  try {
    res = parse(input);
  } catch (error) {
    // console.error(error);
  }

  sendJsonRpcResponse({
    result: res.map((r: ParseResult): JsonRpcResult => ({
      Title: r.title,
      Subtitle: r.subtitle,
      JsonRPCAction: {
        method: 'copy',
        parameters: [r.title]
      },
      IcoPath: 'img\\app.png',
      score: 100
    }))
  });
}
