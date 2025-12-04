let humanScore = 0;
let computerScore = 0;

function getComputerChoice() {
  const choices = ["Rock", "Paper", "Scissors"];
  return choices[Math.floor(Math.random() * 3)];
}

function playRound(humanChoice) {
  const computerChoice = getComputerChoice();
  const resultDisplay = document.querySelector(".result-message");
  const humanScoreDisplay = document.querySelector(".human-score");
  const computerScoreDisplay = document.querySelector(".computer-score");

  if (humanChoice === computerChoice) {
    resultDisplay.textContent = `It's a draw! You both chose ${humanChoice}.`;
  } else if (
    (humanChoice === "Paper" && computerChoice === "Rock") ||
    (humanChoice === "Rock" && computerChoice === "Scissors") ||
    (humanChoice === "Scissors" && computerChoice === "Paper")
  ) {
    humanScore++;
    resultDisplay.textContent = `You win this round! ${humanChoice} beats ${computerChoice}.`;
  } else {
    computerScore++;
    resultDisplay.textContent = `You lose this round! ${computerChoice} beats ${humanChoice}.`;
  }

  humanScoreDisplay.textContent = `You: ${humanScore}`;
  computerScoreDisplay.textContent = `Computer: ${computerScore}`;

  if (humanScore === 5 || computerScore === 5) {
    announceWinner();
  }
}

function announceWinner() {
  const resultDisplay = document.querySelector(".result-message");
  if (humanScore === 5) {
    resultDisplay.textContent = "Congratulations. You won the game!";
  } else if (computerScore === 5) {
    resultDisplay.textContent = "You lost the game. Try again!";
  }

  document.querySelector(".rock").disabled = true;
  document.querySelector(".paper").disabled = true;
  document.querySelector(".scissors").disabled = true;
}

document
  .querySelector(".rock")
  .addEventListener("click", () => playRound("Rock"));
document
  .querySelector(".paper")
  .addEventListener("click", () => playRound("Paper"));
document
  .querySelector(".scissors")
  .addEventListener("click", () => playRound("Scissors"));
