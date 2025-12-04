export default function TargetBox({ characters, onSelect, onClose }) {
  return (
    <div className="target-box">
      <div style={{ textAlign: "right" }}>
        <button
          onClick={onClose}
          style={{ border: "none", background: "transparent", fontSize: 16 }}
        >
          ✕
        </button>
      </div>
      <ul className="target-list">
        {characters.map((c) => (
          <li key={c.slug}>
            <button
              className="target-btn"
              onClick={() => onSelect(c.slug)}
              style={{ width: "100%", cursor: "pointer", marginBottom: 8 }}
            >
              {c.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
