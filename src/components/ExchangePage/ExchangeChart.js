import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";
import { parseFiveMinuteChart } from "../../helpers/ChartHelper";

const ExchangeChart = () => {
  const tradeHistory = useSelector((state) => state.tradeHistory);
  const [parsedData, setParsedData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const currentTheme = useSelector((state) => state.theme.currentTheme);

  useEffect(() => {
    if (tradeHistory.length > 0) {
      setParsedData(parseFiveMinuteChart([...tradeHistory].reverse()));
    }
  }, [tradeHistory]);

  useEffect(() => {
    if (parsedData.length > 0) {
      setChartData([
        {
          data: parsedData,
        },
      ]);
    }
  }, [parsedData]);

  useEffect(() => {
    const options = {
      chart: {
        type: "candlestick",
        height: chartHeight, // Use the dynamic chart height
      },
      title: {
        text: "5 Min Candlestick Chart",
        align: "left",
        style: {
          color: currentTheme === "dark" ? "#ffffff" : "#000000",
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          style: {
            colors: currentTheme === "dark" ? "#ffffff" : "#000000",
          },
        },
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
        labels: {
          style: {
            colors: currentTheme === "dark" ? "#ffffff" : "#000000",
          },
        },
      },
    };
    setChartOptions(options);
  }, [currentTheme]);

  const [chartHeight, setChartHeight] = useState(400);

  const handleResize = () => {
    const isMobile = window.innerWidth <= 768;
    setChartHeight(isMobile ? 200 : 400);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!tradeHistory || tradeHistory.length === 0) {
    return (
      <p
        className={`${
          currentTheme === "dark" ? "text-gray-300" : "text-black"
        }`}
      >
        Loading chart data...
      </p>
    );
  }

  return (
    <div id="chart-container" className="flex justify-center items-center p-4">
      <div className="w-full max-w-screen-xl">
        {chartData.length > 0 &&
        chartData[0] &&
        chartData[0].data.length > 0 ? (
          <ReactApexChart
            options={chartOptions}
            series={chartData}
            type="candlestick"
            height={chartHeight}
          />
        ) : (
          <p
            className={`${
              currentTheme === "dark" ? "text-gray-300" : "text-black"
            }`}
          >
            No chart data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default ExchangeChart;
