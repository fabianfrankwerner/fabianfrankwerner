# Sorting Algorithms — animated explainer

A [Canvas Commons](https://github.com/compositor-experiments/canvas-commons)
(formerly Motion Canvas) project that teaches six sorting algorithms with
animated bar charts, live comparison/swap counters, Big-O callouts, and a
narration script synced through time events.

Algorithms covered:

| Scene        | Algorithm               | Big O (average)   |
| ------------ | ----------------------- | ----------------- |
| `bubble`     | Bubble Sort             | O(n²)             |
| `selection`  | Selection Sort          | O(n²)             |
| `insertion`  | Insertion Sort          | O(n²)             |
| `merge`      | Merge Sort              | O(n log n)        |
| `quick`      | Quick Sort              | O(n log n)        |
| `heap`       | Heap Sort               | O(n log n)        |
| `comparison` | n² vs n log n + table   | —                 |
| `outro`      | Recap                   | —                 |

## Getting started

```bash
npm install
npm start            # open the editor at the printed URL (usually :9000)
```

## Recording the voice-over

1. Run the video inside the editor (press Space).
2. The events in the timeline are the `waitUntil()` labels. While you speak,
   drag their dots to match your voice.
3. Nothing in the scenes changes — cues and animation are decoupled.

The narration lines and suggested timings live in
[`narration/script.md`](narration/script.md). The authoritative list of labels
is `CUES` in [`src/lib/timings.ts`](src/lib/timings.ts).

## Rendering (FFmpeg exporter)

This project renders through the **FFmpeg exporter** (the WebCodecs exporter is
not yet published on npm — `latest` is the `0.0.0` placeholder).

1. After recording cues, hit the **Render** button in the editor toolbar.
2. Choose the **FFmpeg** exporter.
3. Pick any `ffmpeg` binary on your machine (e.g. `brew install ffmpeg`).

The FFmpeg plugin is registered in [`vite.config.ts`](vite.config.ts).

## Project layout

```
src/
  scenes/            one file per scene (each ends in ?scene import in project.ts)
  components/hud.tsx HUD: Counter, Big-O badge, Hud, Pointer, PassLine
  lib/visualization.tsx   BarChart engine (swap, shift-into-place, fly, merge lane…)
  lib/algorithms.ts  per-algorithm metadata (Big-O, stability…)
  lib/timings.ts     time-event ("cue") registry
  lib/theme.ts       palette & fonts
  lib/random.ts      deterministic permutations (same seed ⇒ same array)
  project.ts         the full scene list
narration/script.md  narration sync guide
```

Every bar chart is generated from a deterministic permutation, so the visuals
are identical frame-for-frame between preview and export.

## Commands

| Command               | What it does                          |
| --------------------- | ------------------------------------- |
| `npm start` / `serve` | Run the editor                        |
| `npm run typecheck`   | Typecheck without emitting            |
| `npm run build`       | Typecheck + bundle (for deployment)   |