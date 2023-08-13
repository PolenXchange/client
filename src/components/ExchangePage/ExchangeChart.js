import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";
import { parseFiveMinuteChart } from "../../helpers/ChartHelper";

const ExchangeChart = () => {
  const tradeHistory = useSelector((state) => state.tradeHistory);

  useEffect(() => {
    console.log("tradeHistory");
    console.log(tradeHistory);
  }, [tradeHistory]);

  const [chartHeight, setChartHeight] = useState(400); // Initial chart height

  const handleResize = () => {
    const isMobile = window.innerWidth <= 768;
    setChartHeight(isMobile ? 200 : 400);
  };

  useEffect(() => {
    handleResize(); // Initial resize on component mount
    window.addEventListener("resize", handleResize); // Add resize event listener
    return () => {
      window.removeEventListener("resize", handleResize); // Remove event listener on component unmount
    };
  }, []);

  if (!tradeHistory || tradeHistory.length === 0) {
    return <p>Loading chart data...</p>;
  }

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
      height: chartHeight, // Use the dynamic chart height
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
    <div id="chart-container" className="flex justify-center items-center p-4">
      <div className="w-full max-w-screen-xl">
        {chartData.length > 0 && chartData[0].data.length > 0 ? (
          <ReactApexChart
            options={options}
            series={chartData}
            type="candlestick"
            height={chartHeight}
          />
        ) : (
          <p>No chart data available.</p>
        )}
      </div>
    </div>
  );
};

export default ExchangeChart;
