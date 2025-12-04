import { useEffect, useState } from "react";

export default function HUD({
  session,
  characters = [],
  foundCharacters = [],
}) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!session?.startedAt) return;
    const start = new Date(session.startedAt).getTime();
    const t = setInterval(() => {
      setSeconds(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(t);
  }, [session]);

  const remaining = characters
    .filter((c) => !foundCharacters.includes(c.slug))
    .map((c) => c.name);

  return (
    <div className="hud">
      <div className="remaining">
        <strong>Find:</strong>{" "}
        {remaining.length ? remaining.join(", ") : "All found!"}
      </div>
      <div className="timer">
        ⏱ {Math.floor(seconds / 60)}:
        {(seconds % 60).toString().padStart(2, "0")}
      </div>
    </div>
  );
}
