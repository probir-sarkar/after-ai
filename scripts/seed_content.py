#!/usr/bin/env python3
"""One-off seed: writes src/content/jobs/<slug>/{job.json,notes.mdx} and src/content/sections/*.mdx.

This is a seed, not a build step. After it runs, the files under src/content/ are
the source of truth — edit them directly, and do not re-run this script over them
(it would overwrite hand edits).

Numbers here are copied from the sources listed in src/data/sources.ts. If a figure
is not in a source, it does not go in.
"""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent.parent
JOBS = ROOT / "src" / "content" / "jobs"
SECTIONS = ROOT / "src" / "content" / "sections"

def job(slug, data, note):
    d = JOBS / slug
    d.mkdir(parents=True, exist_ok=True)
    (d / "job.json").write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    (d / "notes.mdx").write_text(note.strip() + "\n")
    print("wrote", slug)

# ---------------------------------------------------------------- survives
job("home-health-aide", {
  "name": "Home health and personal care aides",
  "short": "Home health aides",
  "verdict": "survives",
  "category": "care",
  "oneLiner": "The largest source of new jobs in the US economy — and the one AI helps least.",
  "tests": {"body": 3, "accountability": 2, "relationship": 3, "bundle": 2},
  "why": [
    "Hands-on physical assistance: lifting, transferring, bathing, gait belts",
    "The work is a relationship, and the client can tell the difference",
    "Licensing, liability and dignity keep a human accountable for the outcome",
    "Demand is driven by demographics, not by software adoption"
  ],
  "threats": [
    "Median pay is $35,800 — a job-quality crisis, not an AI story",
    "Most openings replace workers who leave, not new growth",
    "Charting, scheduling and vitals logging will leave the human's plate"
  ],
  "metrics": [
    {"label": "Projected growth, 2025–35", "display": "+18.1%", "value": 18.1, "unit": "percent", "source": "bls-fastest"},
    {"label": "Jobs added", "display": "+847,300", "value": 847300, "unit": "jobs", "source": "bls-fastest"},
    {"label": "Median annual pay", "display": "$35,800", "value": 35800, "unit": "usd", "source": "bls-fastest"},
    {"label": "Openings a year", "display": "760,500", "value": 760500, "unit": "count", "source": "bls-homecare"}
  ],
  "claims": [
    {"text": "Adds more jobs than any other occupation published by the US Bureau of Labor Statistics.", "source": "bls-projections"},
    {"text": "About 760,500 openings a year, most of them replacing workers who leave rather than new positions.", "source": "bls-homecare"},
    {"text": "AI's documented value in care is documentation, scheduling and monitoring; experts across the care workforce reject it as a substitute for physical assistance or human relationships.", "source": "acl-care"}
  ],
  "series": [{"label": "Home health aides", "value": 18.1, "kind": "growth", "source": "bls-fastest"}],
  "horizon": "2025–2035",
  "wage": "$35,800",
  "order": 1,
  "featured": True
}, """
It is the least fashionable answer and the biggest one. **Home health and personal
care aides add more jobs than any other occupation the US Bureau of Labor Statistics
tracks** — 847,300 of them to 2035, about one in every seven jobs the economy is
projected to create.<Cite ids="bls-fastest" />

The reason is not that the work is unskilled. It is that the work is *unbundleable*.
A caregiver lifts a person out of a chair, notices a change in how they are breathing,
and is trusted not to steal from them. When the care workforce was asked directly where
AI helps, the answer was documentation, scheduling and monitoring — and the answer to
"can it replace this?" was no.<Cite ids="acl-care" />

Two honest caveats. Median pay is $35,800, and most of those openings are replacements
for people who leave, which means the growth is partly a measure of turnover. If AI
takes the charting and the scheduling, the occupation gets *more* physical and *less*
paid — the wrong direction for job quality even as headcount rises.
""")

job("nurse-practitioner", {
  "name": "Nurse practitioners",
  "short": "Nurse practitioners",
  "verdict": "survives",
  "category": "care",
  "oneLiner": "The fastest-growing occupation in the BLS table, at 41% — more than ten times the economy-wide rate.",
  "tests": {"body": 2, "accountability": 3, "relationship": 3, "bundle": 3},
  "why": [
    "Prescribing and diagnosing means legal accountability, which cannot be delegated to a model",
    "Care teams are being restructured around these roles, not away from them",
    "The clinical relationship carries the outcome; a wrong call is a harmed patient"
  ],
  "threats": [
    "Documentation and routine triage shrink the administrative half of the role",
    "Training pipelines still depend on supervised hours that AI is not replacing"
  ],
  "metrics": [
    {"label": "Projected growth, 2025–35", "display": "+41.0%", "value": 41.0, "unit": "percent", "source": "bls-fastest"},
    {"label": "Jobs added", "display": "+137,800", "value": 137800, "unit": "jobs", "source": "bls-fastest"},
    {"label": "Median annual pay", "display": "$132,300", "value": 132300, "unit": "usd", "source": "bls-fastest"}
  ],
  "claims": [
    {"text": "The fastest-growing occupation in BLS projections to 2035, at 41%, against 3.5% for all occupations.", "source": "bls-fastest"},
    {"text": "Providers are relying more on these roles to deliver care under collaborative, team-based models.", "source": "bls-projections"}
  ],
  "series": [{"label": "Nurse practitioners", "value": 41.0, "kind": "growth", "source": "bls-fastest"}],
  "horizon": "2025–2035",
  "wage": "$132,300",
  "order": 2,
  "featured": True
}, """
The durability here is not physical, it is *legal*. Someone has to sign the prescription,
carry the liability, and make the judgement call at 3am when the protocol does not cover
the case in front of them. That is the definition of work where a human stays in the loop
because removing them transfers risk nobody wants.

It helps that AI lands on the administrative half. The clinical-trial evidence on
AI-assisted radiology is instructive: junior radiologists' reading time fell 18.5% and
report quality rose, which shifted their work from drafting to reviewing and
correcting.<Cite ids="mckinsey-workforce" /> The drafting was never the job. The
accountability was.
""")

job("solar-installer", {
  "name": "Solar photovoltaic installers",
  "short": "Solar installers",
  "verdict": "survives",
  "category": "trades",
  "oneLiner": "Physical work in a place that changes every day, on a roof that does not read specifications.",
  "tests": {"body": 3, "accountability": 2, "relationship": 1, "bundle": 2},
  "why": [
    "Every site is different: roof pitch, timber, weather, wiring",
    "Fine motor control and safety judgement on ladders and live arrays",
    "The energy transition is the demand driver, not AI"
  ],
  "threats": [
    "Robotics, if dexterity and cost change, is the only real threat here",
    "Pay is moderate for outdoor, hazardous work"
  ],
  "metrics": [
    {"label": "Projected growth, 2025–35", "display": "+36.5%", "value": 36.5, "unit": "percent", "source": "bls-fastest"},
    {"label": "Jobs added", "display": "+11,300", "value": 11300, "unit": "jobs", "source": "bls-fastest"},
    {"label": "Median annual pay", "display": "$53,140", "value": 53140, "unit": "usd", "source": "bls-fastest"}
  ],
  "claims": [
    {"text": "Second-fastest-growing occupation in BLS projections to 2035, at 36.5%.", "source": "bls-fastest"},
    {"text": "Climate and energy-storage trends put renewable energy and environmental engineering roles among the fastest-growing, and environmental stewardship entered the top-10 fastest-growing skills for the first time.", "source": "wef-jobs-2025"}
  ],
  "series": [{"label": "Solar installers", "value": 36.5, "kind": "growth", "source": "bls-fastest"}],
  "horizon": "2025–2035",
  "wage": "$53,140",
  "order": 3
}, """
McKinsey's current-capability estimate is the load-bearing number for every trade on this
page: software agents could touch about 44% of US work hours, but **robots only about
13%**, because machines still lack fine motor control and real-time physical
judgement.<Cite ids="mckinsey-agents" />

A roof is the strongest possible counterexample to the "AI does everything" story.
Nothing about installing an array is stable enough to specify in advance — the layout
changes when the timber under the shingle is rotten. The work is not safe because it is
manual; it is safe because it is *variable* and a mistake injures someone.
""")

job("wind-technician", {
  "name": "Wind turbine service technicians",
  "short": "Wind technicians",
  "verdict": "survives",
  "category": "trades",
  "oneLiner": "Eighty metres up a tower, on a machine that is not coming to you.",
  "tests": {"body": 3, "accountability": 2, "relationship": 0, "bundle": 2},
  "why": [
    "Confined, high-altitude, hazardous — no teleoperation on this timeline",
    "Diagnosis on a variable physical asset, not on a document",
    "Small workforce, growing industry, hard to offshore"
  ],
  "threats": [
    "Remote diagnostics and condition monitoring shrink the inspection half of the job",
    "Very small absolute numbers: this is a niche, not a lifeboat"
  ],
  "metrics": [
    {"label": "Projected growth, 2025–35", "display": "+29.5%", "value": 29.5, "unit": "percent", "source": "bls-fastest"},
    {"label": "Jobs added", "display": "+3,500", "value": 3500, "unit": "jobs", "source": "bls-fastest"},
    {"label": "Median annual pay", "display": "$64,120", "value": 64120, "unit": "usd", "source": "bls-fastest"}
  ],
  "claims": [
    {"text": "Fourth-fastest-growing occupation in BLS projections, at 29.5% — but only 3,500 net new jobs.", "source": "bls-fastest"}
  ],
  "series": [{"label": "Wind technicians", "value": 29.5, "kind": "growth", "source": "bls-fastest"}],
  "horizon": "2025–2035",
  "wage": "$64,120",
  "order": 4
}, """
Percentage growth and job volume are different things, and this one shows why ranking by
percent is misleading. A 29.5% growth rate on a workforce of 11,800 people produces
**3,500 jobs in total**.<Cite ids="bls-fastest" /> It is a good career and a rounding
error in the labour market.

Read it as a category signal rather than an opportunity: the physical maintenance of the
energy transition is one of the few places where both demand *and* task shape point the
same way.
""")

job("industrial-machinery-mechanic", {
  "name": "Industrial machinery mechanics",
  "short": "Machinery mechanics",
  "verdict": "survives",
  "category": "trades",
  "oneLiner": "When the automation breaks, someone has to take it apart.",
  "tests": {"body": 3, "accountability": 2, "relationship": 1, "bundle": 3},
  "why": [
    "Every automation programme creates maintenance work",
    "Fault diagnosis on real metal, in situ, under production pressure",
    "446,900 people already do this — 79,700 more are projected"
  ],
  "threats": [
    "Predictive maintenance removes some scheduled-inspection work",
    "Employer-funded training is the bottleneck, not demand"
  ],
  "metrics": [
    {"label": "Projected growth, 2025–35", "display": "+17.8%", "value": 17.8, "unit": "percent", "source": "bls-fastest"},
    {"label": "Jobs added", "display": "+79,700", "value": 79700, "unit": "jobs", "source": "bls-fastest"},
    {"label": "Median annual pay", "display": "$64,520", "value": 64520, "unit": "usd", "source": "bls-fastest"}
  ],
  "claims": [
    {"text": "Projected to grow 17.8% to 2035, adding 79,700 jobs — one of the largest absolute additions in the fastest-growing table.", "source": "bls-fastest"},
    {"text": "Demand is rising for complementary skills alongside AI fluency — quality assurance, process optimisation, teaching, and physical skills such as nursing and electrical work.", "source": "mckinsey-agents"}
  ],
  "series": [{"label": "Machinery mechanics", "value": 17.8, "kind": "growth", "source": "bls-fastest"}],
  "horizon": "2025–2035",
  "wage": "$64,520",
  "order": 5
}, """
The counter-intuitive consequence of automating a factory is that it needs *more* people
who can fix the automation. McKinsey's skill analysis puts electrical work and quality
assurance among the complementary skills employers are asking for more of as AI
fluency rises.<Cite ids="mckinsey-agents" />

This is the general pattern behind trades on this list: they are not untouched by AI, they
are *downstream* of it.
""")

job("firefighter", {
  "name": "Firefighters",
  "short": "Firefighters",
  "verdict": "survives",
  "category": "frontline",
  "oneLiner": "Ranked the single most AI-proof occupation in a study of O*NET physical abilities.",
  "tests": {"body": 3, "accountability": 3, "relationship": 2, "bundle": 3},
  "why": [
    "Stamina, static strength, reaction time, spatial orientation, danger detection",
    "Someone has to be accountable when the decision kills or saves",
    "The environment changes faster than any specification can describe"
  ],
  "threats": [
    "Dispatch, mapping and paperwork are already being automated around the role",
    "Public-sector pay and staffing are political, not technological, risks"
  ],
  "metrics": [
    {"label": "Median annual pay", "display": "$59,280", "value": 59280, "unit": "usd", "source": "resumenow"},
    {"label": "Rank on Resume Now's list", "display": "#1", "value": 1, "unit": "index", "source": "resumenow"}
  ],
  "claims": [
    {"text": "First on a ranking of occupations that rely most on six O*NET abilities: stamina, static strength, reaction time, spatial orientation, time sharing and problem sensitivity.", "source": "resumenow"},
    {"text": "The distinguishing feature is that the work requires recognising problems, interpreting changing conditions, deciding under unpredictable conditions — and that a wrong call injures someone.", "source": "resumenow"}
  ],
  "series": [],
  "horizon": None,
  "wage": "$59,280",
  "order": 6,
  "featured": True
}, """
The one ranking here that measures *abilities* rather than exposure is the most useful of
the lot, because it explains the pattern instead of describing it. Firefighting scores
highest on stamina, static strength, reaction time, spatial orientation, time sharing
and problem sensitivity.<Cite ids="resumenow" />

Note what that combination implies: **unpredictability plus consequence**. The
interviewed expert's version of the argument is blunt — when something goes wrong in a
life-or-death situation, "you don't necessarily want an AI agent making that final
call."<Cite ids="resumenow" />

That is the test to apply to any role, not just this one.
""")

job("radiologist", {
  "name": "Radiologists",
  "short": "Radiologists",
  "verdict": "survives",
  "category": "judgement",
  "oneLiner": "The profession everyone predicted would vanish first, which instead got better at its hard half.",
  "tests": {"body": 0, "accountability": 3, "relationship": 2, "bundle": 3},
  "why": [
    "The job is a bundle: drafting reports was never the valuable part",
    "Diagnostic accountability sits with a named clinician",
    "AI output needs verification, and verification is expert work"
  ],
  "threats": [
    "The drafting rung of the training ladder is disappearing",
    "Radiology took 20 years of warnings and did not shrink — that is evidence, not comfort"
  ],
  "metrics": [
    {"label": "Reading time cut for juniors", "display": "−18.5%", "value": 18.5, "unit": "percent", "source": "mckinsey-workforce"}
  ],
  "claims": [
    {"text": "In a clinical trial, AI-generated report drafts cut junior radiologists' reading time by 18.5% and improved report quality, shifting work from drafting to reviewing, validating and correcting.", "source": "mckinsey-workforce"},
    {"text": "PwC classifies radiologists as professionalised by AI: routine tasks automated away, human expertise emphasised, and professionalised roles growing twice as fast as democratised ones.", "source": "pwc-barometer"}
  ],
  "series": [],
  "horizon": None,
  "wage": None,
  "order": 7
}, """
This is the clearest case in the literature that **exposure is not displacement**. Expert
opinion on both sides spent two decades predicting the end of radiology. What happened is
in the trial data: less drafting, more reviewing and validating, and harder cases getting
more human attention.<Cite ids="mckinsey-workforce" />

It is also the template for the whole site. PwC's framework calls it *professionalised* —
AI takes the routine work and leaves the expert work, so the role demands more skill and
pays more, and those roles are growing twice as fast as the ones AI deskills.<Cite ids="pwc-barometer" />
""")

job("teacher", {
  "name": "Teachers",
  "short": "Teachers",
  "verdict": "survives",
  "category": "judgement",
  "oneLiner": "Real-time reading of other humans, in a room, with a duty of care.",
  "tests": {"body": 2, "accountability": 3, "relationship": 3, "bundle": 3},
  "why": [
    "A teacher reads the room continuously and changes plan mid-sentence",
    "Parents and institutions require a responsible adult in the building",
    "The role is indivisible: every school still needs the seat filled"
  ],
  "threats": [
    "Lesson prep, marking and reporting are all being automated around the role",
    "Clickwork tutoring products compete at the margins of the job"
  ],
  "metrics": [],
  "claims": [
    {"text": "McKinsey places teachers among occupations with lower disruption because the work depends heavily on physical presence, regulation and human interaction.", "source": "mckinsey-workforce"},
    {"text": "Occupations are bundles of interdependent activities, and some are indivisible — every school still requires a principal, every hospital a medical director.", "source": "mckinsey-workforce"}
  ],
  "series": [],
  "horizon": None,
  "wage": None,
  "order": 8
}, """
The indivisibility argument is the strongest defence of a whole class of roles. Occupations
are not lists of tasks; they are bundles, and some of them cannot be split — the argument
McKinsey makes with the principal and the medical director.<Cite ids="mckinsey-workforce" />

Automating the individual activities (planning, marking, reporting) changes the job's
texture without removing the seat. What survives is the part that needs a person in the
room making judgement calls in real time.
""")

# ---------------------------------------------------------------- at risk
job("data-entry-clerk", {
  "name": "Data entry keyers",
  "short": "Data entry",
  "verdict": "at-risk",
  "category": "cognitive",
  "oneLiner": "Fully specified input, verifiable output, no judgement — the pure case of automatable work.",
  "tests": {"body": 0, "accountability": 0, "relationship": 0, "bundle": 0},
  "why": [
    "The task is the whole job",
    "Every step is already codified in a system the machine can reach",
    "Nothing is lost by removing the human"
  ],
  "threats": [],
  "metrics": [],
  "claims": [
    {"text": "Data entry clerks appear on the World Economic Forum's list of fastest-declining job roles to 2030.", "source": "wef-fastest"},
    {"text": "The ILO's highest exposure gradient is dominated by clerical roles: data entry clerks, typists, accounting and bookkeeping clerks and general office clerks.", "source": "ilo-index"},
    {"text": "In Microsoft's analysis of real AI usage, the most common and most successful AI-assisted activities are information work — creating, processing and communicating information.", "source": "ms-applicability"}
  ],
  "series": [],
  "horizon": "to 2030",
  "wage": None,
  "order": 20,
  "featured": True
}, """
If you want one role that explains the risk side of this site, it is this one. Every
property that protects the jobs above is absent here: no body in a variable world, no
accountability, no relationship, no indivisible bundle. The job *is* the task.

Both of the independent exposure measures converge. The World Economic Forum's employers
put data entry among the fastest-declining roles to 2030.<Cite ids="wef-fastest" /> The
ILO's task-level scoring puts clerical work in the top exposure gradient, and Microsoft's
analysis of actual AI use finds information processing is what the tools are already
best at.<Cite ids="ilo-index" /><Cite ids="ms-applicability" />

None of that is a forecast of a firing date. It is a description of a task profile with
nothing on the defensive side of the ledger.
""")

job("bookkeeping-clerk", {
  "name": "Bookkeeping, accounting and auditing clerks",
  "short": "Bookkeeping clerks",
  "verdict": "at-risk",
  "category": "cognitive",
  "oneLiner": "Rule-based verification of numbers, at high volume, in a digitised system.",
  "tests": {"body": 0, "accountability": 1, "relationship": 1, "bundle": 1},
  "why": [
    "Reconciliation is pattern matching against rules the machine already holds",
    "High volume and routine, so savings per hour are large"
  ],
  "threats": [],
  "metrics": [],
  "claims": [
    {"text": "Employers expect a sharp fall in accounting and auditing clerk roles to 2030, alongside cashiers, ticket clerks and administrative assistants.", "source": "wef-fastest"},
    {"text": "Accounting and bookkeeping clerks sit in the ILO's highest generative-AI exposure gradient.", "source": "ilo-index"},
    {"text": "The ILO finds strongly digitised occupations have increased in exposure as models gained multimodal and agentic capability.", "source": "ilo-index"}
  ],
  "series": [],
  "horizon": "to 2030",
  "wage": None,
  "order": 21
}, """
The uncomfortable lesson from the ILO's 2025 re-scoring is that **exposure is not fixed**.
Between the 2023 and 2025 versions, financial analysts, web and multimedia developers and
applications programmers moved *up* the exposure gradients, because models acquired
multimodal and agentic capability in the interim.<Cite ids="ilo-index" />

Which means: a role's safety is a claim about today's model capabilities, and that claim
has a shelf life.
""")

job("customer-service-rep", {
  "name": "Customer service representatives",
  "short": "Customer service",
  "verdict": "at-risk",
  "category": "cognitive",
  "oneLiner": "The clearest case of AI eating the entry rung rather than the ladder.",
  "tests": {"body": 0, "accountability": 1, "relationship": 2, "bundle": 1},
  "why": [
    "Front-line resolution of routine enquiries is exactly what agents do well",
    "Volume is high and the interaction is text or voice, both native to AI"
  ],
  "threats": [],
  "metrics": [],
  "claims": [
    {"text": "Customer service representatives are among the most affected occupations in Microsoft's usage-based analysis.", "source": "geekwire-ms"},
    {"text": "Early-career workers aged 22–25 in the most AI-exposed occupations — including customer service representatives and software developers — saw a 16% relative employment decline, while experienced workers in the same occupations stayed stable.", "source": "stanford-canaries"},
    {"text": "Employment declines concentrate in applications where AI automates work rather than augments it.", "source": "stanford-canaries"}
  ],
  "series": [],
  "horizon": "2022–2025",
  "wage": None,
  "order": 22,
  "featured": True
}, """
This is where the clearest empirical finding in the field lands. Stanford's payroll-data
study shows the damage is concentrated on the **entry rung**: 22–25-year-olds in the most
AI-exposed occupations saw a 16% relative decline in employment, while experienced workers
in those same occupations were stable or growing.<Cite ids="stanford-canaries" />

Two details matter more than the headline. Adjustments came through hiring, not pay — the
people already in the job kept it and kept their wages. And the decline concentrated in
occupations where AI *automates* rather than *augments*, which is a distinction the
Stanford authors treat as the mechanism, not an afterthought.<Cite ids="stanford-canaries" />

So the loss is not "customer service is gone". It is that the apprenticeship into
customer service stopped admitting anyone.
""")

job("interpreter-translator", {
  "name": "Interpreters and translators",
  "short": "Interpreters & translators",
  "verdict": "at-risk",
  "category": "cognitive",
  "oneLiner": "Ranked the single most AI-affected occupation in Microsoft's usage data.",
  "tests": {"body": 1, "accountability": 1, "relationship": 2, "bundle": 1},
  "why": [
    "Long-form text translation is a solved problem for current models",
    "The work product is text, and text is what the machine produces"
  ],
  "threats": [],
  "metrics": [],
  "claims": [
    {"text": "Interpreters and translators rank first on Microsoft's list of occupations most affected by generative AI, based on 200,000 real AI conversations.", "source": "geekwire-ms"},
    {"text": "The ILO finds translations among the occupations that increased in exposure as model capability widened.", "source": "ilo-index"}
  ],
  "series": [],
  "horizon": "2024–2025",
  "wage": None,
  "order": 23
}, """
The methodological caveat belongs here, because it is the one the researchers themselves
insist on. An applicability score measures *overlap between AI capability and the activities
a job contains*. It is not a headcount forecast — the Microsoft authors point out that
historical automation has sometimes raised employment in affected sectors, and that bank
tellers survived ATMs by changing what the job contained.<Cite ids="geekwire-ms" />

Read this entry as "the text half of translation is gone", not "no one will interpret a
court hearing".
""")

job("software-developer", {
  "name": "Software developers",
  "short": "Software developers",
  "verdict": "mixed",
  "category": "platform",
  "oneLiner": "Split in two: the ones who direct agents are thriving; the ones who wrote boilerplate are not.",
  "tests": {"body": 0, "accountability": 1, "relationship": 1, "bundle": 2},
  "why": [
    "System-level design and trade-off decisions still need a human",
    "Someone must own an outage",
    "The profession absorbed a generational tool change before and refactored around it"
  ],
  "threats": [
    "PwC classifies software developers as *democratised* — AI takes the expert tasks and leaves simpler work",
    "Entry-level hiring in these occupations is where the Stanford decline shows up",
    "The task-level exposure keeps rising as models get agentic"
  ],
  "metrics": [],
  "claims": [
    {"text": "PwC's 2026 Barometer lists software developers among the roles AI democratises: it automates higher-expertise tasks and leaves the role requiring less expertise, with lower barriers to entry and falling wages.", "source": "pwc-barometer"},
    {"text": "Democratised jobs make up 52% of advertised roles and are growing half as fast as professionalised roles, with 42% slower wage growth since 2021.", "source": "pwc-barometer"},
    {"text": "Software developers are among the AI-exposed occupations in which 22–25-year-old employment fell sharply.", "source": "stanford-canaries"}
  ],
  "series": [],
  "horizon": "2021–2025",
  "wage": None,
  "order": 24,
  "featured": True
}, """
The interesting thing about this entry is that the popular story and the measured story
disagree. The popular story is "AI writes code, developers are fine because they do
architecture". PwC's billion-advertisement analysis puts software developers in the
**democratised** bucket — the one where AI takes the harder tasks and leaves work that
requires *less* expertise, with lower barriers to entry and weaker wage growth.<Cite ids="pwc-barometer" />

The 52% of advertised jobs that are being democratised grew half as fast as the 22% being
professionalised, and lag 42% on wage growth since 2021.<Cite ids="pwc-barometer" /> And
Stanford's data shows the entry-level version of this job is where the decline actually
shows up.<Cite ids="stanford-canaries" />

So: not a dying profession, a *redistributing* one. The seat is still there. The on-ramp
narrowed.
""")

job("admin-assistant", {
  "name": "Administrative assistants and executive assistants",
  "short": "Admin assistants",
  "verdict": "at-risk",
  "category": "cognitive",
  "oneLiner": "Scheduling, drafting and coordinating — the exact activities appearing most in real AI usage.",
  "tests": {"body": 0, "accountability": 2, "relationship": 2, "bundle": 2},
  "why": [
    "Trust and discretion still matter: the assistant knows things the org chart does not",
    "Someone must coordinate people who will not coordinate themselves"
  ],
  "threats": [],
  "metrics": [],
  "claims": [
    {"text": "Administrative assistants appear among the roles employers expect to decline sharply to 2030.", "source": "wef-fastest"},
    {"text": "The most common and most successful AI-assisted activities are information work — creating, processing and communicating information.", "source": "ms-applicability"},
    {"text": "The ILO's refined index places clerical support work in the highest exposure gradients.", "source": "ilo-index"}
  ],
  "series": [],
  "horizon": "to 2030",
  "wage": None,
  "order": 25
}, """
This one is genuinely two jobs wearing one title. The part that is calendar Tetris,
document formatting and travel booking is directly exposed. The part that is *knowing what
the boss does not want to hear in front of the board* is not.

That is the split PwC formalises across the whole labour market, and it is why the useful
question is never "is this job safe" but "which half of it survives".
""")

job("junior-analyst", {
  "name": "Junior data analysts",
  "short": "Junior analysts",
  "verdict": "mixed",
  "category": "cognitive",
  "oneLiner": "The role that proves the entry level is being redesigned rather than deleted.",
  "tests": {"body": 0, "accountability": 2, "relationship": 2, "bundle": 3},
  "why": [
    "AI-exposed junior roles redesigned to demand senior skills are growing",
    "Interpretation and framing of a result is now the visible half of the work"
  ],
  "threats": [
    "Globally, entry-level postings in highly AI-exposed roles have flatlined",
    "49% of CEOs expect AI adoption to reduce junior hiring in the next three years"
  ],
  "metrics": [
    {"label": "Growth of 'seniorised' junior roles", "display": "+35%", "value": 35, "unit": "percent", "source": "pwc-barometer"},
    {"label": "Growth of other entry-level roles", "display": "−10%", "value": -10, "unit": "percent", "source": "pwc-release"},
    {"label": "CEO expectation of less junior hiring", "display": "49%", "value": 49, "unit": "percent", "source": "pwc-barometer"}
  ],
  "claims": [
    {"text": "Entry-level roles that now require more than ten traditionally senior skills are growing at 35%, while other entry-level roles decline.", "source": "pwc-barometer"},
    {"text": "The most AI-exposed entry-level roles are seven times more likely than the least exposed to demand traditionally senior skills such as leadership, strategic decision-making and stakeholder management.", "source": "pwc-barometer"},
    {"text": "49% of CEOs expect AI adoption to decrease junior hiring over the next three years, against 12% for senior hiring.", "source": "pwc-barometer"}
  ],
  "series": [{"label": "'Seniorised' junior roles", "value": 35, "kind": "share", "source": "pwc-barometer"}],
  "horizon": "since 2019",
  "wage": None,
  "order": 26,
  "featured": True
}, """
This is the most actionable finding in the entire literature, and it is a genuinely
optimistic one. PwC split AI-exposed entry-level roles by whether they had been
redesigned to demand senior skills. Those that had: **+35% growth since 2019.** Those
that had not: **−10%.**<Cite ids="pwc-barometer" />

The mechanism is that AI removed the routine work that used to serve as the apprenticeship,
so the remaining work *is* the senior work, and employers are now asking juniors for
judgement, stakeholder management and leadership years earlier than they used to.<Cite ids="pwc-barometer" />

The threat is real and should be stated next to the opportunity: 49% of CEOs expect AI to
reduce junior hiring in the next three years, against 12% for senior
hiring.<Cite ids="pwc-barometer" /> The safe conclusion is not "juniors are fine". It is
that junior roles that stay *junior* in scope are the ones disappearing.
""")

# ---------------------------------------------------------------- emerging
job("ai-engineer", {
  "name": "AI engineer (applied / LLM)",
  "short": "AI engineer",
  "verdict": "emerging",
  "category": "platform",
  "oneLiner": "The single fastest-growing job title in the US, two years running.",
  "tests": {"body": 0, "accountability": 1, "relationship": 1, "bundle": 2},
  "why": [
    "Integration and evaluation work that requires judgement about reliability",
    "Every AI deployment creates maintenance and monitoring obligations"
  ],
  "threats": [
    "Titles age fast in this space — the same work was 'ML engineer' five years ago",
    "A crowded on-ramp: it demands production engineering skill, not curiosity"
  ],
  "metrics": [
    {"label": "AI-specialist postings growth, 2025", "display": "+68.9%", "value": 68.9, "unit": "percent", "source": "pwc-barometer"},
    {"label": "All-jobs postings growth, 2025", "display": "+8.6%", "value": 8.6, "unit": "percent", "source": "pwc-barometer"},
    {"label": "Average AI-skills wage premium", "display": "+62%", "value": 62, "unit": "premium", "source": "pwc-barometer"}
  ],
  "claims": [
    {"text": "AI engineer ranks first among LinkedIn's fastest-growing US job titles, having held the top spot for a second year.", "source": "linkedin-rise"},
    {"text": "AI-specialist job postings grew 68.9% in 2025 while total job growth was 8.6%; globally there are now 10.7 AI specialist postings for every one in 2012.", "source": "pwc-barometer"},
    {"text": "The average wage premium for workers with AI skills reached 62%, up from 57% a year earlier.", "source": "pwc-release"}
  ],
  "series": [{"label": "AI engineer", "value": 62, "kind": "premium", "source": "pwc-barometer"}],
  "horizon": "2025",
  "wage": "62% premium over comparable non-AI roles",
  "order": 30,
  "featured": True
}, """
Two things are true at once here and they are easy to confuse. The *demand* is
unambiguous — AI specialist postings grew nearly eight times as fast as the overall jobs
market in 2025, and the skills premium is real at 62%.<Cite ids="pwc-barometer" />

The *role*, though, is not research. It is production engineering with models in it:
retrieval pipelines, evaluation, chasing drift, deciding when an output is reliable enough
to ship. That is why the adjacent roles on this page — the ones about deploying and
governing rather than building — are growing even faster off a smaller base.
""")

job("forward-deployed-engineer", {
  "name": "Forward deployed engineer",
  "short": "Forward deployed engineer",
  "verdict": "emerging",
  "category": "platform",
  "oneLiner": "Postings up 729% in a year: the job that exists because AI projects fail for organisational reasons.",
  "tests": {"body": 0, "accountability": 2, "relationship": 3, "bundle": 3},
  "why": [
    "Enterprise AI deployments fail on process and data politics, not model quality",
    "The role sits inside the customer, so the human relationship is the product"
  ],
  "threats": [
    "Vendor-published and job-board counts are not official occupational statistics",
    "Highly concentrated in a handful of AI labs and consultancies"
  ],
  "metrics": [
    {"label": "Postings, April 2025", "display": "643", "value": 643, "unit": "count", "source": "fde-data"},
    {"label": "Postings, April 2026", "display": "5,330", "value": 5330, "unit": "count", "source": "fde-data"},
    {"label": "Median base salary", "display": "≈$174,000", "value": 174000, "unit": "usd", "source": "fde-data"}
  ],
  "claims": [
    {"text": "Job postings grew from 643 in April 2025 to 5,330 in April 2026 — a 729% increase — on hiring data compiled by Exponent.", "source": "fde-data"},
    {"text": "The role exists because enterprise AI deployments often fail for organisational rather than technical reasons, and an embedded engineer clears those blockers faster than a traditional vendor model.", "source": "fde-data"},
    {"text": "Roughly 70% of postings include equity, and the median base across postings is about $174,000.", "source": "fde-data"}
  ],
  "series": [],
  "horizon": "Apr 2025 → Apr 2026",
  "wage": "≈$174,000 median base",
  "order": 31,
  "featured": True
}, """
The blurb for this one is the most useful sentence in the new-jobs literature: these
projects fail for **organisational reasons rather than technical ones**, so the job is an
engineer embedded inside the customer's building, clearing blockers that a support ticket
cannot reach.<Cite ids="fde-data" />

It is also where the "AI makes work more human" claim stops being a slogan. The role is
mostly software engineering and almost entirely relationship management, and postings for
it grew 729% in a single year.<Cite ids="fde-data" /> Treat the exact number as a
job-board count of one title — real, but not an occupational statistic.
""")

job("data-annotator", {
  "name": "Data annotators and AI trainers",
  "short": "Data annotators",
  "verdict": "emerging",
  "category": "platform",
  "oneLiner": "The most accessible on-ramp into AI work, and the one that rewards domain expertise over coding.",
  "tests": {"body": 0, "accountability": 1, "relationship": 1, "bundle": 2},
  "why": [
    "Labeled data and preference feedback are inputs the models cannot generate for themselves",
    "Domain knowledge (medicine, law, finance) is the scarce input, not programming"
  ],
  "threats": [
    "Individual-contributor annotation is hourly, insecure and often outsourced",
    "Automated labelling compresses the bottom of the market over time"
  ],
  "metrics": [],
  "claims": [
    {"text": "Data annotator ranks fourth among LinkedIn's fastest-growing US job titles for 2026.", "source": "linkedin-rise"},
    {"text": "The work is reviewing and labelling data to specified guidelines and running quality checks so that training datasets are accurate.", "source": "linkedin-rise"}
  ],
  "series": [],
  "horizon": "2023–2025",
  "wage": None,
  "order": 32
}, """
Every capability claim in this field rests on labour of this kind: people who label,
grade and correct model output against a standard. LinkedIn's platform data puts the
title fourth among the fastest-growing roles in the US.<Cite ids="linkedin-rise" />

The honest framing: the junior form of this work is precarious hourly gig labour, easily
outsourced and likely to be partly automated. The senior form — designing the feedback
loops and quality processes for a domain-specific model — is expert work that pays like
it. Same title, different jobs, which is the recurring pattern on this site.
""")

job("ai-governance-lead", {
  "name": "AI governance, risk and audit",
  "short": "AI governance",
  "verdict": "emerging",
  "category": "platform",
  "oneLiner": "Regulation creates a function; the function creates the jobs.",
  "tests": {"body": 0, "accountability": 3, "relationship": 2, "bundle": 3},
  "why": [
    "Independently checking the work is the whole point — the builder cannot audit the builder",
    "Conformity obligations need named owners and documented evidence",
    "Insurers and boards are asking for both"
  ],
  "threats": [
    "The headline ratios come from a vendor study with a commercial interest in governance hiring",
    "Enforcement timelines keep moving, which delays hiring plans"
  ],
  "metrics": [
    {"label": "Builders hired per governance hire (EU)", "display": "≈7 : 1", "value": 7, "unit": "index", "source": "axipro"},
    {"label": "Consultant day rate in mature markets", "display": "$800–2,000", "value": 1400, "unit": "day", "source": "axipro"},
    {"label": "AI-related postings analysed", "display": "3,519", "value": 3519, "unit": "count", "source": "axipro"}
  ],
  "claims": [
    {"text": "Across eight EU countries, companies are hiring roughly seven professionals to build AI systems for every one hired to govern them.", "source": "axipro"},
    {"text": "Independent AI governance consultants in mature markets command day rates of $800–$2,000, with demand up 150% year over year.", "source": "axipro"},
    {"text": "Governing work is a permanent function once regulation attaches to it: EU AI Act obligations, NIST AI RMF and ISO/IEC 42001 all need evidence that someone checked the system.", "source": "axipro"}
  ],
  "series": [],
  "horizon": "2026",
  "wage": "$800–2,000 a day (consulting)",
  "order": 33,
  "featured": True
}, """
This is the category that grows out of the *fourth* test — accountability. If an
organisation must show a regulator, a board and an insurer that a model was checked, the
checking cannot be done by the team that built it.

The evidence here is the weakest on the site and is labelled as such: one vendor study of
3,519 postings across eight EU countries, from a company that sells governance
tooling.<Cite ids="axipro" /> What it measures is a hiring ratio — roughly seven builders
per governance hire — and it is corroborated in direction, though not in magnitude, by the
regulatory calendar those organisations are hiring against.
""")

# ---------------------------------------------------------------- sections
SECTION_COPY = {
"survives": ("01", "What survives",
 "Work that a machine cannot close the loop on.",
 """
Four properties keep turning up in the data. A role is durable to the extent it has at
least one of them — and fragile to the extent it has none.

**It needs a body in a variable world.** Not "blue collar" as a slogan, but physical work
in environments that change faster than a specification can describe. Robots can currently
reach about 13% of US work hours against 44% for software agents, because they lack fine
motor control and real-time physical judgement.<Cite ids="mckinsey-agents" />

**Someone must be accountable.** Occupations are bundles, and some bundles are
indivisible: every school still needs a principal, every hospital a medical
director.<Cite ids="mckinsey-workforce" /> Nobody insures a model or puts one on the stand.

**The work is a relationship.** New tasks added to AI-exposed roles since 2022 are 2.5×
more likely to depend on empathy, presence, judgement, creativity or
leadership.<Cite ids="pwc-barometer" /> Care workers say it in their own words: AI helps
with documentation and scheduling, and cannot hand someone a glass of water.<Cite ids="acl-care" />

**The job is a bundle, not a task list.** Most of today's skills apply to work that could
be automated *and* work that cannot.<Cite ids="mckinsey-agents" /> Radiology got less
drafting and more judgement; the job changed shape rather than disappearing.<Cite ids="mckinsey-workforce" />

The entries below are ranked by strength of evidence, not by how quotable they are. Where
a role has official projections, they are shown; where it does not, we say so instead of
inventing a number.
"""),
"risk": ("02", "What is exposed",
 "Exposure is not displacement. It is a description of a task profile.",
 """
The most important correction in this whole literature: an AI applicability score measures
overlap between what a model can do and what a job contains. It is not a headcount
forecast. The Microsoft researchers who produced the most-cited version say so explicitly,
and point at bank tellers, whose numbers held up after ATMs arrived.<Cite ids="geekwire-ms" />

What *is* observable is narrower and sharper. Payroll data shows a **16% relative
employment decline for 22–25-year-olds in the most AI-exposed occupations**, while
experienced workers in those same occupations stayed flat. The adjustment came through
hiring rather than pay, and it concentrated where AI automates rather than
augments.<Cite ids="stanford-canaries" />

The exposure itself is clustered. One in four workers globally is in an occupation with
some generative-AI exposure, but only 3.3% sit in the highest exposure band, and clerical
work dominates it.<Cite ids="ilo-index" /> Employers' own projections put data entry,
clerical and administrative roles at the fast end of decline to 2030.<Cite ids="wef-fastest" />
"""),
"opportunity": ("03", "What is coming",
 "New work arrives as a layer on top of the old work, not as a replacement for it.",
 """
Five clusters show up consistently in the 2025–26 data, in rough order of evidence
strength.

**Build it.** AI specialist postings grew 68.9% in 2025 against 8.6% for all jobs, with a
62% average wage premium for AI skills.<Cite ids="pwc-barometer" /> AI engineer has been
the fastest-growing US job title for two years running.<Cite ids="linkedin-rise" />

**Deploy it inside someone else's building.** Forward-deployed engineering postings grew
from 643 to 5,330 in a year, because enterprise AI projects fail for organisational
reasons rather than technical ones.<Cite ids="fde-data" />

**Feed and teach it.** Data annotation and evaluation, ranked fourth among LinkedIn's
fastest-growing US roles, and the one entry point that rewards domain knowledge over
coding.<Cite ids="linkedin-rise" />

**Govern it.** Roughly seven builders are hired per governance hire across the EU
postings one study examined, and independent governance consultants charge $800–$2,000 a
day.<Cite ids="axipro" />

**Supervise it.** As agents take routine work, someone reviews outputs, handles
exceptions, assures quality and documents decisions. AI rarely removes work without
creating oversight obligations.<Cite ids="mckinsey-workforce" /> This is where most net
new employment is actually landing.
"""),
"what-to-do": ("04", "What to do about it",
 "Four tests, applied to any role you are considering — plus the three ways to be wrong.",
 """
**Test 1 — Does it need a body in an unpredictable place?** If conditions change daily and
a mistake injures someone, it is durable for a long while yet. The strongest evidence is
the ability ranking: stamina, strength, reaction time, spatial orientation and problem
sensitivity in settings where conditions change.<Cite ids="resumenow" />

**Test 2 — Is a human legally or morally on the hook?** Accountability roles grow as
automation grows, because someone must own the output. Regulation makes it explicit: the
builder cannot be the auditor.<Cite ids="axipro" />

**Test 3 — Would a customer be upset to learn no human was involved?** Care, teaching,
therapy, negotiation. That discomfort is a moat, and the data agrees — new tasks in
AI-exposed roles lean 2.5× harder on empathy, presence and judgement.<Cite ids="pwc-barometer" />

**Test 4 — Is the job a bundle with an indivisible core?** The safest jobs are the ones
the org chart requires the seat for, not just the tasks.<Cite ids="mckinsey-workforce" />

Then act on the one finding with a clear instruction in it. AI-exposed entry-level roles
that were redesigned to demand senior skills grew 35% since 2019; those that were not
shrank 10%.<Cite ids="pwc-barometer" /> The move is not to avoid AI-exposed fields. It is
to enter them at the expert end, which now means demonstrating judgement years before the
career ladder would once have handed it to you.

**Anti-test:** if the job is "produce a first draft of a document", it is already gone —
not the profession, the rung. One in seven US workers has a direct skills pathway from a
shrinking occupation into a growing one.<Cite ids="mckinsey-workforce" /> The jobs exist.
The bridge is the bottleneck.
"""),
}

for slug, (eyebrow, title, standfirst, body) in SECTION_COPY.items():
    SECTIONS.mkdir(parents=True, exist_ok=True)
    fm = (
        "---\n"
        f'title: "{title}"\n'
        f'eyebrow: "{eyebrow}"\n'
        f'standfirst: "{standfirst}"\n'
        "---\n\n"
    )
    (SECTIONS / f"{slug}.mdx").write_text(fm + body.strip() + "\n")
    print("wrote section", slug)