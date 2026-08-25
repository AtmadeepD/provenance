import React from 'react';

export function Markdown({ children }: { children: string }) {
  if (!children) return null;
  const paragraphs = children.split(/\n\s*\n/);
  
  return (
    <div className="space-y-4">
      {paragraphs.map((p, i) => {
        const parts = p.split(/(\*[^*]+\*)/g);
        return (
          <p key={i}>
            {parts.map((part, j) => {
              if (part.startsWith('*') && part.endsWith('*')) {
                return <em key={j}>{part.slice(1, -1)}</em>;
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}
