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
    openGraph: {
      images: [`/api/og?slug=${slug}`],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`/api/og?slug=${slug}`],
    }
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
  
  const primaryKeywords = ['court', 'dgca', 'ncaer', 'mstc', 'hifly'];
  const sourceRefs = new Set<string>();
  data.airframes.forEach(af => {
    af.sources?.forEach(s => sourceRefs.add(s.ref));
  });
  const allSources = Array.from(sourceRefs);

  const primarySources: string[] = [];
  const domainGroups: Record<string, string[]> = {};

  allSources.forEach(src => {
    let url;
    try { url = new URL(src); } catch { return; }
    
    const domain = url.hostname.replace(/^www\./, '');
    const isPrimary = primaryKeywords.some(kw => domain.toLowerCase().includes(kw));

    if (isPrimary) {
      primarySources.push(src);
    } else {
      if (!domainGroups[domain]) domainGroups[domain] = [];
      domainGroups[domain].push(src);
    }
  });

  const mDomains = new Set(allSources.map(s => {
    try { return new URL(s).hostname.replace(/^www\./, ''); } catch { return ''; }
  }).filter(Boolean)).size;
  const nReferences = allSources.length;

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
        <div className="space-y-6 max-w-[68ch]">
          {primarySources.length > 0 && (
            <div className="space-y-2">
              <Eyebrow>primary sources</Eyebrow>
              <div className="space-y-1">
                {primarySources.map(src => (
                  <div key={src}>
                    <a href={src} target="_blank" rel="noopener noreferrer" className="text-small hover:text-ink underline decoration-rule hover:decoration-ink-3 transition-colors break-all">
                      {src}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <details className="group">
            <summary className="text-micro font-mono uppercase tracking-[0.06em] cursor-pointer text-ink-2 hover:text-ink transition-colors list-none select-none">
              <span className="mr-2 inline-block transition-transform group-open:rotate-90">▸</span>
              sources · {nReferences} references across {mDomains} domains
            </summary>
            <div className="mt-6 space-y-6 pl-4 border-l border-rule">
              {Object.entries(domainGroups).sort(([a], [b]) => a.localeCompare(b)).map(([domain, links]) => (
                <div key={domain} className="space-y-2">
                  <Eyebrow>{domain}</Eyebrow>
                  <div className="space-y-1">
                    {links.map(src => (
                      <div key={src}>
                        <a href={src} target="_blank" rel="noopener noreferrer" className="text-small hover:text-ink underline decoration-rule hover:decoration-ink-3 transition-colors break-all">
                          {src}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      </SiteFooter>
    </>
  );
}
