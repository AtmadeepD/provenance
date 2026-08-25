import React from 'react';

interface EyebrowProps {
  children: React.ReactNode;
  rule?: boolean;
}

export function Eyebrow({ children, rule }: EyebrowProps) {
  return (
    <div className="flex flex-col">
      <span className="text-micro text-ink-3">{children}</span>
      {rule && <div className="h-px bg-rule mt-2 w-full" />}
    </div>
  );
}
