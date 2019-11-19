import React from "react";

import { interval, range } from "rxjs";
import {
  map,
  take,
  toArray,
  bufferCount,
  startWith,
  bufferTime,
  takeLast,
  scan
} from "rxjs/operators";

const values = ({
  bitcoin: { min: btcMin, max: btcMax },
  etherum: { min: ethMin, max: ethMax }
}) => {
  const btc = interval(1000)
    .pipe(map(() => Math.random()))
    .pipe(
      scan((acc, val) => {
        acc.push(val);
        return acc.slice(-30);
      }, [])
    );

  return btc;
};

const App = () => {
  const [stream, setStream] = React.useState();

  React.useEffect(() => {
    values({
      bitcoin: { min: 1, max: 5 },
      etherum: { min: 20, max: 30 }
    }).subscribe(val => {
      console.log(val);
      setStream(val);
    });
  }, []);

  return <div className="App">{stream}</div>;
};

export default App;
