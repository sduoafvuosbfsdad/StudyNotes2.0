import { useMemo, useState } from 'react';
import { Section } from '@/components/notes/Section';
import { SubSection } from '@/components/notes/SubSection';
import { Math } from '@/components/notes/Math';
import { Text } from '@/components/notes/Text';
import { Badge } from '@/components/ui/badge';
import { meta } from './vectors-and-spaces.meta';

export { meta };

function clampToCanvas(value: number): number {
  return 120 + value * 18;
}

function VectorAdditionDemo() {
  const [ax, setAx] = useState(2);
  const [ay, setAy] = useState(3);
  const [bx, setBx] = useState(4);
  const [by, setBy] = useState(-1);

  const sum = useMemo(() => ({ x: ax + bx, y: ay + by }), [ax, ay, bx, by]);

  return (
    <div className="not-prose rounded-xl border border-border bg-card/70 p-4">
      <p className="mb-3 text-sm font-medium text-foreground">Vector addition visualizer</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 text-sm">
          <label className="block">
            a_x ({ax})
            <input
              className="mt-1 w-full"
              type="range"
              min={-5}
              max={6}
              value={ax}
              onChange={(event) => setAx(Number(event.target.value))}
            />
          </label>
          <label className="block">
            a_y ({ay})
            <input
              className="mt-1 w-full"
              type="range"
              min={-5}
              max={6}
              value={ay}
              onChange={(event) => setAy(Number(event.target.value))}
            />
          </label>
          <label className="block">
            b_x ({bx})
            <input
              className="mt-1 w-full"
              type="range"
              min={-5}
              max={6}
              value={bx}
              onChange={(event) => setBx(Number(event.target.value))}
            />
          </label>
          <label className="block">
            b_y ({by})
            <input
              className="mt-1 w-full"
              type="range"
              min={-5}
              max={6}
              value={by}
              onChange={(event) => setBy(Number(event.target.value))}
            />
          </label>
        </div>

        <svg viewBox="0 0 240 240" className="h-60 w-full rounded-lg border border-border bg-background">
          <defs>
            <marker id="arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L6,3 L0,6 z" fill="currentColor" />
            </marker>
          </defs>

          <line x1="0" y1="120" x2="240" y2="120" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
          <line x1="120" y1="0" x2="120" y2="240" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />

          <line
            x1="120"
            y1="120"
            x2={clampToCanvas(ax)}
            y2={clampToCanvas(-ay)}
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            markerEnd="url(#arrow)"
          />

          <line
            x1="120"
            y1="120"
            x2={clampToCanvas(bx)}
            y2={clampToCanvas(-by)}
            stroke="hsl(var(--accent))"
            strokeWidth="3"
            markerEnd="url(#arrow)"
          />

          <line
            x1="120"
            y1="120"
            x2={clampToCanvas(sum.x)}
            y2={clampToCanvas(-sum.y)}
            stroke="hsl(var(--foreground))"
            strokeWidth="3.5"
            markerEnd="url(#arrow)"
          />
        </svg>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        a = ({ax}, {ay}), b = ({bx}, {by}), a + b = ({sum.x}, {sum.y})
      </p>
    </div>
  );
}

export default function VectorsAndSpaces() {
  return (
    <>
      <Section title="Introduction">
        <Text>{String.raw`A vector in \(\mathbb{R}^n\) is an ordered tuple representing magnitude and direction. Vector spaces define a consistent algebra over addition and scalar multiplication.`}</Text>
        <p>
          We use vector spaces to model geometry, machine learning features, and optimization problems.
        </p>
      </Section>

      <Section title="Vector Operations">
        <SubSection title="Dot Product">
          <p>
            The dot product quantifies alignment between vectors and is used in projections and cosine
            similarity.
          </p>
          <Math block>{String.raw`\mathbf{u} \cdot \mathbf{v} = \sum_{i=1}^{n} u_i v_i`}</Math>
        </SubSection>

        <SubSection title="Cross Product">
          <p>The cross product in three dimensions returns a vector orthogonal to both inputs.</p>
          <Math block>{String.raw`\mathbf{u} \times \mathbf{v} =
\begin{vmatrix}
\mathbf{i} & \mathbf{j} & \mathbf{k} \\
u_1 & u_2 & u_3 \\
v_1 & v_2 & v_3
\end{vmatrix}`}</Math>
        </SubSection>
      </Section>

      <Section title="Span and Basis">
        <p>
          The span of a set of vectors is all linear combinations of those vectors. A basis is a minimal
          spanning set that is linearly independent.
        </p>
        <Math block>{String.raw`\mathrm{span}(S) = \left\{\sum_{i=1}^{k} c_i\mathbf{v}_i : c_i \in \mathbb{R}\right\}`}</Math>
        <div className="not-prose mt-2 flex gap-2">
          <Badge variant="secondary">Span</Badge>
          <Badge variant="outline">Linear Independence</Badge>
          <Badge>Basis</Badge>
        </div>
      </Section>

      <Section title="Practice">
        <p>Use the controls to see how vector addition composes direction and magnitude.</p>
        <VectorAdditionDemo />
      </Section>
    </>
  );
}
