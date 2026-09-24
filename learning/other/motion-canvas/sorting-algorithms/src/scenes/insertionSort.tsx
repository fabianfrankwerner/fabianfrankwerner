import {Layout, makeScene2D, Txt} from '@canvas-commons/2d';
import {all, createRef, waitFor, waitUntil} from '@canvas-commons/core';
import {BarChart} from '../lib/visualization';
import {THEME} from '../lib/theme';
import {perm} from '../lib/random';
import {Hud} from '../components/hud';
import {ALGORITHM_MAP} from '../lib/algorithms';

export default makeScene2D(function* (view) {
  view.fill(THEME.bg);
  const meta = ALGORITHM_MAP.insertion;

  const cmpRef = createRef<Txt>();
  const writeRef = createRef<Txt>();
  const hudGroup = createRef<Layout>();

  const chart = new BarChart(perm(12, 29), {
    barWidth: 58,
    gap: 12,
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
        counterPatch={{comparisons: cmpRef, swaps: writeRef}}
      />
    </Layout>,
  );

  yield* all(
    chart.appear(0.6, 0.06),
    hudGroup().opacity(0, 0.01).to(1, 0.6),
  );
  yield* waitUntil('insertion.title');
  yield* waitUntil('insertion.teach');

  const n = chart.n;
  let cmp = 0;
  let writes = 0;

  for (let i = 1; i < n; i++) {
    yield* chart.colorIndices([i], THEME.found, 0.3);
    if (i === 1) {
      yield* waitUntil('insertion.first');
    }

    let insertAt = i;
    let j = i - 1;
    let done = false;
    while (!done) {
      cmpRef().text(String(++cmp));
      yield* chart.colorIndices([j], THEME.compare, 0.2);
      if (chart.slots[j].value > chart.slots[i].value) {
        yield* waitFor(0.28);
        yield* chart.resetIndex(j, 0.16);
        if (j === 0) {
          insertAt = 0;
          done = true;
        } else {
          j--;
        }
      } else {
        insertAt = j + 1;
        done = true;
      }
    }

    if (i === 1) {
      yield* waitUntil('insertion.shift');
    }
    yield* chart.shiftIntoPlace(i, insertAt, 0.6);
    writeRef().text(String(++writes));

    if (i === Math.floor(n / 2)) {
      yield* waitUntil('insertion.runs');
    }
  }

  yield* chart.colorRange(0, n - 1, THEME.found, 0.4);
  yield* chart.sortedSweep(THEME.sorted, 0.06, 0.02);
  yield* waitUntil('insertion.wrap');
  yield* waitFor(0.6);
  yield* all(chart.group.opacity(0, 0.5), hudGroup().opacity(0, 0.5));
});