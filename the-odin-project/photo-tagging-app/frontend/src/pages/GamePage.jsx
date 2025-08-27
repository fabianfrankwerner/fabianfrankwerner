import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet, apiPost } from "../lib/api";
import HUD from "../components/HUD";
import GameImage from "../components/GameImage";
import FinishModal from "../components/FinishModal";

export default function GamePage() {
  const { levelId } = useParams();
  const [level, setLevel] = useState(null);
  const [session, setSession] = useState(null);
  const [found, setFound] = useState([]); // array of character slugs
  const [markers, setMarkers] = useState([]);
  const [finished, setFinished] = useState(false);

  // load level and start session
  useEffect(() => {
    (async () => {
      try {
        const lvl = await apiGet(`/api/levels/${levelId}`);
        setLevel(lvl);
        const sess = await apiPost("/api/sessions/start", { levelId });
        setSession(sess);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [levelId]);

  // when found all characters, open finish modal
  useEffect(() => {
    if (
      level &&
      found.length === level.characters.length &&
      level.characters.length > 0
    ) {
      setFinished(true);
    }
  }, [found, level]);

  async function handleGuess({ characterSlug, x, y }) {
    if (!session) return;
    try {
      const res = await apiPost("/api/guess", {
        sessionId: session.id,
        characterSlug,
        x,
        y,
      });
      if (res.correct) {
        setFound((p) =>
          p.includes(characterSlug) ? p : [...p, characterSlug]
        );
        setMarkers((p) => [...p, res.marker]);
      } else {
        // show a simple alert for now
        alert(res.message || "Incorrect. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting guess");
    }
  }

  if (!level || !session) return <div>Loading...</div>;

  return (
    <div className="game-wrap">
      <div className="game-column">
        <GameImage
          src={level.imageUrl}
          characters={level.characters}
          onGuess={handleGuess}
          markers={markers}
        />
      </div>

      <div className="sidebar">
        <HUD
          session={session}
          characters={level.characters}
          foundCharacters={found}
        />
        <div
          style={{
            marginTop: 12,
            background: "#fff",
            padding: 10,
            borderRadius: 6,
          }}
        >
          <h4>Characters</h4>
          <ul>
            {level.characters.map((c) => (
              <li
                key={c.slug}
                style={{
                  textDecoration: found.includes(c.slug)
                    ? "line-through"
                    : "none",
                }}
              >
                {c.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {finished && <FinishModal sessionId={session.id} levelId={level.id} />}
    </div>
  );
}
