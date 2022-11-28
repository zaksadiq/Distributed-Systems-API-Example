const express = require('express');
const router = express.Router();
const controller = require('../controllers/edgeDetect');

// Add image api tool.
const multer = require('multer');
// Implement uploaded image ID counter
var imageID = 0;
// // Establish image folders
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploaded-images');
      },
    filename: function (req, file, cb) {
        console.log('doing this');
        cb(null, imageID+'.jpg');
        console.log('did it.')
    }
});
const upload = multer({ storage: storage });
// Carry out image upload
const uploadImage = () => {
  upload.single('image');
  ++imageID;
}


router.get('/', (req, res) => {
  res.send('Hello World');
})
router.get('/edgedetect', controller.get);
router.post('/edgedetect', upload.single('image'), (res, req) => { console.log('mm'); ++imageID; controller.post(res, req); } );

module.exports = router;