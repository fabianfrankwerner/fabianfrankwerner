import {Layout, makeScene2D, Txt} from '@canvas-commons/2d';
import {all, createRef, waitFor, waitUntil} from '@canvas-commons/core';
import {BarChart, Slot} from '../lib/visualization';
import {THEME} from '../lib/theme';
import {perm} from '../lib/random';
import {Hud} from '../components/hud';
import {ALGORITHM_MAP} from '../lib/algorithms';

interface Sizes {
  stage: number;
  fly: number;
  rest: number;
  pause: number;
}

const PASS_SIZES: Sizes[] = [
  {stage: 0.55, fly: 0.5, rest: 0.25, pause: 0.3},
  {stage: 0.4, fly: 0.36, rest: 0.2, pause: 0.24},
  {stage: 0.34, fly: 0.3, rest: 0.16, pause: 0.2},
  {stage: 0.3, fly: 0.26, rest: 0.14, pause: 0.18},
];

export default makeScene2D(function* (view) {
  view.fill(THEME.bg);
  const meta = ALGORITHM_MAP.merge;

  const cmpRef = createRef<Txt>();
  const mergeRef = createRef<Txt>();
  const runRef = createRef<Txt>();
  const hudGroup = createRef<Layout>();

  const MAIN_ROW = 90;
  const BUF_ROW = 430;

  const chart = new BarChart(perm(16, 55), {
    barWidth: 34,
    gap: 8,
    baselineY: MAIN_ROW,
    maxBarHeight: 260,
    minBarHeight: 18,
  });
  view.add(chart.group);

  view.add(
    <Layout ref={hudGroup} y={-420}>
      <Hud
        title={meta.name}
        bigO={meta.bigO}
        tagline={meta.tagline}
        accent={meta.accent}
        counterPatch={{comparisons: cmpRef, swaps: mergeRef}}
      />
      <Txt
        ref={runRef}
        text={'merging runs of 1'}
        fontSize={24}
        fill={THEME.textMuted}
        fontFamily={THEME.mono}
      />
    </Layout>,
  );

  yield* all(
    chart.appear(0.6, 0.06),
    hudGroup().opacity(0, 0.01).to(1, 0.6),
  );
  yield* waitUntil('merge.title');
  yield* waitUntil('merge.teach');

  const n = chart.n;
  let cmp = 0;
  let merges = 0;

  const paintRuns = function* (lo: number, mid: number, hi: number, d: number) {
    yield* chart.colorRange(lo, mid, THEME.accent, d);
    if (mid + 1 <= hi) yield* chart.colorRange(mid + 1, hi, THEME.pivot, d);
  };

  const optsFor = (pass: number) => PASS_SIZES[Math.min(pass, 3)];

  for (let size = 1, pass = 0; size < n; size *= 2, pass++) {
    runRef().text(`merging runs of ${size}`);
    if (pass === 0) yield* waitUntil('merge.split');
    if (pass === 1) yield* waitUntil('merge.run2');
    if (pass === 2) yield* waitUntil('merge.run4');
    if (pass === 3) yield* waitUntil('merge.run8');

    const op = optsFor(pass);

    for (let lo = 0; lo < n; lo += size * 2) {
      const hi = Math.min(lo + size * 2 - 1, n - 1);
      const mid = Math.min(lo + size - 1, hi);
      if (hi <= mid) continue;

      // --- Stage: fly both runs down into the buffer lane. ---
      const interval: Slot[] = chart.slots.slice(lo, hi + 1);
      yield* all(
        ...interval.map((slot, k) =>
          chart.fly(slot, chart.slotX(lo + k), BUF_ROW, op.stage),
        ),
      );
      yield* paintRuns(lo, mid, hi, 0.25);

      // --- Merge: pick the smaller front and fly it back up. ---
      let count = 0;
      let li = 0;
      let ri = 0;
      let left: Slot | null = interval[0];
      let right: Slot | null = interval[mid - lo + 1] ?? null;
      while (count < hi - lo + 1) {
        const fronts: Slot[] = [];
        if (left) fronts.push(left);
        if (right) fronts.push(right);
        yield* chart.colorSlots(fronts, THEME.compare, 0.12);
        cmpRef().text(String(++cmp));
        yield* waitFor(op.pause);

        let winner: Slot;
        if (!left) {
          winner = right!;
          ri++;
          right = interval[mid - lo + 1 + ri] ?? null;
        } else if (!right) {
          winner = left;
          li++;
          left = interval[li] ?? null;
        } else if (left.value <= right.value) {
          winner = left;
          li++;
          left = interval[li] ?? null;
        } else {
          winner = right;
          ri++;
          right = interval[mid - lo + 1 + ri] ?? null;
        }

        yield* chart.fly(winner, chart.slotX(lo + count), MAIN_ROW, op.fly);
        yield* chart.placeMerge(winner, lo + count, op.rest);
        yield* winner.rect().fill(THEME.found, 0.15);
        count++;
      }
      mergeRef().text(String(++merges));
    }
  }

  yield* chart.resetColors(0.3);
  yield* chart.sortedSweep(THEME.sorted, 0.05, 0.02);
  yield* waitUntil('merge.wrap');
  yield* waitFor(0.6);
  yield* all(chart.group.opacity(0, 0.5), hudGroup().opacity(0, 0.5));
});