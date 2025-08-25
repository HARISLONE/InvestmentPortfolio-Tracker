import { usePortfolio } from "../context/PortfolioContext";
import { formatCurrency, formatPct } from "../services/format";

export default function PortfolioSummary() {
  const { summary } = usePortfolio();
  const signClass = (n) => (n >= 0 ? "text-green" : "text-red");

  return (
    <div className="summary grid four">
      <Tile label="Total Cost" value={formatCurrency(summary.totalCost)} />
      <Tile label="Current Value" value={formatCurrency(summary.totalValue)} />
      <Tile label="P/L" value={formatCurrency(summary.pnlAbs)} className={signClass(summary.pnlAbs)} />
      <Tile label="P/L %" value={formatPct(summary.pnlPct)} className={signClass(summary.pnlPct)} />
    </div>
  );
}

function Tile({ label, value, className }) {
  return (
    <div className={`tile ${className || ""}`}>
      <div className="tile-label">{label}</div>
      <div className="tile-value">{value}</div>
    </div>
  );
}
