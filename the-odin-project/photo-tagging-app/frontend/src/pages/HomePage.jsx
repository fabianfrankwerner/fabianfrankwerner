import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    async function fetchLevels() {
      const res = await fetch("/api/levels", { credentials: "include" });
      const data = await res.json();
      setLevels(data);
    }
    fetchLevels();
  }, []);

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Choose a Level</h1>
      <ul className="space-y-2">
        {levels.map((lvl) => (
          <li key={lvl.id} className="border p-3 rounded bg-white shadow">
            <Link
              to={`/game/${lvl.id}`}
              className="text-blue-600 font-semibold"
            >
              {lvl.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
