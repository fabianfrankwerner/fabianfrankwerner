// A simple fetch wrapper to get data from CoinGecko
export const getCoins = async () => {
  // We use the CoinGecko API (free tier)
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    // In JS, we just return the JSON and hope for the best
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return []; // Return empty array on failure so app doesn't crash immediately
  }
};
