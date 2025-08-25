import React, { useMemo } from "react";
import Chart from "react-google-charts";

/**
 * assets: [{ type, value }]
 * onSelect?: (type: string) => void
 */
const DistributionPie = ({ assets, onSelect }) => {
  const data = useMemo(() => {
    const byType = assets.reduce((acc, a) => {
      const key = a.type || "Other";
      const val = typeof a.value === "number" ? a.value : 0;
      acc[key] = (acc[key] || 0) + val;
      return acc;
    }, {});
    const rows = Object.entries(byType).filter(([, v]) => v > 0);
    return [["Type", "Value"], ...rows];
  }, [assets]);

  if (data.length <= 1) {
    return <div style={{ opacity: 0.85 }}>Add priced assets to see distribution.</div>;
  }

  const chartEvents = [
    {
      eventName: "select",
      callback: ({ chartWrapper }) => {
        const chart = chartWrapper.getChart();
        const sel = chart.getSelection?.()[0];
        if (!sel || sel.row == null) return;
        const type = data[sel.row + 1]?.[0];
        if (type && onSelect) onSelect(type);
      },
    },
  ];

  return (
    <Chart
      chartType="PieChart"
      data={data}
      height="280px"
      options={{
        legend: { position: "bottom", textStyle: { color: "#fff" } },
        backgroundColor: "transparent",
        chartArea: { width: "94%", height: "78%" },
        pieHole: 0.35,
        sliceVisibilityThreshold: 0, // show small slices
        tooltip: { isHtml: false },
      }}
      chartEvents={chartEvents}
    />
  );
};

export default DistributionPie;
