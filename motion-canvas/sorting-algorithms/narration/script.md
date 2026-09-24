# Sorting Algorithms — Narration Script

Every `waitUntil(label)` in the scenes shows up as a draggable event in the
editor timeline. Workflow: open the editor, run the video at normal speed, and
while you speak drag the dots to line up with your voice. Nothing in the code
needs to change to re-time the video — the cue events are independent of the
animations.

Legend for the moment column:

- `in`   — fade elements onto screen
- `teach`— the idea is being stated slowly
- `run`  — algorithm runs by itself
- `wrap` — immediate Big-O recap at the end of a scene

---

## Scene 0 — Intro (`intro.tsx`)

| Cue           | On screen                                   | Narration (speak line)                          |
| ------------- | ------------------------------------------- | ----------------------------------------------- |
| `intro.title` | Title "SORTING ALGORITHMS" fades in         | "Sorting. Six classic algorithms. And the Big O behind them." |
| `intro.rewind`| Teaser chart + bars rise, near-sorted data  | "Here's a nearly sorted array. Watch it sort itself… then we'll ask why some are fast and some are slow." |
| `intro.out`   | Teaser self-sorts + green sweep             | "Let's begin with the simple ones — and the Big O way of thinking about them." |

---

## Scene 1 — Bubble Sort (`bubbleSort.tsx`) — O(n²)

| Cue             | On screen                       | Narration                                         |
| --------------- | --------------------------------- | ------------------------------------------------- |
| `bubble.title`  | Title + O(n²) badge              | "Bubble Sort. The one everyone writes first."     |
| `bubble.teach`  | Compare two neighbours           | "Compare neighbouring bars. If the left is bigger, swap them. Big ones bubble to the right." |
| `bubble.first`  | First pass, slow (0.5s/swap)     | "Watch the first pass slowly."                    |
| `bubble.speedup`| Passes accelerate (0.14s/swap)   | "Now the same idea, faster."                      |
| `bubble.early`  | Early-exit when a pass is clean  | "Notice something? A pass with zero swaps means it's sorted. We can stop early." |
| `bubble.wrap`   | Green sorted sweep               | "That's why Bubble's average is O of n squared."  |

---

## Scene 2 — Selection Sort (`selectionSort.tsx`) — O(n²)

| Cue              | On screen                          | Narration                                        |
| ---------------- | ---------------------------------- | ------------------------------------------------ |
| `selection.title`| Title + O(n²) badge                | "Selection Sort. Find the minimum, put it in place." |
| `selection.teach`| min + scan pointers                | "Scan from here to the end for the smallest bar. Then swap it to the front." |
| `selection.first`| First pass, scanning               | "First pass — scan… and we found the 1. Swap it in." |
| `selection.swap` | Swap minimum to front              | "One swap fixes the first position for good."    |
| `selection.runs` | Remaining passes accelerate        | "Every pass scans everything again: that's the n squared." |
| `selection.wrap` | Green sorted sweep                 | "Selection always scans the whole tail — even when sorted. O(n²) every time." |

---

## Scene 3 — Insertion Sort (`insertionSort.tsx`) — O(n²)

| Cue              | On screen                          | Narration                                        |
| ---------------- | ---------------------------------- | ------------------------------------------------ |
| `insertion.title`| Title + O(n²) badge                | "Insertion Sort — like sorting a hand of cards." |
| `insertion.teach`| Cards metaphor                     | "Pick up the next card, shift bigger ones right, drop it in." |
| `insertion.first`| First pull                         | "Pull out the 4… compare with 7, shift, insert." |
| `insertion.shift`| Shift + insert                     | "The 7 slides over and the 4 slots in. One write." |
| `insertion.runs` | Mid-array                          | "Real people sort this way. And on nearly-sorted data it's nearly O(n)." |
| `insertion.wrap` | Green sorted sweep                 | "But on random input it's still O(n²)."          |

---

## Scene 4 — Merge Sort (`mergeSort.tsx`) — O(n log n)

| Cue          | On screen                | Narration                                        |
| ------------ | ------------------------ | ------------------------------------------------ |
| `merge.title`| Title + O(log-n) badge   | "Merge Sort — divide and conquer."               |
| `merge.teach`| Two-run idea             | "Split the array into tiny runs, sort each run, merge them back up in order." |
| `merge.split`| Runs of 1 staged         | "Runs of one are already sorted. Merge pairs:"  |
| `merge.run2` | Merging size 2 runs      | "Two sorted bars pick the smaller front, always." |
| `merge.run4` | Runs of 4                | "Now runs of four. Same trick, bigger runs."     |
| `merge.run8` | Runs of 8                | "Runs of eight. Only log n levels deep — that's where the log n comes from." |
| `merge.wrap` | Green sorted sweep       | "O(n log n). The price: the buffer lane means O(n) extra memory." |

---

## Scene 5 — Quick Sort (`quickSort.tsx`) — O(n log n)

| Cue             | On screen                  | Narration                                        |
| --------------- | -------------------------- | ------------------------------------------------ |
| `quick.title`   | Title + O(log-n) badge     | "Quick Sort — the workhorse."                    |
| `quick.teach`   | Pivot + pointers           | "Pick a pivot. Send everything smaller to the left, larger to the right." |
| `quick.partition` | First partition, two pointers | "Two pointers: scan… any bar smaller than the pivot jumps to the boundary." |
| `quick.recurse` | Recurse on the halves      | "The pivot is in its final home. Now sort each half the same way." |
| `quick.finish`  | Partitions all in place    | "Every pivot lands in place — recursion does the rest." |
| `quick.wrap`    | Green sorted sweep         | "Average O(n log n)… but a bad pivot choice can cost O(n²)." |

---

## Scene 6 — Heap Sort (`heapSort.tsx`) — O(n log n)

| Cue         | On screen               | Narration                                        |
| ----------- | ----------------------- | ------------------------------------------------ |
| `heap.title`| Title + O(log-n) badge  | "Heap Sort — sort through a max-heap. O(n log n) with no extra memory." |
| `heap.teach`| Max-heap idea           | "A max-heap keeps its biggest element on top. The root is always the maximum." |
| `heap.build` | Heapify: bubble down    | "Build the heap by sifting each node down so the biggest rises." |
| `heap.extract` | Swap max to end, shrink heap | "Swap the root (the max) to the end, shrink the heap, sift down again." |
| `heap.repeat`| Repeat extraction        | "Same step, over and over. Each pass rescues the next biggest." |
| `heap.wrap`  | Green sorted sweep       | "Guaranteed O(n log n), and it sorts in place."  |

---

## Scene 7 — Comparison (`comparison.tsx`) — n² vs n log n

| Cue            | On screen             | Narration                                        |
| -------------- | --------------------- | ------------------------------------------------ |
| `compare.title`| Title in              | "Same data, two growth curves. The gap gets absurd fast." |
| `compare.chart`| Growth chart + table  | "Quadratic vs n-log-n on a shared scale. By thirty items, n² does over twenty times the work." |
| `compare.table`| Property table        | "Here's the cheat sheet: average, worst, space, stability, in-place." |
| `compare.guide`| Takeaway lines        | "Nearly sorted? Insertion. Big data? Merge, Quick or Heap. Stable merge needed? Merge. Tiny memory? Heap." |

---

## Scene 8 — Outro (`outro.tsx`)

| Cue          | On screen             | Narration                                        |
| ------------ | --------------------- | ------------------------------------------------ |
| `outro.title`| Card + title in       | "That's all six: that's what sorting is made of." |
| `outro.lines`| Recap lines in        | "n squared: Bubble, Selection, Insertion. n log n: Merge, Quick, Heap." |
| `outro.end`  | Thanks fade in        | "Thanks for watching — go sort something!"       |

---

## Big-O quick reference

| Notation     | Meaning                       | Algorithms here                     |
| ------------ | ----------------------------- | ----------------------------------- |
| `O(1)`       | constant time                 | swap, compare (per step)            |
| `O(n)`       | one pass over the data        | passing through the array once      |
| `O(n²)`      | a pass for every element      | Bubble, Selection, Insertion (avg)  |
| `O(n log n)` | log depth × one pass each     | Merge, Quick (avg), Heap            |

In plain words: `O(n²)` means doubling the input **quadruples** the work;
`O(n log n)` means doubling the input just adds one more "layer" of work.
That difference is exactly the curve you see in the comparison scene.