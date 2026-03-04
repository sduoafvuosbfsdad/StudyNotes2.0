import { memo, useMemo } from 'react';
import { Math } from '@/components/notes/Math';

type Segment =
  | { type: 'text'; value: string }
  | { type: 'math'; value: string; block: boolean };

const MATH_PATTERN = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|(?<!\\)\$[^$\n]+?\$)/g;

function trimDelimiters(raw: string): { value: string; block: boolean } {
  if (raw.startsWith('$$') && raw.endsWith('$$')) {
    return { value: raw.slice(2, -2).trim(), block: true };
  }

  if (raw.startsWith('\\[') && raw.endsWith('\\]')) {
    return { value: raw.slice(2, -2).trim(), block: true };
  }

  if (raw.startsWith('\\(') && raw.endsWith('\\)')) {
    return { value: raw.slice(2, -2).trim(), block: false };
  }

  return { value: raw.slice(1, -1).trim(), block: false };
}

function parseSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  let cursor = 0;

  for (const match of text.matchAll(MATH_PATTERN)) {
    const index = match.index ?? 0;
    const token = match[0];

    if (index > cursor) {
      segments.push({
        type: 'text',
        value: text.slice(cursor, index)
      });
    }

    const { value, block } = trimDelimiters(token);
    segments.push({ type: 'math', value, block });
    cursor = index + token.length;
  }

  if (cursor < text.length) {
    segments.push({ type: 'text', value: text.slice(cursor) });
  }

  return segments;
}

interface TextProps {
  children: string;
  className?: string;
}

function TextComponent({ children, className }: TextProps) {
  const segments = useMemo(() => parseSegments(children), [children]);

  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (segment.type === 'text') {
          return (
            <span key={`text-${index}`}>
              {segment.value.split('\n').map((line, lineIndex, lines) => (
                <span key={`line-${lineIndex}`}>
                  {line}
                  {lineIndex < lines.length - 1 ? <br /> : null}
                </span>
              ))}
            </span>
          );
        }

        return (
          <Math key={`math-${index}`} block={segment.block}>
            {segment.value}
          </Math>
        );
      })}
    </span>
  );
}

export const Text = memo(TextComponent);
