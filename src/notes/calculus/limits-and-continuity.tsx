import { useMemo, useState } from 'react';
import { useLanguage } from '@/components/language-context';
import { Math as KaTeXMath } from '@/components/notes/Math';
import { Section } from '@/components/notes/Section';
import { SubSection } from '@/components/notes/SubSection';
import { Text } from '@/components/notes/Text';
import { Slider } from '@/components/ui/slider';
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
  const { locale } = useLanguage();
  const x0 = 2;
  const fx0 = 4;
  const isZh = locale === 'zh-CN';

  const samples = useMemo(() => {
    return [-delta, -delta / 2, 0, delta / 2, delta].map((offset) => {
      const x = x0 + offset;
      const band = epsilonBand(x, epsilon);
      return { x, y: band.y };
    });
  }, [delta, epsilon]);

  return (
    <div className="not-prose rounded-xl border border-border bg-card/70 p-4">
      <p className="mb-3 text-sm font-medium">
        {isZh ? 'f(x)=x² 在 x=2 处的 ε-δ 探索器' : 'Epsilon-Delta explorer for f(x) = x^2 at x = 2'}
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 text-sm">
          <label className="block">
            ε ({epsilon.toFixed(2)})
            <Slider className="mt-1" min={0.05} max={1.5} step={0.05} value={epsilon} onValueChange={setEpsilon} />
          </label>
          <label className="block">
            δ ({delta.toFixed(2)})
            <Slider className="mt-1" min={0.05} max={1.5} step={0.05} value={delta} onValueChange={setDelta} />
          </label>
          <p className="text-xs text-muted-foreground">{isZh ? '目标点：' : 'Target point:'} (2, 4)</p>
        </div>

        <div className="rounded-lg border border-border bg-background p-3 text-xs">
          <p className="mb-2 font-medium">{isZh ? '区间 (2-δ, 2+δ) 内的采样点' : 'Sample points in (2-delta, 2+delta)'}</p>
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
  const { locale } = useLanguage();
  const isZh = locale === 'zh-CN';

  return (
    <>
      <Section title={isZh ? 'ε-δ 定义' : 'Epsilon-Delta'}>
        <Text>
          {isZh
            ? String.raw`严格定义为：对任意 \\(\epsilon > 0\\)，都存在 \\(\delta > 0\\)，使得当 \\(0 < |x-a| < \delta\\) 时，一定有 \\(|f(x)-L| < \epsilon\\)。`
            : String.raw`The formal definition says: for every \(\epsilon > 0\), there exists \(\delta > 0\) such that \(0 < |x-a| < \delta\) implies \(|f(x)-L| < \epsilon\).`}
        </Text>
        <KaTeXMath block>{String.raw`\lim_{x \to a} f(x) = L`}</KaTeXMath>
        <EpsilonDeltaDemo />
      </Section>

      <Section title={isZh ? '夹逼定理' : 'Squeeze Theorem'}>
        <p>
          {isZh
            ? '若 g(x) ≤ f(x) ≤ h(x)，且两侧函数都收敛到 L，则 f(x) 也收敛到 L。'
            : 'If g(x) <= f(x) <= h(x) and both outer functions converge to L, then f(x) also converges to L.'}
        </p>
        <KaTeXMath block>{String.raw`g(x) \le f(x) \le h(x), \ \lim_{x\to a}g(x)=\lim_{x\to a}h(x)=L \Rightarrow \lim_{x\to a}f(x)=L`}</KaTeXMath>
      </Section>

      <Section title={isZh ? '间断点类型' : 'Types of Discontinuity'}>
        <SubSection title={isZh ? '可去间断点' : 'Removable'}>
          <p>{isZh ? '极限存在，但 f(a) 缺失或与极限值不一致。' : 'The limit exists, but f(a) is missing or mismatched.'}</p>
        </SubSection>
        <SubSection title={isZh ? '跳跃间断点' : 'Jump'}>
          <p>{isZh ? '左右极限都存在，但二者不相等。' : 'Left and right limits exist but differ.'}</p>
        </SubSection>
        <SubSection title={isZh ? '无穷间断点' : 'Infinite'}>
          <p>{isZh ? '函数值在该点附近发散到无穷。' : 'Function magnitude diverges near a point.'}</p>
        </SubSection>
      </Section>
    </>
  );
}
