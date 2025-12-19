import React from "react";
import type { Coin } from "../types";

// Define what props this component accepts
interface CoinRowProps {
  coin: Coin;
}

const CoinRow: React.FC<CoinRowProps> = ({ coin }) => {
  // TypeScript knows coin.price_change_percentage_24h is a number
  const priceChangeColor =
    coin.price_change_percentage_24h > 0 ? "positive" : "negative";

  return (
    <div className="coin-row">
      <div className="coin-name-group">
        {/* If I type coin.imag instead of coin.image, TS will error here */}
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

      {/* .toLocaleString() is safe because TS knows current_price is a number */}
      <div>${coin.current_price.toLocaleString()}</div>

      <div className={priceChangeColor}>
        {/* .toFixed() is safe. If property was optional (number | undefined), TS would force a check */}
        {coin.price_change_percentage_24h.toFixed(2)}%
      </div>

      <div>${coin.market_cap.toLocaleString()}</div>
    </div>
  );
};

export default CoinRow;
