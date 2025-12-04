function fibonacciIteration(n) {
  let array = [];

  for (let i = 0; i < n; i++) {
    if (i < 2) {
      array.push(i);
    } else {
      array.push(array[i - 1] + array[i - 2]);
    }
  }

  return array;
}

console.log(fibonacciIteration(9)); // [0, 1, 1, 2, 3, 5, 8, 13, 21]

function fibonacciRecursion(n) {
  if (n < 2) {
    return [0, 1].slice(0, n + 1);
  }

  const prev = fibonacciRecursion(n - 1);
  return [...prev, prev[prev.length - 1] + prev[prev.length - 2]];
}

console.log(fibonacciRecursion(8)); // [0, 1, 1, 2, 3, 5, 8, 13, 21]
