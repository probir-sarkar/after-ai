import type { ReactNode } from 'react';

export const C = {
  survive: '#6ee7b7',
  risk: '#ff7d6e',
  emerge: '#8ab4ff',
  signal: '#dcf26e',
  ink: '#f2efe9',
  muted: '#a9a9b4',
  faint: '#85858f',
  grid: 'rgba(255,255,255,0.07)',
  panel: '#0e0e12',
  line: '#26262f',
};

export const mono = 'JetBrains Mono Variable, ui-monospace, monospace';

export const tick = { fill: C.muted, fontSize: 10.5, fontFamily: mono };

/** The one tooltip style every chart uses. */
export function TipBox({
  title,
  rows,
}: {
  title: string;
  rows: { k: string; v: string; color?: string }[];
}) {
  return (
    <div className="tt">
      <div className="tt-k mb-1">{title}</div>
      {rows.map((r) => (
        <div key={r.k} className="flex items-baseline justify-between gap-4">
          <span style={{ color: C.faint }}>{r.k}</span>
          <span className="tt-v num" style={r.color ? { color: r.color } : undefined}>
            {r.v}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Recharts passes these props; typing them loosely keeps the call sites clean. */
export type TipProps = {
  active?: boolean;
  payload?: any[];
  label?: string | number;
};

export function Plot({
  children,
  height,
  label,
}: {
  children: ReactNode;
  height: number;
  label: string;
}) {
  return (
    <div className="chart-shell w-full" style={{ height }} role="img" aria-label={label}>
      {children}
    </div>
  );
}