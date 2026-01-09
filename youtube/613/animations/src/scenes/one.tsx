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
bun create elysia app`}
    />
  );

  yield* waitFor(1);

yield* code().code.append(`\n\n// ---

cd app`, 1);

yield* code().code.append(`\n\n// ---

bun run src/index.ts`, 1);

yield* waitFor(1);

// yield* code().code.append(`\n\n/** @type {import('codehike/mdx').CodeHikeConfig} */
// const chConfig = {
//   components: { code: "Code" },
// }
  
// // ...`, 1);
  
//   yield* waitFor(2);

//   yield* code().code(
//     `\
// MDX`,
//     2
//   );

//   yield* waitFor(2);

//   yield* code().code.append('\n\n# Poetry?', 1);
//   yield* code().code.append('\n\n# Pipenv?', 1);
//   yield* code().code.append('\n\n# Conda?', 1);
//   yield* code().code.append('\n\n# Rye?', 1);

//   yield* waitFor(8);

//   // 18



//   yield* waitFor(4);

//   yield* code().code.append(`\n
// # ---

// ~ bundle install`, 2);

// yield* waitFor(12);
});
