import { makeScene2D, Code, LezerHighlighter, lines } from "@motion-canvas/2d";
import { all, createRef, DEFAULT, waitFor } from "@motion-canvas/core";

// 40 Seconds (Total)

export default makeScene2D(function* (view) {
  const code = createRef<Code>();

  view.add(
    <Code
      ref={code}
      fontSize={81}
      fontFamily={"Geist Mono"}
      code={`\
# Python
import requests

def get_commits(user, repo):
    url = f"https://api.github.com/repos/{user}/{repo}/commits"
    response = requests.get(url)
    return response.json()`}
    />
  );

  // 15 Seconds

  yield* waitFor(4);

  yield* code().selection(code().findFirstRange(/import requests/gi), 2);

  yield* waitFor(6);

  yield* code().selection(DEFAULT, 2);

  yield* waitFor(1.5);

  // 25 Seconds

    yield* code().code(
      `\
# Ruby
require 'httparty'

class GithubFetcher
  include HTTParty
  base_uri 'https://api.github.com'

  def self.get_commits(user, repo)
    get("/repos/#{user}/#{repo}/commits")
  end
end`,
      4
    );

    yield* waitFor(2);

    yield* code().selection(code().findAllRanges(/include HTTParty/gi), 2);

    yield* waitFor(6);

    yield* code().selection(DEFAULT, 2);

    yield* waitFor(10);

    // 16 / 25

  //   yield* code().selection(DEFAULT, 2);

  //   yield* code().code(
  //     `\
  // # Python
  // def greet(name):
  //     return f"Hello, {name}"`,
  //     4
  //   );

  //   yield* code().code.append(
  //     `\n\n\
  // # Ruby
  // def greet name
  //   "Hello, #{name}"
  // end`,
  //     4
  //   );

  //   yield* waitFor(10);
});
