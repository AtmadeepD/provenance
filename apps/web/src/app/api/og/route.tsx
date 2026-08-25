import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getAirline } from '@/lib/data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return new Response('Missing slug', { status: 400 });
  }

  const data = await getAirline(slug);
  if (!data) {
    return new Response('Not found', { status: 404 });
  }

  const newsreader = await fs.readFile(path.join(process.cwd(), 'src/app/api/og/newsreader.ttf'));
  const ibm = await fs.readFile(path.join(process.cwd(), 'src/app/api/og/ibmplexmono.ttf'));

  const total = data.airframes.length;
  const counts = data.airframes.reduce((acc, af) => {
    acc[af.status.state] = (acc[af.status.state] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const FATE_ORDER = ['active', 'stored', 'withdrawn', 'scrapped', 'written_off', 'preserved', 'unknown'] as const;
  const colors: Record<string, string> = {
    active: '#2E7D57',
    stored: '#B98A2F',
    withdrawn: '#B98A2F',
    scrapped: '#9A3B3B',
    written_off: '#9A3B3B',
    preserved: '#4C6FB3',
    unknown: '#8B8F99'
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FAFAF7',
          padding: '80px',
          fontFamily: '"Newsreader"',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto', marginBottom: 'auto' }}>
          <div
            style={{
              fontFamily: '"IBM Plex Mono"',
              fontSize: 24,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#8B8F99',
              display: 'flex',
              alignItems: 'center',
              marginBottom: 24
            }}
          >
            airline · {data.founded}–{data.ceased?.substring(0, 4)}
          </div>
          <div
            style={{
              fontSize: 72,
              color: '#16181D',
              display: 'flex',
              alignItems: 'baseline'
            }}
          >
            {data.name}
            <span style={{ color: data.livery?.primary || '#16181D' }}>.</span>
          </div>

          <div style={{ display: 'flex', height: 20, width: '100%', borderRadius: 10, overflow: 'hidden', marginTop: 80 }}>
            {FATE_ORDER.map(fate => {
              const count = counts[fate] || 0;
              if (count === 0) return null;
              return (
                <div
                  key={fate}
                  style={{
                    height: '100%',
                    width: `${(count / total) * 100}%`,
                    backgroundColor: colors[fate]
                  }}
                />
              );
            })}
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: 80,
            fontFamily: '"IBM Plex Mono"',
            fontSize: 24,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#16181D'
          }}
        >
          PROVENANCE
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Newsreader',
          data: newsreader,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'IBM Plex Mono',
          data: ibm,
          weight: 400,
          style: 'normal',
        }
      ],
    }
  );
}
