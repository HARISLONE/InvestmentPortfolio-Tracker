const CG_BASE = "https://api.coingecko.com/api/v3";

// map "Bitcoin" -> "bitcoin"
export async function searchCoinGecko(query) {
  const url = `${CG_BASE}/search?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("CoinGecko search error");
  const json = await res.json();
  return json?.coins || [];
}

// batch prices: ids = "bitcoin,ethereum", vs = "usd"
export async function getCryptoPrices(ids = [], vs = "usd") {
  if (!ids.length) return {};
  const url = `${CG_BASE}/simple/price?ids=${encodeURIComponent(
    ids.join(",")
  )}&vs_currencies=${encodeURIComponent(vs)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("CoinGecko price error");
  return await res.json(); // { bitcoin: { usd: 64250 }, ... }
}
