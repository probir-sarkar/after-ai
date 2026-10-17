export const site = {
  name: 'After AI',
  tagline: 'Which jobs survive, and which are being born',
  description:
    'A sourced, chart-heavy brief on the work that survives automation, the work that is exposed, and the roles being created — built from the 2025–26 labour-market evidence.',
  url: 'https://after-ai.probir.dev',
} as const;

export const nav = [
  { href: '/survives', label: 'Survives' },
  { href: '/risk', label: 'Risk' },
  { href: '/opportunity', label: 'Opportunity' },
  { href: '/what-to-do', label: 'What to do' },
  { href: '/jobs', label: 'All jobs' },
  { href: '/sources', label: 'Sources' },
] as const;

export type Verdict = 'survives' | 'at-risk' | 'emerging' | 'mixed';

export const verdictMeta: Record<
  Verdict,
  { label: string; blurb: string; color: string; tone: string }
> = {
  survives: {
    label: 'Survives',
    blurb: 'Durable: at least one of the four tests holds, and the evidence is direct.',
    color: 'var(--color-survive)',
    tone: 'survive',
  },
  'at-risk': {
    label: 'Exposed',
    blurb: 'The task profile has little on the defensive side of the ledger.',
    color: 'var(--color-risk)',
    tone: 'risk',
  },
  emerging: {
    label: 'Emerging',
    blurb: 'New work created by AI deployment. Evidence is younger and thinner.',
    color: 'var(--color-emerge)',
    tone: 'emerge',
  },
  mixed: {
    label: 'In flux',
    blurb: 'Splitting in two: a version that got more expert, and a version that got deskilled.',
    color: 'var(--color-signal)',
    tone: 'signal',
  },
};

export const categoryMeta: Record<string, string> = {
  care: 'Care & health',
  trades: 'Trades & physical',
  judgement: 'Judgement & accountability',
  frontline: 'Frontline & emergency',
  cognitive: 'Cognitive & clerical',
  platform: 'AI-native',
};

export const testLabels = [
  { key: 'body', label: 'Body in a variable world', short: 'Body' },
  { key: 'accountability', label: 'Someone is accountable', short: 'Accountability' },
  { key: 'relationship', label: 'It is a relationship', short: 'Relationship' },
  { key: 'bundle', label: 'Indivisible bundle', short: 'Bundle' },
] as const;

/** Formats a value that the data file already carries a display string for. */
export function signed(value: number, digits = 1): string {
  const rounded = Number.isInteger(value) ? value : Number(value.toFixed(digits));
  return `${rounded > 0 ? '+' : rounded < 0 ? '−' : ''}${Math.abs(rounded)}`;
}

export function withCommas(value: number): string {
  return value.toLocaleString('en-US');
}

export function cleanPath(pathname: string): string {
  return pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
}
