import { Rect, Circle, Layout, Txt, makeScene2D } from "@motion-canvas/2d";
import { createRef, all, sequence } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  // Create shape references
  const leftCircle = createRef<Circle>();
  const rightCircle = createRef<Circle>();
  const label = createRef<Txt>();

  // Layout container to center everything
  view.add(
    <Layout layout gap={20} alignItems="center" justifyContent="center">
      <Circle
        ref={leftCircle}
        width={100}
        height={100}
        fill="#4caf50"
        opacity={0}
      />
      <Circle
        ref={rightCircle}
        width={100}
        height={100}
        fill="#2196f3"
        opacity={0}
      />
      <Txt ref={label} fontSize={40} text="" fill="white" />
    </Layout>
  );

  // Animate Inner Join: overlap highlight
  yield* sequence(
    0.5,
    all(leftCircle().opacity(0.8, 0.5), rightCircle().opacity(0.8, 0.5)),
    label().text("INNER JOIN", 0.5)
  );

  yield* label().text("Everyone in Both Tables", 1);

  // Left Join: keep left fully, reduce right
  yield* sequence(
    0.5,
    all(
      leftCircle().fill("#4caf50", 1),
      rightCircle().fill("#2196f3", 1),
      rightCircle().opacity(0.3, 0.5)
    ),
    label().text("LEFT JOIN", 0.5)
  );

  yield* label().text("All from Left + Matching Right", 1);

  // Right Join: mirror of left join
  yield* sequence(
    0.5,
    all(leftCircle().opacity(0.3, 0.5), rightCircle().opacity(0.8, 0.5)),
    label().text("RIGHT JOIN", 0.5)
  );

  yield* label().text("All from Right + Matching Left", 1);

  // Full Join: both fully visible
  yield* sequence(
    0.5,
    all(leftCircle().opacity(0.8, 0.5), rightCircle().opacity(0.8, 0.5)),
    label().text("FULL OUTER JOIN", 0.5)
  );

  yield* label().text("Everyone from Both Tables", 1);

  // Fade out shapes and show quick "Fancy Joins" teaser
  yield* sequence(
    0.5,
    all(leftCircle().opacity(0, 0.5), rightCircle().opacity(0, 0.5)),
    label().text("…and more fancy joins (Self, Cross, Natural)", 1)
  );
});
