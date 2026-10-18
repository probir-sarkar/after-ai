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
        'Not protected, and that is expected: this job exists because of AI, so it never needed protecting. That is not the same as being at risk.',
    };
  }
  if (verdict === 'at-risk') {
    return {
      total,
      reading:
        total <= 3
          ? 'Almost none of these hold, so nothing here keeps the work out of a machine’s reach.'
          : 'One of them holds, which is usually what survives of a job after its routine half is automated.',
    };
  }
  if (verdict === 'mixed') {
    return {
      total,
      reading:
        'One title, two jobs: the part that got more skilled is protected, the part that got simpler is not.',
    };
  }
  return {
    total,
    reading:
      total >= 9
        ? 'Most of these hold. A machine cannot do this work on its own, so the job keeps its shape.'
        : 'Some of these hold. The job stays, but its routine half moves to AI.',
  };
}

/** A word for the total, so the page never has to show a score out of twelve. */
export function protectionWord(total: number): string {
  if (total >= 9) return 'Well protected';
  if (total >= 6) return 'Partly protected';
  if (total >= 3) return 'Weakly protected';
  return 'Barely protected';
}

// Astro.url.pathname carries the .html that build.format:'file' adds, so every
// canonical, og:url and nav highlight is built from the cleaned path instead.
export function cleanPath(pathname: string): string {
  return pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
}

export function signed(value: number, digits = 1): string {
  const rounded = Number.isInteger(value) ? value : Number(value.toFixed(digits));
  return `${rounded > 0 ? '+' : rounded < 0 ? '−' : ''}${Math.abs(rounded)}`;
}

export function withCommas(value: number): string {
  return value.toLocaleString('en-US');
}
