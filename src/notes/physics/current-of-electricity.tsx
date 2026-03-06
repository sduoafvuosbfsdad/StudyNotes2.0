import type { PropsWithChildren } from 'react';
import { useLanguage } from '@/components/language-context';
import { Math } from '@/components/notes/Math';
import { Section } from '@/components/notes/Section';
import { SubSection } from '@/components/notes/SubSection';
import ammeterImage from '../../assets/images/physics/current-of-electricity/ammeter.png';
import circuitDiagramsImage from '../../assets/images/physics/current-of-electricity/circuit-diagrams.png';
import voltmeterImage from '../../assets/images/physics/current-of-electricity/voltmeter.png';
import { meta } from './current-of-electricity.meta';

export { meta };

interface NoteCardProps extends PropsWithChildren {
  title?: string;
}

function NoteCard({ title, children }: NoteCardProps) {
  return (
    <div className="not-prose rounded-xl border border-border bg-card/70 p-4">
      {title ? <p className="mb-2 text-sm font-semibold text-foreground">{title}</p> : null}
      <div className="space-y-2 text-sm text-foreground">{children}</div>
    </div>
  );
}

interface InstrumentImageProps {
  src: string;
  alt: string;
  detail?: string;
}

function InstrumentImage({ src, alt, detail }: InstrumentImageProps) {
  return (
    <figure className="not-prose rounded-xl border border-border bg-card/60 p-3">
      <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-white/95 p-2">
        <img src={src} alt={alt} className="max-h-full max-w-full object-contain" loading="lazy" />
      </div>
      {detail ? <figcaption className="mt-2 text-xs text-muted-foreground">{detail}</figcaption> : null}
    </figure>
  );
}

interface SvgInsertPlaceholderProps {
  id: string;
  label: string;
  suggestedPath: string;
  locale: 'en' | 'zh-CN';
}

function SvgInsertPlaceholder({ id, label, suggestedPath, locale }: SvgInsertPlaceholderProps) {
  const isZh = locale === 'zh-CN';

  return (
    <div className="not-prose rounded-xl border border-dashed border-border bg-muted/20 p-4">
      <p className="text-sm font-semibold text-foreground">{isZh ? `SVG 占位图：${label}` : `SVG Placeholder: ${label}`}</p>
      <p className="mt-2 text-xs text-muted-foreground">ID: {id}</p>
      <p className="mt-1 text-xs text-muted-foreground">{isZh ? '建议文件：' : 'Suggested file:'} {suggestedPath}</p>
      <div className="mt-3 flex h-44 items-center justify-center rounded-lg bg-background/80 text-xs text-muted-foreground">
        {isZh ? '请替换为最终 SVG 标注或导入的 SVG 资源。' : 'Replace this block with your final SVG markup or imported SVG asset.'}
      </div>
    </div>
  );
}

export default function CurrentOfElectricity() {
  const { locale } = useLanguage();
  const isZh = locale === 'zh-CN';

  return (
    <>
      <Section title={isZh ? '14.0 基础概念' : '14.0 basic knowledge'} className="space-y-2">
        <p>{isZh ? '电流会优先沿电阻较小的路径通过。' : 'Electricity takes the path with the least resistance.'}</p>
      </Section>

      <Section title={isZh ? '14.1 电流' : '14.1 Currents'} className="space-y-2">
        <NoteCard>
          <p>{isZh ? '电流表示单位时间内通过导体横截面的电荷量。' : 'Current is the rate of flow of charge.'}</p>
          <Math block>{String.raw`I = \frac{Q}{t}`}</Math>
          <p>{isZh ? '其中 I 为电流（A）' : 'where I is current (A)'}</p>
          <p>{isZh ? 'Q 为电荷量（C）' : 'Q is electric charge (C)'}</p>
          <p>{isZh ? 't 为时间（s）' : 't is time (s)'}</p>
        </NoteCard>

        <SubSection title={isZh ? '14.1.1 传统电流方向与电子流方向' : '14.1.1 Conventional current flow & electron flow'} className="space-y-2">
          <SvgInsertPlaceholder
            id="conventional-current-flow-circuit"
            label={isZh ? '传统电流与电子流方向回路图' : 'Conventional current and electron flow loop'}
            suggestedPath="src/assets/images/physics/current-of-electricity/conventional-current-flow.svg"
            locale={locale}
          />
          <NoteCard title={isZh ? '补充' : 'Aside'}>
            <p>{isZh ? '传统电流方向：由正极流向负极。' : 'Conventional current flow: Positive to Negative flow'}</p>
            <p>{isZh ? '电子流方向：由负极流向正极。' : 'Electron flow: Negative to Positive flow'}</p>
          </NoteCard>
        </SubSection>

        <SubSection title={isZh ? '14.1.2 电流的测量' : '14.1.2 Measuring currents'} className="space-y-2">
          <div className="not-prose grid gap-4 md:grid-cols-2">
            <InstrumentImage src={ammeterImage} alt={isZh ? '用于测量电流的电流表' : 'Ammeter used to measure current in amperes'} detail={isZh ? '电流表。' : 'Ammeter.'} />
            <SvgInsertPlaceholder
              id="ammeter-series-circuit"
              label={isZh ? '电流表串联接入电路' : 'Ammeter connected in series'}
              suggestedPath="src/assets/images/physics/current-of-electricity/ammeter-series-circuit.svg"
              locale={locale}
            />
          </div>

          <NoteCard>
            <p>{isZh ? '电流表用于测量电流，单位是安培。' : 'Ammeters are used to measure current in amperes.'}</p>
            <p>{isZh ? '理想电流表内阻近似为 0，可让电流几乎无损通过。' : 'Infinitely small resistance: allow all current to pass.'}</p>
            <p>{isZh ? '电流表必须串联在电路中。' : 'Connect in series.'}</p>
          </NoteCard>

          <NoteCard>
            <p>{isZh ? '可把电流类比成管道中的“水流量”。' : 'Think of current as the amount of "water" flowing through a pipe.'}</p>
            <p>{isZh ? '串联电路中，各处电流大小相同。' : 'The amount of water flowing remains the same throughout the system in a series circuit.'}</p>
            <p>{isZh ? '并联电路中，电子会优先走阻力更小的支路。' : 'In parallel circuits, electrons take the path with the least resistance.'}</p>
          </NoteCard>
        </SubSection>
      </Section>

      <Section title={isZh ? '14.2 电路图' : '14.2 Current diagrams'} className="space-y-2">
        <InstrumentImage src={circuitDiagramsImage} alt={isZh ? '常见电路符号对照表' : 'Reference table of standard circuit symbols'} />
        <NoteCard>
          <p>{isZh ? '作图必须使用直线连接。' : 'YOU MUST CONSTRUCT WITH STRAIGHT LINES.'}</p>
        </NoteCard>
      </Section>

      <Section title={isZh ? '14.3 电动势与电势差' : '14.3 Electromotive force vs potential difference'} className="space-y-2">
        <NoteCard title="TLDR">
          <p>{isZh ? '电动势（EMF）：对应整个电路。' : 'Electromotive force - Entire circuit'}</p>
          <p>{isZh ? '电势差（PD）：对应某一元件两端。' : 'Potential Difference - Across electric components'}</p>
        </NoteCard>

        <SubSection title={isZh ? '14.3.1 电动势' : '14.3.1 Electromotive force'} className="space-y-2">
          <NoteCard>
            <p>{isZh ? '电动势是电源把电荷推动通过整个回路时，对单位电荷所做的功。' : 'Electromotive force is work done per unit charge by a source in driving charges across a circuit.'}</p>
            <Math block>{String.raw`E = \frac{W}{Q}`}</Math>
            <p>{isZh ? '其中 E 为电动势（V）' : 'where E is electromotive force (V)'}</p>
            <p>{isZh ? 'W 为电源做功（J）' : 'W is work done by source (J)'}</p>
            <p>{isZh ? 'Q 为电荷量（C）' : 'Q is charge (C)'}</p>
          </NoteCard>
        </SubSection>

        <SubSection title={isZh ? '14.3.2 电势差' : '14.3.2 Potential difference'} className="space-y-2">
          <NoteCard>
            <p>{isZh ? '电势差是电荷通过某个元件时，单位电荷所对应的做功。' : 'Potential difference is work done per unit charge in driving charges through a component.'}</p>
            <Math block>{String.raw`V = \frac{W}{Q}`}</Math>
            <p>{isZh ? '其中 V 为电势差（V）' : 'where V is potential difference (V)'}</p>
            <p>{isZh ? 'W 为做功（J）' : 'W is work done (J)'}</p>
            <p>{isZh ? 'Q 为电荷量（C）' : 'Q is charge (C)'}</p>
          </NoteCard>
        </SubSection>

        <SubSection title={isZh ? '14.3.3 电压测量' : '14.3.3 Measuring Voltage'} className="space-y-2">
          <div className="not-prose grid gap-4 md:grid-cols-2">
            <InstrumentImage src={voltmeterImage} alt={isZh ? '用于测量电势差的电压表' : 'Voltmeter used to measure potential difference'} detail={isZh ? '电压表。' : 'Voltmeter.'} />
            <SvgInsertPlaceholder
              id="emf-pd-measurement-circuit"
              label={isZh ? '测量电动势与电势差的电路图' : 'Circuit for measuring EMF and potential difference'}
              suggestedPath="src/assets/images/physics/current-of-electricity/emf-pd-measurement-circuit.svg"
              locale={locale}
            />
          </div>
          <NoteCard>
            <p>{isZh ? '上方电压表支路表示测量电动势（EMF）。' : 'Upper meter branch represents EMF measurement.'}</p>
            <p>{isZh ? '下方电压表支路表示测量元件两端电势差（PD）。' : 'Lower meter branch represents potential difference (PD) across the component.'}</p>
          </NoteCard>
        </SubSection>
      </Section>
    </>
  );
}
