const reverseString = function (str) {
  result = str.split("").reverse().join("");
  //   let result = "";
  //   for (let i = formatStr.length; i >= 0; i--) {
  //     result += formatStr;
  //   }
  return result;
};
console.log(reverseString("hello there"));

// Do not edit below this line
module.exports = reverseString;
