import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";
import { parseFiveMinuteChart } from "../../helpers/ChartHelper";

const ExchangeChart = () => {
  const tradeHistory = useSelector((state) => state.tradeHistory);
  const [parsedData, setParsedData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [reactApexChart, setReactApexChart] = useState();
  useEffect(() => {
    console.log("tradeHistory");
    console.log(tradeHistory);
    if (tradeHistory.length > 0) {
      setParsedData(parseFiveMinuteChart([...tradeHistory].reverse()));
    }
  }, [tradeHistory]);
  useEffect(() => {
    console.log("parsedData");
    console.log(parsedData);
    if (parsedData.length > 0) {
      setChartData([
        {
          data: parsedData,
        },
      ]);
    }
  }, [parsedData]);
  useEffect(() => {
    console.log("chartData");
    console.log(chartData);
    if (chartData.length > 0) {
      setReactApexChart(
        <ReactApexChart
          options={options}
          series={chartData}
          type="candlestick"
          height={chartHeight}
        />
      );
    }
  }, [chartData]);
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
        {chartData.length > 0 &&
        chartData[0] &&
        chartData[0].data.length > 0 ? (
          reactApexChart
        ) : (
          <p>No chart data available.</p>
        )}
      </div>
    </div>
  );
};

export default ExchangeChart;
