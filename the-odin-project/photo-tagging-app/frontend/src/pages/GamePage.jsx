import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HUD from "../components/HUD";
import FinishModal from "../components/FinishModal";

export default function GamePage() {
  const { levelId } = useParams();
  const [session, setSession] = useState(null);
  const [level, setLevel] = useState(null);
  const [foundCharacters, setFoundCharacters] = useState([]);
  const [finished, setFinished] = useState(false);

  // Load level + start session
  useEffect(() => {
    async function init() {
      // Fetch level info
      const resLevel = await fetch(`/api/levels/${levelId}`, {
        credentials: "include",
      });
      const lvl = await resLevel.json();
      setLevel(lvl);

      // Start a session
      const resSession = await fetch("/api/sessions/start", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ levelId }),
      });
      const sess = await resSession.json();
      setSession(sess);
    }
    init();
  }, [levelId]);

  useEffect(() => {
    if (level && foundCharacters.length === level.characters.length) {
      setFinished(true);
    }
  }, [foundCharacters, level]);

  if (!level || !session) return <p>Loading...</p>;

  return (
    <div>
      <HUD
        session={session}
        characters={level.characters}
        foundCharacters={foundCharacters}
      />

      {/* Replace this with your actual tagging image logic */}
      <div className="mt-20 text-center">
        <h2 className="text-xl font-bold mb-4">{level.name}</h2>
        <p>Game UI goes here (click on characters in the picture)</p>
        <button
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => {
            // fake: mark next character as found
            const next = level.characters.find(
              (c) => !foundCharacters.includes(c.name)
            );
            if (next) {
              setFoundCharacters([...foundCharacters, next.name]);
            }
          }}
        >
          Mark Next Character Found
        </button>
      </div>

      {finished && <FinishModal sessionId={session.id} levelId={level.id} />}
    </div>
  );
}
