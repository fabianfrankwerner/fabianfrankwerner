import {
  Circle,
  Grid,
  Layout,
  Line,
  Node,
  Rect,
  Txt,
  makeScene2D,
} from "@motion-canvas/2d";
import {
  all,
  createSignal,
  easeOutCubic,
  linear,
  waitFor,
  Vector2,
  map,
} from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  // --- CONFIGURATION ---
  // Scaled up by 1.5x (810 * 1.5 = 1215)
  const GRAPH_WIDTH = 1215;
  const GRAPH_HEIGHT = 1215;
  const AXIS_OFFSET = 81; // Scaled offset

  // Colors
  const C_BG = "#1e1e1e";
  const C_GRID = "#333";
  const C_AXIS = "#808080";
  const C_VANILLA = "#663399";
  const C_TAILWIND = "#38BDF8";

  // Signals for animation
  const progress = createSignal(0);

  // --- DATA FUNCTIONS ---

  // Linear Growth (Vanilla)
  // y = x (Perfect diagonal 1:1 growth)
  const getVanillaY = (t: number) => t;

  // Logarithmic Growth (Tailwind)
  // Higher multiplier (100) makes the "knee" of the curve sharper.
  // Result: Steep start (loading framework), then extremely flat tail.
  const getTailwindY = (t: number) => {
    // Math.log(t * 100 + 1) reaches ~4.6 at t=1.
    // Divided by 8 to land at ~0.57 height (lower than Vanilla's 1.0).
    return Math.log(t * 100 + 1) / 8;
  };

  view.fill(C_BG);

  // ROOT NODE: Center the entire graph structure
  view.add(
    <Node>
      {/* 1. THE GRID (Background) */}
      <Grid
        width={GRAPH_WIDTH}
        height={GRAPH_HEIGHT}
        stroke={C_GRID}
        lineWidth={3} // Scaled line width
        spacing={150} // Scaled spacing
        opacity={0.5}
      />

      {/* 2. AXES & LABELS */}
      <Node position={[-GRAPH_WIDTH / 2, GRAPH_HEIGHT / 2]}>
        {/* Y-Axis (File Size) */}
        <Line
          points={[Vector2.zero, new Vector2(0, -GRAPH_HEIGHT - AXIS_OFFSET)]}
          stroke={C_AXIS}
          lineWidth={6} // Scaled
          endArrow
          arrowSize={24} // Scaled
        />
        <Txt
          text="FILE SIZE"
          fill={C_AXIS}
          fontFamily={"Space Mono"}
          fontSize={36} // Scaled font
          rotation={-90}
          x={-90}
          y={-GRAPH_HEIGHT / 2}
        />

        {/* X-Axis (Pages) */}
        <Line
          points={[Vector2.zero, new Vector2(GRAPH_WIDTH + AXIS_OFFSET, 0)]}
          stroke={C_AXIS}
          lineWidth={6} // Scaled
          endArrow
          arrowSize={24} // Scaled
        />
        <Txt
          text="NUMBER OF PAGES"
          fill={C_AXIS}
          fontFamily={"Space Mono"}
          fontSize={36} // Scaled font
          y={90}
          x={GRAPH_WIDTH / 2}
        />

        {/* Origin Label */}
        <Txt text="0" fill={C_AXIS} fontSize={36} x={-30} y={30} />
      </Node>

      {/* 3. DATA PLOT LAYERS (Overlay) */}
      <Node position={[-GRAPH_WIDTH / 2, GRAPH_HEIGHT / 2]}>
        {/* VANILLA CSS LINE (Linear) */}
        <GraphCurve
          progress={progress}
          color={C_VANILLA}
          width={GRAPH_WIDTH}
          height={GRAPH_HEIGHT}
          dataFunction={getVanillaY}
          label="CSS"
        />

        {/* TAILWIND CSS LINE (Logarithmic) */}
        <GraphCurve
          progress={progress}
          color={C_TAILWIND}
          width={GRAPH_WIDTH}
          height={GRAPH_HEIGHT}
          dataFunction={getTailwindY}
          label="Tailwind CSS"
        />
      </Node>
    </Node>
  );

  // --- ANIMATION SCRIPT ---

  yield* waitFor(1);

  // Animate the graph drawing
  yield* progress(1, 4, easeOutCubic);

  yield* waitFor(2);
});

// --- HELPER COMPONENT FOR THE CURVES ---
const GraphCurve = (props: {
  progress: () => number;
  color: string;
  width: number;
  height: number;
  dataFunction: (t: number) => number;
  label: string;
}) => {
  const currentPos = () => {
    const p = props.progress();
    const x = p * props.width;
    const y = -props.dataFunction(p) * props.height;
    return new Vector2(x, y);
  };

  return (
    <Node>
      <Line
        points={() => {
          const p = props.progress();
          const steps = 100; // Increased resolution for smoother large curves
          const points = [];

          for (let i = 0; i <= steps * p; i++) {
            const t = i / steps;
            points.push(
              new Vector2(
                t * props.width,
                -props.dataFunction(t) * props.height
              )
            );
          }

          if (points.length < 2) return [Vector2.zero, Vector2.zero];
          points.push(currentPos());

          return points;
        }}
        stroke={props.color}
        lineWidth={9} // Scaled line width
        lineCap={"round"}
        lineJoin={"round"}
      />

      <Layout
        x={() => currentPos().x}
        y={() => currentPos().y}
        opacity={() => (props.progress() > 0.05 ? 1 : 0)}
      >
        <Circle
          size={30} // Scaled circle
          fill={props.color}
          stroke={props.color}
        />

        <Txt
          text={props.label}
          fill={props.color}
          fontFamily={"Space Mono"}
          fontSize={42} // Scaled font
          fontWeight={700}
          y={-60}
          x={30}
          shadowBlur={10}
          shadowColor={"rgba(0,0,0,0.5)"}
        />
      </Layout>
    </Node>
  );
};
