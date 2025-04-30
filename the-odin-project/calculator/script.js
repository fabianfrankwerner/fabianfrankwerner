let firstNumber = "";
let operator = "";
let secondNumber = "";
let shouldResetDisplay = false;

const display = document.querySelector(".calculator-display");
const buttons = document.querySelectorAll(".calculator-button");

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) return "Error";
  return a / b;
}

function operate(operator, a, b) {
  a = Number(a);
  b = Number(b);
  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "×":
      return multiply(a, b);
    case "÷":
      return divide(a, b);
    default:
      return b;
  }
}

function updateDisplay(value) {
  display.textContent = value;
}

function clearCalculator() {
  firstNumber = "";
  operator = "";
  secondNumber = "";
  updateDisplay("0");
}

function handleNumberClick(number) {
  if (shouldResetDisplay) {
    firstNumber = "";
    shouldResetDisplay = false;
  }

  if (operator === "") {
    firstNumber += number;
    updateDisplay(firstNumber);
  } else {
    secondNumber += number;
    updateDisplay(secondNumber);
  }
}

function handleOperatorClick(newOperator) {
  if (firstNumber === "") return;

  if (operator !== "" && secondNumber !== "") {
    const result = operate(operator, firstNumber, secondNumber);
    firstNumber = result.toString();
    secondNumber = "";
    updateDisplay(firstNumber);
  }

  operator = newOperator;
}

function handleEquals() {
  if (firstNumber === "" || operator === "" || secondNumber === "") return;

  const result = operate(operator, firstNumber, secondNumber);
  updateDisplay(result);
  firstNumber = result.toString();
  operator = "";
  secondNumber = "";
  shouldResetDisplay = true;
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    if (value >= "0" && value <= "9") {
      handleNumberClick(value);
    } else if (value === "AC") {
      clearCalculator();
    } else if (value === "=") {
      handleEquals();
    } else if (value === "+/-") {
      if (operator === "") {
        firstNumber = (Number(firstNumber) * -1).toString();
        updateDisplay(firstNumber);
      } else {
        secondNumber = (Number(secondNumber) * -1).toString();
        updateDisplay(secondNumber);
      }
    } else if (value === "%") {
      if (operator === "") {
        firstNumber = (Number(firstNumber) / 100).toString();
        updateDisplay(firstNumber);
      } else {
        secondNumber = (Number(secondNumber) / 100).toString();
        updateDisplay(secondNumber);
      }
    } else {
      handleOperatorClick(value);
    }
  });
});
