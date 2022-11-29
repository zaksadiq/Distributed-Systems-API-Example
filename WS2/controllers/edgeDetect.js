const path = require('path');
const { Image } = require('image-js');
const cannyEdgeDetector = require('canny-edge-detector');
const imageToBase64 = require('image-to-base64');

// Clean promises a la await-to-js
const clean = async promise => promise.then(res => [null, res]).catch(err => [err || true, null]);

const edgeDetectImage = async imagePath => {
  // Return promise for easy handling and asynchronous code
  return new Promise((resolve, reject) => {
    const doPromise = async () => {
      // We must use the async keyword on this function to use 'await' below.
      console.log("got to promise");
      // Load image
      let [err, image] = await clean(Image.load(imagePath));
      if (err) {
        console.log("Image load error");
        reject(err);
      }
      else {
        // Carry out processing -
        console.log("Carrying out processing");
        // processing requires image to be black and white.
        let edge = cannyEdgeDetector(image.grey());
        // Return processed image:
        console.log('Success');
        // Save image - returns a resolved promise on completion
        let [err, save] = await clean(edge.save(imagePath));
        // Return error from promise on error
        if (err) { reject(err) }
        console.log(`save: ${save}`);
        console.log(save);
        resolve(save);
      }
    }
    doPromise();
  });
}

//GET /edgedetect
const get = (req, res, next) => {
  // do things
  // ::::::::::::::::::::::::::::::::::::::::::
  // ::::::::::::::::::::::::::::::::::::::::::
  // now send the data:
  // if (!err) {
    const data = { message: 'Hello World' };
  // }
    // Adds header
    res.setHeader('Content-Type', 'application/json');

    // responds with status code 200 and data
    res.status(200).json(data);
}
//POST /edgedetect
// Should run after image upload
const post =  (req, res) => {
  console.log('received');
  console.log(req.file);
  // Make path 'global' so it is unaffected by e.g. images are in Windows but the server runs from WSL.
  const safePath = path.join(__dirname, `../uploads/${req.file.filename}`);
  // Process image
  // abstract out response handling
  const successResponse = base64EncodedImage => {
    // console.log(base64EncodedImage);
    res.json({ "image": `data:image/jpeg;base64,${base64EncodedImage}` });
  }
  const errorHandle = errorMessage => {
    res.status(400).send(errorMessage);
  }
  // Do edge detection.
  edgeDetectImage(safePath)
    .then(
      // Successful processing, image returned.
      result => {
        console.log("got edge detection result");
        console.log(result);
        // Base64 Encode result before sending back
        imageToBase64(safePath)
          .then( base64encoded => { successResponse(base64encoded); } )
          .catch( error => { errorHandle(error.message); }
          );
      })
    .catch(
      error => { errorHandle(error.message); }
    );
}

module.exports = {
  get,
  post
}