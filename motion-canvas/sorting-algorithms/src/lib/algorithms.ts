import {THEME} from './theme';

export interface AlgorithmMeta {
  id: string;
  name: string;
  bigO: string;
  complexityN: string;
  complexityRead: string;
  best: string;
  worst: string;
  space: string;
  stable: boolean;
  inPlace: boolean;
  technique: string;
  tagline: string;
  accent: string;
}

export const ALGORITHMS: AlgorithmMeta[] = [
  {
    id: 'bubble',
    name: 'Bubble Sort',
    bigO: 'O(n²)',
    complexityN: 'O(n²)',
    complexityRead: 'O of n squared',
    best: 'O(n)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: true,
    inPlace: true,
    technique: 'Compare and swap neighbours',
    tagline: 'Big bubbles float to the top.',
    accent: THEME.compare,
  },
  {
    id: 'selection',
    name: 'Selection Sort',
    bigO: 'O(n²)',
    complexityN: 'O(n²)',
    complexityRead: 'O of n squared',
    best: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: false,
    inPlace: true,
    technique: 'Pick the smallest, put it in place',
    tagline: 'Always scans, rarely swaps.',
    accent: THEME.pivot,
  },
  {
    id: 'insertion',
    name: 'Insertion Sort',
    bigO: 'O(n²)',
    complexityN: 'O(n²)',
    complexityRead: 'O of n squared',
    best: 'O(n)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: true,
    inPlace: true,
    technique: 'Insert each card back into order',
    tagline: 'Like sorting a hand of cards.',
    accent: THEME.active,
  },
  {
    id: 'merge',
    name: 'Merge Sort',
    bigO: 'O(n log n)',
    complexityN: 'O(n log n)',
    complexityRead: 'O of n log n',
    best: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)',
    stable: true,
    inPlace: false,
    technique: 'Divide, conquer, merge',
    tagline: 'Sorting by splitting and rejoining.',
    accent: THEME.accent,
  },
  {
    id: 'quick',
    name: 'Quick Sort',
    bigO: 'O(n log n)',
    complexityN: 'O(n log n)',
    complexityRead: 'O of n log n',
    best: 'O(n log n)',
    worst: 'O(n²)',
    space: 'O(log n)',
    stable: false,
    inPlace: true,
    technique: 'Partition around a pivot',
    tagline: 'The famous pivot-and-partition.',
    accent: THEME.pivotActive,
  },
  {
    id: 'heap',
    name: 'Heap Sort',
    bigO: 'O(n log n)',
    complexityN: 'O(n log n)',
    complexityRead: 'O of n log n',
    best: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(1)',
    stable: false,
    inPlace: true,
    technique: 'Build a heap, pop the max',
    tagline: 'Sorting through a max-heap.',
    accent: THEME.heap,
  },
];

export const ALGORITHM_MAP: Record<string, AlgorithmMeta> = Object.fromEntries(
  ALGORITHMS.map(a => [a.id, a]),
);