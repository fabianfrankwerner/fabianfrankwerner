import { makeScene2D, Code, LezerHighlighter } from "@motion-canvas/2d";
import { all, createRef, DEFAULT, waitFor } from "@motion-canvas/core";

// import {parser} from '@lezer/javascript';
import {parser} from '@lezer/markdown';
// import {parser} from '@lezer/json';
// import {parser} from '@lezer/html';

// const JavaScript = new LezerHighlighter(parser);
const MD = new LezerHighlighter(parser);
// const JSON = new LezerHighlighter(parser);
// const HTML = new LezerHighlighter(parser);

export default makeScene2D(function* (view) {
  const code = createRef<Code>();

  view.add(
    <Code
      highlighter={MD}
      ref={code}
      fontSize={108}
      fontFamily={"Space Mono"}
      code={""}
    />
  );

  // append immediately
  code().code.append(`npm init`);

  // animate using the signal signature
  yield* code().code.append('\nnpm install tailwindcss', 2);

  // animate using the signal signature
  yield* code().code.append('\nnpx tailwindcss init', 2);
});
