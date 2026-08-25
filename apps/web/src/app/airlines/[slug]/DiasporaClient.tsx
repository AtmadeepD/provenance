'use client';

import React, { useState } from 'react';
import { Airframe } from '@/lib/types';
import { MiniLifeline } from '@/components/lifeline/MiniLifeline';
import { FateChip, FateStatus } from '@/components/FateChip';
import { Mono } from '@/components/Mono';
import { Eyebrow } from '@/components/Eyebrow';

interface DiasporaClientProps {
  airframes: Airframe[];
  liveryFallback: string;
}

const SECTION_ORDER = ['mainline fleet', 'turboprops', 'inherited from air deccan', 'widebody'];
const FATE_ORDER = ['active', 'stored', 'withdrawn', 'scrapped', 'written_off', 'preserved', 'unknown'];

function getSection(reg: string) {
  if (reg.startsWith('VT-KF')) return 'mainline fleet';
  if (reg.startsWith('VT-KA')) return 'turboprops';
  if (reg.startsWith('VT-AD') || reg.startsWith('VT-DK') || reg.startsWith('VT-DN')) return 'inherited from air deccan';
  if (reg.startsWith('VT-VJ')) return 'widebody';
  return 'other';
}

export function DiasporaClient({ airframes, liveryFallback }: DiasporaClientProps) {
  const [filter, setFilter] = useState<string>('All');

  const filtered = filter === 'All' ? airframes : airframes.filter(a => {
    let stateLabel = a.status.state.replace('_', ' ');
    if (stateLabel === 'active') stateLabel = 'flying';
    return stateLabel.toLowerCase() === filter.toLowerCase();
  });

  // Group into sections
  const grouped: Record<string, Airframe[]> = {};
  for (const af of filtered) {
    const kfReg = af.identities[0]?.reg || '';
    const section = getSection(kfReg);
    if (!grouped[section]) grouped[section] = [];
    grouped[section].push(af);
  }

  // Sort within sections
  for (const section of Object.keys(grouped)) {
    grouped[section].sort((a, b) => {
      const aFateIdx = FATE_ORDER.indexOf(a.status.state);
      const bFateIdx = FATE_ORDER.indexOf(b.status.state);
      if (aFateIdx !== bFateIdx) return aFateIdx - bFateIdx;
      return a.type.localeCompare(b.type);
    });
  }

  const filters = ['All', 'Flying', 'Stored', 'Withdrawn', 'Scrapped', 'Written off', 'Preserved', 'Unknown'];
  const activeFilters = filters.filter(f => f === 'All' || airframes.some(a => {
    let sl = a.status.state.replace('_', ' ');
    if (sl === 'active') sl = 'flying';
    return sl.toLowerCase() === f.toLowerCase();
  }));

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap gap-2">
        {activeFilters.map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-chip text-micro font-mono border transition-colors ${
              filter === f 
                ? 'bg-ink text-paper border-ink' 
                : 'bg-paper-sunken text-ink border-rule hover:border-ink-3'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-16">
        {SECTION_ORDER.map(section => {
          const sectionFrames = grouped[section];
          if (!sectionFrames || sectionFrames.length === 0) return null;

          return (
            <div key={section} className="space-y-4">
              <Eyebrow rule>{section}</Eyebrow>
              <div className="flex flex-col border-t border-rule">
                {sectionFrames.map(af => {
                  const kfReg = af.identities[0]?.reg || af.airframe_id;
                  const lastReg = af.identities[af.identities.length - 1]?.reg;
                  const currentOp = af.eras[af.eras.length - 1]?.operator_id;
                  
                  return (
                    <div key={af.airframe_id} className="grid grid-cols-1 md:grid-cols-[240px_1fr_1fr_1fr_auto] gap-4 py-4 border-b border-rule hover:bg-paper-sunken transition-colors items-center group px-2 -mx-2">
                      <div className="w-full">
                        <MiniLifeline 
                          eras={af.eras}
                          identities={af.identities}
                          status={af.status}
                          from={af.first_flight}
                          liveryFallback={liveryFallback}
                        />
                      </div>
                      
                      <Mono className="text-small">
                        {af.confidence.identity !== 'verified' && (
                          <span className="text-ink-3 mr-1 cursor-help" title="Identity mapping is unverified">~</span>
                        )}
                        {af.type} · {af.msn}
                      </Mono>
                      
                      <Mono className="text-small">
                        {kfReg}
                        {lastReg && lastReg !== kfReg && (
                          <>
                            <span className="text-ink-3 mx-2">→</span>
                            {lastReg}
                          </>
                        )}
                      </Mono>
                      
                      <div className="text-body text-ink-2 truncate">
                        {currentOp !== 'kingfisher' ? currentOp : ''}
                      </div>
                      
                      <div className="flex items-center gap-2 justify-end">
                        {af.confidence.status !== 'verified' && (
                          <Mono className="text-ink-3 text-small cursor-help" title="Current status is unverified">~</Mono>
                        )}
                        <FateChip status={af.status.state as FateStatus} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
