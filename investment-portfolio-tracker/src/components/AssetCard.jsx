import React from "react";

const AssetCard = ({ asset, onRemove, currencySymbol = "$" }) => {
  const priceText =
    asset.price != null ? `${currencySymbol}${asset.price.toLocaleString()}` : "—";
  const valueText =
    asset.value != null ? `${currencySymbol}${asset.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "—";

  return (
    <div className="asset-card">
      <div className="asset-card__top">
        <div>
          <div className="asset-card__name">
            {asset.name} {asset.symbol ? `(${asset.symbol.toUpperCase()})` : ""}
          </div>
          <div className="asset-card__type">Type: {asset.type}</div>
        </div>
        <button className="asset-card__remove" onClick={onRemove}>Remove</button>
      </div>

      <div>Amount: <strong>{asset.amount}</strong></div>
      <div>Price: <strong>{priceText}</strong></div>
      <div>Value: <strong>{valueText}</strong></div>
      {asset.cost != null && (
     <div>Cost: <strong>{currencySymbol}{asset.cost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></div>
   )}
   {asset.pnlAbs != null && (
     <div>
       P/L:{" "}
       <strong style={{ color: asset.pnlAbs >= 0 ? '#00d48f' : '#ff5668' }}>
         {currencySymbol}{asset.pnlAbs.toLocaleString(undefined, { maximumFractionDigits: 2 })}
         {asset.pnlPct != null ? ` (${asset.pnlPct.toFixed(2)}%)` : ""}
       </strong>
     </div>
   )}
    </div>
  );
};

export default AssetCard;
