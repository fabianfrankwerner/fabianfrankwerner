/*

TODO (Rock beats scissors, scissors beat paper, and paper beats rock.)

[x] getComputerChoice
[x] getHumanChoice
[x] playRound
[x] playGame

*/

const hands = ["rock", "paper", "scissors"];

let computerScore = 0;
let humanScore = 0;

function playRound() {
  let computerChoice = hands[Math.floor(Math.random() * 3)];
  let humanChoice = prompt("Pick your hand.").toLowerCase();

  console.log(`Computer: ${computerChoice} | Human: ${humanChoice}`);

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
    console.log("Draw");
  }

  console.log(`Computer: ${computerScore} | Human: ${humanScore}`);
}

function playGame() {
  while (computerScore !== 5 || humanScore !== 5) {
    if (computerScore === 5 || humanScore === 5) {
      if (computerScore === 5) {
        console.log("Computer wins!");
        break;
      } else {
        console.log("Human wins!");
        break;
      }
    }
    playRound();
  }
}

playGame();
