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
      console.log("SENDING GUESS:", {
        sessionId: session.id,
        characterSlug,
        x,
        y,
      });
      // include debug=1 temporarily to get target bounds back
      const res = await apiPost(`/api/guess?debug=1`, {
        sessionId: session.id,
        characterSlug,
        x,
        y,
      });
      console.log("GUESS RESPONSE:", res);

      if (res.debug) {
        // helpful for debugging — read these values and compare to click location
        console.log("DEBUG target bounds (normalized):", res.debug.target);
        console.log("TOLERANCE:", res.debug.tol);
        console.log("CHECKED BOUNDS:", res.debug.checkedBounds);
      }

      if (res.correct) {
        setFound((p) =>
          p.includes(characterSlug) ? p : [...p, characterSlug]
        );
        setMarkers((p) => [...p, res.marker]);
      } else {
        alert(res.message || "Incorrect — try again.");
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
