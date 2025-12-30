import { makeScene2D, Code, LezerHighlighter } from "@motion-canvas/2d";
import { all, createRef, DEFAULT, waitFor } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const code = createRef<Code>();

  view.add(
    <Code
      ref={code}
      fontSize={108}
      fontFamily={"Geist Mono"}
      code={`\
        def greet name
  "Hello, #{name}"
end`}
    />
  );
});
