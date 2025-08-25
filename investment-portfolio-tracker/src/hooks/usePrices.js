import { useEffect, useMemo, useRef, useState } from "react";
import { getCryptoPrices } from "../services/marketApi";
import { getStockQuote } from "../services/stockApi";

export default function usePrices(assets, currencyName = "usd") {
  const [cryptoPrices, setCryptoPrices] = useState({}); // { id: price }
  const [stockPrices, setStockPrices] = useState({}); // { symbol: price }
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  const cryptoIds = useMemo(() => {
    const s = new Set();
    assets.forEach(
      (a) => a.type === "Crypto" && a.coingeckoId && s.add(a.coingeckoId)
    );
    return Array.from(s);
  }, [assets]);

  const stockSymbols = useMemo(() => {
    const s = new Set();
    assets.forEach(
      (a) => a.type === "Stock" && a.symbol && s.add(a.symbol.toUpperCase())
    );
    return Array.from(s);
  }, [assets]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      // crypto (batch)
      if (cryptoIds.length) {
        const data = await getCryptoPrices(cryptoIds, currencyName);
        const flat = {};
        cryptoIds.forEach((id) => {
          const v = data?.[id]?.[currencyName];
          if (typeof v === "number") flat[id] = v;
        });
        setCryptoPrices(flat);
      } else {
        setCryptoPrices({});
      }

      // stocks (per symbol)
      if (stockSymbols.length) {
        const results = await Promise.allSettled(
          stockSymbols.map(getStockQuote)
        );
        const map = {};
        results.forEach((r, i) => {
          if (r.status === "fulfilled" && typeof r.value === "number") {
            map[stockSymbols[i]] = r.value;
          }
        });
        setStockPrices(map);
      } else {
        setStockPrices({});
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    clearInterval(timerRef.current);
    // refresh every 60s
    timerRef.current = setInterval(fetchAll, 60_000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencyName, JSON.stringify(cryptoIds), JSON.stringify(stockSymbols)]);

  return { cryptoPrices, stockPrices, loading };
}
