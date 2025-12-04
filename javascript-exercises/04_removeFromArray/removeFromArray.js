const removeFromArray = function (array, ...remove) {
  array = array.flat();
  remove = remove.flat();

  return array.filter((item) => !remove.includes(item));
};

console.log(removeFromArray([1, 2, 3, 4], 3));

// Do not edit below this line
module.exports = removeFromArray;
