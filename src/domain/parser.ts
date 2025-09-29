import { Temporal } from 'temporal-polyfill';

const REGEX_FROM_TIME = /^\d\d:\d\d([-+]\d\d:\d\d)+$/g;
const REGEX_FROM_DATE = /^\d{4}-\d{2}-\d{2}$/g;

type Sign = '+' | '-';

export type ParseResult = {
  title: string,
  subtitle: string
};

function isSign (input: string): input is Sign {
  return ['-', '+'].includes(input);
}

export function parse (input: string | undefined): ParseResult[] {
  if (input === undefined || input.trim() === '') {
    return [];
  }

  const cleanInput = input.replace(/[^A-Za-z0-9-+:]+/g, '').toLowerCase();

  if (REGEX_FROM_TIME.test(cleanInput)) {
    return parseFromTime(cleanInput);
  }

  if (REGEX_FROM_DATE.test(cleanInput)) {
    return parseFromDate(cleanInput);
  }

  return [];
}

/**
 * Parses user input that starts with a time, like `10:06 + 05:55`.
 * @param input User input.
 * @returns List of results.
 */
function parseFromTime (input: string): ParseResult[] {
  const chunks: Array<{ sign: '-' | '+', value: string }> = [];

  let currentSign: Sign = '+';
  let buffer = '';

  for (const char of input) {
    if (isSign(char)) {
      if (buffer.length > 0) {
        chunks.push({
          sign: currentSign,
          value: buffer
        });

        buffer = '';
      }

      currentSign = char;
      continue;
    }

    buffer += char;
  }

  chunks.push({
    sign: currentSign,
    value: buffer
  });

  let duration: Temporal.Duration | undefined;

  for (const chunk of chunks) {
    const [hours, minutes, seconds] = chunk.value.split(':').map(Number);

    if (duration === undefined) {
      duration = Temporal.Duration.from({ hours: hours ?? 0, minutes: minutes ?? 0, seconds: seconds ?? 0 });
      continue;
    }

    const d = Temporal.Duration.from({ hours: hours ?? 0, minutes: minutes ?? 0, seconds: seconds ?? 0 });

    if (chunk.sign === '+') {
      duration = duration.add(d);
    } else if (chunk.sign === '-') {
      duration = duration.subtract(d);
    }
  }

  if (duration !== undefined) {
    return [
      {
        title: `${duration.hours.toString().padStart(2, '0')}:${duration.minutes.toString().padStart(2, '0')}`,
        subtitle: duration.toLocaleString()
      },
      {
        title: duration.toString(),
        subtitle: 'ISO duration'
      }
    ];
  }

  return [];
}

function parseFromDate (input: string): ParseResult[] {
  const date = Temporal.PlainDateTime.from(input);
  const dateInstance = new Date(date.toString());

  return [
    { title: date.toLocaleString(), subtitle: 'Locale string' },
    {
      title: new Intl.DateTimeFormat(undefined, {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }).format(dateInstance),
      subtitle: 'Local date and time'
    },
    { title: (Date.parse(date.toString()) / 1_000_000).toString(), subtitle: 'Timestamp in seconds' },
    { title: (Date.parse(date.toString()) / 1000).toString(), subtitle: 'Timestamp in milliseconds' }
  ];
}
