function sumRange(num) {
  return num === 1 ? 1 : num + sumRange(num - 1);
}
console.log(sumRange(3));
