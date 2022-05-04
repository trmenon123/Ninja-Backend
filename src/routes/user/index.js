const express = require('express');
const router = express.Router();
const { authController, userController } = require('../../controller');


// Create New Entry
router.post(
    "/createNewNote", 
    authController.requireSignin, 
    userController.createNewNoteController
);

// Getting list of entries
router.post(
    "/getAllNotes", 
    authController.requireSignin,
    userController.getAllNotesController
);

// Updating notes
router.put(
    "/updateNote", 
    authController.requireSignin,
    userController.updateNotesController
);

module.exports = router;