import {Gradient, makeScene2D, Rect, Txt} from '@canvas-commons/2d';
import {all, createRef, waitUntil} from '@canvas-commons/core';
import {THEME} from '../lib/theme';

export default makeScene2D(function* (view) {
  view.fill(THEME.bg);

  const card = createRef<Rect>();
  const title = createRef<Txt>();
  const lines = [createRef<Txt>(), createRef<Txt>(), createRef<Txt>()];
  const thanks = createRef<Txt>();

  const gradient = new Gradient({
    type: 'linear',
    from: [-400, 0],
    to: [400, 0],
    stops: [
      {offset: 0, color: '#7dd3fc'},
      {offset: 0.5, color: '#a78bfa'},
      {offset: 1, color: '#f472b6'},
    ],
  });

  const copy = [
    'n²   Bubble · Selection · Insertion',
    'n log n   Merge · Quick · Heap',
    'Stability, memory and speed — pick for the job',
  ];

  view.add(
    <Rect
      ref={card}
      width={1200}
      height={620}
      radius={32}
      fill={THEME.surfaceAlt}
      stroke={THEME.starterBorder}
      lineWidth={3}
      opacity={0}
    />,
  );
  view.add(
    <Txt
      ref={title}
      text={'YOU NOW KNOW SIX SORTS'}
      fontSize={72}
      fontWeight={900}
      letterSpacing={8}
      fill={gradient}
      fontFamily={THEME.mono}
      y={-210}
      opacity={0}
    />,
  );
  copy.forEach((line, i) => {
    view.add(
      <Txt
        ref={lines[i]}
        text={line}
        fontSize={34}
        fill={i < 2 ? THEME.text : THEME.textMuted}
        fontFamily={i < 2 ? THEME.mono : THEME.sans}
        y={-60 + i * 64}
        opacity={0}
      />,
    );
  });
  view.add(
    <Txt
      ref={thanks}
      text={'Thanks for watching!'}
      fontSize={46}
      fontWeight={700}
      fill={THEME.accent}
      fontFamily={THEME.sans}
      y={270}
      opacity={0}
    />,
  );

  yield* all(card().opacity(1, 0.7), title().opacity(1, 0.7));
  yield* waitUntil('outro.title');

  yield* all(lines[0]().opacity(1, 0.5), lines[1]().opacity(1, 0.5), lines[2]().opacity(1, 0.5));
  yield* waitUntil('outro.lines');

  yield* thanks().opacity(1, 0.7);
  yield* waitUntil('outro.end');

  yield* all(
    card().opacity(0, 0.6),
    title().opacity(0, 0.6),
    thanks().opacity(0, 0.6),
    lines[0]().opacity(0, 0.6),
    lines[1]().opacity(0, 0.6),
    lines[2]().opacity(0, 0.6),
  );
});