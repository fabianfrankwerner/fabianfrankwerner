import { makeScene2D, Code, LezerHighlighter, lines } from "@motion-canvas/2d";
import { all, createRef, DEFAULT, waitFor } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const code = createRef<Code>();

  view.add(
    <Code
      ref={code}
      fontSize={81}
      fontFamily={"Geist Mono"}
      code={`\
//hello world`}
    />
  );


  yield* waitFor(4);

//   yield* code().code.append('\n\n~ pip install', 2);
  
//   yield* waitFor(2);

//   yield* code().code.append('\n\n# ---', 2);

//   yield* waitFor(2);

//   yield* code().code.append('\n\n~ python -m venv venv', 2);
//   yield* code().code.append('\n~ source venv/bin/activate', 2);
//   yield* code().code.append('\n\n~ touch requirements.txt', 2);

//   yield* waitFor(2);

//   yield* code().code(
//     `\
// # Python
// requirements.txt`,
//     2
//   );

//   yield* code().code.append('\n\n# Poetry?', 1);
//   yield* code().code.append('\n\n# Pipenv?', 1);
//   yield* code().code.append('\n\n# Conda?', 1);
//   yield* code().code.append('\n\n# Rye?', 1);

//   yield* waitFor(8);

//   // 18

//   yield* code().code(
//     `\
// # Ruby
// source 'https://rubygems.org'
// gem 'sinatra'
// gem 'httparty'`,
//     2
//   );

//   yield* waitFor(4);

//   yield* code().code.append(`\n
// # ---

// ~ bundle install`, 2);

// yield* waitFor(12);
});
