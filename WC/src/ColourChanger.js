import { useEffect, useState } from 'react';
import App from './App';
var convert = require('color-convert');
// Bezier curve for ease timing function on theme colour transitions.
var BezierEasing = require("bezier-easing");


function ColourChanger(props) {
  // Colour changer jazz
  // UI elements colour #1677ff
  const [themeColour, setThemeColour] = useState('#1677ff');
  const themeColourInterval = 100;
  const maxTime = 1600;
  const [currentEaseRatio, setEaseRatio] = useState(0);
  const [currentThemeColourTime, setCurrentThemeColourTime] = useState(0);
  const [currentThemeColourRGB, setCurrentThemeColourRGB] = useState([9,47,100]);

  // Run constantly colour change function on App render. useEffect will run every render cycle 
  // (AKA component update), the second argument ensures the function waits until a new theme colour is
  // chosen before being called.
  useEffect(() => {
    // console.log('calling use effect handler');
    // setInterval( () => {
    const interval = setInterval(() => {
      // console.log('calling colour changer' + ' current colour time = ');
      // console.log(currentThemeColourTime);
      // console.log('calling interval function');
      setCurrentThemeColourTime(
        (prevCounter) => { 
          // console.log('setting new time');
          if (prevCounter === maxTime) prevCounter = 0;
          return prevCounter += themeColourInterval;
      });
      setCurrentThemeColourRGB(
        (currentThemeColourRGB) => {
          // console.log('changing theme colour');
          const coloursRGB = [[248, 255, 240], [240, 248, 255]]; // points to interpolate.
          const ease = BezierEasing(0.42, 0, 0.58, 1.0);
          const redDiff = coloursRGB[1][0] - coloursRGB[0][0];
          const greenDiff = coloursRGB[1][1] - coloursRGB[0][1];
          const blueDiff = coloursRGB[1][2] - coloursRGB[0][2];

          const easeRatio = ease(currentThemeColourTime/(2*maxTime)); //half it so we can reverse
          setEaseRatio(easeRatio);

          if (currentThemeColourTime < (maxTime/2)) {
            var newColour = [((easeRatio * redDiff) + coloursRGB[0][0]), ((easeRatio * greenDiff) + coloursRGB[0][1]), ((easeRatio * blueDiff) + coloursRGB[0][2])];
          }
          else {
          const redDiffReverse = -redDiff;
          const greenDiffReverse = -greenDiff;
          const blueDiffReverse = -blueDiff;
            var newColour = [((easeRatio * redDiffReverse) + coloursRGB[0][0]), ((easeRatio * greenDiffReverse) + coloursRGB[0][1]), ((easeRatio * blueDiffReverse) + coloursRGB[0][2])];
          }

          // Make colour more legible now we have emulated the CSS colour of the application's background.
          var hsl = convert.rgb.hsl(newColour);
          hsl[1] = 1.15 * hsl[1]; // increase saturation so UI elements aren't too light.
          hsl[2] = 0.45* hsl[2]; // decrease lightness so UI elements are more visible.
          newColour = convert.hsl.rgb(hsl);

          setThemeColour('rgb(' + newColour[0] + ',' + newColour[1] + ',' + newColour[2] + ')');
          return newColour;
        }
        );
        props.func(themeColour, currentThemeColourTime, currentEaseRatio);
      }, themeColourInterval); // Function to compute. Set Interval means this is looped indefinitely.

    // Return to cleanup & avoid memory leak when this function is recreated next time useEffect is called.
    return () => clearInterval(interval);
  },
    [currentThemeColourTime, currentThemeColourRGB] // No dependencies , ie. have this function compute only first render.
  );

  return (
    <>
    {/* <h1>
      I am the colour changer.
    </h1> */}
    </>
  );
}

export default ColourChanger;