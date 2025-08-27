import React, { useRef, useState } from "react";
import TargetBox from "./TargetBox";
import Marker from "./Marker";

export default function GameImage({ src, characters, onGuess, markers = [] }) {
  const imgRef = useRef();
  const [target, setTarget] = useState(null); // {xPx, yPx, normX, normY, show}

  function onClick(e) {
    const rect = imgRef.current.getBoundingClientRect();
    const xPx = e.clientX - rect.left;
    const yPx = e.clientY - rect.top;
    const normX = xPx / rect.width;
    const normY = yPx / rect.height;
    setTarget({ xPx, yPx, normX, normY });
  }

  function closeTarget() {
    setTarget(null);
  }

  async function handleSelect(characterSlug) {
    await onGuess({ characterSlug, x: target.normX, y: target.normY });
    setTarget(null);
  }

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <img
        ref={imgRef}
        src={src}
        alt="level"
        onClick={onClick}
        style={{ maxWidth: "100%", height: "auto", display: "block" }}
      />
      {target && (
        <TargetBox
          x={target.xPx}
          y={target.yPx}
          characters={characters}
          onSelect={handleSelect}
          onClose={closeTarget}
        />
      )}
      {markers.map((m, i) => (
        <Marker key={i} x={m.x} y={m.y} />
      ))}
    </div>
  );
}
