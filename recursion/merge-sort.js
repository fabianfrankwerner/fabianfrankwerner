function mergeSort(arr) {
  // Base case: arrays with 0 or 1 element are already sorted
  if (arr.length <= 1) return arr;

  // Divide: split array into two halves
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  // Conquer: recursively sort both halves and merge
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  const result = [];
  let i = 0,
    j = 0;

  // Merge sorted arrays by comparing elements
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  // Add remaining elements
  return result.concat(left.slice(i), right.slice(j));
}

// Example usage:
const unsorted = [64, 34, 25, 12, 22, 11];
const sorted = mergeSort(unsorted);
console.log("Original:", unsorted);
console.log("Sorted:", sorted);
