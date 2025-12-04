import "./App.css";
import { useState } from "react";
import Cards from "./components/Cards";

export default function App() {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  return (
    <>
      <h1>Rick & Morty Memory</h1>
      <h2>
        Get points by clicking on an image but don't click on any more than
        once!
      </h2>

      {score > bestScore && setBestScore(score)}
      <h3>
        Score: {score} | Best Score: {bestScore}
      </h3>

      <Cards gameScore={score} setGameScore={setScore} />
    </>
  );
}
