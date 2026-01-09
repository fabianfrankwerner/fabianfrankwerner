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

yield* code().code.append(`\n

cd app`, 1);

yield* code().code.append(`\n

bun run src/index.ts`, 1);

yield* waitFor(1);

yield* code().code(
    `\
// index.ts`,
    1
  );

yield* code().code.append(`\n\nimport { Elysia } from "elysia"`, 1)

yield* code().code.append(`\n\nconst app = new Elysia()`, 1)

// yield* waitFor(1);

yield* code().code.append(`
  .get("/", "Hello Elysia")
`, 1)

yield* code().code.append(`  .get("/user/:id", ({ params: { id } }) => id)
`, 1)

yield* code().code.append(`  .post("/form", ({ body }) => body)
`, 1)

yield* code().code.append(`  .listen(3000);
`, 1)

yield* code().selection(code().findAllRanges(/.get/gi), 1);

yield* code().selection(DEFAULT, 1);
});
