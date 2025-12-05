import { makeScene2D, Code, LezerHighlighter } from "@motion-canvas/2d";
import { all, createRef, DEFAULT, waitFor } from "@motion-canvas/core";

// import {parser} from '@lezer/javascript';
// import {parser} from '@lezer/markdown';
// import {parser} from '@lezer/json';
import {parser} from '@lezer/html';

// const JavaScript = new LezerHighlighter(parser);
// const MD = new LezerHighlighter(parser);
// const JSON = new LezerHighlighter(parser);
const HTML = new LezerHighlighter(parser);

export default makeScene2D(function* (view) {
  const code = createRef<Code>();

  view.add(
    <Code
      ref={code}
      fontSize={54}
      fontFamily={"Space Mono"}
      offsetX={-1}
      x={-400}
      code={"const number = 7;"}
    />
  );

  yield* waitFor(0.6);
  yield* all(
    code().code.replace(code().findFirstRange("number"), "variable", 0.6),
    code().code.prepend(0.6)`function example() {\n  `,
    code().code.append(0.6)`\n}`
  );

  yield* waitFor(0.6);
  yield* code().selection(code().findFirstRange("variable"), 0.6);

  yield* waitFor(0.6);
  yield* all(
    code().code("const number = 7;", 0.6),
    code().selection(DEFAULT, 0.6)
  );
});
