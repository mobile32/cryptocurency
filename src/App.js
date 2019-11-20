import React from "react";
import CanvasJSReact from "./lib/canvasjs.react";
import { interval } from "rxjs";
import { map, scan, share } from "rxjs/operators";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const generator = ({
  bitcoin: { min: btcMin, max: btcMax },
  etherum: { min: ethMin, max: ethMax }
}) => {
  const timer = interval(1000).pipe(share());

  const btc = streamBuilder(timer, btcMin, btcMax);
  const eth = streamBuilder(timer, ethMin, ethMax);

  return { btc, eth };
};

const streamBuilder = (timer, min, max) =>
  timer
    .pipe(map(() => getRandomIntInclusive(min, max)))
    .pipe(map(value => ({ x: new Date(), y: value })))
    .pipe(
      scan((acc, val) => {
        acc.push(val);
        return acc.slice(-30);
      }, [])
    );

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const chartFrame = (btcValues, ethValues) => ({
  theme: "light2",
  title: {
    text: "BTC & ETH"
  },
  axisY: {
    includeZero: false,
    prefix: "$"
  },
  toolTip: {
    shared: true
  },
  data: [
    {
      type: "area",
      name: "BTC",
      showInLegend: true,
      yValueFormatString: "$#,##0.##",
      dataPoints: btcValues
    },
    {
      type: "area",
      name: "ETH",
      showInLegend: true,
      yValueFormatString: "$#,##0.##",
      dataPoints: ethValues
    }
  ]
});

const App = () => {
  const [btcStream, setBtcStream] = React.useState();
  const [ethStream, setEthStream] = React.useState();

  React.useEffect(() => {
    const values = generator({
      bitcoin: { min: 10000, max: 10500 },
      etherum: { min: 3000, max: 3200 }
    });

    values.btc.subscribe(val => {
      console.log("BTC:", val);
      setBtcStream(val);
    });

    values.eth.subscribe(val => {
      console.log("ETH:", val);
      setEthStream(val);
    });
  }, []);

  return (
    <div className="App">
      <CanvasJSChart options={chartFrame(btcStream, ethStream)} />
    </div>
  );
};

export default App;
