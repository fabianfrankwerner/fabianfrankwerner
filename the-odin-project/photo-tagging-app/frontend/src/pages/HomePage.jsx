import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../lib/api";

export default function HomePage() {
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet("/api/levels");
        setLevels(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div>
      <h1>Choose a Level</h1>
      <div>
        {levels.map((lvl) => (
          <div key={lvl.id} className="level-card">
            <div>
              <div className="level-title">{lvl.title}</div>
              <div style={{ fontSize: 13, color: "#666" }}>
                {lvl.description || ""}
              </div>
            </div>
            <div>
              <Link to={`/game/${lvl.id}`} className="navlink">
                Play
              </Link>
              <Link
                to={`/leaderboard/${lvl.id}`}
                style={{ marginLeft: 10 }}
                className="navlink"
              >
                Leaderboard
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
