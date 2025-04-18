import "../index.css";
import Card from "./Card.jsx";
import data from "../data.js";

export default function Main() {
  const cards = data.map((card, index) => {
    return <Card key={card.id} isLast={index === data.length - 1} {...card} />;
  });

  return (
    <main>
      <div className="cards">{cards}</div>
    </main>
  );
}
