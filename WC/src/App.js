import { useEffect, useState } from 'react';
import './App.css';

import { Alert, Button, ConfigProvider, Divider, message, Spin, Steps } from 'antd';
import LogsContainer from './ConsoleContainer.js';
import Buffer from 'buffer'

function App({themeColour, themeTime, easeRatio}) {

  // store loading value
  const [loading, setLoading] = useState(false);
  const [ws1Image, setWs1Image] = useState(undefined);


  // Button Handlers:
  const fetchButtonHandler = () => {
    switch (currentStep) {
      case 0: fetchFromWS1(); break;
      case 1: fetchFromWS2(); break;
      case 2: fetchFromWS3(); break;
    }
  }
  const fetchFromWS1 = () => {
    stepsHeaderSetStati(['process', stepsHeaderStati[1], stepsHeaderStati[2]]);
    setLoading(true);
    stepsHeaderSetDescriptions([<>Working..</>, stepsHeaderDescriptions[1], stepsHeaderDescriptions[2]])
    stepsHeaderSetSubTitles([<><Spin/></>, stepsHeaderSubTitles[1], stepsHeaderSubTitles[2]])
    const url = 'http://127.0.0.1:5004/random';
    console.log('Starting fetch from ' + url);
    fetch(url)
      .then( response => {
        console.log('io');
        console.log(response);
        if (response.ok) {
          console.log(response + ' received.');
          console.log(response);
          return response.json();
        }
        throw response;
      })
      .then(data => {
        //console.log(JSON.stringify(data));
        console.log('jjhhjjj');
        setWs1Image('data:image/png;base64,'+data.encoded_picture);
        //console.log(data.encoded_picture);
        // Buffer.from(data, 'base64').toString();
        stepsHeaderSetStati(['finish', stepsHeaderStati[1], stepsHeaderStati[2]]);
        stepsHeaderSetSubTitles([<>Success.</>, stepsHeaderSubTitles[1], stepsHeaderSubTitles[2]])
        stepsHeaderSetDescriptions([
        <>
        <p>Response data:</p>
        <p>{JSON.stringify(data)}</p>
        <img src={ws1Image} />
        </>, stepsHeaderDescriptions[1], stepsHeaderDescriptions[2]])
        stepsHeaderSetDisabled([false, false, true]);
      })
      .catch(error => {
        console.error('======response error=====');
        console.error(error.message);
        stepsHeaderSetStati(['error', stepsHeaderStati[1], stepsHeaderStati[2]]);
        stepsHeaderSetSubTitles([<>Error.</>, stepsHeaderSubTitles[1], stepsHeaderSubTitles[2]])
        stepsHeaderSetDescriptions([<>Response error.<br />{error.message}</>, stepsHeaderDescriptions[1], stepsHeaderDescriptions[2]])
      })
      .finally(() => {
        console.log('Fetch finished');
        setLoading(false);
      });
  };
  const fetchFromWS2 = () => {
    stepsHeaderSetStati([stepsHeaderSetStati[0], 'process', stepsHeaderStati[2]]);
    console.log('Submitting images for post-processing.');
    stepsHeaderSetSubTitles([stepsHeaderSubTitles[0], <>Working..</>, stepsHeaderSubTitles[2]]);;
    stepsHeaderSetDescriptions([stepsHeaderDescriptions[0], <><Spin/></>, stepsHeaderDescriptions[2]]);
  };
  const fetchFromWS3 = () => {
    stepsHeaderSetStati([stepsHeaderStati[0], stepsHeaderStati[1], 'process']);
    console.log('gettingMarsImages');
    stepsHeaderSetSubTitles([<>Working..</>, stepsHeaderSubTitles[1], stepsHeaderSubTitles[2]])
    stepsHeaderSetDescriptions([<><Spin/></>, stepsHeaderDescriptions[1], stepsHeaderDescriptions[2]])
  };
  // const WS1ButtonClicked = () => {
  //   fetchFromWS1API();
  // };
  // const WS2ButtonClicked = () => {
  //   console.log('WS1ButtonClicked.');
  //   fetchFromWS2API();
  // };
  // const WS3ButtonClicked = () => {
  //   console.log('WS1ButtonClicked.');
  //   fetchFromWS3API();
  // };


  // Handle step / tab change.
  const [currentStep, setCurrentStep] = useState(0);
  const onChangeStep = value => {
    console.log('Changing tab:', value);
    console.log('Adjusting to fetch from Web Server', value+1);
    setCurrentStep(value);
  };
  
  // Array of current step statuses.
  const [stepsHeaderStati, stepsHeaderSetStati] = useState([
    'wait',
    'wait',
    'wait'
  ]);
  // Array of current step descriptions.
  const [stepsHeaderDescriptions, stepsHeaderSetDescriptions] = useState([
    // <><Button onClick={WS1ButtonClicked}>Fetch</Button></>,
    // <><Button onClick={WS2ButtonClicked}>Fetch</Button></>,
    // <><Button onClick={WS3ButtonClicked}>Fetch</Button></>
  ]);
  const [stepsHeaderDisabled, stepsHeaderSetDisabled] = useState([false, true, true]);
  // Array of current step sub-titles.
  const [stepsHeaderSubTitles, stepsHeaderSetSubTitles] = useState([
    // <><Button onClick={WS1ButtonClicked}>Fetch.</Button></>,
    // <><Button onClick={WS2ButtonClicked}>Fetch</Button></>,
    // <><Button onClick={WS3ButtonClicked}>Fetch</Button></>
  ]);
  // Array of step items.
  const stepsItemsHeader = [
    {
      title: 'Web Server 1',
      disabled: stepsHeaderDisabled[0],
      status: stepsHeaderStati[0],
      subTitle: stepsHeaderSubTitles[0],
      onChange: onChangeStep
    },
    {
      title: 'Web Server 2',
      disabled: stepsHeaderDisabled[1],
      status: stepsHeaderStati[1],
      subTitle: stepsHeaderSubTitles[1],
      onChange: onChangeStep
    },
    {
      title: 'External Web Server',
      disabled: stepsHeaderDisabled[2],
      status: stepsHeaderStati[2],
      subTitle: stepsHeaderSubTitles[2],
      onChange: onChangeStep
    },
  ];
  const stepsItemsBelow = [
    {
      title: 'Web Server 1',
      description: stepsHeaderDescriptions[0],
      disabled: stepsHeaderDisabled[0],
      status: stepsHeaderStati[0],
      subTitle: stepsHeaderSubTitles[0],
      // onChange: onChangeStep
    },
    {
      title: 'Web Server 2',
      description: stepsHeaderDescriptions[1],
      disabled: stepsHeaderDisabled[1],
      status: stepsHeaderStati[1],
      subTitle: stepsHeaderSubTitles[1],
      // onChange: onChangeStep
    },
    {
      title: 'External Web Server',
      description: stepsHeaderDescriptions[2],
      disabled: stepsHeaderDisabled[2],
      status: stepsHeaderStati[2],
      subTitle: stepsHeaderSubTitles[2],
      // onChange: onChangeStep
    },
  ];


  return (
    <>
      <ConfigProvider theme={{ token: { colorPrimary: themeColour, borderRadius: 6 } }} >
        {/* <ColourChanger></ColourChanger> */}
        <div className="App">
          <body className="App-header">
            <Steps current={currentStep} items={stepsItemsHeader} labelPlacement='horizontal' onChange={onChangeStep} 
            type='navigation' 
            />
            <br />
            <br />
            <br />
            <br />
            <section class="content">
              {/* <Divider /> */}
              {/* <span>Fetch from server {currentStep + 1}</span> */}
              <br />
              <div class="content-box">
                <LogsContainer />
              </div>
              <br />
              {!loading ?
                (
                  <>
                    {/*decoded image*/}
                    <Button onClick={fetchButtonHandler}>Fetch.</Button>
                    <img src={ws1Image} />
                    <p class="small-text">WS{currentStep+1}</p>
                  </>
                )
                : (
                  <Spin />
                )
              }
              <Divider />

            </section>
            <p class="spin">
              {/* <h1 style={{color: themeColour}}>DS CW2</h1><br /> */}
              {/* <h1>Web Server API chain caller.</h1> */}
    
              <span>
              {/* Start: <br /> */}
              {/* Theme time: { currentThemeColourTime } <br /> */}
              {/* Theme colour: { themeColour } <br /> */}
              </span>
            </p>

            <br />
            <br />
            {/* <Steps items={stepsItems0} progressDot /> */}
            <br />
            <br />

            <Steps direction={'vertical'} items={stepsItemsBelow} labelPlacement='vertical' progressDot />

          </body>
            <section class="small-text theme-info">
              <span>
                <span>Theme RGB: {themeColour} </span>
                <span>Theme Time: {themeTime} </span>
                <span>Bezier ease: {easeRatio} </span>
              </span>
            </section>
        </div>
      </ConfigProvider>
    </>
  );
}

export default App;
