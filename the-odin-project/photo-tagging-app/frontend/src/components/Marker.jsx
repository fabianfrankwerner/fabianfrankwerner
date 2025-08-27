import React from "react";

export default function Marker({ x, y }) {
  // x,y are normalized 0..1 — position relative to parent container
  const style = {
    position: "absolute",
    left: `${x * 100}%`,
    top: `${y * 100}%`,
    transform: "translate(-50%,-50%)",
    pointerEvents: "none",
  };
  return (
    <div style={style}>
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          background: "red",
          border: "2px solid white",
        }}
      />
    </div>
  );
}
