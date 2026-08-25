import React from 'react';
import { scaleTime } from 'd3-scale';

export interface MiniLifelineProps {
  eras: {
    operator_id: string;
    role: string;
    from?: string | null;
    to?: string | null;
  }[];
  identities: {
    reg: string;
    from?: string | null;
    to?: string | null;
  }[];
  status: {
    state: 'active' | 'stored' | 'withdrawn' | 'scrapped' | 'written_off' | 'preserved' | 'unknown';
    as_of?: string;
  };
  from?: string | null;
  to?: string | null;
  liveryFallback?: string;
}

const parseDate = (d?: string | null) => d ? new Date(d) : null;

export function MiniLifeline({ eras, identities, status, from, to, liveryFallback }: MiniLifelineProps) {
  const WIDTH = 240;
  const HEIGHT = 36;
  const BAR_Y = 11;
  const BAR_H = 14;
  const TICK_Y = 8;
  const TICK_H = 20;
  const RIGHT_PAD = 10;
  const PLOT_W = WIDTH - RIGHT_PAD;

  let hasMissingDates = false;
  eras.forEach(e => {
    if (!e.from) hasMissingDates = true;
  });

  let minDate = parseDate(from) || parseDate(eras[0]?.from);
  let maxDate = parseDate(to);

  if (!maxDate) {
    const lastEra = eras[eras.length - 1];
    if (lastEra?.to) {
      maxDate = parseDate(lastEra.to);
    } else if (status.state === 'active' || status.state === 'stored') {
      maxDate = new Date();
    } else if (status.as_of) {
      maxDate = parseDate(status.as_of);
    }
  }

  if (!minDate || !maxDate) {
    hasMissingDates = true;
  }

  const ops = eras.map(e => e.operator_id).join(', then ');
  const ariaLabel = hasMissingDates 
    ? `Dates unknown; operators: ${ops}; ${status.state}.`
    : `${minDate?.getFullYear() || ''} to ${maxDate?.getFullYear() || ''}; operators: ${ops}; ${status.state}.`;

  const scale = hasMissingDates ? null : scaleTime().domain([minDate as Date, maxDate as Date]).range([0, PLOT_W]);

  const renderTerminal = () => {
    const cx = PLOT_W;
    const cy = HEIGHT / 2;
    const state = status.state;
    const color = `var(--color-fate-${state === 'withdrawn' ? 'stored' : state === 'written_off' ? 'writtenoff' : state})`;
    
    if (state === 'active') {
      return (
        <path d={`M${cx},${cy - 3} L${cx + 6},${cy} L${cx},${cy + 3} Z`} fill={color} />
      );
    }
    if (state === 'stored' || state === 'withdrawn') {
      return (
        <g fill={color}>
          <rect x={cx} y={cy - 3} width={2} height={6} />
          <rect x={cx + 3} y={cy - 3} width={2} height={6} />
        </g>
      );
    }
    if (state === 'scrapped' || state === 'written_off') {
      const col = state === 'written_off' ? 'var(--color-fate-writtenoff)' : 'var(--color-fate-scrapped)';
      return (
        <g stroke={col} strokeWidth="1.5" strokeLinecap="round">
          <line x1={cx - 3.5} y1={cy - 3.5} x2={cx + 3.5} y2={cy + 3.5} />
          <line x1={cx - 3.5} y1={cy + 3.5} x2={cx + 3.5} y2={cy - 3.5} />
        </g>
      );
    }
    if (state === 'preserved') {
      return (
        <polygon points={`${cx},${cy - 3} ${cx + 3},${cy} ${cx},${cy + 3} ${cx - 3},${cy}`} fill={color} />
      );
    }
    if (state === 'unknown') {
      return <circle cx={cx} cy={cy} r="1.5" fill="var(--color-fate-unknown)" />;
    }
    return null;
  };

  return (
    <svg width={WIDTH} height={HEIGHT} role="img" aria-label={ariaLabel} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hatch" width="4" height="4" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="var(--color-paper-sunken)" />
          <line x1="0" y1="0" x2="0" y2="4" stroke="var(--color-rule)" strokeWidth="2" />
        </pattern>
      </defs>

      {hasMissingDates ? (
        <rect x="0" y={BAR_Y} width={PLOT_W} height={BAR_H} fill="var(--color-rule-strong)" />
      ) : (
        <>
          {eras.map((era, i) => {
            const startX = scale!(parseDate(era.from) || minDate!);
            const toDate = parseDate(era.to);
            let endX = PLOT_W;
            if (toDate) {
               endX = scale!(toDate);
            } else if (i < eras.length - 1) {
               endX = scale!(parseDate(eras[i+1].from) || maxDate!);
            }

            const fill = era.operator_id === 'kingfisher' ? liveryFallback || 'var(--color-ink-3)' : 'var(--color-ink-3)';
            
            return (
              <g key={i}>
                {i > 0 && (
                   (() => {
                     const prevTo = parseDate(eras[i-1].to);
                     if (prevTo) {
                       const gapStart = scale!(prevTo);
                       if (startX > gapStart) {
                         return <rect x={gapStart} y={BAR_Y} width={startX - gapStart} height={BAR_H} fill="url(#hatch)" />;
                       }
                     }
                     return null;
                   })()
                )}
                <rect x={startX} y={BAR_Y} width={Math.max(0, endX - startX)} height={BAR_H} fill={fill} />
              </g>
            );
          })}

          {identities.map((id, i) => {
            if (id.from) {
              const x = scale!(parseDate(id.from)!);
              return <rect key={i} x={x} y={TICK_Y} width="1" height={TICK_H} fill="var(--color-ink)" />;
            }
            return null;
          })}
        </>
      )}

      {renderTerminal()}
    </svg>
  );
}
