import { useEffect, useState, useReducer } from 'react';
import './App.css';

import { Alert, Button, ConfigProvider, Divider, message, Spin, Steps } from 'antd';
import LogsContainer from './ConsoleContainer.js';

// Import modules for POSTing formdata.
import { FormData, Blob } from 'formdata-node';
import axios from 'axios';
import { Buffer } from 'buffer';
// const { Buffer } = require('buffer');


function App({themeColour, themeTime, easeRatio}) {

  // Store loading value in state for dynamic front-end.
  const [loading, setLoading] = useState(false);
  // Store WS1 Image value in state for dynamic front-end.
  const [imageResultArray, setImageResultArray] = useState(['', '', '']);


 // Adapted from https://gist.github.com/emindeniz99/0b415de896f5c335d253d870116d798f
 const postBase64AsFormData = async (base64, url) => {

   console.log('Creating formdata object');
   let formData = new FormData();
   console.log('Reading base64 encoding to buffer');
  //  console.log(`base64: ${base64}`);
   console.log(`destination url: ${url}`);
   console.log('converting base64 to blob');
  const base64Response = await fetch(`data:image/jpg;base64,${base64}`);
  const base64Blob = await base64Response.blob();
  //  base64ToBlob = (base64, type = 'application/octet-stream') => fetch(base64ToBlob)
  //    .then( res => res.blob() )
  //    .then( res => console.log(res) );
   //   buffer to form/data, https://stackoverflow.com/questions/43913650/how-to-send-a-buffer-in-form-data-to-signserver
   console.log('Appending base64 to formdata');
   // Turn buffer into blob
  //  formData.append('file', Buffer.from(base64Blob), 'coursework.jpg');
   formData.append('image', base64Blob, 'coursework.jpg');
   console.log('Beginning post request using Axios');
   return await axios({
     method: 'post',
     url: url,
     data: formData,
     headers: { 'Content-Type': 'multipart/form-data' },
   })
   .then( res => {
     console.log('Successful response.');
     console.log(`statusCode: ${res.statusCode}`);
     console.log(res.data);
     return res.data.image;
   })
   .catch( error => {
     console.log('Something went wrong.');
     console.error(error);
     stepsHeaderSetStati([stepsHeaderStati[0], 'error', stepsHeaderStati[2]]);
     stepsHeaderSetSubTitles([stepsHeaderSubTitles[0], <>Error.</>, stepsHeaderSubTitles[2]])
     stepsHeaderSetDescriptions([stepsHeaderDescriptions[0], <>Response error.<br />{error.message}</>, stepsHeaderDescriptions[2]])
   });
 }

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
    stepsHeaderSetDescriptions([<>Working..</>, stepsHeaderDescriptions[1], stepsHeaderDescriptions[2]]);
    stepsHeaderSetSubTitles([<><Spin/></>, stepsHeaderSubTitles[1], stepsHeaderSubTitles[2]]);
    // Go to WS1.
    const url = 'http://127.0.0.1:5004/random';
    console.log(`Starting fetch from ${url}`);
    fetch(url)
      .then( response => {
        //
        if (response.ok) {
          console.log(response + ' received.');
          return response.json();
        }
        // else raise error.
        throw response;
      })
      .then(data => {
        // console.log(JSON.stringify(data));
        // Input image data into our image data array.
        // setImageResultArray( imageResultArray.splice(0, 0, `data:image/png;base64,${data.encoded_picture}`) );
        let currentSrc = `data:image/jpg;base64,${data.encoded_picture}`;
        setImageResultArray([data.encoded_picture, imageResultArray[1], imageResultArray[2]]);
        // console.log(imageResultArray[0]);
        stepsHeaderSetStati(['finish', stepsHeaderStati[1], stepsHeaderStati[2]]);
        stepsHeaderSetSubTitles([<>Success.</>, stepsHeaderSubTitles[1], stepsHeaderSubTitles[2]])
        stepsHeaderSetDescriptions([
        <>
        <p>Response data:</p>
        {/* <p>{JSON.stringify(data)}</p> */}
        <img src={currentSrc} width={700} />
        </>, stepsHeaderDescriptions[1], stepsHeaderDescriptions[2]]);
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
  const fetchFromWS2 = async () => {
    stepsHeaderSetSubTitles([stepsHeaderSubTitles[0], <>Working..</>, stepsHeaderSubTitles[2]]);;
    stepsHeaderSetDescriptions([stepsHeaderDescriptions[0], <><Spin/></>, stepsHeaderDescriptions[2]]);
    console.log('Submitting images for post-processing.');
    let newBase64 = await postBase64AsFormData(imageResultArray[0], `http://localhost:3001/edgedetect`);
    console.log('new base 64');
    console.log(newBase64);
    setImageResultArray([imageResultArray[0], newBase64, imageResultArray[2]]);
    stepsHeaderSetStati([stepsHeaderStati[0], 'finish', stepsHeaderStati[2]]);
    stepsHeaderSetSubTitles([stepsHeaderSubTitles[0], <>Success.</>, stepsHeaderSubTitles[2]])
    stepsHeaderSetDescriptions([stepsHeaderDescriptions[0], <>
        <p>Response data:</p>
        <img src={newBase64} width={700} />
    </>, stepsHeaderDescriptions[2]]);
    // Post image to WS2
  };
  const fetchFromWS3 = () => {
    stepsHeaderSetStati([stepsHeaderStati[0], stepsHeaderStati[1], 'process']);
    console.log('gettingMarsImages');
    stepsHeaderSetSubTitles([<>Working..</>, stepsHeaderSubTitles[1], stepsHeaderSubTitles[2]])
    stepsHeaderSetDescriptions([<><Spin/></>, stepsHeaderDescriptions[1], stepsHeaderDescriptions[2]])
  };

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
        <body className="App">
          <div className="App-header">
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
              {/*decoded image*/}
              <p>
                <img src={`data:image/jpg;base64,${imageResultArray[0]}`} key={`0 ${imageResultArray[0]}`} width={161} height={121} />
                <img key={`1 ${imageResultArray[1]}`} src={imageResultArray[1]} width={161} height={120} />
                <img key={`2 ${imageResultArray[2]}`} src={imageResultArray[2]} width={161} height={120} />
              </p>
              {!loading ?
                (
                  <>
                    <Button onClick={fetchButtonHandler}>Fetch.</Button>
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

          </div>
            <section class="small-text theme-info">
              <span>
                <span>Theme RGB: {themeColour} </span>
                <span>Theme Time: {themeTime} </span>
                <span>Bezier ease: {easeRatio} </span>
              </span>
            </section>
        </body>
      </ConfigProvider>
    </>
  );
}

export default App;
