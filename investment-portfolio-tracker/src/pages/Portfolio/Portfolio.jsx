import React, { useContext, useMemo, useState, useEffect } from "react";
import "./Portfolio.css";
import AssetCard from "../../components/AssetCard";
import AddAssetModal from "../../components/AddAssetModal";
import DistributionPie from "../../components/DistributionPie";
import { listenPortfolio, savePortfolio } from "../../services/portfolioStore";
import { useAuth } from "../../context/AuthContext";
import usePrices from "../../hooks/usePrices";
import { CoinContext } from "../../context/CoinContext";

const Portfolio = () => {
  // const { currency } = useContext(CoinContext); // { name, symbol }
  // const [assets, setAssets] = useLocalStorage("ipt_assets", []);
  const { currency } = useContext(CoinContext);
   const { user } = useAuth();
   const [assets, setAssets] = useState([]);

   useEffect(() => {
     if (!user) return;
     const unsub = listenPortfolio(user.uid, setAssets);
     return () => unsub();
   }, [user]);

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name_asc");

  const { cryptoPrices, stockPrices, loading } = usePrices(assets, currency?.name || "usd");

  const addAsset = (asset) => {
    setAssets((prev) => {
      const next = [...prev, asset];
      if (user) savePortfolio(user.uid, next);
      return next;
    });
  }

  const removeAsset = (idx) => {
    setAssets((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      if (user) savePortfolio(user.uid, next);
      return next;
    });
  }
  const openAdd = () => document.getElementById("addAssetModal").showModal();

  // attach price/value
  const enriched = useMemo(() => {
    return assets.map((a) => {
      let price = null;
      if (a.type === "Crypto" && a.coingeckoId) {
        price = cryptoPrices[a.coingeckoId] ?? null;
      } else if (a.type === "Stock" && a.symbol) {
        price = stockPrices[a.symbol.toUpperCase()] ?? null;
      }
      const amount = Number(a.amount) || 0;
      const value = price != null ? amount * price : null;
      const cost  = (typeof a.buyPrice === "number" ? a.buyPrice : Number(a.buyPrice) || 0) * amount;
      const pnlAbs = value != null ? value - cost : null;
      const pnlPct = cost > 0 && pnlAbs != null ? (pnlAbs / cost) * 100 : null;
      return { ...a, amount, price, value, cost, pnlAbs, pnlPct };
    });
  }, [assets, cryptoPrices, stockPrices]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = enriched.filter((a) => {
      const matchesText =
        !q ||
        a.name.toLowerCase().includes(q) ||
        (a.type && a.type.toLowerCase().includes(q)) ||
        (a.symbol && a.symbol.toLowerCase().includes(q));
      const matchesType = typeFilter === "All" || a.type === typeFilter;
      return matchesText && matchesType;
    });

    switch (sortBy) {
      case "value_desc": list = [...list].sort((a,b)=>(b.value??-Infinity)-(a.value??-Infinity)); break;
      case "value_asc":  list = [...list].sort((a,b)=>(a.value??Infinity)-(b.value??Infinity));   break;
      case "amount_desc":list = [...list].sort((a,b)=>Number(b.amount)-Number(a.amount)); break;
      case "amount_asc": list = [...list].sort((a,b)=>Number(a.amount)-Number(b.amount)); break;
      case "name_desc":  list = [...list].sort((a,b)=>b.name.localeCompare(a.name)); break;
      default:           list = [...list].sort((a,b)=>a.name.localeCompare(b.name));
    }
    return list;
  }, [enriched, query, typeFilter, sortBy]);

  const totals = useMemo(() => {
    const totalUnits = assets.reduce((s, a) => s + (Number(a.amount) || 0), 0);
    const totalValue = enriched.reduce((s, a) => s + (a.value ?? 0), 0);
    const totalCost  = enriched.reduce((s, a) => s + (a.cost  ?? 0), 0);
    const pnlAbs     = totalValue - totalCost;
    const pnlPct     = totalCost > 0 ? (pnlAbs / totalCost) * 100 : 0;
    return { totalUnits, totalValue, totalCost, pnlAbs, pnlPct };
  }, [assets, enriched]);


  return (
    <div className="portfolio-wrap">
      <h1 className="portfolio-title">My Portfolio</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 16 }}>
        <div className="asset-card" style={{ minHeight: 80 }}>
          <div style={{ fontSize: 12, opacity: .8 }}>Total Cost</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>
            {currency?.symbol}{totals.totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div className="asset-card" style={{ minHeight: 80 }}>
          <div style={{ fontSize: 12, opacity: .8 }}>Current Value {loading ? "(updating…)" : ""}</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>
            {currency?.symbol}{totals.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div className="asset-card" style={{ minHeight: 80 }}>
          <div style={{ fontSize: 12, opacity: .8 }}>P/L</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: totals.pnlAbs >= 0 ? '#00d48f' : '#ff5668' }}>
            {currency?.symbol}{totals.pnlAbs.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div className="asset-card" style={{ minHeight: 80 }}>
          <div style={{ fontSize: 12, opacity: .8 }}>P/L %</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: totals.pnlAbs >= 0 ? '#00d48f' : '#ff5668' }}>
            {totals.pnlPct.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="asset-card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, opacity: .8, marginBottom: 6 }}>
          Distribution (by value) — click a slice to filter
        </div>
        <DistributionPie assets={enriched} onSelect={(type) => setTypeFilter(type)} />
      </div>

      <div className="portfolio-actions" style={{ flexWrap: "wrap" }}>
        <button className="btn-primary" onClick={openAdd}>+ Add Asset</button>
        <input className="add-asset-input" placeholder="Search assets…"
          value={query} onChange={(e) => setQuery(e.target.value)} style={{ width: 240 }}/>
        <select className="add-asset-select" value={typeFilter} onChange={(e)=>setTypeFilter(e.target.value)} style={{ width: 160 }}>
          <option>All</option><option>Stock</option><option>Crypto</option><option>Bond</option>
        </select>
        <select className="add-asset-select" value={sortBy} onChange={(e)=>setSortBy(e.target.value)} style={{ width: 220 }}>
          <option value="name_asc">Sort: Name A→Z</option>
          <option value="name_desc">Sort: Name Z→A</option>
          <option value="amount_desc">Sort: Amount High→Low</option>
          <option value="amount_asc">Sort: Amount Low→High</option>
          <option value="value_desc">Sort: Value High→Low</option>
          <option value="value_asc">Sort: Value Low→High</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p style={{ opacity: 0.85 }}>No assets match your filters.</p>
      ) : (
        <div className="assets-grid">
          {filtered.map((asset, i) => (
            <AssetCard
              key={`${asset.name}-${i}`}
              asset={asset}
              onRemove={() => removeAsset(i)}
              currencySymbol={currency?.symbol || "$"}
            />
          ))}
        </div>
      )}

      <AddAssetModal onAdd={addAsset} />
    </div>
  );
};

export default Portfolio;
