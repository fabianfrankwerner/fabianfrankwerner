import { useState } from "react";

export default function FinishModal({ sessionId, levelId, onFinish }) {
  const [name, setName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch("/api/sessions/finish", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        playerName: name,
      }),
    });

    // Redirect to leaderboard
    window.location.href = `/leaderboard/${levelId}`;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-white rounded-xl p-6 w-80">
        <h2 className="text-lg font-bold mb-4">You finished! 🎉</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Submit Score
          </button>
        </form>
      </div>
    </div>
  );
}
