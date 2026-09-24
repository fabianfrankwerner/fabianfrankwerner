import {Layout, makeScene2D, Polygon, Txt} from '@canvas-commons/2d';
import {all, createRef, ThreadGenerator, waitFor, waitUntil} from '@canvas-commons/core';
import {BarChart} from '../lib/visualization';
import {THEME} from '../lib/theme';
import {perm} from '../lib/random';
import {Hud, Pointer} from '../components/hud';
import {ALGORITHM_MAP} from '../lib/algorithms';

export default makeScene2D(function* (view) {
  view.fill(THEME.bg);
  const meta = ALGORITHM_MAP.quick;

  const cmpRef = createRef<Txt>();
  const swapRef = createRef<Txt>();
  const jPtr = createRef<Polygon>();
  const iPtr = createRef<Polygon>();
  const pivotPtr = createRef<Polygon>();
  const hudGroup = createRef<Layout>();

  const chart = new BarChart(perm(14, 63), {
    barWidth: 54,
    gap: 11,
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

  const py = -360;
  view.add(
    <Pointer
      ref={jPtr}
      x={chart.slotX(1)}
      y={py}
      color={THEME.compare}
      size={26}
      label={'scan'}
      opacity={0}
    />,
  );
  view.add(
    <Pointer
      ref={iPtr}
      x={chart.slotX(0) - chart.spacing() / 2}
      y={py}
      color={THEME.accent}
      size={26}
      label={'boundary'}
      opacity={0}
    />,
  );
  view.add(
    <Pointer
      ref={pivotPtr}
      x={chart.slotX(chart.n - 1)}
      y={py}
      color={THEME.pivot}
      size={30}
      label={'pivot'}
      opacity={0}
    />,
  );

  yield* all(
    chart.appear(0.6, 0.06),
    hudGroup().opacity(0, 0.01).to(1, 0.6),
  );
  yield* waitUntil('quick.title');
  yield* waitUntil('quick.teach');

  yield* all(
    jPtr().opacity(1, 0.4),
    iPtr().opacity(1, 0.4),
    pivotPtr().opacity(1, 0.4),
  );

  const n = chart.n;
  let cmp = 0;
  let swaps = 0;
  let firstPartition = true;
  let recurseCued = false;

  const quickRange = function* (low: number, high: number): ThreadGenerator {
    if (low >= high) {
      yield* chart.colorRange(low, high, THEME.sorted, 0.25);
      return;
    }

    yield* chart.colorRange(low, high, THEME.active, 0.2);
    const pivotIdx = high;
    yield* pivotPtr().position.x(chart.slotX(pivotIdx), 0.4);
    yield* chart.colorIndices([pivotIdx], THEME.pivot, 0.2);

    if (firstPartition) {
      yield* waitUntil('quick.partition');
      firstPartition = false;
    }

    const pivotVal = chart.slots[high].value;
    let boundary = low - 1;
    yield* iPtr().position.x(
      chart.slotX(Math.max(low - 1, 0)) - chart.spacing() / 2,
      0.3,
    );

    for (let j = low; j < high; j++) {
      cmpRef().text(String(++cmp));
      yield* jPtr().position.x(chart.slotX(j), 0.2);
      yield* chart.colorIndices([j], THEME.compare, 0.15);
      if (chart.slots[j].value <= pivotVal) {
        boundary++;
        yield* iPtr().position.x(chart.slotX(boundary), 0.25);
        if (boundary !== j) {
          yield* chart.swap(boundary, j, 0.4);
          swapRef().text(String(++swaps));
        }
        yield* chart.resetIndex(boundary, 0.12);
      } else {
        yield* waitFor(0.12);
      }
      yield* chart.resetIndex(j, 0.12);
    }

    // Drop the pivot between the two sides.
    const p = boundary + 1;
    yield* pivotPtr().position.x(chart.slotX(p), 0.4);
    if (p !== pivotIdx) {
      yield* chart.swap(p, pivotIdx, 0.45);
      swapRef().text(String(++swaps));
    }
    yield* chart.resetIndices(
      Array.from({length: high - low + 1}, (_, k) => low + k),
      0.25,
    );
    yield* chart.colorRange(p, p, THEME.sorted, 0.25);

    if (!recurseCued) {
      yield* waitUntil('quick.recurse');
      recurseCued = true;
    }
    yield* quickRange(low, p - 1);
    yield* quickRange(p + 1, high);
  };

  yield* quickRange(0, n - 1);
  yield* chart.sortedSweep(THEME.sorted, 0.05, 0.02);
  yield* waitUntil('quick.wrap');
  yield* waitFor(0.6);
  yield* all(chart.group.opacity(0, 0.5), hudGroup().opacity(0, 0.5));
});