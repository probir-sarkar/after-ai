import { useEffect, useState } from 'react';
import { ToggleGroup } from '@base-ui-components/react/toggle-group';
import { Toggle } from '@base-ui-components/react/toggle';
import { verdictMeta, type Verdict } from '@/lib/site';

/**
 * Filters the server-rendered job cards by toggling `hidden` on the existing
 * DOM rather than re-rendering the list, so the catalogue still works with JS
 * off and the markup is not shipped twice.
 */
const OPTIONS: { value: Verdict | 'all'; label: string }[] = [
  { value: 'all', label: 'Everything' },
  { value: 'survives', label: verdictMeta.survives.label },
  { value: 'at-risk', label: verdictMeta['at-risk'].label },
  { value: 'emerging', label: verdictMeta.emerging.label },
  { value: 'mixed', label: verdictMeta.mixed.label },
];

export default function JobFilter({ counts }: { counts: Record<string, number> }) {
  const [selected, setSelected] = useState<string[]>(['all']);
  const active = selected[0] ?? 'all';

  useEffect(() => {
    let shown = 0;
    document.querySelectorAll<HTMLElement>('.job-card').forEach((card) => {
      const match = active === 'all' || card.dataset.verdict === active;
      card.hidden = !match;
      if (match) shown += 1;
    });
    const out = document.getElementById('job-count');
    if (out) out.textContent = String(shown);
  }, [active]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <ToggleGroup
        value={selected}
        onValueChange={(v) => setSelected(v.length ? v.slice(-1).map(String) : ['all'])}
        className="flex flex-wrap gap-2"
        aria-label="Filter jobs by verdict"
      >
        {OPTIONS.map((o) => (
          <Toggle
            key={o.value}
            value={o.value}
            className="chip cursor-pointer data-[pressed]:border-transparent data-[pressed]:bg-ink data-[pressed]:text-void"
          >
            {o.label}
            <span className="num opacity-60">{o.value === 'all' ? total : (counts[o.value] ?? 0)}</span>
          </Toggle>
        ))}
      </ToggleGroup>
      <p className="eyebrow" aria-live="polite">
        <span id="job-count">{total}</span> shown
      </p>
    </div>
  );
}
