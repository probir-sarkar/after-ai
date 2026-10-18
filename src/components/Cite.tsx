import { getSource } from '@/data/sources';

/**
 * Inline citation used inside MDX. `ids` is a comma-separated list of source ids;
 * an unknown id throws at build time (see getSource), so a typo cannot ship as a
 * silently missing reference.
 *
 * Alignment: an inline-block with `vertical-align: bottom`, measured rather than
 * guessed. A <sup> floated the chip above the x-height and detached it from its
 * sentence; inline-flex put the flex baseline in the wrong place. Bottom alignment
 * puts the pill's bottom edge on the bottom of the line box, so the chips read as
 * a row of tags sitting under the text rather than superscripts over it.
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
          className={`num inline-block rounded-[4px] border border-line bg-panel px-[5px] py-[2px] align-bottom text-[11px] leading-none text-muted no-underline hover:border-signal hover:text-ink ${i > 0 ? 'ml-1' : ''}`}
        >
          {s.short}
        </a>
      ))}
    </span>
  );
}