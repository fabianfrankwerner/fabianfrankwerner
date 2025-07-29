import vegetables from "../vegetables";

const Store = () => {
  return (
    <div>
      <h1>Store</h1>
      <p>Get goin!</p>
      <ul>
        {vegetables.map((veg, idx) => (
          <li key={idx}>{veg.emoji}</li>
        ))}
      </ul>
    </div>
  );
};

export default Store;
