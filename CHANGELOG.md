# After AI — daily changes

One dated line per day: what changed on the site, which page, and which source forced
the change. The daily update job reads this first so it does not repeat yesterday's work,
and so a claim that has gone stale is visible rather than buried.

Rules the daily job works to: every number needs two independent sources (primary first),
forecasts stay labelled as forecasts, editorial judgements stay labelled as judgements,
and no change is better than an invented one. One page per day, small diffs.

- **2026-10-27** — site-wide: footer now links Little Thinker, the blog and browserstay.com/projects,
  so the four projects cross-reference each other. No claims or figures touched.

- **2026-10-28** — `customer-service-rep`: added four metrics and replaced the claims list with the
  September 2026 Canaries figures (most-exposed occupations −0.5% year on year, least-exposed +1.0%;
  workers 22–25 in exposed jobs −3.7%, a 36th consecutive month of decline, now reaching 26–30 at
  −2.8%) and the Banque de France hiring data (permanent-contract hires for 21–29-year-olds in the
  most exposed fifth ~28% below November 2022, against 8%). The 19% level gap and the 3.7% annual
  rate are now explicitly separated in the prose so they are not read as one figure. New sources:
  `adp-canaries-sep26`, `bdf-463`. Also fixed `scripts/seo.mjs`, which still asserted the old
  after-ai.probir.dev host in robots.txt and had failed every build since the domain move.
