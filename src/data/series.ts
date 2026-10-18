/**
 * Every chart series on the site lives here with its source id attached, so the
 * build check can prove that no number reaches a chart without a reference.
 * Figures are transcribed exactly as published; unit and horizon live with the
 * chart caption, not in the value.
 */

export interface Bar {
  label: string;
  value: number;
  display: string;
  source: string;
  tone?: 'survive' | 'risk' | 'emerge' | 'signal';
}

/** WEF employers: jobs created and displaced to 2030, by technology driver. */
export const churn: {
  driver: string;
  created: number;
  displaced: number;
  /** True when the leftward figure is a net position, not a displacement count. */
  netOnly?: boolean;
  note?: string;
  source: string;
}[] = [
  { driver: 'Broadening digital access', created: 19, displaced: -9, source: 'wef-fastest' },
  { driver: 'AI & information processing', created: 11, displaced: -9, source: 'wef-fastest' },
  {
    driver: 'Robots & autonomous systems',
    created: 0,
    displaced: -5,
    netOnly: true,
    note: 'No creation figure published; the −5M is the net position after displacement.',
    source: 'wef-fastest',
  },
];

/** ILO task-level scoring: how much global employment sits in each exposure band. */
export const exposure: Bar[] = [
  { label: 'Any exposure, worldwide', value: 25, display: '1 in 4', source: 'ilo-index', tone: 'signal' },
  { label: 'Highest exposure band', value: 3.3, display: '3.3%', source: 'ilo-index', tone: 'risk' },
  { label: 'Any exposure — high-income', value: 34, display: '34%', source: 'ilo-index', tone: 'emerge' },
  { label: 'Any exposure — low-income', value: 11, display: '11%', source: 'ilo-index', tone: 'survive' },
];

/** Stanford: relative employment change since late 2022. */
export const entryLevel: Bar[] = [
  {
    label: 'Ages 22–25, exposed',
    value: -16,
    display: '−16%',
    source: 'stanford-canaries',
    tone: 'risk',
  },
  {
    label: 'Experienced, same jobs',
    value: 0,
    display: 'stable',
    source: 'stanford-canaries',
    tone: 'emerge',
  },
];

/** PwC: entry-level roles split by whether they were redesigned to demand senior skills. */
export const seniorised: Bar[] = [
  {
    label: '10+ new senior skills',
    value: 35,
    display: '+35%',
    source: 'pwc-barometer',
    tone: 'survive',
  },
  { label: 'Other entry-level roles', value: -10, display: '−10%', source: 'pwc-release', tone: 'risk' },
];

/** PwC: the AI-skills wage premium, by sector, 2025. */
export const premium: Bar[] = [
  { label: 'Consumer markets', value: 118, display: '+118%', source: 'pwc-release', tone: 'emerge' },
  { label: 'Average, all sectors', value: 62, display: '+62%', source: 'pwc-release', tone: 'signal' },
  { label: 'Government & public sector', value: 16, display: '+16%', source: 'pwc-release', tone: 'survive' },
];

/** Forward-deployed engineer postings, one year apart. */
export const fde: Bar[] = [
  { label: 'Apr 2025', value: 643, display: '643', source: 'fde-data', tone: 'emerge' },
  { label: 'Apr 2026', value: 5330, display: '5,330', source: 'fde-data', tone: 'signal' },
];

/** BLS: fastest-growing occupations by percentage, 2025–2035. */
export const blsGrowth: Bar[] = [
  { label: 'Nurse practitioners', value: 41.0, display: '+41.0%', source: 'bls-fastest', tone: 'survive' },
  { label: 'Solar photovoltaic installers', value: 36.5, display: '+36.5%', source: 'bls-fastest', tone: 'survive' },
  { label: 'Data scientists', value: 34.6, display: '+34.6%', source: 'bls-fastest', tone: 'emerge' },
  { label: 'Wind turbine technicians', value: 29.5, display: '+29.5%', source: 'bls-fastest', tone: 'survive' },
  { label: 'Medical & health services managers', value: 24.2, display: '+24.2%', source: 'bls-fastest', tone: 'survive' },
  { label: 'Physical therapist assistants', value: 23.0, display: '+23.0%', source: 'bls-fastest', tone: 'survive' },
  { label: 'Psychiatric technicians', value: 22.3, display: '+22.3%', source: 'bls-fastest', tone: 'survive' },
  { label: 'Computer & information researchers', value: 21.8, display: '+21.8%', source: 'bls-fastest', tone: 'emerge' },
  { label: 'Occupational therapy assistants', value: 21.5, display: '+21.5%', source: 'bls-fastest', tone: 'survive' },
  { label: 'Physician assistants', value: 21.1, display: '+21.1%', source: 'bls-fastest', tone: 'survive' },
  { label: 'Information security analysts', value: 21.0, display: '+21.0%', source: 'bls-fastest', tone: 'emerge' },
  { label: 'Home health & personal care aides', value: 18.1, display: '+18.1%', source: 'bls-fastest', tone: 'survive' },
];

/** BLS: largest absolute job gains, in thousands, 2025–2035. */
export const blsAbsolute: Bar[] = [
  { label: 'Home health & personal care aides', value: 847.3, display: '+847.3k', source: 'bls-fastest', tone: 'survive' },
  { label: 'Medical & health services managers', value: 155.1, display: '+155.1k', source: 'bls-fastest', tone: 'survive' },
  { label: 'Nurse practitioners', value: 137.8, display: '+137.8k', source: 'bls-fastest', tone: 'survive' },
  { label: 'Computer & information systems managers', value: 108.1, display: '+108.1k', source: 'bls-fastest', tone: 'emerge' },
  { label: 'Substance abuse & mental health counselors', value: 98.0, display: '+98.0k', source: 'bls-fastest', tone: 'survive' },
  { label: 'Data scientists', value: 95.4, display: '+95.4k', source: 'bls-fastest', tone: 'emerge' },
  { label: 'Industrial machinery mechanics', value: 79.7, display: '+79.7k', source: 'bls-fastest', tone: 'survive' },
];

/** PwC's two-track split of the labour market. */
export const twoTrack: {
  track: 'Professionalised' | 'Democratised' | 'Low exposure';
  share: number;
  plain: string;
  move: string;
  outcome: string;
  examples: string;
  source: string;
}[] = [
  {
    track: 'Professionalised',
    share: 22,
    plain: 'AI does the boring parts, so the job gets harder — and pays more.',
    move: 'AI takes the routine tasks; the human does the harder, more expert ones',
    outcome: 'These roles are growing twice as fast as democratised ones, with 42% higher wage growth since 2021.',
    examples: 'Radiologists · employment recruiters · air traffic controllers',
    source: 'pwc-barometer',
  },
  {
    track: 'Democratised',
    share: 52,
    plain: 'AI does the hard parts, so the job gets simpler — and pays less.',
    move: 'AI takes the complex tasks; simpler work is left for people to do',
    outcome: 'Barriers to entry fall and wages fall; postings grow half as fast as the professionalised track.',
    examples: 'Software developers · loan officers · medical secretaries · finance managers',
    source: 'pwc-barometer',
  },
  {
    track: 'Low exposure',
    share: 26,
    plain: 'AI barely touches it either way. Something else decides this job’s fate.',
    move: 'Few tasks in the job overlap with what AI can do at all',
    outcome: 'AI changes little either way here — demand for these jobs is driven by something else.',
    examples: 'Chefs · construction workers · mechanics',
    source: 'pwc-barometer',
  },
];

/** Microsoft: the two ends of the AI-applicability ranking, drawn from real usage. */
export const spectrum = {
  most: [
    'Interpreters & translators',
    'Historians',
    'Passenger attendants',
    'Sales representatives',
    'Writers & authors',
    'Customer service representatives',
  ],
  least: [
    'Roofers',
    'Tire builders',
    'Pile driver operators',
    'Surgical assistants',
    'Massage therapists',
    'Phlebotomists',
    'Embalmers',
    'Nursing assistants',
  ],
  source: 'geekwire-ms',
};