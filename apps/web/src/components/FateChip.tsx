import React from 'react';

export type FateStatus = 'active' | 'stored' | 'scrapped' | 'preserved' | 'written_off' | 'unknown';

interface FateChipProps {
  status: FateStatus;
}

const statusMap: Record<FateStatus, { label: string; colorClass: string; borderColorClass: string }> = {
  active: { label: 'FLYING', colorClass: 'text-fate-active', borderColorClass: 'border-fate-active' },
  stored: { label: 'STORED', colorClass: 'text-fate-stored', borderColorClass: 'border-fate-stored' },
  scrapped: { label: 'SCRAPPED', colorClass: 'text-fate-scrapped', borderColorClass: 'border-fate-scrapped' },
  preserved: { label: 'PRESERVED', colorClass: 'text-fate-preserved', borderColorClass: 'border-fate-preserved' },
  written_off: { label: 'LOST', colorClass: 'text-fate-scrapped', borderColorClass: 'border-fate-scrapped' },
  unknown: { label: 'UNKNOWN', colorClass: 'text-fate-unknown', borderColorClass: 'border-fate-unknown' },
};

export function FateChip({ status }: FateChipProps) {
  const { label, colorClass, borderColorClass } = statusMap[status];
  return (
    <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-chip border bg-paper-raised text-micro font-mono ${colorClass} ${borderColorClass}`}>
      {label}
    </span>
  );
}
