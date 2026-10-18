// Every claim on the site resolves to an entry here. Chart data and job records
// carry a `source` id; `scripts/check.mjs` fails the build on an unknown id and
// on an entry nobody cites, so the bibliography cannot drift away from the data.
export type SourceKind = 'survey' | 'study' | 'statistics' | 'report' | 'press';

export interface Source {
  id: string;
  short: string;
  title: string;
  publisher: string;
  year: number;
  kind: SourceKind;
  url: string;
  note?: string;
}

export const sources = [
  {
    id: 'wef-jobs-2025',
    short: 'WEF 2025',
    title: 'Future of Jobs Report 2025',
    publisher: 'World Economic Forum',
    year: 2025,
    kind: 'survey',
    url: 'https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf',
    note: 'Survey of 1,000+ employers across 22 industry clusters, representing 14 million workers. Projections to 2030. Employer expectations, not observed outcomes.',
  },
  {
    id: 'wef-fastest',
    short: 'WEF 2025',
    title: 'Future of Jobs Report 2025: the fastest growing and declining jobs',
    publisher: 'World Economic Forum',
    year: 2025,
    kind: 'report',
    url: 'https://www.weforum.org/stories/2025/01/future-of-jobs-report-2025-the-fastest-growing-and-declining-jobs',
  },
  {
    id: 'ms-applicability',
    short: 'Microsoft Research 2025',
    title: 'Working with AI: Measuring the Applicability of Generative AI to Occupations',
    publisher: 'Microsoft Research (arXiv:2507.07935)',
    year: 2025,
    kind: 'study',
    url: 'https://arxiv.org/abs/2507.07935',
    note: 'Classifies 200,000 anonymised Bing Copilot conversations against O*NET work activities. Measures capability overlap with work, not job loss.',
  },
  {
    id: 'geekwire-ms',
    short: 'GeekWire 2025',
    title: 'Microsoft study shows jobs most — and least — impacted by generative AI',
    publisher: 'GeekWire',
    year: 2025,
    kind: 'press',
    url: 'https://www.geekwire.com/2025/microsoft-study-shows-jobs-most-and-least-impacted-by-generative-ai',
    note: 'Carries the ranked lists of most and least affected occupations, and the authors’ caveat that applicability is not displacement.',
  },
  {
    id: 'ilo-index',
    short: 'ILO 2025',
    title: 'Generative AI and Jobs: A Refined Global Index of Occupational Exposure',
    publisher: 'International Labour Organization',
    year: 2025,
    kind: 'study',
    url: 'https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure',
    note: '2,861 tasks scored across three LLMs plus expert review. Four exposure gradients; clerical work highest, physical work lowest.',
  },
  {
    id: 'stanford-canaries',
    short: 'Stanford 2026',
    title: 'Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence (August 2026 revision)',
    publisher: 'Stanford Digital Economy Lab',
    year: 2026,
    kind: 'study',
    url: 'https://digitaleconomy.stanford.edu/app/uploads/2026/08/Canaries_August2026.pdf',
    note: 'ADP payroll microdata through June 2026. Young workers (22–25) in AI-exposed occupations sit 19% below their kept-pace path (15% at the July 2025 vintage); experienced workers show no comparable gap. Descriptive, not causal.',
  },
  {
    id: 'stanford-dashboard',
    short: 'Canaries dashboard',
    title: 'Canaries Dashboard — AI Economic Indicators',
    publisher: 'Stanford Digital Economy Lab with ADP Research',
    year: 2026,
    kind: 'statistics',
    url: 'https://digitaleconomy.stanford.edu/project/indicators/canaries-dashboard/',
    note: 'Monthly update of the Canaries results; the paper it extends is the August 2026 revision above.',
  },
  {
    id: 'indeed-pay',
    short: 'Indeed Sep 2026',
    title: 'AI Exposure Isn’t Squeezing Advertised Pay in the US — It’s Boosting It',
    publisher: 'Indeed Hiring Lab',
    year: 2026,
    kind: 'report',
    url: 'https://hiringlab.indeed.com/2026/09/17/ai-exposure-isnt-squeezing-advertised-pay-in-the-us-its-boosting-it',
    note: 'Advertised salary on millions of US postings. +46% in the most AI-exposed occupations since 2021 vs +25% in the least exposed; the premium widens with seniority and is negligible at entry level.',
  },
  {
    id: 'indeed-snapshot',
    short: 'Indeed Sep 2026',
    title: 'US Labor Market Snapshot — September 2026',
    publisher: 'Indeed Hiring Lab',
    year: 2026,
    kind: 'statistics',
    url: 'https://hiringlab.indeed.com/2026/09/24/us-labor-market-snapshot-september-2026',
    note: 'Job Postings Index 103.5 on 18 September 2026, +0.7% year on year — the first positive annual reading in almost four years.',
  },
  {
    id: 'oecd-2026',
    short: 'OECD 2026',
    title: 'OECD Employment Outlook 2026: Geographic Disparities in Jobs and Incomes',
    publisher: 'OECD',
    year: 2026,
    kind: 'report',
    url: 'https://www.oecd.org/en/publications/oecd-employment-outlook-2026_7e710f54-en.html',
    note: 'OECD unemployment 4.9% in May 2026. Young university graduates face a rising unemployment risk — a trend the OECD notes began well before generative AI, which is why it is not attributed to AI here.',
  },
  {
    id: 'wef-four-futures',
    short: 'WEF 2026',
    title: 'Four Futures for Jobs in the New Economy: AI and Talent in 2030',
    publisher: 'World Economic Forum',
    year: 2026,
    kind: 'report',
    url: 'https://www.weforum.org/publications/four-futures-for-jobs-in-the-new-economy-ai-and-talent-in-2030/',
    note: 'Scenarios, not projections: four plausible 2030 futures at the intersection of AI advancement and workforce readiness. Used here only for the uncertainty section.',
  },
  {
    id: 'mckinsey-agents',
    short: 'McKinsey 2025',
    title: 'Agents, robots, and us: Skill partnerships in the age of AI',
    publisher: 'McKinsey Global Institute',
    year: 2025,
    kind: 'report',
    url: 'https://www.mckinsey.com/~/media/mckinsey/mckinsey%20global%20institute/our%20research/agents%20robots%20and%20us%20skill%20partnerships%20in%20the%20age%20of%20ai/agents-robots-and-us-skill-partnerships-in-the-age-of-ai.pdf',
    note: 'Technical potential, not a forecast: about 57% of US work hours could in theory be automated today (44% by agents, 13% by robots).',
  },
  {
    id: 'mckinsey-workforce',
    short: 'McKinsey 2025',
    title: 'Workforce in motion: Skills and pathways to future jobs in the United States',
    publisher: 'McKinsey Global Institute',
    year: 2025,
    kind: 'report',
    url: 'https://www.mckinsey.com/mgi/our-research/workforce-in-motion-skills-and-pathways-to-future-jobs-in-the-united-states',
    note: 'Occupations as bundles of interdependent activities; only about one in seven US workers has a direct skills pathway to a growing occupation.',
  },
  {
    id: 'pwc-barometer',
    short: 'PwC 2026',
    title: '2026 Global AI Jobs Barometer',
    publisher: 'PwC',
    year: 2026,
    kind: 'survey',
    url: 'https://pwc.com/gx/en/issues/artificial-intelligence/job-barometer/2026/2026-global-ai-jobs-barometer-full-report.pdf',
    note: 'Over one billion job advertisements in 27 countries. Splits occupations into professionalised, democratised and low-exposure tracks.',
  },
  {
    id: 'pwc-release',
    short: 'PwC 2026',
    title: 'AI reshapes global labour market into two distinct paths, rewarding human skills',
    publisher: 'PwC press release',
    year: 2026,
    kind: 'press',
    url: 'https://pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html',
  },
  {
    id: 'bls-fastest',
    short: 'BLS 2026',
    title: 'Fastest growing occupations, 2025 and projected 2035',
    publisher: 'US Bureau of Labor Statistics',
    year: 2026,
    kind: 'statistics',
    url: 'https://www.bls.gov/emp/tables/fastest-growing-occupations.htm',
    note: 'Official projections. Includes median annual wage, which is a current wage, not a projection.',
  },
  {
    id: 'bls-projections',
    short: 'BLS 2026',
    title: 'Industry and occupational employment projections overview, 2024–34',
    publisher: 'BLS Monthly Labor Review',
    year: 2026,
    kind: 'statistics',
    url: 'https://www.bls.gov/opub/mlr/2026/article/industry-and-occupational-employment-projections-overview.htm',
  },
  {
    id: 'bls-homecare',
    short: 'BLS 2026',
    title: 'Occupational Outlook Handbook: Home Health and Personal Care Aides',
    publisher: 'US Bureau of Labor Statistics',
    year: 2026,
    kind: 'statistics',
    url: 'https://www.bls.gov/ooh/healthcare/home-health-aides-and-personal-care-aides.htm',
    note: 'About 760,500 openings a year projected, most from replacement rather than growth.',
  },
  {
    id: 'linkedin-rise',
    short: 'LinkedIn 2026',
    title: 'Jobs on the Rise 2026: the 25 fastest-growing roles in the US',
    publisher: 'LinkedIn, via ZDNET',
    year: 2026,
    kind: 'report',
    url: 'https://www.zdnet.com/article/fastest-growing-ai-jobs-in-the-us-linkedin/',
    note: 'Ranked by growth in member job postings, Jan 2023 – Jul 2025. Platform data, not a representative labour-market survey.',
  },
  {
    id: 'fde-data',
    short: 'Exponent 2026',
    title: 'What is a Forward Deployed Engineer? (hiring data compiled by Exponent)',
    publisher: 'Forward Deployed Engineer job board',
    year: 2026,
    kind: 'report',
    url: 'https://fde-engineers.com/articles/what-is-a-forward-deployed-engineer',
    note: 'Postings grew from 643 in April 2025 to 5,330 in April 2026. A job-board count of one title, not an O*NET occupation.',
  },
  {
    id: 'resumenow',
    short: 'Resume Now 2026',
    title: 'The top 10 “AI-proof” jobs that require uniquely human skills',
    publisher: 'Resume Now, via CNBC',
    year: 2026,
    kind: 'report',
    url: 'https://www.cnbc.com/2026/08/10/the-top-ai-proof-jobs-that-require-uniquely-human-skills.html',
    note: 'Ranks occupations on six O*NET abilities: stamina, static strength, reaction time, spatial orientation, time sharing, problem sensitivity.',
  },
  {
    id: 'acl-care',
    short: 'ACL 2026',
    title: 'A New Era of Care: Beyond the Algorithm',
    publisher: 'Administration for Community Living',
    year: 2026,
    kind: 'report',
    url: 'https://acl.gov/sites/default/files/Direct%20Care%20Workforce/dcw-ai-beyond-the-algorithm.pdf',
    note: 'Expert interviews across the direct-care workforce. AI useful for documentation and scheduling; rejected as a substitute for physical assistance or relationships.',
  },
  {
    id: 'axipro',
    short: 'Axipro 2026',
    title: 'EU companies hire seven people to build AI for every one hired to govern it',
    publisher: 'Axipro study, via GlobeNewswire',
    year: 2026,
    kind: 'report',
    url: 'https://globenewswire.com/fr/news-release/2026/07/13/3326317/0/en/new-axipro-study-eu-companies-hire-seven-people-to-build-ai-for-every-one-hired-to-govern-it.html',
    note: 'Vendor study of 3,519 AI-related postings across eight EU countries. Directionally useful; company has a commercial interest in governance hiring.',
  },
] as const satisfies readonly Source[];

export type SourceId = (typeof sources)[number]['id'];

const byId = new Map<string, Source>(sources.map((s) => [s.id, s]));

export function getSource(id: string): Source {
  const source = byId.get(id);
  if (!source) throw new Error(`Unknown source id: "${id}" — add it to src/data/sources.ts`);
  return source;
}

export function sourceLabel(ids: readonly string[]): string {
  return ids.map((id) => getSource(id).short).join(' · ');
}