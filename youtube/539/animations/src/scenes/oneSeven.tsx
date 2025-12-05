import {
  makeScene2D,
  Code,
  LezerHighlighter,
  word,
  lines,
} from "@motion-canvas/2d";
import { all, createRef, waitFor } from "@motion-canvas/core";

// import { parser } from "@lezer/javascript";
// import {parser} from '@lezer/markdown';
// import {parser} from '@lezer/json';
import { parser } from "@lezer/html";

// const JavaScript = new LezerHighlighter(parser);
// const MD = new LezerHighlighter(parser);
// const JSON = new LezerHighlighter(parser);
const HTML = new LezerHighlighter(parser);

export default makeScene2D(function* (view) {
  const code = createRef<Code>();

  view.add(
    <Code
      ref={code}
      fontSize={108}
      fontFamily={"Space Mono"}
      code={`.search-container:hover {}`}
    />
  );

  yield* code().code(
    `.search-container:hover {
  background-color: var(--bg-element-hover);
  box-shadow: 0 1px 6px 0 rgba(23, 23, 23, 0.5);
}`,
    2
  );

  yield* code().selection(code().findFirstRange("hover"), 2);

  yield* code().code(``, 2);

  view.add(
    <Code
      ref={code}
      fontSize={108}
      fontFamily={"Space Mono"}
      code={`h-[46px]`}
    />
  );

  yield* waitFor(2)

  yield* code().code.append('\n\nshadow-[0_1px_6px_0_rgba(23,23,23,0.5)]', 2);

  yield* waitFor(2)
});
