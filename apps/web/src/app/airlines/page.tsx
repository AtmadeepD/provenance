import { Container } from '@/components/Container';
import { Eyebrow } from '@/components/Eyebrow';
import { SiteFooter } from '@/components/SiteFooter';
import Link from 'next/link';

export default function AirlinesIndexPage() {
  return (
    <>
      <Container className="py-24 space-y-16 flex-1">
        <header className="space-y-6 max-w-[68ch]">
          <h1 className="text-display-xl font-normal font-display">
            Airlines
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/airlines/kingfisher" className="block p-6 rounded-card border border-rule hover:bg-paper-sunken transition-colors group">
            <Eyebrow>airline · 2003–2012</Eyebrow>
            <h2 className="text-h2 font-display mt-2 group-hover:text-ink transition-colors">
              Kingfisher Airlines
              <span style={{ color: '#B3202C' }}>.</span>
            </h2>
            <div className="mt-4 text-small text-ink-2">
              68 airframes identified
            </div>
            {/* Miniature fate strip placeholder */}
            <div className="mt-4 w-full h-[6px] rounded-full overflow-hidden flex">
              <div style={{ width: '20%', backgroundColor: 'var(--color-fate-active)' }} />
              <div style={{ width: '30%', backgroundColor: 'var(--color-fate-stored)' }} />
              <div style={{ width: '15%', backgroundColor: 'var(--color-fate-scrapped)' }} />
              <div style={{ width: '35%', backgroundColor: 'var(--color-fate-unknown)' }} />
            </div>
          </Link>
        </div>
      </Container>
      <SiteFooter date="2026-08-25" />
    </>
  );
}
