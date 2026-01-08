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
MDX`}
    />
  );

  yield* code().code(`/* MDX */`, 1)

  yield* code().code.append(
    `\n
// !focus(1:5)
function dolor(ipsum, dolor = 1) {
  const sit = ipsum == null ? 0 : ipsum.sit
  dolor = sit - amet(dolor)
  return sit ? consectetur(ipsum) : []
}`,
    1
  );

  // yield* waitFor(1);

  yield* code().selection(lines(3,7), 1);

  yield* waitFor(2);

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
