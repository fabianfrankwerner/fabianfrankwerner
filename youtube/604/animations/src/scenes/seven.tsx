import { makeScene2D, Code, LezerHighlighter, lines } from "@motion-canvas/2d";
import { all, createRef, DEFAULT, waitFor } from "@motion-canvas/core";

// 51 Seconds (Total)

export default makeScene2D(function* (view) {
  const code = createRef<Code>();

  view.add(
    <Code
      ref={code}
      fontSize={81}
      fontFamily={"Geist Mono"}
      code={`\
# Python
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/analyze/<user>/<repo>')
def analyze(user, repo):
    data = get_commits(user, repo)
    return jsonify(data)`}
    />
  );

  // 13.5 Seconds

  yield* waitFor(2);

  yield* code().selection(code().findAllRanges(/Flask/gi), 2);

  yield* code().selection(lines(5), 4);

  yield* code().selection(DEFAULT, 2);

  yield* waitFor(3.5);

  // 38 Seconds

  yield* code().code(
    `\
# Ruby
require 'sinatra'
require 'json'

get '/analyze/:user/:repo' do
  content_type :json
  data = get_commits(params[:user], params[:repo])
  data.to_json
end`,
    4
  );

  yield* waitFor(2);

  yield* code().selection(code().findFirstRange(/sinatra/gi), 2);

  yield* code().selection(DEFAULT, 2);

  yield* code().selection(lines(4), 8);

  yield* waitFor(10);

  // 28 / 38

  yield* code().selection(code().findFirstRange(/get/gi), 4);

  yield* code().selection(DEFAULT, 2);

  yield* waitFor(6);
});
