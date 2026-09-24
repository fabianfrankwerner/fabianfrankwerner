import {Gradient, makeScene2D, Rect, Txt} from '@canvas-commons/2d';
import {all, createRef, waitFor, waitUntil} from '@canvas-commons/core';
import {BarChart} from '../lib/visualization';
import {THEME} from '../lib/theme';
import {partiallySorted} from '../lib/random';

export default makeScene2D(function* (view) {
  view.fill(THEME.bg);

  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const hint = createRef<Txt>();
  const box = createRef<Rect>();

  const gradient = new Gradient({
    type: 'linear',
    from: [0, -60],
    to: [0, 120],
    stops: [
      {offset: 0, color: '#7dd3fc'},
      {offset: 0.55, color: '#a78bfa'},
      {offset: 1, color: '#f472b6'},
    ],
  });

  const chart = new BarChart(partiallySorted(14, 42), {
    barWidth: 42,
    gap: 10,
    baselineY: 205,
    maxBarHeight: 300,
    minBarHeight: 20,
  });

  view.add(
    <Rect
      ref={box}
      width={820}
      height={410}
      radius={24}
      stroke={THEME.starterBorder}
      lineWidth={2}
      fill={THEME.surfaceAlt}
      y={-10}
      opacity={0}
    />,
  );
  view.add(chart.group);
  view.add(
    <Txt
      ref={title}
      text={'SORTING ALGORITHMS'}
      fontSize={92}
      fontWeight={900}
      letterSpacing={10}
      fill={gradient}
      fontFamily={THEME.mono}
      y={-330}
      opacity={0}
    />,
  );
  view.add(
    <Txt
      ref={subtitle}
      text={'visualized, annotated & compared — with Big O analysis'}
      fontSize={30}
      fontWeight={500}
      fill={THEME.textMuted}
      fontFamily={THEME.sans}
      y={-250}
      opacity={0}
    />,
  );
  view.add(
    <Txt
      ref={hint}
      text={'watch how fast they sort — and how fast they DON’T'}
      fontSize={26}
      fill={THEME.textFaint}
      fontFamily={THEME.sans}
      y={125}
      opacity={0}
    />,
  );

  yield* all(
    title().opacity(1, 0.8),
    subtitle().opacity(1, 0.7),
    box().opacity(1, 0.7),
  );
  yield* waitUntil('intro.title');

  yield* chart.appear(0.9, 0.07);
  yield* waitUntil('intro.rewind');

  yield* hint().opacity(1, 0.6);

  // A quick teaser: the array sorts itself with a fast, silent bubble pass.
  const n = chart.n;
  for (let pass = 0; pass < n - 1; pass++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - pass; j++) {
      yield* chart.colorIndices([j, j + 1], THEME.active, 0.1);
      if (chart.slots[j].value > chart.slots[j + 1].value) {
        yield* chart.swap(j, j + 1, 0.22);
        swapped = true;
      } else {
        yield* waitFor(0.08);
      }
      yield* chart.resetIndex(j, 0.08);
    }
    yield* chart.resetIndex(n - 1 - pass, 0.1);
    if (!swapped) break;
  }
  yield* chart.sortedSweep(THEME.sorted, 0.06, 0.02);
  yield* waitUntil('intro.out');

  yield* all(
    title().opacity(0, 0.5),
    subtitle().opacity(0, 0.5),
    box().opacity(0, 0.5),
    hint().opacity(0, 0.5),
    chart.group.opacity(0, 0.5),
  );
  yield* waitFor(0.2);
});