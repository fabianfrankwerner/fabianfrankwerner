import { Composition, registerRoot } from "remotion";
import { Video, STEP_FRAMES } from "./Video";

export const RemotionRoot = () => {
  return (
    <Composition
      id="Video"
      component={Video}
      durationInFrames={300} // Default
      fps={60}
      width={1280}
      height={720}
      calculateMetadata={async ({ props }) => {
        const stepCount = props.steps ? props.steps.length : 0;
        return {
          durationInFrames: stepCount * STEP_FRAMES || 60,
        };
      }}
      defaultProps={{
        steps: []
      }}
    />
  );
};

registerRoot(RemotionRoot);
