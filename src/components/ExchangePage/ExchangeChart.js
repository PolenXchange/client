import React, { useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";
import { parseFiveMinuteChart } from "../../helpers/ChartHelper"; // Import the parsing function

const ExchangeChart = () => {
  // Access the trade history data from the Redux store
  const tradeHistory = useSelector((state) => state.tradeHistory);

  useEffect(() => {
    console.log("tradeHistory");
    console.log(tradeHistory);
  }, [tradeHistory]);

  // Check if tradeHistory is not yet loaded or empty
  if (!tradeHistory || tradeHistory.length === 0) {
    return <p>Loading chart data...</p>;
  }

  // Parse and format the trade history data for the chart
  const parsedData = parseFiveMinuteChart([...tradeHistory].reverse());
  console.log("parsedData");
  console.log(parsedData);
  const chartData = [
    {
      data: parsedData,
    },
  ];
  console.log("chartData");
  console.log(chartData);

  const options = {
    chart: {
      type: "candlestick",
    },
    title: {
      text: "5 Min Candlestick Chart",
      align: "left",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div id="chart">
      {/* Check if the chartData array is not empty */}
      {chartData.length > 0 && chartData[0].data.length > 0 ? (
        <ReactApexChart
          options={options}
          series={chartData}
          type="candlestick"
        />
      ) : (
        <p>No chart data available.</p>
      )}
    </div>
  );
};

export default ExchangeChart;
