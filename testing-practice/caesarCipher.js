function caesarCipher(str, shift) {
  return str
    .split("")
    .map((char) => {
      if (char >= "a" && char <= "z") {
        let code = ((((char.charCodeAt(0) - 97 + shift) % 26) + 26) % 26) + 97;
        return String.fromCharCode(code);
      } else if (char >= "A" && char <= "Z") {
        let code = ((((char.charCodeAt(0) - 65 + shift) % 26) + 26) % 26) + 65;
        return String.fromCharCode(code);
      } else {
        return char;
      }
    })
    .join("");
}

module.exports = caesarCipher;
