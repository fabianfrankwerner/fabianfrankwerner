import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiGet } from "../lib/api";

export default function Leaderboard() {
  const { levelId } = useParams();
  const [scores, setScores] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet(`/api/leaderboard/${levelId}`);
        setScores(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [levelId]);

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <ol>
        {scores.map((s, i) => (
          <li
            key={s.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <div>
              {i + 1}. {s.playerName || "Anonymous"}
            </div>
            <div>{Math.round((s.durationMs || 0) / 1000)}s</div>
          </li>
        ))}
      </ol>
      <div style={{ marginTop: 12 }}>
        <Link to={`/game/${levelId}`}>Play again</Link>
      </div>
    </div>
  );
}
