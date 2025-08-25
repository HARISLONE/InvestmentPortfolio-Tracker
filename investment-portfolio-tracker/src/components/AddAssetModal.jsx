import React, { useEffect, useMemo, useRef, useState } from "react";
import "./AddAssetModal.css";
import { searchCoinGecko } from "../services/marketApi";

const AddAssetModal = ({ onAdd }) => {
  const [form, setForm] = useState({ name: "", type: "Stock", amount: "", symbol: "", buyPrice: "" });
  const [resolving, setResolving] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [openSug, setOpenSug] = useState(false);
  const dialogRef = useRef(null);
  const sugRef = useRef(null);
  const typing = useRef(0);

  // Close dialog on native cancel
  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    const handleCancel = (e) => { e.preventDefault(); node.close(); };
    node.addEventListener("cancel", handleCancel);
    return () => node.removeEventListener("cancel", handleCancel);
  }, []);

  // Crypto autocomplete (debounced)
  useEffect(() => {
    if (form.type !== "Crypto") { setSuggestions([]); return; }
    const q = form.name.trim();
    if (q.length < 2) { setSuggestions([]); return; }

    const id = ++typing.current;
    const t = setTimeout(async () => {
      try {
        const list = await searchCoinGecko(q);
        if (id !== typing.current) return;
        setSuggestions(list.slice(0, 8)); // top 8
        setOpenSug(true);
      } catch { setSuggestions([]); }
    }, 250);
    return () => clearTimeout(t);
  }, [form.type, form.name]);

  useEffect(() => {
    const onClickAway = (e) => {
      if (!sugRef.current) return;
      if (!sugRef.current.contains(e.target)) setOpenSug(false);
    };
    document.addEventListener("click", onClickAway);
    return () => document.removeEventListener("click", onClickAway);
  }, []);

  const pickSuggestion = (coin) => {
    setForm(f => ({ ...f, name: coin.name, coingeckoId: coin.id }));
    setOpenSug(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amountNum = Number(form.amount);
    if (!form.name.trim() || amountNum <= 0) return;

    let payload = { name: form.name.trim(), type: form.type, amount: amountNum, buyPrice: Number(form.buyPrice) || 0 };

    if (form.type === "Crypto") {
      // if user didn’t click a suggestion, try to resolve a best match quickly
      if (!form.coingeckoId) {
        try {
          setResolving(true);
          const list = await searchCoinGecko(form.name.trim());
          const best = list.find(c => c.name?.toLowerCase() === form.name.trim().toLowerCase()) || list[0];
          if (best?.id) payload.coingeckoId = best.id;
        } catch {}
        finally { setResolving(false); }
      } else {
        payload.coingeckoId = form.coingeckoId;
      }
    }

    if (form.type === "Stock") {
      payload.symbol = (form.symbol || form.name).toUpperCase();
    }

    onAdd(payload);
    setForm({ name: "", type: "Stock", amount: "", symbol: "", buyPrice: "" });
    dialogRef.current?.close();
  };

  return (
    <dialog id="addAssetModal" ref={dialogRef} className="add-asset-dialog">
      <div className="add-asset-header">
        <h2 className="add-asset-title">Add Asset</h2>
        <button className="add-asset-close" aria-label="Close"
          onClick={() => dialogRef.current?.close()}>
          ✕
        </button>
      </div>

      <form className="add-asset-form" onSubmit={handleSubmit}>
        <select
          className="add-asset-select"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option>Stock</option>
          <option>Crypto</option>
          <option>Bond</option>
        </select>

        {/* Name with suggestions (Crypto) */}
        <div style={{ position: "relative" }} ref={sugRef}>
          <input
            className="add-asset-input"
            type="text"
            placeholder={form.type === "Crypto" ? "Coin name (e.g., Bitcoin)" : "Asset name (e.g., Apple)"}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value, coingeckoId: undefined })}
            required
          />
          {form.type === "Crypto" && openSug && suggestions.length > 0 && (
            <div style={{
              position: "absolute",
              top: "46px",
              left: 0,
              right: 0,
              background: "rgba(8,11,40,.96)",
              border: "1px solid rgba(255,255,255,.14)",
              borderRadius: 10,
              maxHeight: 240,
              overflow: "auto",
              zIndex: 1000
            }}>
              {suggestions.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => pickSuggestion(c)}
                  style={{
                    display: "flex",
                    gap: 10,
                    width: "100%",
                    padding: "10px 12px",
                    background: "transparent",
                    border: 0,
                    color: "#fff",
                    textAlign: "left",
                    cursor: "pointer"
                  }}
                >
                  {c.thumb ? <img src={c.thumb} alt="" width={18} height={18}/> : null}
                  <span>{c.name}</span>
                  <span style={{ opacity: .7 }}>({c.symbol?.toUpperCase()})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stock symbol (only for Stock) */}
        {form.type === "Stock" && (
          <input
            className="add-asset-input"
            type="text"
            placeholder="Ticker symbol (e.g., AAPL)"
            value={form.symbol}
            onChange={(e) => setForm({ ...form, symbol: e.target.value })}
          />
        )}

        <input
          className="add-asset-input"
          type="number"
          min="0"
          step="any"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />

        <input
          className="add-asset-input"
          type="number"
          min="0"
          step="any"
          placeholder="Buy price per unit (in selected currency)"
          value={form.buyPrice}
          onChange={(e) => setForm({ ...form, buyPrice: e.target.value })}
          required
        />


        <button type="submit" className="add-asset-submit" disabled={resolving}>
          {resolving ? "Finding…" : "Add"}
        </button>
      </form>
    </dialog>
  );
};

export default AddAssetModal;
