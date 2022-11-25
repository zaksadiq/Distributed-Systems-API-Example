import { useState } from 'react';
import ColourChanger from './ColourChanger';
import App from './App.js';

function Wrapper() {

  const [colour, setColour] = useState('');
  const [time, setTime] = useState(0);
  const [ease, setEase] = useState(0);

  const pull_data = (data, data1, data2) => {
    // console.log(data, data1);
    setColour(data);
    setTime(data1);
    setEase(data2);
    // console.log('colour' + colour);
  }

  return (
    <>
      <ColourChanger
      func={pull_data}
      />
      <App themeColour={colour} themeTime={time} easeRatio={ease}/>
    </>
  );
}

export default Wrapper;
