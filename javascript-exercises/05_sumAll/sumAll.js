// sumAll(1, 4) returns the sum of 1 + 2 + 3 + 4 which is 10

const sumAll = function (first, last) {
  let numbers = [];

  if (!Number.isInteger(first) || !Number.isInteger(last)) {
    return "ERROR";
  } else if (first < 0 || last < 0) {
    return "ERROR";
  }

  if (first > last) {
    let checkpoint = first;
    first = last;
    last = checkpoint;
  }

  for (let i = first; i <= last; i++) {
    numbers.push(i);
  }

  let total = 0;

  for (let i = 0; i < numbers.length; i++) {
    total += numbers[i];
  }

  return total;
};

console.log(sumAll(1, 4));

// Do not edit below this line
module.exports = sumAll;
