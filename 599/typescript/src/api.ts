import type { Coin } from "./types";

// We explicitly state that this function returns a Promise containing an array of Coins
export const getCoins = async (): Promise<Coin[]> => {
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // We cast the JSON to our type.
    // Note: This is a compile-time check. Runtime data could still technically be wrong.
    const data = (await response.json()) as Coin[];
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return []; // Returns an empty array which matches Coin[] type (empty list)
  }
};
