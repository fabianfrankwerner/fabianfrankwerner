import { useState, useEffect } from "react";
import "../styles/cards.css";

function getRandomNumber() {
  return Math.floor(Math.random() * 826) + 1;
}

async function getRandomCharacters(count) {
  const characterCount = Array.from(
    new Set(Array(count).fill().map(getRandomNumber))
  ).join(",");

  const url = `https://rickandmortyapi.com/api/character/${characterCount}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

export default function Cards({ gameScore, setGameScore }) {
  const [characters, setCharacters] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    getRandomCharacters(10).then((data) => {
      if (!data) return;
      if (Array.isArray(data)) {
        setCharacters(data);
      } else if (data.results) {
        setCharacters(data.results);
      } else {
        setCharacters([data]);
      }
    });
  }, []);

  function handleCardClick(id) {
    if (selectedIds.includes(id)) {
      alert("Card already selected. Game over!");
      setGameScore(0);
      setSelectedIds([]);
      // recall use effect
    } else {
      setSelectedIds([...selectedIds, id]);
      setGameScore(gameScore + 1);
      // reorder cards randomly
    }
  }

  return (
    <div className="cards">
      {characters.map((character) => (
        <div
          className="card"
          key={character.id}
          onClick={() => handleCardClick(character.id)}
        >
          <img
            className="card--image"
            src={character.image}
            alt={character.name}
          />
          <p className="card--text">{character.name}</p>
        </div>
      ))}
    </div>
  );
}
