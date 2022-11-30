const express = require('express');
const path = require('path');
const router = express.Router();
const controller = require('../controllers/edgeDetect');

// Add image upload tool.
const multer = require('multer');
// Implement uploaded image ID counter - 
// TODO: implement as environment variable stored locally,
// so that it can be read on server startup & execution.
let imageID = 0;
// // Establish image folders
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, `${imageID}.jpg`);
  }
});
const upload = multer({ storage: storage });
// Carry out image upload
// const uploadImage = () => {
//   upload.single('image');
// }


router.get('/', (req, res) => {
  res.send('Hello World');
});
router.get('/edgedetect', controller.get);
router.post('/edgedetect', upload.single("image"), (res, req, imageID) => { console.log(req.body); ++imageID; controller.post(res, req); } );
// router.post('/edgedetect', upload.single('image'), (res, req) => { console.log('mm'); ++imageID; controller.post(res, req); } );
// router.post('/edgedetect', upload.single("image"), (req, res) => {
//   if (req.file) {
//     res.send("Single file uploaded successfully");
//   } else {
//     console.log(`request body: ${req.body}`);
//     console.log(req.body);
//     res.status(400).send("Please upload a valid image");
//   }
// });

module.exports = router;