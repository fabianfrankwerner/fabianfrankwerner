import { makeScene2D, Code, LezerHighlighter } from "@motion-canvas/2d";
import { all, createRef, DEFAULT, waitFor } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const code = createRef<Code>();

  view.add(
    <Code
      ref={code}
      fontSize={108}
      fontFamily={"Geist Mono"}
      code={"print()"}
    />
  );

  // append immediately
  code().code.append(`# Comment`, 4);

  yield* waitFor(2.7);
});
