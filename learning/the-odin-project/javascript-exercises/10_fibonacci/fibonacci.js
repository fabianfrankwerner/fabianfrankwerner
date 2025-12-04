const fibonacci = function (n) {
  const number = parseInt(n);

  // Handle invalid inputs
  if (number < 0) return "OOPS";
  if (number === 0) return 0;

  let a = 1;
  let b = 1;

  // For numbers 1 and 2, return 1
  if (number <= 2) return 1;

  // Calculate Fibonacci number
  for (let i = 3; i <= number; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }

  return b;
};

// Do not edit below this line
module.exports = fibonacci;
