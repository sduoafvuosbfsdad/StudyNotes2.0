import { useMemo, useState } from 'react';
import { Section } from '@/components/notes/Section';
import { SubSection } from '@/components/notes/SubSection';
import { Math } from '@/components/notes/Math';
import { Slider } from '@/components/ui/slider';
import { meta } from './matrix-transformations.meta';

export { meta };

function transformPoint(a: number, b: number, c: number, d: number, x: number, y: number) {
  return {
    x: a * x + b * y,
    y: c * x + d * y
  };
}

function toCanvas(x: number, y: number) {
  return {
    x: 120 + x * 38,
    y: 120 - y * 38
  };
}

function MatrixDemo() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [d, setD] = useState(1);

  const transformed = useMemo(() => {
    const square = [
      transformPoint(a, b, c, d, 0, 0),
      transformPoint(a, b, c, d, 1, 0),
      transformPoint(a, b, c, d, 1, 1),
      transformPoint(a, b, c, d, 0, 1)
    ];

    return square.map((point) => toCanvas(point.x, point.y));
  }, [a, b, c, d]);

  const points = transformed.map((point) => `${point.x},${point.y}`).join(' ');
  const determinant = a * d - b * c;

  return (
    <div className="not-prose rounded-xl border border-border bg-card/70 p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 text-sm">
          <label className="block">
            a ({a.toFixed(1)})
            <Slider
              className="mt-1"
              min={-2}
              max={2}
              step={0.1}
              value={a}
              onValueChange={setA}
            />
          </label>
          <label className="block">
            b ({b.toFixed(1)})
            <Slider
              className="mt-1"
              min={-2}
              max={2}
              step={0.1}
              value={b}
              onValueChange={setB}
            />
          </label>
          <label className="block">
            c ({c.toFixed(1)})
            <Slider
              className="mt-1"
              min={-2}
              max={2}
              step={0.1}
              value={c}
              onValueChange={setC}
            />
          </label>
          <label className="block">
            d ({d.toFixed(1)})
            <Slider
              className="mt-1"
              min={-2}
              max={2}
              step={0.1}
              value={d}
              onValueChange={setD}
            />
          </label>
          <p className="pt-1 text-xs text-muted-foreground">det(A) = {determinant.toFixed(2)}</p>
        </div>

        <svg viewBox="0 0 240 240" className="h-60 w-full rounded-lg border border-border bg-background">
          <line x1="0" y1="120" x2="240" y2="120" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
          <line x1="120" y1="0" x2="120" y2="240" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />

          <polygon points="120,120 158,120 158,82 120,82" fill="hsl(var(--accent) / 0.2)" stroke="hsl(var(--accent))" strokeWidth="2" />
          <polygon points={points} fill="hsl(var(--primary) / 0.25)" stroke="hsl(var(--primary))" strokeWidth="2" />
        </svg>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        The blue square is the transformed unit square under your chosen matrix.
      </p>
    </div>
  );
}

export default function MatrixTransformations() {
  return (
    <>
      <Section title="Matrix Multiplication">
        <p>Linear maps compose through multiplication, which lets us chain transforms efficiently.</p>
        <Math block>{String.raw`(AB)_{ij} = \sum_{k=1}^{n} A_{ik} B_{kj}`}</Math>
      </Section>

      <Section title="Determinants">
        <SubSection title="Area Scaling">
          <p>The determinant scales area in 2D (or volume in higher dimensions).</p>
          <Math block>{String.raw`\det\begin{pmatrix} a & b \\ c & d \end{pmatrix} = ad - bc`}</Math>
        </SubSection>
      </Section>

      <Section title="Eigenvalues">
        <p>
          Eigenvectors keep direction after transformation, scaled by their eigenvalue. They explain dominant
          action in dynamical systems and PCA.
        </p>
        <Math block>{String.raw`A\mathbf{v} = \lambda\mathbf{v}`}</Math>
        <MatrixDemo />
      </Section>
    </>
  );
}
