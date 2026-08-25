import React from 'react';
import { Container } from './Container';
import { Mono } from './Mono';

interface SiteFooterProps {
  date: string;
  children?: React.ReactNode;
}

export function SiteFooter({ date, children }: SiteFooterProps) {
  return (
    <footer className="border-t border-rule mt-auto bg-paper">
      <Container className="py-12 flex flex-col gap-4">
        {children && (
          <div className="text-small text-ink-2">
            {children}
          </div>
        )}
        <div className="text-small text-ink-2">
          part of the PROVENANCE register
        </div>
        <Mono className="text-micro text-ink-3">
          data snapshot: {date}
        </Mono>
      </Container>
    </footer>
  );
}
