import katex from 'katex';

export interface KaTeXRenderOptions {
  block?: boolean;
}

export function renderKatex(expression: string, options: KaTeXRenderOptions = {}): string {
  return katex.renderToString(expression, {
    throwOnError: false,
    displayMode: options.block ?? false,
    strict: 'ignore'
  });
}
