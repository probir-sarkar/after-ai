import { useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Tabs } from '@base-ui-components/react/tabs';
import { C, mono, Plot, TipBox, tick, type TipProps } from './ChartKit';
import type { Bar as BarDatum } from '@/data/series';
import { churn, exposure, fde, premium, twoTrack } from '@/data/series';
import { testLabels, type Verdict } from '@/lib/site';

const toneColor = (t?: BarDatum['tone']) =>
  t === 'risk' ? C.risk : t === 'emerge' ? C.emerge : t === 'signal' ? C.signal : t === 'survive' ? C.survive : C.muted;

/* ------------------------------------------------------------------ bars */

/** Horizontal bars — the workhorse for ranked lists. */
export function RankedBars({
  data,
  height,
  labelWidth = 200,
  unitNote,
}: {
  data: BarDatum[];
  height: number;
  labelWidth?: number;
  unitNote: string;
}) {
  return (
    <Plot height={height} label={unitNote}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 62, bottom: 4, left: 0 }}
          barCategoryGap={9}
        >
          <XAxis type="number" hide domain={[0, 'dataMax']} />
          <YAxis
            type="category"
            dataKey="label"
            width={labelWidth}
            axisLine={false}
            tickLine={false}
            tick={{ ...tick, textAnchor: 'end' }}
            interval={0}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            content={({ active, payload }: TipProps) =>
              active && payload?.length ? (
                <TipBox
                  title={payload[0].payload.label}
                  rows={[
                    { k: 'value', v: payload[0].payload.display },
                    { k: 'source', v: payload[0].payload.source },
                  ]}
                />
              ) : null
            }
          />
          <Bar dataKey="value" radius={[3, 3, 3, 3]} barSize={13} isAnimationActive={false}>
            {data.map((d) => (
              <Cell key={d.label} fill={toneColor(d.tone)} fillOpacity={0.95} />
            ))}
            <LabelList dataKey="display" position="right" fill={C.ink} fontFamily={mono} fontSize={11} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Plot>
  );
}

/** Vertical bars that cross zero — used for the two entry-level findings. */
export function ZeroBars({ data, height, note }: { data: BarDatum[]; height: number; note: string }) {
  return (
    <Plot height={height} label={note}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 18, right: 8, bottom: 30, left: 0 }} barCategoryGap="28%">
          <XAxis
            dataKey="label"
            axisLine={{ stroke: C.line }}
            tickLine={false}
            tick={{ ...tick, fontSize: 10 }}
            interval={0}
            height={44}
          />
          <YAxis
            tickFormatter={(v: number) => `${v > 0 ? '+' : ''}${v}%`}
            axisLine={false}
            tickLine={false}
            tick={{ ...tick, fontSize: 10 }}
            width={44}
          />
          <ReferenceLine y={0} stroke={C.line} />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            content={({ active, payload }: TipProps) =>
              active && payload?.length ? (
                <TipBox
                  title={String(payload[0].payload.label).replace('\n', ' ')}
                  rows={[
                    { k: 'change', v: payload[0].payload.display },
                    { k: 'source', v: payload[0].payload.source },
                  ]}
                />
              ) : null
            }
          />
          <Bar dataKey="value" radius={[3, 3, 0, 0]} barSize={64} minPointSize={3} isAnimationActive={false}>
            {data.map((d) => (
              <Cell key={d.label} fill={toneColor(d.tone)} fillOpacity={0.95} />
            ))}
            <LabelList dataKey="display" position="top" fill={C.ink} fontFamily={mono} fontSize={11} offset={8} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Plot>
  );
}

/* ------------------------------------------------------- specific charts */

const SHORT_DRIVER: Record<string, string> = {
  'Broadening digital access': 'Digital access',
  'AI & information processing': 'AI & information',
  'Robots & autonomous systems': 'Robots & autonomy',
};

/**
 * WEF employers: jobs created vs displaced to 2030, in millions.
 *
 * Grouped vertical bars put three categories across a 1000px panel and left the
 * plot mostly empty, with 26px columns. This is a diverging layout instead: each
 * driver is a row, creation runs right from a centre axis, displacement runs
 * left, and the two figures sit in their own column so a long bar can never
 * push a label off the panel.
 */
export function ChurnChart() {
  const max = Math.max(...churn.map((d) => Math.max(d.created, Math.abs(d.displaced))));
  // 38% of the half-width, not 50%: the value label sits at the bar's end and
  // needs room, or the longest bar pushes its number out of the panel.
  const unit = 38 / max;

  return (
    <div className="chart-shell">
      <div className="mb-2 flex flex-wrap items-center gap-x-5 gap-y-1">
        <span className="flex items-center gap-2">
          <span className="h-[9px] w-[9px] rounded-[2px]" style={{ background: C.survive }} />
          <span className="eyebrow">Created →</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="h-[9px] w-[9px] rounded-[2px]" style={{ background: C.risk }} />
          <span className="eyebrow">Displaced ←</span>
        </span>
        <span className="eyebrow ml-auto">millions of jobs · to 2030</span>
      </div>

      <div className="relative">
        {/* the zero line, drawn once behind every row */}
        <span className="absolute bottom-0 left-[calc(132px+1.25rem)] top-0 hidden w-px bg-[var(--color-line)] sm:block" />
        <span className="absolute -top-0.5 left-[calc(132px+1.25rem)] hidden h-2 w-px bg-[var(--color-faint)] sm:block" />

        {churn.map((row) => {
          const createdW = row.created * unit;
          const displacedW = Math.abs(row.displaced) * unit;
          return (
            <div
              key={row.driver}
              className="grid grid-cols-1 items-center gap-x-5 gap-y-1 border-t border-[var(--color-line-soft)] py-3 sm:grid-cols-[132px_1fr]"
            >
              <div className="text-[12.5px] leading-tight text-muted">{SHORT_DRIVER[row.driver] ?? row.driver}</div>

              <div className="relative h-[26px]">
                {row.created > 0 ? (
                  <>
                    <span
                      className="absolute top-1/2 left-1/2 h-[13px] -translate-y-1/2 rounded-r-[3px]"
                      style={{ width: `${createdW}%`, background: C.survive }}
                    />
                    <span
                      className="num absolute top-1/2 -translate-y-1/2 pl-2 text-[11.5px] whitespace-nowrap"
                      style={{ left: `calc(50% + ${createdW}%)`, color: C.survive }}
                    >
                      +{row.created}M
                    </span>
                  </>
                ) : (
                  <span className="num absolute top-1/2 left-1/2 -translate-y-1/2 pl-2 text-[10.5px] whitespace-nowrap text-faint">
                    no creation figure published
                  </span>
                )}

                <span
                  className="absolute top-1/2 right-1/2 h-[13px] -translate-y-1/2 rounded-l-[3px]"
                  style={{
                    width: `${displacedW}%`,
                    background: row.netOnly ? 'rgba(255,125,110,0.22)' : C.risk,
                    border: row.netOnly ? `1px dashed ${C.risk}` : undefined,
                  }}
                />
                <span
                  className="num absolute top-1/2 -translate-y-1/2 pr-2 text-[11.5px] whitespace-nowrap"
                  style={{ right: `calc(50% + ${displacedW}%)`, color: C.risk }}
                >
                  {row.netOnly ? `net −${Math.abs(row.displaced)}M` : `−${Math.abs(row.displaced)}M`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="eyebrow mt-3">The dashed bar is a net figure: employers published no creation number for robots.</p>
    </div>
  );
}

export function ExposureChart() {
  return <RankedBars data={exposure} height={196} labelWidth={168} unitNote="Share of global employment by generative-AI exposure band" />;
}

/** PwC AI-skills wage premium by sector. */
export function PremiumChart() {
  return <RankedBars data={premium} height={150} labelWidth={168} unitNote="AI-skills wage premium by sector, 2025" />;
}

/** Forward-deployed engineer postings, one year apart. */
export function FdeChart() {
  return (
    <div className="relative">
      <Plot height={220} label="Forward-deployed engineer job postings, April 2025 and April 2026">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={fde} margin={{ top: 22, right: 8, bottom: 6, left: 0 }} barCategoryGap="40%">
            <XAxis dataKey="label" axisLine={{ stroke: C.line }} tickLine={false} tick={{ ...tick, fontSize: 10 }} height={26} />
            <YAxis hide domain={[0, 6200]} />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              content={({ active, payload }: TipProps) =>
                active && payload?.length ? (
                  <TipBox
                    title={payload[0].payload.label}
                    rows={[
                      { k: 'postings', v: payload[0].payload.display },
                      { k: 'source', v: payload[0].payload.source },
                    ]}
                  />
                ) : null
              }
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={72} isAnimationActive={false}>
              {fde.map((d) => (
                <Cell key={d.label} fill={toneColor(d.tone)} fillOpacity={0.95} />
              ))}
              <LabelList dataKey="display" position="top" fill={C.ink} fontFamily={mono} fontSize={13} offset={10} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Plot>
      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-right">
        <div className="num text-4xl text-signal">×8.3</div>
        <div className="eyebrow mt-1">in one year</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ two track */

/** PwC's split, with the share donut always visible and detail per track. */
export function TwoTrack() {
  const [track, setTrack] = useState('Professionalised');
  const total = twoTrack.reduce((n, t) => n + t.share, 0);
  const active = twoTrack.find((t) => t.track === track) ?? twoTrack[0]!;

  const colors: Record<string, string> = {
    Professionalised: C.survive,
    Democratised: C.risk,
    'Low exposure': C.emerge,
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:items-start">
      <div className="relative">
        <Plot height={260} label={`Share of advertised jobs: professionalised ${twoTrack[0]!.share}%, democratised ${twoTrack[1]!.share}%, low exposure ${twoTrack[2]!.share}%`}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={twoTrack}
                dataKey="share"
                nameKey="track"
                innerRadius={68}
                outerRadius={104}
                paddingAngle={3}
                stroke="none"
                isAnimationActive={false}
                startAngle={90}
                endAngle={-270}
              >
                {twoTrack.map((t) => (
                  <Cell key={t.track} fill={colors[t.track]} fillOpacity={0.95} />
                ))}
              </Pie>
              <Tooltip
                content={({ active: a, payload }: TipProps) =>
                  a && payload?.length ? (
                    <TipBox
                      title={payload[0].payload.track}
                      rows={[
                        { k: 'share', v: `${payload[0].payload.share}%` },
                        { k: 'source', v: payload[0].payload.source },
                      ]}
                    />
                  ) : null
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </Plot>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <div className="num text-3xl">{total}%</div>
          <div className="eyebrow mt-1">of job ads studied</div>
        </div>
      </div>

      <div>
        <Tabs.Root value={track} onValueChange={(v) => setTrack(String(v))}>
          <Tabs.List className="flex flex-wrap gap-2">
            {twoTrack.map((t) => (
              <Tabs.Tab
                key={t.track}
                value={t.track}
                className="chip cursor-pointer data-[active]:border-transparent data-[active]:bg-ink data-[active]:text-void"
                style={{ borderColor: colors[t.track] }}
              >
                {t.track} · {t.share}%
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <Tabs.Panel value={active.track} className="mt-5">
            <div className="panel p-5">
              <div className="eyebrow">{active.track}</div>
              <p className="mt-3 font-display text-[21px] leading-snug text-ink">{active.plain}</p>
              <p className="mt-4 text-[13.5px] leading-relaxed text-muted">{active.move}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{active.outcome}</p>
              <div className="mt-4 hairline pt-3">
                <div className="eyebrow mb-1">Examples named in the study</div>
                <div className="num text-[11px] text-muted">{active.examples}</div>
              </div>
            </div>
          </Tabs.Panel>
        </Tabs.Root>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- job tests */

/**
 * The four tests, scored 0–3. This is an editorial reading of a job's task
 * profile, not a measurement — the panel says so, prints the scale, and ends
 * with a sentence, because "0/3" on its own reads as a grade.
 */
export function TestBars({
  tests,
  verdict,
  reading,
}: {
  tests: Record<string, number>;
  verdict: Verdict;
  reading: string;
}) {
  const total = testLabels.reduce((n, t) => n + (tests[t.key] ?? 0), 0);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="eyebrow">0 doesn’t apply · 1 a little · 2 clearly · 3 it’s the whole job</span>
        <span className="num shrink-0 text-[12px] text-ink">total {total}/12</span>
      </div>

      <div className="mt-3 grid gap-2.5">
        {testLabels.map((t) => {
          const score = tests[t.key] ?? 0;
          const color = score >= 3 ? C.survive : score === 2 ? C.signal : score === 1 ? C.emerge : C.risk;
          return (
            <div key={t.key} className="grid grid-cols-[1fr_62px_30px] items-center gap-3">
              <div className="text-[11.5px] leading-tight text-muted" title={t.label}>
                {t.short}
              </div>
              <div className="flex gap-[3px]">
                {[1, 2, 3].map((n) => (
                  <span
                    key={n}
                    className="h-[8px] flex-1 rounded-[3px]"
                    style={{
                      // An empty segment has to stay visible: at #1e1e25 on a #0e0e12
                      // panel the unfilled part of the scale disappeared entirely.
                      background: n <= score ? color : '#2f2f3a',
                    }}
                  />
                ))}
              </div>
              <div className="num text-right text-[11px] text-faint">{score}</div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 border-t border-[var(--color-line-soft)] pt-3 text-[11.5px] leading-relaxed text-muted">
        {reading}
      </p>
      <p className="mt-2 text-[11px] leading-relaxed text-faint">
        Our reading of the job, not a measurement. The evidence behind it is below.
      </p>
    </div>
  );
}

/* ------------------------------------------------------- delta rows */

/**
 * A two-row comparison where one row is a null result. Recharts draws nothing
 * for a zero value, which reads as "missing data" — this draws a dashed
 * baseline instead and lets the caption call it a null result.
 */
export function DeltaRows({
  rows,
}: {
  rows: { label: string; value: number; display: string; tone?: BarDatum['tone'] }[];
}) {
  const scale = Math.max(...rows.map((r) => Math.abs(r.value)), 1);

  return (
    <div className="grid gap-3 py-1">
      {rows.map((r) => {
        const color = toneColor(r.tone);
        const pct = (Math.abs(r.value) / scale) * 100;
        return (
          <div key={r.label} className="grid grid-cols-[132px_1fr_62px] items-center gap-3 sm:grid-cols-[180px_1fr_70px]">
            <div className="text-[11.5px] leading-tight text-muted">{r.label}</div>
            <div className="relative h-[16px]">
              <span className="absolute inset-y-0 left-0 w-px bg-[var(--color-line)]" />
              {r.value === 0 ? (
                <>
                  <span
                    className="absolute left-0 top-1/2 h-0 w-full -translate-y-1/2 border-t border-dashed"
                    style={{ borderColor: color, opacity: 0.45 }}
                  />
                  <span
                    className="absolute left-0 top-1/2 h-[16px] w-[3px] -translate-y-1/2 rounded-[1px]"
                    style={{ background: color }}
                  />
                </>
              ) : (
                <span
                  className="absolute left-0 top-1/2 h-[14px] -translate-y-1/2 rounded-r-[3px]"
                  style={{ width: `${pct}%`, background: color }}
                />
              )}
            </div>
            <div className="num text-right text-[13px]" style={{ color }}>
              {r.display}
            </div>
          </div>
        );
      })}
    </div>
  );
}