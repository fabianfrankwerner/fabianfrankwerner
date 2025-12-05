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
      code={`<button></button>`}
    />
  );

  yield* code().code(`<button class="...">Google Search</button>`, 2);

  yield* code().code.append(
    `\n<button class="...">I'm Feeling Lucky</button>`,
    2
  );

  yield* code().selection(code().findAllRanges(`class="..."`), 2);

  yield* code().code(``, 2);

  view.add(
    <Code
      ref={code}
      fontSize={108}
      fontFamily={"Space Mono"}
      code={`.btn-google {}`}
    />
  );

  yield* code().code(
    `.btn-google {
  @apply ...
}`,
    2
  );

  yield* code().selection(code().findFirstRange("@apply"), 2);

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

  yield* code().code(`<div class="btn-google"></div>`, 2);

  yield* code().selection(code().findFirstRange("btn-google"), 2);

  yield* code().code(``, 2);

  view.add(
    <Code
      highlighter={HTML}
      ref={code}
      fontSize={108}
      fontFamily={"Space Mono"}
      code={`<Button />`}
    />
  );

  yield* waitFor(2);
});
