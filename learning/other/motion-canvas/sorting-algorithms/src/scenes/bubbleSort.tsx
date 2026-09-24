import {Layout, Line, makeScene2D, Txt} from '@canvas-commons/2d';
import {all, createRef, waitFor, waitUntil} from '@canvas-commons/core';
import {BarChart} from '../lib/visualization';
import {THEME} from '../lib/theme';
import {perm} from '../lib/random';
import {Counter, Hud, PassLine} from '../components/hud';
import {ALGORITHM_MAP} from '../lib/algorithms';

export default makeScene2D(function* (view) {
  view.fill(THEME.bg);
  const meta = ALGORITHM_MAP.bubble;

  const cmpRef = createRef<Txt>();
  const swapRef = createRef<Txt>();
  const passRef = createRef<Txt>();
  const passLine = createRef<Line>();
  const hudGroup = createRef<Layout>();

  const chart = new BarChart(perm(16, 11), {
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

  view.add(<Layout x={-760} y={92}><Counter label={'pass'} value={'—'} ref={passRef} compact /></Layout>);

  view.add(<PassLine ref={passLine} x={chart.slotX(0)} />);

  yield* all(
    chart.appear(0.6, 0.045),
    hudGroup().opacity(0, 0.01).to(1, 0.6),
    passLine().opacity(1, 0.6),
  );
  yield* waitUntil('bubble.title');
  yield* waitUntil('bubble.teach');

  const n = chart.n;
  let cmp = 0;
  let swaps = 0;

  const slowDur = 0.5;
  const fastDur = 0.14;

  for (let pass = 0; pass < n - 1; pass++) {
    passRef().text(String(pass + 1));
    const last = n - 1 - pass;
    const boundary = (chart.slotX(last - 1) + chart.slotX(last)) / 2;

    if (pass === 1) {
      yield* waitUntil('bubble.speedup');
    }

    let swapped = false;
    for (let j = 0; j < last; j++) {
      const duration = pass === 0 ? slowDur : fastDur;
      cmpRef().text(String(++cmp));
      yield* chart.colorIndices([j, j + 1], THEME.compare, duration * 0.35);
      if (chart.slots[j].value > chart.slots[j + 1].value) {
        yield* chart.swap(j, j + 1, duration);
        swapRef().text(String(++swaps));
        swapped = true;
      } else {
        yield* waitFor(duration * 0.3);
      }
      yield* chart.resetIndex(j, duration * 0.3);
      yield* chart.colorIndices([j + 1], THEME.active, duration * 0.2);
    }

    // Clear the scan highlights from this pass.
    for (let i = 0; i < last; i++) {
      yield* chart.resetIndex(i, 0.2);
    }
    yield* chart.colorRange(last, last, THEME.sorted, 0.35);
    yield* passLine().position.x(boundary, 0.3);

    if (!swapped) {
      yield* waitUntil('bubble.early');
      yield* chart.colorRange(0, last, THEME.found, 0.5);
      yield* waitFor(0.4);
      break;
    }
  }

  yield* chart.resetColors(0.4);
  yield* chart.sortedSweep(THEME.sorted, 0.05, 0.02);
  yield* waitUntil('bubble.wrap');
  yield* waitFor(0.6);
  yield* all(chart.group.opacity(0, 0.5), hudGroup().opacity(0, 0.5));
});