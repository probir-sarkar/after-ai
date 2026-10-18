export const site = {
  name: 'After AI',
  tagline: 'Which jobs survive, and which are being born',
  description:
    'Which jobs survive automation, which are already exposed, and which are being created — with every figure cited to a public source.',
  url: 'https://after-ai.probir.dev',
  repo: 'https://github.com/probir-sarkar/after-ai',
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
  { key: 'body', label: 'The work needs a body, in a place that keeps changing', short: 'Needs hands and a body' },
  { key: 'accountability', label: 'A person is legally or morally answerable for the result', short: 'A person is answerable' },
  { key: 'relationship', label: 'It depends on a relationship with a person', short: 'It needs a relationship' },
  { key: 'bundle', label: 'The role is one job, not a pile of tasks', short: "The role can't be split" },
] as const;

/** What each step of the 0–3 scale means. */
export const testScale = [
  { n: 0, label: 'not at all' },
  { n: 1, label: 'a little' },
  { n: 2, label: 'clearly' },
  { n: 3, label: 'the whole job' },
] as const;

export type TestProfile = { body: number; accountability: number; relationship: number; bundle: number };

/**
 * Turns the four-test score into a sentence, because "4/12" on its own reads as
 * a bad grade. The score measures how much protection a job gets from the four
 * properties — it is not a judgement of demand, and the verdict has to be part
 * of the reading or an emerging role looks like an exposed one.
 */
export function readProfile(t: TestProfile, verdict: Verdict): { total: number; reading: string } {
  const total = t.body + t.accountability + t.relationship + t.bundle;

  if (verdict === 'emerging') {
    return {
      total,
      reading:
        'Low, and that is expected. These four things protect a job from being automated — and this job was created by AI in the first place, so it never needed protecting. Low here does not mean at risk.',
    };
  }
  if (verdict === 'at-risk') {
    return {
      total,
      reading:
        total <= 3
          ? 'None of the four really applies. Nothing here is protecting the job from being automated.'
          : 'One or two of the four apply. That is usually what is left of a job after the routine half is automated.',
    };
  }
  if (verdict === 'mixed') {
    return {
      total,
      reading:
        'A low score that hides two different jobs under one title: the part that got more skilled scores high, the part that got simpler scores near zero.',
    };
  }
  return {
    total,
    reading:
      total >= 9
        ? 'Most of the four apply. A machine cannot do this work on its own, so the job holds its shape.'
        : 'Some of the four apply. The job stays, but its routine half moves to AI.',
  };
}

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