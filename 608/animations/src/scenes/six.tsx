import { makeScene2D, Code, LezerHighlighter, lines } from "@motion-canvas/2d";
import { all, createRef, DEFAULT, waitFor } from "@motion-canvas/core";

// 41.5 Seconds (Total)

export default makeScene2D(function* (view) {
  const code = createRef<Code>();

  view.add(
    <Code
      ref={code}
      fontSize={81}
      fontFamily={"Geist Mono"}
      code={`\
# Python
import pandas as pd

def process_commits(commits):
    # Load data into a DataFrame
    df = pd.DataFrame(commits)
    
    # Normalize the nested JSON to get author names
    df['author_name'] = df['commit'].apply(lambda x: x['author']['name'])
    
    # Count commits by author
    top_authors = df['author_name'].value_counts().head(5)
    
    return top_authors.to_dict()`}
    />
  );

  // 20.5 Seconds

  yield* waitFor(4);

  yield* code().selection(code().findAllRanges(/df/gi), 2);

  yield* waitFor(2);

  yield* code().selection(DEFAULT, 2);

  yield* waitFor(10.5);

  // 21 Seconds

    yield* code().code(
      `\
# Ruby
def process_commits(commits)
  commits
    .map { |c| c['commit']['author']['name'] } # Extract names
    .tally                                     # Count occurrences
    .sort_by { |_, count| -count }             # Sort descending
    .take(5)                                   # Get top 5
    .to_h                                      # Convert back to Hash
end`,
      4
    );

    yield* waitFor(4);

    yield* code().selection(lines(3), 1);
    yield* code().selection(lines(4), 1);
    yield* code().selection(lines(5), 1);
    yield* code().selection(lines(6), 1);
    yield* code().selection(lines(7), 1);

    yield* code().selection(DEFAULT, 2);

    yield* waitFor(6);
});
