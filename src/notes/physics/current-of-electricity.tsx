import type { PropsWithChildren } from 'react';
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
}

function SvgInsertPlaceholder({ id, label, suggestedPath }: SvgInsertPlaceholderProps) {
  return (
    <div className="not-prose rounded-xl border border-dashed border-border bg-muted/20 p-4">
      <p className="text-sm font-semibold text-foreground">SVG Placeholder: {label}</p>
      <p className="mt-2 text-xs text-muted-foreground">ID: {id}</p>
      <p className="mt-1 text-xs text-muted-foreground">Suggested file: {suggestedPath}</p>
      <div className="mt-3 flex h-44 items-center justify-center rounded-lg bg-background/80 text-xs text-muted-foreground">
        Replace this block with your final SVG markup or imported SVG asset.
      </div>
    </div>
  );
}

export default function CurrentOfElectricity() {
  return (
    <>
      <Section title="14.0 Basic Knowledge" className="space-y-2">
        <p>Electricity takes the path with the least resistance.</p>
      </Section>

      <Section title="14.1 Currents" className="space-y-2">
        <NoteCard>
          <p>Current is the rate of flow of charge.</p>
          <Math block>{String.raw`I = \frac{Q}{t}`}</Math>
          <p>where I is current (A)</p>
          <p>Q is electric charge (C)</p>
          <p>t is time (s)</p>
        </NoteCard>

        <SubSection title="14.1.1 Conventional Current Flow & Electron Flow" className="space-y-2">
          <SvgInsertPlaceholder
            id="conventional-current-flow-circuit"
            label="Conventional current and electron flow loop"
            suggestedPath="src/assets/images/physics/current-of-electricity/conventional-current-flow.svg"
          />
          <NoteCard title="Aside">
            <p>Conventional current flow: Positive to Negative flow</p>
            <p>Electron flow: Negative to Positive flow</p>
          </NoteCard>
        </SubSection>

        <SubSection title="14.1.2 Measuring Current" className="space-y-2">
          <div className="not-prose grid gap-4 md:grid-cols-2">
            <InstrumentImage
              src={ammeterImage}
              alt="Ammeter used to measure current in amperes"
              detail="Ammeter."
            />
            <SvgInsertPlaceholder
              id="ammeter-series-circuit"
              label="Ammeter connected in series"
              suggestedPath="src/assets/images/physics/current-of-electricity/ammeter-series-circuit.svg"
            />
          </div>

          <NoteCard>
            <p>Ammeters are used to measure current in amperes.</p>
            <p>Infinitely small resistance: allow all current to pass.</p>
            <p>Connect in series.</p>
          </NoteCard>

          <NoteCard>
            <p>Think of current as the amount of "water" flowing through a pipe.</p>
            <p>The amount of water flowing remains the same throughout the system in a series circuit.</p>
            <p>In parallel circuits, electrons take the path with the least resistance.</p>
          </NoteCard>
        </SubSection>
      </Section>

      <Section title="14.2 Circuit Diagrams" className="space-y-2">
        <InstrumentImage src={circuitDiagramsImage} alt="Reference table of standard circuit symbols" />
        <NoteCard>
          <p>YOU MUST CONSTRUCT WITH STRAIGHT LINES.</p>
        </NoteCard>
      </Section>

      <Section title="14.4 Electromotive Force VS Potential Difference" className="space-y-2">
        <NoteCard title="TLDR">
          <p>Electromotive force - Entire circuit</p>
          <p>Potential Difference - Across electric components</p>
        </NoteCard>

        <SubSection title="14.4.1 Electromotive Force" className="space-y-2">
          <NoteCard>
            <p>Electromotive force is work done per unit charge by a source in driving charges across a circuit.</p>
            <Math block>{String.raw`E = \frac{W}{Q}`}</Math>
            <p>where E is electromotive force (V)</p>
            <p>W is work done by source (J)</p>
            <p>Q is charge (C)</p>
          </NoteCard>
        </SubSection>

        <SubSection title="14.4.2 Potential Difference" className="space-y-2">
          <NoteCard>
            <p>Potential difference is work done per unit charge in driving charges through a component.</p>
            <Math block>{String.raw`V = \frac{W}{Q}`}</Math>
            <p>where V is potential difference (V)</p>
            <p>W is work done (J)</p>
            <p>Q is charge (C)</p>
          </NoteCard>
        </SubSection>

        <SubSection title="14.4.3 Measuring Voltage" className="space-y-2">
          <div className="not-prose grid gap-4 md:grid-cols-2">
            <InstrumentImage
              src={voltmeterImage}
              alt="Voltmeter used to measure potential difference"
              detail="Voltmeter."
            />
            <SvgInsertPlaceholder
              id="emf-pd-measurement-circuit"
              label="Circuit for measuring EMF and potential difference"
              suggestedPath="src/assets/images/physics/current-of-electricity/emf-pd-measurement-circuit.svg"
            />
          </div>
          <NoteCard>
            <p>Upper meter branch represents EMF measurement.</p>
            <p>Lower meter branch represents potential difference (PD) across the component.</p>
          </NoteCard>
        </SubSection>
      </Section>
    </>
  );
}
