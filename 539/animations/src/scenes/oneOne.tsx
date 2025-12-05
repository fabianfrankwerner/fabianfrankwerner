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
  code().code.append(`touch style.css`);

  // animate using the signal signature
  yield* code().code.append('\ntouch index.html', 2);
});
