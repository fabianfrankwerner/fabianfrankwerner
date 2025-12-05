import {
  makeScene2D,
  Code,
  LezerHighlighter,
  word,
  lines,
} from "@motion-canvas/2d";
import { all, createRef, waitFor } from "@motion-canvas/core";

// import {parser} from '@lezer/javascript';
// import {parser} from '@lezer/markdown';
// import {parser} from '@lezer/json';
// import { parser } from "@lezer/html";

// const JavaScript = new LezerHighlighter(parser);
// const MD = new LezerHighlighter(parser);
// const JSON = new LezerHighlighter(parser);
// const HTML = new LezerHighlighter(parser);

export default makeScene2D(function* (view) {
  const code = createRef<Code>();

  view.add(
    <Code ref={code} fontSize={108} fontFamily={"Space Mono"} code={`* {}`} />
  );

  yield* code().code(
    `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}`,
    2
  );

  yield* code().selection(code().findFirstRange("border-box"), 2);
});
