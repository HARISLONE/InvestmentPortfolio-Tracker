// Uses Alpha Vantage "GLOBAL_QUOTE" endpoint.
// 1) Get a free key: https://www.alphavantage.co/support/#api-key
// 2) Add it to a .env file as VITE_ALPHA_VANTAGE_KEY=your_key

const AV_BASE = "https://www.alphavantage.co/query";
const KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY; // may be undefined

export async function getStockQuote(symbol) {
  if (!symbol) return null;
  if (!KEY) return null; // no key set → gracefully skip

  const url = `${AV_BASE}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(
    symbol
  )}&apikey=${KEY}`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const json = await res.json();
  const priceStr = json?.["Global Quote"]?.["05. price"];
  const price = priceStr ? Number(priceStr) : null;
  return Number.isFinite(price) ? price : null;
}
