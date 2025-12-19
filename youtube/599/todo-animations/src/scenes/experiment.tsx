import { makeScene2D, Rect, Line, Txt, Node, Layout } from "@motion-canvas/2d";
import {
  createSignal,
  map,
  easeInOutCubic,
  Vector2,
  waitFor,
  range,
  all,
  createRef,
} from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  // --- CONFIGURATION ---
  const SCALE = 10; // Scale factor for visibility
  const BASE_SIZE = 100; // The "CSS Width" setting
  const TARGET_PADDING = 20; // The padding we want to add

  // Colors (Pixel-perfect from your uploaded images)
  const C_BG = "#000000";
  const C_HATCH_BG = "#000000";
  const C_CONTENT = "#ffffff";
  const C_DIM = "#ffffff";
  const C_HATCH_LINES = "#ffffff";

  // --- SIGNALS ---
  // Controls the amount of padding applied (0 to 24)
  const padding = createSignal(0);

  // Controls the Box Model Mode
  // 0 = content-box (Outer grows)
  // 1 = border-box (Outer stays fixed, Inner shrinks)
  const borderBoxMode = createSignal(0);

  // --- DERIVED CALCULATIONS ---

  // 1. Outer Box Size (The total footprint)
  // If content-box (0): BASE + Padding*2
  // If border-box (1):  BASE
  const outerSize = () => {
    const growth = padding() * 2;
    // Interpolate between "Growth" (mode 0) and "Fixed" (mode 1)
    return (BASE_SIZE + growth * (1 - borderBoxMode())) * SCALE;
  };

  // 2. Inner Content Size (The blue area)
  // If content-box (0): BASE
  // If border-box (1):  BASE - Padding*2
  const innerSize = () => {
    const shrinkage = padding() * 2;
    // Interpolate between "Fixed" (mode 0) and "Shrinkage" (mode 1)
    return (BASE_SIZE - shrinkage * borderBoxMode()) * SCALE;
  };

  // 3. Label Logic
  const labelValue = () => outerSize() / SCALE;

  // --- SCENE ---
  view.add(
    <Rect width={"100%"} height={"100%"} fill={C_BG}>
      {/* 1. CODE LABEL (Top) */}
      {/* <Txt
        y={-810}
        text={() =>
          borderBoxMode() < 0.5
            ? "box-sizing: content-box;"
            : "box-sizing: border-box;"
        }
        fill={C_HATCH_LINES}
        fontFamily={"Space Mono"}
        fontSize={54}
      /> */}

      {/* 2. THE BOX */}
      <Rect
        width={outerSize}
        height={outerSize}
        fill={C_HATCH_BG}
        stroke={C_DIM}
        lineWidth={13.5}
        radius={27}
        clip // Clips the hatching lines inside the growing/shrinking box
      >
        {/* Hatching Pattern */}
        <Node rotation={-45} opacity={0.25}>
          {range(-40, 40).map((i) => (
            <Line
              points={[new Vector2(-2000, i * 40), new Vector2(2000, i * 40)]}
              stroke={C_HATCH_LINES}
              lineWidth={6.75}
            />
          ))}
        </Node>

        {/* Inner Content Box */}
        <Rect
          width={innerSize}
          height={innerSize}
          fill={C_CONTENT}
          radius={27}
        />
      </Rect>

      {/* 3. DIMENSION ARROWS */}

      {/* Horizontal Dimension (Top) */}
      <DimensionLine
        size={outerSize}
        textValue={labelValue}
        offset={new Vector2(0, -60)} // 60px gap from the box
        color={C_DIM}
        axis={"horizontal"}
      />

      {/* Vertical Dimension (Left) */}
      <DimensionLine
        size={outerSize}
        textValue={labelValue}
        offset={new Vector2(-60, 0)} // 60px gap from the box
        color={C_DIM}
        axis={"vertical"}
      />
    </Rect>
  );

  // --- ANIMATION SCRIPT ---

  // Step 1: Start with CSS Width 128px, No Padding.
  // Visual: 128px Box.
  yield* waitFor(2);

  // Step 2: "Adding padding increases the width..."
  // Animate padding 0 -> 24px in Content-Box mode.
  // Visual: Box explodes to 176px.
  yield* padding(TARGET_PADDING, 6);
  yield* waitFor(2);

  // Step 3: "It makes layout math a nightmare."
  // Pause to let viewer digest the 176px number.
  yield* waitFor(1);

  // Step 4: The Fix. Switch to Border-Box.
  // Visual: Outer box shrinks back to 128px. Inner box shrinks.
  yield* borderBoxMode(2, 1.5, easeInOutCubic);

  // Step 5: Show that it works.
  yield* waitFor(2);
});

// --- HELPER COMPONENT ---
// Draws an arrow that sticks to the outside of the box size provided
const DimensionLine = (props: {
  size: () => number;
  textValue: () => number;
  offset: Vector2;
  color: string;
  axis: "horizontal" | "vertical";
}) => {
  const isHoriz = props.axis === "horizontal";

  // Calculate position: Center of box (0,0) + Half Size + Gap Offset
  const position = () => {
    const s = props.size() / 2;
    if (isHoriz) return new Vector2(0, -s + props.offset.y);
    return new Vector2(-s + props.offset.x, 0);
  };

  return (
    <Node position={position}>
      {/* Arrow Line */}
      <Line
        points={() => {
          const s = props.size() / 2;
          return isHoriz
            ? [new Vector2(-s, 0), new Vector2(s, 0)]
            : [new Vector2(0, -s), new Vector2(0, s)];
        }}
        stroke={props.color}
        lineWidth={6.75}
        startArrow
        endArrow
        arrowSize={13.5}
      />

      {/* Label Text */}
      <Txt
        text={() => `${props.textValue().toFixed(0)}px`}
        fill={props.color}
        fontFamily={"Space Mono"}
        fontSize={54}
        y={isHoriz ? -81 : 0}
        x={isHoriz ? 0 : -81}
        rotation={isHoriz ? 0 : -90}
      />
    </Node>
  );
};
