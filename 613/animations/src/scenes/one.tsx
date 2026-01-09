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

yield* code().code.replace(lines(7), `  .post("/form", ({ body }) => body) // {"hello": "Elysia"}\n`, 1);

yield* waitFor(4);

yield* code().code(
  `\
// index.ts
  
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/user/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Number()
        })
    })
    .listen(3000)`,
  2
);

yield* waitFor(14);

yield* code().code(
  `\
// client.ts

import { treaty } from '@elysiajs/eden'
import type { App } from './server'

const app = treaty<App>('localhost:3000')

const { data } = await app.user({ id: 617 }).get()

console.log(data)`,
  2
);

yield* waitFor(10);

yield* code().code(
  `\
bun run dev`,
  2
);

yield* waitFor(4);
});
