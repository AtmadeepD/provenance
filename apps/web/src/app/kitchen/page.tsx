import React from 'react';
import { Container } from '@/components/Container';
import { Eyebrow } from '@/components/Eyebrow';
import { FateChip, FateStatus } from '@/components/FateChip';
import { Mono } from '@/components/Mono';
import { MiniLifeline } from '@/components/lifeline/MiniLifeline';

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function KitchenSink() {
  const fateStatuses: FateStatus[] = ['active', 'stored', 'scrapped', 'preserved', 'written_off', 'unknown'];

  return (
    <Container className="py-24 space-y-16">
      <div className="space-y-4">
        <h1 className="text-display-xl font-normal">Design System Kitchen Sink</h1>
        <p className="text-body text-ink-2">A reference for all tokens and primitives defined in Phase 0.2.</p>
      </div>

      <section className="space-y-6">
        <Eyebrow rule>Color Tokens</Eyebrow>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ColorSwatch name="paper" className="bg-paper text-ink border border-rule" />
          <ColorSwatch name="paper-raised" className="bg-paper-raised text-ink border border-rule shadow-plate" />
          <ColorSwatch name="paper-sunken" className="bg-paper-sunken text-ink border border-rule" />
          <ColorSwatch name="ink" className="bg-ink text-paper" />
          <ColorSwatch name="ink-2" className="bg-ink-2 text-paper" />
          <ColorSwatch name="ink-3" className="bg-ink-3 text-paper" />
          <ColorSwatch name="rule" className="bg-rule text-ink" />
          <ColorSwatch name="rule-strong" className="bg-rule-strong text-ink" />
        </div>
      </section>

      <section className="space-y-6">
        <Eyebrow rule>Fate Colors</Eyebrow>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <ColorSwatch name="fate-active" className="bg-fate-active text-paper" />
          <ColorSwatch name="fate-stored" className="bg-fate-stored text-paper" />
          <ColorSwatch name="fate-scrapped" className="bg-fate-scrapped text-paper" />
          <ColorSwatch name="fate-preserved" className="bg-fate-preserved text-paper" />
          <ColorSwatch name="fate-unknown" className="bg-fate-unknown text-paper" />
        </div>
      </section>

      <section className="space-y-6">
        <Eyebrow rule>Typography</Eyebrow>
        <div className="space-y-8">
          <TypeSpecimen name="text-display-xl" className="text-display-xl" />
          <TypeSpecimen name="text-display" className="text-display" />
          <TypeSpecimen name="text-h2" className="text-h2" />
          <TypeSpecimen name="text-h3" className="text-h3" />
          <TypeSpecimen name="text-body" className="text-body" />
          <TypeSpecimen name="text-small" className="text-small" />
          <TypeSpecimen name="text-micro" className="text-micro" />
        </div>
      </section>

      <section className="space-y-6">
        <Eyebrow rule>Components</Eyebrow>
        
        <div className="space-y-4">
          <h3 className="text-h3">Eyebrow</h3>
          <div className="p-6 bg-paper-sunken rounded-card">
            <Eyebrow>airframe · msn 3990</Eyebrow>
          </div>
          <div className="p-6 bg-paper-sunken rounded-card">
            <Eyebrow rule>airline · ceased 2012</Eyebrow>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-h3">Mono</h3>
          <div className="p-6 bg-paper-sunken rounded-card">
            <Mono>MSN 3990 · A320-232 · 2009</Mono>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-h3">FateChips</h3>
          <div className="p-6 bg-paper-sunken rounded-card flex flex-wrap gap-4">
            {fateStatuses.map(status => (
              <FateChip key={status} status={status} />
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <Eyebrow rule>Mini-Lifeline</Eyebrow>
        <div className="space-y-4">
          <div className="p-6 bg-paper-sunken rounded-card space-y-8">
            <div>
              <h4 className="text-small mb-2">Case (a) Full dates (active 2-era)</h4>
              <MiniLifeline 
                eras={[
                  { operator_id: 'twa', role: 'passenger', from: '1990-01', to: '2005-06' },
                  { operator_id: 'kalitta', role: 'cargo', from: '2008-01', to: '2026-08' }
                ]}
                identities={[
                  { reg: 'N123TW', from: '1990-01' },
                  { reg: 'N456KA', from: '2008-01' }
                ]}
                status={{ state: 'active', as_of: '2026-08-25' }}
                liveryFallback="#B3202C"
              />
            </div>
            
            <div>
              <h4 className="text-small mb-2">Case (a) Full dates (scrapped 3-era, with gap)</h4>
              <MiniLifeline 
                eras={[
                  { operator_id: 'air_deccan', role: 'passenger', from: '2004-01', to: '2008-01' },
                  { operator_id: 'kingfisher', role: 'passenger', from: '2008-08', to: '2012-10' },
                  { operator_id: 'other', role: 'passenger', from: '2014-01', to: '2020-01' }
                ]}
                identities={[
                  { reg: 'VT-DKA', from: '2004-01' },
                  { reg: 'VT-DKA', from: '2008-08' },
                  { reg: 'M-ABFI', from: '2014-01' }
                ]}
                status={{ state: 'scrapped', as_of: '2026-08-25' }}
                liveryFallback="#B3202C"
              />
            </div>

            <div>
              <h4 className="text-small mb-2">Case (b) Missing dates (single muted bar)</h4>
              <MiniLifeline 
                eras={[
                  { operator_id: 'kingfisher', role: 'passenger' }
                ]}
                identities={[
                  { reg: 'VT-KFC' }
                ]}
                status={{ state: 'stored', as_of: '2026-08-25' }}
              />
            </div>
            
            <div>
              <h4 className="text-small mb-2">Case (c) Unknown status</h4>
              <MiniLifeline 
                eras={[
                  { operator_id: 'kingfisher', role: 'passenger' }
                ]}
                identities={[
                  { reg: 'VT-KFD' }
                ]}
                status={{ state: 'unknown', as_of: '2026-08-25' }}
              />
            </div>
          </div>
        </div>
      </section>
      
      <section className="space-y-6">
        <Eyebrow rule>Interactive Elements (Focus testing)</Eyebrow>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-ink text-paper rounded-card">Focus me</button>
          <a href="#" className="px-4 py-2 border border-rule rounded-card hover:bg-paper-sunken inline-block">Link focus</a>
          <input type="text" placeholder="Input focus" className="px-4 py-2 border border-rule rounded-card" />
        </div>
      </section>
    </Container>
  );
}

function ColorSwatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`h-24 w-full rounded-card ${className} flex items-center justify-center p-4`}>
      </div>
      <Mono className="text-small text-ink-2">--{name}</Mono>
    </div>
  );
}

function TypeSpecimen({ name, className }: { name: string; className: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-4 border-b border-rule pb-4">
      <div className="w-40 shrink-0">
        <Mono className="text-small text-ink-3">.{name}</Mono>
      </div>
      <div className={className}>
        Aircraft outlive their airlines.
      </div>
    </div>
  );
}
