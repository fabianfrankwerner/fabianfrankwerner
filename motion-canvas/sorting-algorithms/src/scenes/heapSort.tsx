import {Layout, Line, makeScene2D, Polygon, Txt} from '@canvas-commons/2d';
import {all, createRef, waitFor, waitUntil} from '@canvas-commons/core';
import {BarChart} from '../lib/visualization';
import {THEME} from '../lib/theme';
import {perm} from '../lib/random';
import {Hud, PassLine, Pointer} from '../components/hud';
import {ALGORITHM_MAP} from '../lib/algorithms';

export default makeScene2D(function* (view) {
  view.fill(THEME.bg);
  const meta = ALGORITHM_MAP.heap;

  const cmpRef = createRef<Txt>();
  const swapRef = createRef<Txt>();
  const rootPtr = createRef<Polygon>();
  const heapLine = createRef<Line>();
  const hudGroup = createRef<Layout>();

  const chart = new BarChart(perm(16, 99), {
    barWidth: 42,
    gap: 9,
    baselineY: 150,
    maxBarHeight: 400,
    minBarHeight: 26,
  });
  view.add(chart.group);

  view.add(
    <Layout ref={hudGroup} y={-420}>
      <Hud
        title={meta.name}
        bigO={meta.bigO}
        tagline={meta.tagline}
        accent={meta.accent}
        counterPatch={{comparisons: cmpRef, swaps: swapRef}}
      />
    </Layout>,
  );

  view.add(<Pointer ref={rootPtr} x={chart.slotX(0)} y={-360} color={THEME.heap} size={30} label={'root'} opacity={0} />);
  view.add(<PassLine ref={heapLine} x={chart.slotX(chart.n - 1) + chart.spacing() / 2} color={THEME.textMuted} />);

  yield* all(
    chart.appear(0.6, 0.06),
    hudGroup().opacity(0, 0.01).to(1, 0.6),
  );
  yield* waitUntil('heap.title');
  yield* waitUntil('heap.teach');

  const n = chart.n;
  let cmp = 0;
  let swaps = 0;

  yield* all(rootPtr().opacity(1, 0.4), heapLine().opacity(0.6, 0.4));

  const siftDown = function* (start: number, heapEnd: number) {
    let i = start;
    for (;;) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let largest = i;
      if (l <= heapEnd) {
        cmpRef().text(String(++cmp));
        yield* chart.colorIndices([l], THEME.compare, 0.12);
        if (chart.slots[l].value > chart.slots[largest].value) largest = l;
        yield* chart.resetIndex(l, 0.12);
      }
      if (r <= heapEnd) {
        cmpRef().text(String(++cmp));
        yield* chart.colorIndices([r], THEME.compare, 0.12);
        if (chart.slots[r].value > chart.slots[largest].value) largest = r;
        yield* chart.resetIndex(r, 0.12);
      }
      if (largest === i) break;
      yield* chart.colorIndices([i, largest], THEME.found, 0.15);
      yield* chart.swap(i, largest, 0.4);
      swapRef().text(String(++swaps));
      yield* chart.resetIndices([i, largest], 0.2);
      i = largest;
    }
  };

  // --- Build the max-heap (bottom-up sift-down). ---
  yield* waitUntil('heap.build');
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* chart.colorIndices([i], THEME.pivot, 0.15);
    yield* siftDown(i, n - 1);
    yield* chart.resetIndices([i], 0.2);
  }
  yield* chart.colorRange(0, n - 1, THEME.heap, 0.4);
  yield* chart.resetColors(0.6);

  // --- Extract the max repeatedly. ---
  yield* rootPtr().position.x(chart.slotX(0), 0.2);
  for (let end = n - 1; end >= 1; end--) {
    if (end === n - 1) yield* waitUntil('heap.extract');
    if (end === Math.floor(n / 2)) yield* waitUntil('heap.repeat');

    yield* chart.colorIndices([0, end], THEME.compare, 0.15);
    yield* chart.swap(0, end, 0.45);
    swapRef().text(String(++swaps));
    yield* chart.colorIndices([end], THEME.sorted, 0.3);

    yield* all(
      heapLine().position.x(chart.slotX(end - 1) + chart.spacing() / 2, 0.35),
    );
    yield* chart.resetIndices([0], 0.2);
    if (end - 1 > 0) yield* siftDown(0, end - 1);
  }

  yield* chart.colorRange(0, 0, THEME.sorted, 0.3);
  yield* chart.sortedSweep(THEME.sorted, 0.04, 0.02);
  yield* waitUntil('heap.wrap');
  yield* waitFor(0.6);
  yield* all(chart.group.opacity(0, 0.5), hudGroup().opacity(0, 0.5));
});