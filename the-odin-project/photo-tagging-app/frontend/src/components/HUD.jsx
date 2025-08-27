import { useEffect, useState } from "react";

export default function HUD({ session, characters, foundCharacters }) {
  const [time, setTime] = useState(0);

  // Update timer every second
  useEffect(() => {
    if (!session?.startedAt) return;

    const start = new Date(session.startedAt).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      setTime(Math.floor((now - start) / 1000)); // seconds elapsed
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const remaining = characters.filter((c) => !foundCharacters.includes(c.name));

  return (
    <div className="fixed top-0 left-0 w-full flex justify-between p-4 bg-black/70 text-white text-sm z-50">
      {/* Remaining Characters */}
      <div>
        <strong>Find:</strong>{" "}
        {remaining.length > 0
          ? remaining.map((c) => c.name).join(", ")
          : "🎉 All found!"}
      </div>

      {/* Timer */}
      <div>
        ⏱ {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
      </div>
    </div>
  );
}
