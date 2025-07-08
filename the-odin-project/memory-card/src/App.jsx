// import "./App.css";
import { useState } from "react";

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

      {/* Current Score */}
      <p>Score: {score}</p>

      {/* Best Score */}
      {score > bestScore && setBestScore(score)}
      <p>Best Score: {bestScore}</p>

      {/* Cards */}
    </>
  );
}
