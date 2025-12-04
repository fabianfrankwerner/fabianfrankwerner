const convertToCelsius = function (int) {
  const celsius = (int - 32) * (5 / 9);
  return Number(celsius.toFixed(1));
};

const convertToFahrenheit = function (int) {
  const fahrenheit = (int * 9) / 5 + 32;
  return Number(fahrenheit.toFixed(1));
};

// Do not edit below this line
module.exports = {
  convertToCelsius,
  convertToFahrenheit,
};
