function all(array, callback) {
  let result = true;
  for (let i = 0; i < array.length; i++) {
    result = callback(array[i]);
  }
  return result;
}

console.log(
  all([1, 2, 9], function (num) {
    return num < 7;
  })
);
