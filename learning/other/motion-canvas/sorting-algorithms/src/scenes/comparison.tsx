import {Line, makeScene2D, Rect, Txt} from '@canvas-commons/2d';
import {all, createRef, sequence, waitFor, waitUntil} from '@canvas-commons/core';
import {THEME} from '../lib/theme';
import {ALGORITHMS} from '../lib/algorithms';

export default makeScene2D(function* (view) {
  view.fill(THEME.bg);

  const title = createRef<Txt>();
  const chartBox = createRef<Rect>();
  const curveQuad = createRef<Line>();
  const curveLog = createRef<Line>();
  const legendQuad = createRef<Txt>();
  const legendLog = createRef<Txt>();
  const table = createRef<Rect>();
  const guide1 = createRef<Txt>();
  const guide2 = createRef<Txt>();
  const guide3 = createRef<Txt>();

  view.add(
    <Txt
      ref={title}
      text={'Choosing the right sort'}
      fontSize={52}
      fontWeight={900}
      fill={THEME.text}
      fontFamily={THEME.sans}
      y={-470}
      opacity={0}
    />,
  );

  // --- Growth chart (share one axis so the gap is honest). ---
  const CN = 30;
  const scale = 380 / (CN * CN);
  const stepX = 760 / CN;
  const qPoints: [number, number][] = [];
  const lPoints: [number, number][] = [];
  for (let n = 1; n <= CN; n++) {
    qPoints.push([-380 + n * stepX, 150 - n * n * scale]);
    lPoints.push([-380 + n * stepX, 152 - n * Math.log2(n) * scale]);
  }

  view.add(
    <Rect
      ref={chartBox}
      x={-470}
      y={-150}
      width={860}
      height={430}
      radius={20}
      fill={THEME.surfaceAlt}
      stroke={THEME.border}
      lineWidth={2}
      opacity={0}
    >
      <Line points={[[-372, 150], [372, 150]]} stroke={THEME.border} lineWidth={2} />
      <Line points={[[-372, 150], [-372, -265]]} stroke={THEME.border} lineWidth={2} />
      <Txt text={'items  →'} fontSize={18} fill={THEME.textFaint} fontFamily={THEME.mono} x={250} y={185} />
      <Txt text={'work ↑'} fontSize={18} fill={THEME.textFaint} fontFamily={THEME.mono} x={-455} y={-270} />
      <Line ref={curveQuad} points={qPoints} stroke={THEME.danger} lineWidth={5} opacity={0} />
      <Line ref={curveLog} points={lPoints} stroke={THEME.accent} lineWidth={5} opacity={0} />
      <Txt ref={legendQuad} text={'n²'} fontSize={34} fontWeight={800} fill={THEME.danger} fontFamily={THEME.mono} x={290} y={-120} opacity={0} />
      <Txt ref={legendLog} text={'n · log n'} fontSize={34} fontWeight={800} fill={THEME.accent} fontFamily={THEME.mono} x={200} y={-10} opacity={0} />
    </Rect>,
  );

  // --- Property table. ---
  const header =
    ['sort', 'avg', 'worst', 'best', 'space', 'stab', 'in'].map(s => s.padEnd(9)).join(' ');
  const rows = ALGORITHMS.map(a =>
    [a.name, a.complexityN, a.worst, a.best, a.space, a.stable ? 'yes' : 'no', a.inPlace ? 'yes' : 'no']
      .map(s => s.padEnd(9))
      .join(' '),
  );

  view.add(
    <Rect
      ref={table}
      x={120}
      y={-150}
      width={940}
      layout
      direction="column"
      gap={8}
      padding={26}
      radius={20}
      fill={THEME.surfaceAlt}
      stroke={THEME.border}
      lineWidth={2}
      opacity={0}
    >
      <Txt text={'AT A GLANCE'} fontSize={15} letterSpacing={5} fill={THEME.textFaint} fontFamily={THEME.mono} />
      <Txt text={header} fontSize={24} fontWeight={800} fill={THEME.accentSoft} fontFamily={THEME.mono} />
      {rows.map((row, i) => (
        <Txt
          key={String(i)}
          text={row}
          fontSize={22}
          fill={i % 2 === 0 ? THEME.text : THEME.textMuted}
          fontFamily={THEME.mono}
        />
      ))}
    </Rect>,
  );

  // --- Bottom takeaways. ---
  const guides = [
    'Tiny or nearly-sorted input  →  Insertion Sort  (best case O(n))',
    'Big data  →  Merge / Quick / Heap  (n log n beats n² fast)',
    'Stable + predictable  →  Merge  |  Tiny memory  →  Heap / In-place',
  ];
  const guideRefs = [guide1, guide2, guide3];
  guides.forEach((g, i) => {
    view.add(
      <Txt
        ref={guideRefs[i]}
        text={g}
        fontSize={28}
        fill={THEME.textMuted}
        fontFamily={THEME.sans}
        y={330 + i * 48}
        opacity={0}
      />,
    );
  });

  yield* all(title().opacity(1, 0.6), chartBox().opacity(1, 0.6));
  yield* waitUntil('compare.title');

  yield* all(
    curveQuad().opacity(1, 0.5),
    curveLog().opacity(1, 0.5),
    legendQuad().opacity(1, 0.4),
    legendLog().opacity(1, 0.4),
    table().opacity(1, 0.6),
  );
  yield* waitUntil('compare.chart');

  yield* sequence(0.45, guide1().opacity(1, 0.4), guide2().opacity(1, 0.4), guide3().opacity(1, 0.4));
  yield* waitUntil('compare.guide');

  yield* waitFor(1);
  yield* all(
    title().opacity(0, 0.4),
    chartBox().opacity(0, 0.4),
    table().opacity(0, 0.4),
    guide1().opacity(0, 0.4),
    guide2().opacity(0, 0.4),
    guide3().opacity(0, 0.4),
  );
});