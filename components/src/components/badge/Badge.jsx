export default function Badge({ children, color, type }) {
  return <p className={`badge ${color} ${type}`}>{children}</p>;
}
