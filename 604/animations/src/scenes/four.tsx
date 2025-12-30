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
# Python
def analyze_repo(user, repo):
    if user:
        print(f"Analyzing {repo}...")
    else:
        print("No user provided.")`}
    />
  );

  yield* waitFor(2);

  yield* all(code().selection(lines(2,5), 6));

  yield* code().selection(DEFAULT, 2);

  yield* waitFor(10);

  yield* code().code(
    `\
# Ruby
def analyze_repo(user, repo)
  if user
    puts "Analyzing #{repo}..."
  else
    puts "No user provided."
  end
end`,
    4
  );

  yield* waitFor(2);

  yield* code().selection(code().findAllRanges(/end/gi), 4);

  yield* code().selection(DEFAULT, 2);

  yield* code().code(
    `\
# Python
def greet(name):
    return f"Hello, {name}"`,
    4
  );

  yield* code().code.append(
    `\n\n\
# Ruby
def greet name
  "Hello, #{name}"
end`,
    4
  );

  yield* waitFor(10);
});
