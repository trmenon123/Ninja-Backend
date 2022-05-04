const path = require('path');
const fs = require('fs');
const {userServices} = require('../../services');

const { uploadFile} = require('../../middleware');

const uploadController = async (req, res) => {
    try{
        if(req.params) {
            const noteId = req.params.noteId;
            const note = await userServices.getNoteByIdService(noteId);
            if(note?.exist === true) {
                console.log("Initiating upload process to server");
                uploadFile(req, res, async function (err) {
                    if (err){
                        console.log(JSON.stringify(err));
                        res.status(200)
                        .json({
                            success: false, 
                            message: "Unable to upload to server",
                            data: {}
                        });
                    } else {
                        console.log('The filename is ' + res.req.file.filename);
                        const data = {mediaPresent: true, mediaUrl: res.req.file.filename};
                        const updatedNote = await userServices.updateNoteById(noteId, data);
                        res.status(200)
                        .json({
                            success: true, 
                            message: "File Uploaded to server", 
                            data: updatedNote
                        });  
                    }
                });
            }else {
                res.status(200)
              .json({
                success: false, 
                message: "Invalid note id",
                data: {}
            });
            }
        }else {
            res.status(200)
              .json({
                success: false, 
                message: "Note Id is not present",
                data: {}
            });
        }
    }catch(err) {
        console.log("[ERROR: ASSETCONTROLLER] Exception encountered in assetcontroller upload");
        console.log(err);
        res.status(200)
          .json({
            success: false, 
            message: "api failed",
            data: {}
        });
    }    
};

// Getting media files
const downloadController = (req, res)=> {
    try {
      const file = req.params.file;
      const fileLocation = path.join(`${__basedir}/images/`, file);
      res.sendFile(`${fileLocation}`);
    }catch(err) {
      console.log(err);
      res.status(200)
      .json({
        success: false, 
        message: "api failed", 
        asset: {}
      });
    }
  }

module.exports = {
    uploadController,
    downloadController,
  }