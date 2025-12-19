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
      highlighter={HTML}
      ref={code}
      fontSize={108}
      fontFamily={"Space Mono"}
      code={`<div>`}
    />
  );

  yield* code().code(`<div class="nav-right">`, 2);

  yield* waitFor(4)

  yield* code().selection(code().findFirstRange("nav-right"), 2);

  yield* waitFor(2)

  yield* code().code(``, 2);

  view.add(
    <Code ref={code} fontSize={108} fontFamily={"Space Mono"} code={``} />
  );

  yield* code().code(`.nav-right {}`, 2);

  yield* code().code(
    `.nav-right {
  display: flex;
  align-items: center;
}`,
    2
  );

  
  yield* code().selection(code().findFirstRange("display: flex"), 2);
  
  yield* waitFor(8)

  yield* code().code(``, 2);

  view.add(
    <Code
      highlighter={HTML}
      ref={code}
      fontSize={108}
      fontFamily={"Space Mono"}
      code={`<div>`}
    />
  );

  yield* code().code(`<div class="nav-right flex items-center gap-4">`, 2);

  yield* waitFor(4)

  yield* code().selection(code().findFirstRange("gap-4"), 2);

  yield* waitFor(12)

  // yield* code().code(``, 3);
});
