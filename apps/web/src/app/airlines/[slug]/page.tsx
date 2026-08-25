import { notFound } from 'next/navigation';
import { getAirline, getAllAirlineSlugs } from '@/lib/data';
import { Container } from '@/components/Container';
import { Eyebrow } from '@/components/Eyebrow';
import { FateStrip } from '@/components/FateStrip';
import { Markdown } from '@/components/Markdown';
import { DiasporaClient } from './DiasporaClient';
import { SiteFooter } from '@/components/SiteFooter';
import { Metadata } from 'next';

export async function generateStaticParams() {
  const slugs = await getAllAirlineSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getAirline(slug);
  if (!data) return {};
  
  const fates = data.airframes.reduce((acc, af) => {
    acc[af.status.state] = (acc[af.status.state] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const desc = Object.entries(fates).map(([k, v]) => `${v} ${k.replace('_', ' ')}`).join(', ');

  return {
    title: `${data.name} — where the fleet went | PROVENANCE`,
    description: `Fleet diaspora: ${desc}`,
  };
}

export default async function DiasporaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getAirline(slug);
  if (!data) notFound();

  const counts = data.airframes.reduce((acc, af) => {
    acc[af.status.state] = (acc[af.status.state] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const total = data.airframes.length;
  
  const sourceRefs = new Set<string>();
  data.airframes.forEach(af => {
    af.sources?.forEach(s => sourceRefs.add(s.ref));
  });
  const allSources = Array.from(sourceRefs);

  return (
    <>
      <Container className="py-24 space-y-16 flex-1">
        <header className="space-y-6 max-w-[68ch]">
          <Eyebrow rule>airline · {data.founded}–{data.ceased?.substring(0, 4)}</Eyebrow>
          <h1 className="text-display-xl font-normal font-display">
            {data.name}
            <span style={{ color: data.livery?.primary || 'var(--color-ink)' }}>.</span>
          </h1>
          <div className="text-h3 font-display text-ink-2 space-y-4">
            <Markdown>{data.obituary_md || ''}</Markdown>
            <p className="text-body font-sans mt-4">
              At its peak the airline ran 64–66 aircraft. By February 2012, 22 of them still flew.
            </p>
          </div>
        </header>

        <section className="space-y-4">
          <Eyebrow>every airframe {data.name} operated or inherited — {total} identified</Eyebrow>
          <FateStrip counts={counts} total={total} />
        </section>

        <DiasporaClient airframes={data.airframes} liveryFallback={data.livery?.primary || '#B3202C'} />
      </Container>
      <SiteFooter date="2026-08-25">
        <div className="space-y-1 max-w-[68ch] break-all">
          {allSources.map(src => (
            <div key={src}>
              <a href={src} target="_blank" rel="noopener noreferrer" className="hover:text-ink underline decoration-rule hover:decoration-ink-3 transition-colors">
                {src}
              </a>
            </div>
          ))}
        </div>
      </SiteFooter>
    </>
  );
}
