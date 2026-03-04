import { useMemo, useState } from 'react';
import { Section } from '@/components/notes/Section';
import { SubSection } from '@/components/notes/SubSection';
import { Math } from '@/components/notes/Math';
import { meta } from './derivatives.meta';

export { meta };

function f(x: number): number {
  return x * x;
}

function toCanvas(x: number, y: number) {
  return {
    x: 120 + x * 40,
    y: 200 - y * 20
  };
}

function DerivativeDemo() {
  const [x0, setX0] = useState(1.2);

  const slope = 2 * x0;
  const y0 = f(x0);

  const path = useMemo(() => {
    const points: string[] = [];
    for (let x = -2.5; x <= 2.5; x += 0.1) {
      const { x: px, y: py } = toCanvas(x, f(x));
      points.push(`${px},${py}`);
    }
    return points.join(' ');
  }, []);

  const line = useMemo(() => {
    const xStart = -2.5;
    const xEnd = 2.5;
    const yStart = y0 + slope * (xStart - x0);
    const yEnd = y0 + slope * (xEnd - x0);

    return {
      start: toCanvas(xStart, yStart),
      end: toCanvas(xEnd, yEnd),
      point: toCanvas(x0, y0)
    };
  }, [slope, x0, y0]);

  return (
    <div className="not-prose rounded-xl border border-border bg-card/70 p-4">
      <p className="mb-3 text-sm font-medium">Tangent-line explorer for f(x) = x^2</p>

      <label className="mb-4 block text-sm">
        x at tangent point ({x0.toFixed(2)})
        <input
          className="mt-1 w-full"
          type="range"
          min={-2}
          max={2}
          step={0.05}
          value={x0}
          onChange={(event) => setX0(Number(event.target.value))}
        />
      </label>

      <svg viewBox="0 0 240 240" className="h-60 w-full rounded-lg border border-border bg-background">
        <line x1="0" y1="200" x2="240" y2="200" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
        <line x1="120" y1="0" x2="120" y2="240" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />

        <polyline points={path} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
        <line
          x1={line.start.x}
          y1={line.start.y}
          x2={line.end.x}
          y2={line.end.y}
          stroke="hsl(var(--accent))"
          strokeWidth="2"
        />
        <circle cx={line.point.x} cy={line.point.y} r="4" fill="hsl(var(--foreground))" />
      </svg>

      <p className="mt-3 text-sm text-muted-foreground">
        f({x0.toFixed(2)}) = {y0.toFixed(2)}, slope = f'({x0.toFixed(2)}) = {slope.toFixed(2)}
      </p>
    </div>
  );
}

export default function Derivatives() {
  return (
    <>
      <Section title="Definition">
        <p>The derivative is the instantaneous rate of change, defined as a limit of secant slopes.</p>
        <Math block>{String.raw`f'(x) = \lim_{h\to0}\frac{f(x+h)-f(x)}{h}`}</Math>
      </Section>

      <Section title="Rules">
        <SubSection title="Power Rule">
          <Math block>{String.raw`\frac{d}{dx}(x^n)=nx^{n-1}`}</Math>
        </SubSection>
        <SubSection title="Product and Quotient">
          <Math block>{String.raw`(fg)' = f'g + fg'`}</Math>
          <Math block>{String.raw`\left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^2}`}</Math>
        </SubSection>
      </Section>

      <Section title="Chain Rule">
        <p>The derivative of a composition multiplies outer and inner derivatives.</p>
        <Math block>{String.raw`\frac{d}{dx} f(g(x)) = f'(g(x))\cdot g'(x)`}</Math>
      </Section>

      <Section title="Applications">
        <p>Tangent lines, optimization, and local approximation all rely on derivatives.</p>
        <DerivativeDemo />
      </Section>
    </>
  );
}
