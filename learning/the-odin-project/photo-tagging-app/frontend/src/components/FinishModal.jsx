import { useState } from "react";
import { apiPost } from "../lib/api";

export default function FinishModal({ sessionId, levelId }) {
  const [name, setName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await apiPost("/api/sessions/finish", { sessionId, playerName: name });
      window.location.href = `/leaderboard/${levelId}`;
    } catch (err) {
      console.error(err);
      alert("Failed to submit score.");
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3 style={{ marginTop: 0 }}>You finished! 🎉</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 10 }}>
            <input
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: 8,
                background: "#1c6ef2",
                color: "white",
                border: "none",
                borderRadius: 4,
              }}
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{ padding: 8 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
