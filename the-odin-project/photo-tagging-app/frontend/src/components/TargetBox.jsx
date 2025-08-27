import React from "react";

export default function TargetBox({ x, y, characters, onSelect, onClose }) {
  const style = {
    position: "absolute",
    left: x,
    top: y,
    transform: "translate(-50%, -100%)",
    zIndex: 20,
    background: "white",
    border: "1px solid #ccc",
    padding: 8,
  };

  return (
    <div style={style}>
      <button onClick={onClose} style={{ float: "right" }}>
        ×
      </button>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {characters.map((c) => (
          <li key={c.slug}>
            <button onClick={() => onSelect(c.slug)}>{c.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
