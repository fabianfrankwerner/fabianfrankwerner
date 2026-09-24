/**
 * Time-event ("narration cue") registry.
 *
 * Every `waitUntil(label)` in the scenes uses a label from this table. These
 * labels appear as draggable events in the Motion Canvas editor timeline, so a
 * voice-over can be synced to them without touching code.
 *
 * `narration/script.md` mirrors this table with the spoken lines and a
 * suggested on-screen timing for each cue.
 */
export interface Cue {
  label: string;
  moment: string;
}

export const CUES: Cue[] = [
  // Intro
  {label: 'intro.title', moment: 'Title on screen'},
  {label: 'intro.rewind', moment: 'Tease rewind'},
  {label: 'intro.out', moment: 'Cut to Bubble Sort'},

  // Bubble Sort
  {label: 'bubble.title', moment: 'Title + big-O badge in'},
  {label: 'bubble.teach', moment: 'Explanation of the idea'},
  {label: 'bubble.first', moment: 'First pass, slow'},
  {label: 'bubble.speedup', moment: 'Remaining passes accelerate'},
  {label: 'bubble.early', moment: 'Early-exit on a sorted pass'},
  {label: 'bubble.wrap', moment: 'Sorted sweep + O(n²) recap'},

  // Selection Sort
  {label: 'selection.title', moment: 'Title + big-O badge in'},
  {label: 'selection.teach', moment: 'Explanation of the idea'},
  {label: 'selection.first', moment: 'First pass, scanning for minimum'},
  {label: 'selection.swap', moment: 'Swap minimum to the front'},
  {label: 'selection.runs', moment: 'Remaining passes accelerate'},
  {label: 'selection.wrap', moment: 'Sorted sweep + O(n²) recap'},

  // Insertion Sort
  {label: 'insertion.title', moment: 'Title + big-O badge in'},
  {label: 'insertion.teach', moment: 'Cards metaphor'},
  {label: 'insertion.first', moment: 'Pull a card out'},
  {label: 'insertion.shift', moment: 'Shift, shift, insert'},
  {label: 'insertion.runs', moment: 'Remaining elements'},
  {label: 'insertion.wrap', moment: 'Sorted sweep + O(n²) recap'},

  // Merge Sort
  {label: 'merge.title', moment: 'Title + big-O badge in'},
  {label: 'merge.teach', moment: 'Divide and conquer idea'},
  {label: 'merge.split', moment: 'Splitting into lanes'},
  {label: 'merge.run2', moment: 'Merge pairs (size 2)'},
  {label: 'merge.run4', moment: 'Merge runs of 4'},
  {label: 'merge.run8', moment: 'Merge runs of 8'},
  {label: 'merge.wrap', moment: 'Sorted sweep + O(n log n) recap'},

  // Quick Sort
  {label: 'quick.title', moment: 'Title + big-O badge in'},
  {label: 'quick.teach', moment: 'Pivot + partition idea'},
  {label: 'quick.partition', moment: 'First partition, two pointers'},
  {label: 'quick.recurse', moment: 'Recur on the halves'},
  {label: 'quick.finish', moment: 'Partitions all in place'},
  {label: 'quick.wrap', moment: 'Sorted sweep + big-O recap'},

  // Heap Sort
  {label: 'heap.title', moment: 'Title + big-O badge in'},
  {label: 'heap.teach', moment: 'Max-heap idea'},
  {label: 'heap.build', moment: 'Heapify: bubble down'},
  {label: 'heap.extract', moment: 'Swap max to end, shrink heap'},
  {label: 'heap.repeat', moment: 'Repeat extraction'},
  {label: 'heap.wrap', moment: 'Sorted sweep + O(n log n) recap'},

  // Comparison
  {label: 'compare.title', moment: 'Comparison title in'},
  {label: 'compare.chart', moment: 'Growth chart appears'},
  {label: 'compare.table', moment: 'Property table appears'},
  {label: 'compare.guide', moment: 'When to use each'},

  // Outro
  {label: 'outro.title', moment: 'Recap title in'},
  {label: 'outro.lines', moment: 'Takeaway lines in'},
  {label: 'outro.end', moment: 'Thanks + credit'},
];

export function label(id: string): string {
  return id;
}