import React from "react";

// Notice: No prop types validation. 'coin' could be anything.
const CoinRow = ({ coin }) => {
  // Logic to determine color for price change
  // RISK: if price_change_percentage_24h is null, this might crash or look weird
  const priceChangeColor =
    coin.price_change_percentage_24h > 0 ? "positive" : "negative";

  return (
    <div className="coin-row">
      <div className="coin-name-group">
        {/* RISK: if coin.image is missing, we get a broken image icon */}
        <img src={coin.image} alt={coin.name} className="coin-icon" />
        <span>{coin.name}</span>
        <span
          style={{
            textTransform: "uppercase",
            color: "#888",
            fontSize: "0.8em",
          }}
        >
          {coin.symbol}
        </span>
      </div>

      {/* RISK: Typo potential here. It's 'current_price', not 'price' */}
      <div>${coin.current_price.toLocaleString()}</div>

      <div className={priceChangeColor}>
        {coin.price_change_percentage_24h?.toFixed(2)}%
      </div>

      <div>
        {/* Simple Market Cap display */}${coin.market_cap.toLocaleString()}
      </div>
    </div>
  );
};

export default CoinRow;
