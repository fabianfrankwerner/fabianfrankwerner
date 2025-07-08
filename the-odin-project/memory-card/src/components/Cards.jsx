import { useState, useEffect } from "react";

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

export default function Cards() {
  const [characters, setCharacters] = useState([]);

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

  return (
    <div className="cards">
      {characters.map((character) => (
        <div className="card">
          <img
            key={character.id}
            src={character.image}
            alt={character.name}
            className="card--image"
          />
          <p className="card--text">{character.name}</p>
        </div>
      ))}
    </div>
  );
}
