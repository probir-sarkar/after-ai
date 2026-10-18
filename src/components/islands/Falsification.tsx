import { Accordion } from '@base-ui-components/react/accordion';

/**
 * The honest section: what would have to change for the rest of the site to be
 * wrong. Each item names the load-bearing assumption it attacks.
 */
const ITEMS = [
  {
    k: 'Robotics',
    q: 'If robots get hands',
    a: 'The 13%-of-hours estimate is what protects every trade and care role on this site. A step change in dexterity, cost and reliability would move roofers, drivers and care aides from durable to exposed faster than any of the other assumptions here.',
    source: 'mckinsey-agents',
  },
  {
    k: 'Agent reliability',
    q: 'If verification gets cheap',
    a: 'Every "human in the loop" role — reviewing outputs, handling exceptions, assuring quality — depends on supervision being necessary. If models become reliably self-verifying on routine work, the oversight layer is the first thing to shrink.',
    source: 'mckinsey-workforce',
  },
  {
    k: 'Adoption speed',
    q: 'If diffusion outruns capability',
    a: 'The 57%-of-hours figure is technical potential, not a forecast. Diffusion has historically taken decades, and the gap between what is possible and what is deployed is where most of today\'s jobs live. Slow adoption makes this site\'s risk section too pessimistic.',
    source: 'mckinsey-agents',
  },
  {
    k: 'Policy',
    q: 'If the new jobs are not reachable',
    a: 'Nothing in the data guarantees the jobs created are in the same countries, or reachable by the same people, as the ones displaced. Only about one in seven US workers has a direct skills pathway from a shrinking occupation to a growing one, and that ratio is the whole policy problem in one number.',
    source: 'mckinsey-workforce',
  },
];

export default function Falsification() {
  return (
    <Accordion.Root className="panel divide-y divide-[var(--color-line-soft)]">
      {ITEMS.map((item) => (
        <Accordion.Item key={item.k} value={item.k}>
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full cursor-pointer items-baseline gap-4 px-5 py-4 text-left">
              <span className="eyebrow w-32 shrink-0 group-data-[panel-open]:text-signal">{item.k}</span>
              <span className="flex-1 text-[16.5px] leading-snug text-ink">{item.q}</span>
              <span className="num text-[14px] text-faint transition-transform group-data-[panel-open]:rotate-45">
                +
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className="overflow-hidden">
            <p className="max-w-[68ch] px-5 pb-5 pl-[9.5rem] text-[14px] leading-relaxed text-muted">
              {item.a}
            </p>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}