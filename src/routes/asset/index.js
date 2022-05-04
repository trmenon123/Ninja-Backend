const express = require('express');
const router = express.Router();
const { authController, assetController } = require('../../controller');

// Adding media to note
router.post(
    "/upload/:noteId", 
    authController.requireSignin,
    assetController.uploadController
);

// Getting image as blob
router.get(
    '/download/:file',  
    authController.requireSignin,
    assetController.downloadController
);

module.exports = router;