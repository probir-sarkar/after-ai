/**
 * Semantic wrappers: pages import a chart by the question it answers, and the
 * series it uses is fixed here. Bar height is derived from the row count so a
 * longer list cannot squash its labels.
 */
import { DeltaRows, RankedBars, SeniorityShift, ZeroBars } from './Charts';
import { blsAbsolute, blsGrowth, entryLevel, entryLevelLevels, payDivergence, seniorised, seniorityShift } from '@/data/series';

const rowHeight = (n: number, min = 180) => Math.max(min, n * 27 + 24);

export function EntryLevelChart() {
  return (
    <DeltaRows
      rows={entryLevel.map((r) => ({ label: r.label, value: r.value, display: r.display, tone: r.tone }))}
    />
  );
}

export function EntryLevelLevelsChart() {
  return (
    <ZeroBars
      data={entryLevelLevels}
      height={252}
      note="Employment change in levels, November 2022 to June 2026, for 22–25-year-olds"
    />
  );
}

export function SeniorityChart() {
  return <SeniorityShift data={seniorityShift} />;
}

export function PayDivergenceChart() {
  return (
    <RankedBars
      data={payDivergence}
      height={150}
      labelWidth={190}
      unitNote="Growth in advertised pay since 2021, by AI exposure"
    />
  );
}

export function SeniorisedChart() {
  return (
    <ZeroBars
      data={seniorised}
      height={252}
      note="Growth in entry-level postings since 2019, split by whether the role was redesigned to demand senior skills"
    />
  );
}

export function BlsGrowthChart() {
  return (
    <RankedBars
      data={blsGrowth}
      height={rowHeight(blsGrowth.length)}
      labelWidth={252}
      unitNote="Projected percentage growth in employment, 2025–2035"
    />
  );
}

export function BlsAbsoluteChart() {
  return (
    <RankedBars
      data={blsAbsolute}
      height={rowHeight(blsAbsolute.length, 200)}
      labelWidth={252}
      unitNote="Projected absolute change in employment in thousands, 2025–2035"
    />
  );
}

export {
  ChurnChart,
  ExposureChart,
  FdeChart,
  PremiumChart,
  RankedBars,
  TestBars,
  TwoTrack,
  ZeroBars,
} from './Charts';