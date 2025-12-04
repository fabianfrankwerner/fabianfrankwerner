const palindromes = function (word) {
  // Remove all non-alphanumeric characters and convert to lowercase
  const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");
  // Reverse the cleaned word
  const revWord = cleanWord.split("").reverse().join("");
  // Compare the cleaned word with its reverse
  return cleanWord === revWord;
};

console.log(palindromes("racecar"));

// Do not edit below this line
module.exports = palindromes;
