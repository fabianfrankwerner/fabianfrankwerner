import {Layout, makeScene2D, Polygon, Txt} from '@canvas-commons/2d';
import {all, createRef, waitFor, waitUntil} from '@canvas-commons/core';
import {BarChart} from '../lib/visualization';
import {THEME} from '../lib/theme';
import {perm} from '../lib/random';
import {Hud, Pointer} from '../components/hud';
import {ALGORITHM_MAP} from '../lib/algorithms';

export default makeScene2D(function* (view) {
  view.fill(THEME.bg);
  const meta = ALGORITHM_MAP.selection;

  const cmpRef = createRef<Txt>();
  const swapRef = createRef<Txt>();
  const minPtr = createRef<Polygon>();
  const scanPtr = createRef<Polygon>();
  const hudGroup = createRef<Layout>();

  const chart = new BarChart(perm(16, 23), {
    barWidth: 48,
    gap: 10,
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

  const pointerY = -360;
  view.add(
    <Pointer
      ref={minPtr}
      x={chart.slotX(0)}
      y={pointerY}
      color={THEME.found}
      size={30}
      label={'min'}
      opacity={0}
    />,
  );
  view.add(
    <Pointer
      ref={scanPtr}
      x={chart.slotX(1)}
      y={pointerY}
      color={THEME.compare}
      size={30}
      label={'scan'}
      opacity={0}
    />,
  );

  yield* all(
    chart.appear(0.6, 0.045),
    hudGroup().opacity(0, 0.01).to(1, 0.6),
  );
  yield* waitUntil('selection.title');
  yield* waitUntil('selection.teach');

  yield* all(minPtr().opacity(1, 0.4), scanPtr().opacity(1, 0.4));

  const n = chart.n;
  let cmp = 0;
  let swaps = 0;

  for (let i = 0; i < n - 1; i++) {
    if (i === 0) yield* waitUntil('selection.first');
    if (i === 1) yield* waitUntil('selection.runs');
    yield* minPtr().position.x(chart.slotX(i), 0.4);
    yield* chart.colorIndices([i], THEME.found, 0.25);

    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      cmpRef().text(String(++cmp));
      yield* scanPtr().position.x(chart.slotX(j), 0.22);
      yield* chart.colorIndices([j], THEME.compare, 0.2);
      if (chart.slots[j].value < chart.slots[minIdx].value) {
        yield* chart.resetIndex(minIdx, 0.2);
        minIdx = j;
        yield* minPtr().position.x(chart.slotX(minIdx), 0.35);
        yield* chart.colorIndices([minIdx], THEME.found, 0.2);
      }
      yield* chart.resetIndex(j, 0.15);
    }

    // Restore the scan region, then swap the minimum into place.
    yield* chart.resetIndices(Array.from({length: n - i}, (_, k) => i + k), 0.2);
    if (i === 0) yield* waitUntil('selection.swap');
    if (minIdx !== i) {
      yield* chart.swap(i, minIdx, 0.55);
      swapRef().text(String(++swaps));
    }
    yield* chart.colorRange(i, i, THEME.sorted, 0.3);
  }

  yield* chart.colorRange(n - 1, n - 1, THEME.sorted, 0.3);
  yield* chart.sortedSweep(THEME.sorted, 0.05, 0.02);
  yield* waitUntil('selection.wrap');
  yield* waitFor(0.6);
  yield* all(chart.group.opacity(0, 0.5), hudGroup().opacity(0, 0.5));
});