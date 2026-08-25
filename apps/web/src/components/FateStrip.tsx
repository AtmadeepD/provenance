'use client';
import React, { useEffect, useState } from 'react';
import { Mono } from '@/components/Mono';

const FATE_ORDER = ['active', 'stored', 'withdrawn', 'scrapped', 'written_off', 'preserved', 'unknown'] as const;

export function FateStrip({ counts, total }: { counts: Record<string, number>, total: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-4">
      <div className="w-full flex h-[10px] rounded-[6px] overflow-hidden">
        {FATE_ORDER.map((fate, i) => {
          const count = counts[fate] || 0;
          if (count === 0) return null;
          const pct = (count / total) * 100;
          const color = `var(--color-fate-${fate === 'withdrawn' ? 'stored' : fate === 'written_off' ? 'writtenoff' : fate})`;
          
          return (
            <div
              key={fate}
              style={{
                 width: mounted ? `${pct}%` : '0%',
                 backgroundColor: color,
                 transition: `width 500ms cubic-bezier(.22,.8,.26,.99) ${i * 40}ms`
              }}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        <Mono className="text-small text-ink-2">
          {FATE_ORDER.filter(f => counts[f] > 0).map(fate => {
             let label = fate.replace('_', ' ');
             if (label === 'active') label = 'flying';
             return `${counts[fate]} ${label}`;
          }).join(' · ')}
        </Mono>
      </div>
    </div>
  );
}
