import { useMemo, useState } from 'react';
import { useLanguage } from '@/components/language-context';
import { Math } from '@/components/notes/Math';
import { Section } from '@/components/notes/Section';
import { SubSection } from '@/components/notes/SubSection';
import { Text } from '@/components/notes/Text';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
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
  const { locale } = useLanguage();
  const isZh = locale === 'zh-CN';

  const sum = useMemo(() => ({ x: ax + bx, y: ay + by }), [ax, ay, bx, by]);

  return (
    <div className="not-prose rounded-xl border border-border bg-card/70 p-4">
      <p className="mb-3 text-sm font-medium text-foreground">{isZh ? '向量加法可视化' : 'Vector addition visualizer'}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 text-sm">
          <label className="block">
            a_x ({ax})
            <Slider className="mt-1" min={-5} max={6} value={ax} onValueChange={setAx} />
          </label>
          <label className="block">
            a_y ({ay})
            <Slider className="mt-1" min={-5} max={6} value={ay} onValueChange={setAy} />
          </label>
          <label className="block">
            b_x ({bx})
            <Slider className="mt-1" min={-5} max={6} value={bx} onValueChange={setBx} />
          </label>
          <label className="block">
            b_y ({by})
            <Slider className="mt-1" min={-5} max={6} value={by} onValueChange={setBy} />
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

          <line x1="120" y1="120" x2={clampToCanvas(ax)} y2={clampToCanvas(-ay)} stroke="hsl(var(--primary))" strokeWidth="3" markerEnd="url(#arrow)" />

          <line x1="120" y1="120" x2={clampToCanvas(bx)} y2={clampToCanvas(-by)} stroke="hsl(var(--accent))" strokeWidth="3" markerEnd="url(#arrow)" />

          <line x1="120" y1="120" x2={clampToCanvas(sum.x)} y2={clampToCanvas(-sum.y)} stroke="hsl(var(--foreground))" strokeWidth="3.5" markerEnd="url(#arrow)" />
        </svg>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        a = ({ax}, {ay}), b = ({bx}, {by}), a + b = ({sum.x}, {sum.y})
      </p>
    </div>
  );
}

export default function VectorsAndSpaces() {
  const { locale } = useLanguage();
  const isZh = locale === 'zh-CN';

  return (
    <>
      <Section title={isZh ? '简介' : 'Introduction'}>
        <Text>
          {isZh
            ? String.raw`\\(\mathbb{R}^n\\) 中的向量是表示大小与方向的有序数组。向量空间为向量加法与数乘提供统一且自洽的代数结构。`
            : String.raw`A vector in \(\mathbb{R}^n\) is an ordered tuple representing magnitude and direction. Vector spaces define a consistent algebra over addition and scalar multiplication.`}
        </Text>
        <p>{isZh ? '向量空间广泛用于几何建模、机器学习特征表示与优化问题。' : 'We use vector spaces to model geometry, machine learning features, and optimization problems.'}</p>
      </Section>

      <Section title={isZh ? '向量运算' : 'Vector Operations'}>
        <SubSection title={isZh ? '点积' : 'Dot Product'}>
          <p>{isZh ? '点积用于衡量两个向量的对齐程度，常见于投影与余弦相似度。' : 'The dot product quantifies alignment between vectors and is used in projections and cosine similarity.'}</p>
          <Math block>{String.raw`\mathbf{u} \cdot \mathbf{v} = \sum_{i=1}^{n} u_i v_i`}</Math>
        </SubSection>

        <SubSection title={isZh ? '叉积' : 'Cross Product'}>
          <p>{isZh ? '在三维空间中，叉积得到一个同时垂直于两个输入向量的向量。' : 'The cross product in three dimensions returns a vector orthogonal to both inputs.'}</p>
          <Math block>{String.raw`\mathbf{u} \times \mathbf{v} =
\begin{vmatrix}
\mathbf{i} & \mathbf{j} & \mathbf{k} \\
u_1 & u_2 & u_3 \\
v_1 & v_2 & v_3
\end{vmatrix}`}</Math>
        </SubSection>
      </Section>

      <Section title={isZh ? '张成与基' : 'Span and Basis'}>
        <p>{isZh ? '向量组的张成是这些向量所有线性组合的集合。基是线性无关且能张成整个空间的最小向量组。' : 'The span of a set of vectors is all linear combinations of those vectors. A basis is a minimal spanning set that is linearly independent.'}</p>
        <Math block>{String.raw`\mathrm{span}(S) = \left\{\sum_{i=1}^{k} c_i\mathbf{v}_i : c_i \in \mathbb{R}\right\}`}</Math>
        <div className="not-prose mt-2 flex gap-2">
          <Badge variant="secondary">{isZh ? '张成' : 'Span'}</Badge>
          <Badge variant="outline">{isZh ? '线性无关' : 'Linear Independence'}</Badge>
          <Badge>{isZh ? '基' : 'Basis'}</Badge>
        </div>
      </Section>

      <Section title={isZh ? '练习' : 'Practice'}>
        <p>{isZh ? '调节参数，观察向量加法如何组合方向与大小。' : 'Use the controls to see how vector addition composes direction and magnitude.'}</p>
        <VectorAdditionDemo />
      </Section>
    </>
  );
}
