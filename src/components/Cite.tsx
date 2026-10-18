import { getSource } from '@/data/sources';

/**
 * Inline citation used inside MDX. `ids` is a comma-separated list of source ids;
 * an unknown id throws at build time (see getSource), so a typo cannot ship as a
 * silently missing reference.
 *
 * Alignment: an inline-block with `vertical-align: middle`, so the pill centres
 * on the x-height of the surrounding line. A <sup> floated it above the text and
 * detached it from its sentence; inline-flex put the flex baseline in the wrong
 * place; bottom pinned it to the line-box floor. Middle reads as a tag sitting
 * inside the sentence.
 */
export default function Cite({ ids }: { ids: string }) {
  const list = ids
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map(getSource);

  return (
    <span className="ml-1 whitespace-nowrap">
      {list.map((s, i) => (
        <a
          key={s.id}
          href={`/sources#${s.id}`}
          target="_blank"
          rel="noopener"
          title={`${s.title} — ${s.publisher}, ${s.year}`}
          className={`num inline-block rounded-[4px] border border-line bg-panel px-[5px] py-[2px] align-middle text-[11px] leading-none text-muted no-underline hover:border-signal hover:text-ink ${i > 0 ? 'ml-1' : ''}`}
        >
          {s.short}
        </a>
      ))}
    </span>
  );
}