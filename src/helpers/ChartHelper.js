export const parseFiveMinuteChart = (data, previousPrice, roundLimit) => {
  console.log("data");
  console.log(data);

  // Define the specific date
  let firstDate = new Date(data[0].date);
  let lastDate = new Date(data.at(-1).date);

  // Calculate the end date (specific date + 5 minutes)
  let currentDate = new Date(firstDate.getTime() + 5 * 60000);
  const parsed = [];

  while (currentDate <= lastDate) {
    const filteredObjects = data
      .filter((obj) => {
        const date = new Date(obj.date);
        return date > firstDate && date < currentDate;
      })
      .map((trade) => {
        const hive = trade.current_pays.includes("HIVE")
          ? parseFloat(trade.current_pays)
          : parseFloat(trade.open_pays);
        const hbd = trade.current_pays.includes("HBD")
          ? parseFloat(trade.current_pays)
          : parseFloat(trade.open_pays);
        let hivePrice = hbd / hive;
        return { ...trade, hive, hbd, hivePrice };
      });
    if (filteredObjects.length > 0) {
      let open = filteredObjects[0].hivePrice;
      let high = filteredObjects.reduce((maxObj, obj) => {
        return obj.hivePrice > maxObj.hivePrice ? obj : maxObj;
      }).hivePrice;
      let low = filteredObjects.reduce((minObj, obj) => {
        return obj.hivePrice < minObj.hivePrice ? obj : minObj;
      }).hivePrice;
      let close = filteredObjects.at(-1).hivePrice;
      parsed.push({
        x: new Date(firstDate),
        y: [
          parseFloat(open).toFixed(3),
          parseFloat(high).toFixed(3),
          parseFloat(low).toFixed(3),
          parseFloat(close).toFixed(3),
        ], //open, high, low, close
      });
    }

    firstDate = currentDate;
    currentDate = new Date(firstDate.getTime() + 5 * 60000);
  }
  console.log("parsed");
  console.log(parsed);
  return parsed;
};

const findFirstNormalPrice = (data, previousPrice, roundLimit) => {
  var hivePrice = 0;
  for (const trade of data) {
    const hive = trade.current_pays.includes("HIVE")
      ? parseFloat(trade.current_pays)
      : parseFloat(trade.open_pays);
    const hbd = trade.current_pays.includes("HBD")
      ? parseFloat(trade.current_pays)
      : parseFloat(trade.open_pays);
    hivePrice = hbd / hive;
    if (Math.min(hive, hbd) >= roundLimit) {
      return hivePrice;
    }
  }
  if (previousPrice > 0) return previousPrice;
  return hivePrice;
};

function addOneMinute(timestamp) {
  var date = new Date(timestamp);
  date.setTime(date.getTime() + 60000); // Add 1 minute (60,000 milliseconds)

  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString().padStart(2, "0");
  var day = date.getDate().toString().padStart(2, "0");
  var hour = date.getHours().toString().padStart(2, "0");
  var minute = date.getMinutes().toString().padStart(2, "0");
  var second = date.getSeconds().toString().padStart(2, "0");

  var newTimestamp = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  return newTimestamp;
}

function isTimestampSmaller(timestamp1, timestamp2) {
  var date1 = new Date(timestamp1);
  var date2 = new Date(timestamp2);

  return date1.getTime() < date2.getTime();
}
