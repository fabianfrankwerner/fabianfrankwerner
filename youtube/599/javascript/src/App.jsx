import React, { useState, useEffect } from "react";
import "./App.css";
import { getCoins } from "./api";
import CoinTable from "./components/CoinTable";

function App() {
  // State initialization
  // We initialize with empty array, but JS doesn't enforce that this stays an array
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await getCoins();
      setCoins(data);
    };

    fetchData();

    // Optional: Set up an interval to simulate real-time updates
    const interval = setInterval(fetchData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Filter logic
  // RISK: If 'coin.name' is undefined for some reason, .toLowerCase() will crash
  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Crypto Tracker (JavaScript)</h1>

      <input
        type="text"
        placeholder="Search for a currency..."
        className="search-input"
        onChange={(e) => setSearch(e.target.value)}
      />

      <CoinTable coins={filteredCoins} />
    </div>
  );
}

export default App;
