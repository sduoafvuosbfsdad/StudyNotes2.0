import { useMemo, useState } from 'react';
import { Section } from '@/components/notes/Section';
import { SubSection } from '@/components/notes/SubSection';
import { Math as KaTeXMath } from '@/components/notes/Math';
import { Text } from '@/components/notes/Text';
import { meta } from './limits-and-continuity.meta';

export { meta };

function epsilonBand(x: number, epsilon: number) {
  const y = x * x;
  return {
    y,
    lower: y - epsilon,
    upper: y + epsilon
  };
}

function EpsilonDeltaDemo() {
  const [epsilon, setEpsilon] = useState(0.4);
  const [delta, setDelta] = useState(0.5);
  const x0 = 2;
  const fx0 = 4;

  const samples = useMemo(() => {
    return [-delta, -delta / 2, 0, delta / 2, delta].map((offset) => {
      const x = x0 + offset;
      const band = epsilonBand(x, epsilon);
      return { x, y: band.y };
    });
  }, [delta, epsilon]);

  return (
    <div className="not-prose rounded-xl border border-border bg-card/70 p-4">
      <p className="mb-3 text-sm font-medium">Epsilon-Delta explorer for f(x) = x^2 at x = 2</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 text-sm">
          <label className="block">
            epsilon ({epsilon.toFixed(2)})
            <input
              className="mt-1 w-full"
              type="range"
              min={0.05}
              max={1.5}
              step={0.05}
              value={epsilon}
              onChange={(event) => setEpsilon(Number(event.target.value))}
            />
          </label>
          <label className="block">
            delta ({delta.toFixed(2)})
            <input
              className="mt-1 w-full"
              type="range"
              min={0.05}
              max={1.5}
              step={0.05}
              value={delta}
              onChange={(event) => setDelta(Number(event.target.value))}
            />
          </label>
          <p className="text-xs text-muted-foreground">Target point: (2, 4)</p>
        </div>

        <div className="rounded-lg border border-border bg-background p-3 text-xs">
          <p className="mb-2 font-medium">Sample points in (2-delta, 2+delta)</p>
          <ul className="space-y-1">
            {samples.map((sample) => {
              const inside = Math.abs(sample.y - fx0) < epsilon;
              return (
                <li key={sample.x} className={inside ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600'}>
                  x = {sample.x.toFixed(2)}, f(x) = {sample.y.toFixed(3)}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function LimitsAndContinuity() {
  return (
    <>
      <Section title="Epsilon-Delta">
        <Text>{String.raw`The formal definition says: for every \(\epsilon > 0\), there exists \(\delta > 0\) such that \(0 < |x-a| < \delta\) implies \(|f(x)-L| < \epsilon\).`}</Text>
        <KaTeXMath block>{String.raw`\lim_{x \to a} f(x) = L`}</KaTeXMath>
        <EpsilonDeltaDemo />
      </Section>

      <Section title="Squeeze Theorem">
        <p>If g(x) &lt;= f(x) &lt;= h(x) and both outer functions converge to L, then f(x) also converges to L.</p>
        <KaTeXMath block>{String.raw`g(x) \le f(x) \le h(x), \ \lim_{x\to a}g(x)=\lim_{x\to a}h(x)=L \Rightarrow \lim_{x\to a}f(x)=L`}</KaTeXMath>
      </Section>

      <Section title="Types of Discontinuity">
        <SubSection title="Removable">
          <p>The limit exists, but f(a) is missing or mismatched.</p>
        </SubSection>
        <SubSection title="Jump">
          <p>Left and right limits exist but differ.</p>
        </SubSection>
        <SubSection title="Infinite">
          <p>Function magnitude diverges near a point.</p>
        </SubSection>
      </Section>
    </>
  );
}
