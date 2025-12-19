import React from "react";
import CoinRow from "./CoinRow";
import type { Coin } from "../types";

interface CoinTableProps {
  coins: Coin[]; // Must be an array of Coin objects
}

const CoinTable: React.FC<CoinTableProps> = ({ coins }) => {
  return (
    <div className="coin-container">
      <div
        className="coin-row"
        style={{ fontWeight: "bold", borderBottom: "2px solid #444" }}
      >
        <div>Coin</div>
        <div>Price</div>
        <div>24h Change</div>
        <div>Mkt Cap</div>
      </div>

      {coins.map((coin) => (
        <CoinRow key={coin.id} coin={coin} />
      ))}
    </div>
  );
};

export default CoinTable;
