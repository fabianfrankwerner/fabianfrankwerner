import { useRef, useState } from "react";
import TargetBox from "./TargetBox";
import Marker from "./Marker";

export default function GameImage({ src, characters, onGuess, markers = [] }) {
  const imgRef = useRef(null);
  const [target, setTarget] = useState(null); // { xPx, yPx, normX, normY }

  function handleClick(e) {
    const img = imgRef.current;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    const xPx = e.clientX - rect.left;
    const yPx = e.clientY - rect.top;
    const normX = xPx / rect.width;
    const normY = yPx / rect.height;
    setTarget({ xPx, yPx, normX, normY });
  }

  async function handleSelect(characterSlug) {
    await onGuess({ characterSlug, x: target.normX, y: target.normY });
    setTarget(null);
  }

  function handleClose() {
    setTarget(null);
  }

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        maxWidth: "100%",
      }}
    >
      <img
        ref={imgRef}
        src={src}
        alt="game"
        onClick={handleClick}
        style={{
          display: "block",
          maxWidth: "100%",
          height: "auto",
          userSelect: "none",
        }}
      />

      {target && (
        <div
          style={{
            position: "absolute",
            left: target.xPx,
            top: target.yPx,
            transform: "translate(-50%,-100%)",
          }}
        >
          <TargetBox
            x={0}
            y={0}
            characters={characters}
            onSelect={handleSelect}
            onClose={handleClose}
          />
        </div>
      )}

      {markers.map((m, i) => (
        <Marker key={i} x={m.x} y={m.y} />
      ))}
    </div>
  );
}
