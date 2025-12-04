import React, { useEffect, useState } from "react";
import { get, post } from "../lib/api";
import GameImage from "../components/GameImage";
import HUD from "../components/HUD";

export default function Play({ levelId }) {
  const [level, setLevel] = useState(null);
  const [session, setSession] = useState(null);
  const [found, setFound] = useState([]);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    async function load() {
      const lv = await get(`/api/levels/${levelId}`);
      setLevel(lv);
      const s = await post("/api/sessions/start", { levelId });
      setSession(s);
    }
    load();
  }, [levelId]);

  async function handleGuess({ characterSlug, x, y }) {
    const res = await post("/api/guess", {
      sessionId: session.id,
      characterSlug,
      x,
      y,
    });
    if (res.correct) {
      setFound((prev) => [...prev, characterSlug]);
      setMarkers((prev) => [...prev, res.marker]);
    } else {
      alert("Incorrect Guess");
    }
  }

  if (!level) return <div>Loading...</div>;
  return (
    <div>
      <HUD characters={level.characters} found={found} />
      <GameImage
        src={level.imageUrl}
        characters={level.characters}
        onGuess={handleGuess}
        markers={markers}
      />
    </div>
  );
}
