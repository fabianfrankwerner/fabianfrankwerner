const add = function (x, y) {
  return x + y;
};

const subtract = function (x, y) {
  return x - y;
};

const sum = function (arr) {
  if (arr.length < 1) {
    return 0;
  } else {
    return arr.reduce((total, num) => total + num);
  }
};

const multiply = function (arr) {
  return arr.reduce((total, num) => total * num);
};

const power = function (x, y) {
  return Math.pow(x, y);
};

const factorial = function (n) {
  let res = 1;
  for (let i = 1; i <= n; i++) {
    res *= i;
  }
  return res;
};

// Do not edit below this line
module.exports = {
  add,
  subtract,
  sum,
  multiply,
  power,
  factorial,
};
