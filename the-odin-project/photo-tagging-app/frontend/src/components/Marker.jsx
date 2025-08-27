export default function Marker({ x, y }) {
  const style = {
    position: "absolute",
    left: `${x * 100}%`,
    top: `${y * 100}%`,
    transform: "translate(-50%,-50%)",
    pointerEvents: "none",
  };
  return (
    <div style={style}>
      <div className="marker-dot" />
    </div>
  );
}
