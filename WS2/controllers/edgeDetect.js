const cannyEdgeDetector = require('canny-edge-detector');

const edgeDetectImage = (file) => {
console.log('file' + file);
 return cannyEdgeDetector(file);
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
const post =  (req, res) => {
  console.log('received')
  console.log(req)
  // console.log('uploaded image')
  // console.log(req.file);
  // var newImage = edgeDetectImage(req.file);
  res.json({image: newImage});
}

module.exports = {
  get,
  post
}