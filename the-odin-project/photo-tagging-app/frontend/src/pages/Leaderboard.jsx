import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Leaderboard() {
  const { levelId } = useParams();
  const [scores, setScores] = useState([]);

  useEffect(() => {
    async function fetchScores() {
      const res = await fetch(`/api/leaderboard/${levelId}`, {
        credentials: "include",
      });
      const data = await res.json();
      setScores(data);
    }
    fetchScores();
  }, [levelId]);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Leaderboard 🏆</h1>
      <ol className="space-y-2">
        {scores.map((s, idx) => (
          <li key={s.id} className="flex justify-between border-b pb-1 text-sm">
            <span>
              {idx + 1}. {s.playerName}
            </span>
            <span>{Math.floor(s.duration / 1000)}s</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
