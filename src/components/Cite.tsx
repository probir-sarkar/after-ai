import { getSource } from '@/data/sources';

/**
 * Inline citation used inside MDX. `ids` is a comma-separated list of source ids;
 * an unknown id throws at build time (see getSource), so a typo cannot ship as a
 * silently missing reference.
 */
export default function Cite({ ids }: { ids: string }) {
  const list = ids
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map(getSource);

  return (
    <sup className="ml-1 inline-flex gap-1 align-super">
      {list.map((s) => (
        <a
          key={s.id}
          href={`/sources#${s.id}`} target="_blank" rel="noopener"
          title={`${s.title} — ${s.publisher}, ${s.year}`}
          className="num rounded-[4px] border border-line bg-panel px-1 py-[1px] text-[11px] leading-none text-muted no-underline hover:border-signal hover:text-ink"
        >
          {s.short}
        </a>
      ))}
    </sup>
  );
}