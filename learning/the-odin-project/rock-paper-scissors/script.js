const rock = document.querySelector("#rock");
const paper = document.querySelector("#paper");
const scissors = document.querySelector("#scissors");

const game = document.querySelector("#game");
const elements = game.querySelectorAll(
  "input, button, select, textarea, fieldset"
);

const score = document.querySelector("#score");
const result = document.querySelector("#result");
const results = document.querySelector("#results");

rock.addEventListener("click", () => playRound("rock"));
paper.addEventListener("click", () => playRound("paper"));
scissors.addEventListener("click", () => playRound("scissors"));

const hands = ["rock", "paper", "scissors"];

let computerScore = 0;
let humanScore = 0;

function playRound(humanChoice) {
  let computerChoice = hands[Math.floor(Math.random() * 3)];
  results.textContent = `Computer: ${computerChoice} | Human: ${humanChoice}`;

  if (computerChoice === "rock" && humanChoice === "paper") {
    humanScore++;
  } else if (computerChoice === "rock" && humanChoice === "scissors") {
    computerScore++;
  } else if (computerChoice === "paper" && humanChoice === "rock") {
    computerScore++;
  } else if (computerChoice === "paper" && humanChoice === "scissors") {
    humanScore++;
  } else if (computerChoice === "scissors" && humanChoice === "rock") {
    humanScore++;
  } else if (computerChoice === "scissors" && humanChoice === "paper") {
    computerScore++;
  } else {
    results.textContent = "Draw";
  }

  score.textContent = `Computer: ${computerScore} | Human: ${humanScore}`;

  if (computerScore === 5 || humanScore === 5) {
    if (computerScore === 5) {
      result.textContent = "Computer wins!";
    } else {
      result.textContent = "Human wins!";
    }
    elements.forEach((element) => {
      element.disabled = true;
    });
    computerScore = 0;
    humanScore = 0;
    score.textContent = "";
    results.textContent = "";
  }
}
