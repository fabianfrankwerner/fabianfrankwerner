import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import "./App.css"; // We reuse the same CSS
import { getCoins } from "./api";
import CoinTable from "./components/CoinTable";
import type { Coin } from "./types";

function App() {
  // We explicitly tell useState that this array will only ever contain Coin objects
  const [coins, setCoins] = useState<Coin[]>([]);

  // Type inference works fine here (infers string), but we can be explicit:
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    // We can type the async function, though TS infers return type is Promise<void>
    const fetchData = async () => {
      const data = await getCoins();
      setCoins(data);
      // If getCoins returned generic objects, setCoins(data) would error here.
    };

    fetchData();

    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Event Handler Typing
  // We specify that 'e' is a ChangeEvent coming from an HTMLInputElement
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Safe filtering
  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Crypto Tracker (TypeScript)</h1>

      <input
        type="text"
        placeholder="Search for a currency..."
        className="search-input"
        onChange={handleChange} // TS checks if handleChange signature matches onChange expectation
      />

      <CoinTable coins={filteredCoins} />
    </div>
  );
}

export default App;
