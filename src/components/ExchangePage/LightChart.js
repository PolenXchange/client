import React, { useEffect, useRef } from "react";
import {
  createChart,
  CrosshairMode,
  CandlestickSeries,
} from "lightweight-charts";

const LightChart = ({ data }) => {
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    // Create a new chart instance
    chartInstanceRef.current = createChart(chartContainerRef.current, {
      width: 800,
      height: 400,
      crosshair: {
        mode: CrosshairMode.Normal,
      },
    });

    // Add candlestick series to the chart
    const series = chartInstanceRef.current.addCandlestickSeries();

    // Set the data for the candlestick series
    series.setData(data);

    return () => {
      // Clean up the chart when the component is unmounted
      chartInstanceRef.current?.remove();
    };
  }, [data]);

  return <div ref={chartContainerRef} className="chart-container"></div>;
};

export default LightChart;
