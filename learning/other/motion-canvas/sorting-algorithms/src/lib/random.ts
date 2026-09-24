import {useRandom} from '@canvas-commons/core';

/** A shuffled permutation of 1..n, deterministic per `seed`. */
export function perm(n: number, seed: number): number[] {
  const random = useRandom(seed, true);
  const arr = Array.from({length: n}, (_, i) => i + 1);
  for (let i = n - 1; i > 0; i--) {
    const j = random.nextInt(0, i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** A "mostly sorted" list: shuffled, then small runs sorted in place. */
export function partiallySorted(n: number, seed: number): number[] {
  const arr = perm(n, seed);
  const run = Math.max(2, Math.ceil(n / 5));
  for (let i = 0; i < n; i += run) {
    const slice = arr.slice(i, i + run);
    slice.sort((a, b) => a - b);
    arr.splice(i, slice.length, ...slice);
  }
  return arr;
}