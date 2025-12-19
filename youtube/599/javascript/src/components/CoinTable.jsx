import React from "react";
import CoinRow from "./CoinRow";

const CoinTable = ({ coins }) => {
  return (
    <div className="coin-container">
      {/* Header Row */}
      <div
        className="coin-row"
        style={{ fontWeight: "bold", borderBottom: "2px solid #444" }}
      >
        <div>Coin</div>
        <div>Price</div>
        <div>24h Change</div>
        <div>Mkt Cap</div>
      </div>

      {/* RISK: If 'coins' is not an array (e.g. API error returned an object), 
        this .map() will crash the entire app with "coins.map is not a function"
      */}
      {coins.map((coin) => (
        <CoinRow key={coin.id} coin={coin} />
      ))}
    </div>
  );
};

export default CoinTable;
