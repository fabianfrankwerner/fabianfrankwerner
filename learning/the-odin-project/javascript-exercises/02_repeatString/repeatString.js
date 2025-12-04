const repeatString = function (string, num) {
  result = "";
  if (num < 0) {
    result = "ERROR";
    return result;
  }
  for (let index = 0; index < num; index++) {
    result += string;
  }
  return result;
};

// Do not edit below this line
module.exports = repeatString;
