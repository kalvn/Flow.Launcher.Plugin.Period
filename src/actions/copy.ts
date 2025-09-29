import clipboard from 'clipboardy';

export function copy (text: string | undefined): void {
  if (text !== undefined) {
    clipboard.writeSync(text);
  }
}
