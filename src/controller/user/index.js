const { userServices } = require('../../services');

// Creating new note [CONTROLLER]
const createNewNoteController = async( req, res)=> {
    try{
        if(req?.body) {
            const userExist = await userServices.getUserByIdService(req.body?.createdBy);
            if(userExist?.exist === true) {
                const titleExist = await userServices.getNoteByTitleService(req.body?.title);
                if(titleExist?.exist === true) {
                    res
                    .status(200)
                    .json({
                        success: false, 
                        message: "Note already exist with the same title", 
                        data: {}
                    }); 
                }
                if(titleExist?.exist === false) {
                    if(req.body?.content) {
                        const data = {
                            userId: userExist?.data?.userId,
                            userProfileId: userExist?.data?.userProfileId,
                            title: req.body.title,
                            content: req.body.content,
                            mediaPresent: false,
                            mediaUrl: 'DEFAULT'
                        };
                        const newNote = await userServices.createNoteService(data);
                        if(newNote) {
                            res
                            .status(200)
                            .json({
                                success: true, 
                                message: "Created new note", 
                                data: newNote
                            });
                        }else {
                            res
                            .status(200)
                            .json({
                                success: false, 
                                message: "Unable to create note at the moment. Try again later", 
                                data: {}
                            });
                        }
                        
                    }else {
                        res
                        .status(200)
                        .json({
                            success: false, 
                            message: "Content can not be empty", 
                            data: {}
                        }); 
                    }                    
                }
            }else {
                res
                .status(200)
                .json({
                    success: false, 
                    message: "User not present", 
                    data: {}
                });    
            }
        }else {
            res
            .status(200)
            .json({
                success: false, 
                message: "Request body not present", 
                data: {}
            });
        }       
    }catch(err) {
        console.log("[ERROR: CONTROLLER] Trying to create new entry");
        res
        .status(200)
        .json({success: false, message: "Call not acheived", data: {}});
    }
};

// Getting all notes by user [CONTROLLER]
const getAllNotesController = async( req, res)=> {
    try {
        if(req.body) {
            const user = await userServices.getUserByIdService(req.body?.userId);
            if(user.exist === true) {
                let data = {userId: req.body?.userId};
                if(req.body?.isFilter === true) {
                    data['title'] = req.body?.filterTitle;
                };
                const notes = await userServices.getAllNotesServices(data);
                res
                .status(200)
                .json({
                    success: true, 
                    message: "Notes archived", 
                    data: notes
                });
            }else {
                res
                .status(200)
                .json({
                    success: false, 
                    message: "User does not exist", 
                    data: {}
                });
            }
        }else {
            res
            .status(200)
            .json({
                success: false, 
                message: "request body not present", 
                data: {}
            });
        }
    }catch(err) {
        console.log("[ERROR: CONTROLLER] Trying to get all notes for user");
        res
        .status(200)
        .json({success: false, message: "Call not acheived", data: {}});
    }
}

// Update notes [CONTROLLER]
const updateNotesController = async(req, res)=> {
    try {
        if(req.body) {
            const note = await userServices.getNoteByIdService(req.body?.noteId);
            if(note?.exist === true) {
                const updatedNote = await userServices.updateNoteById(
                    req.body?.noteId, req.body?.data
                );
                res
                .status(200)
                .json({success: true, message: "Note updated", data: updatedNote});
            }else {
                res
                .status(200)
                .json({success: false, message: "Note does not exist", data: {}});
            }
        }else {
            res
            .status(200)
            .json({success: false, message: "Request body not present", data: {}});
        }
    }catch(err) {
        console.log("[ERROR: CONTROLLER] Updating notes");
        console.log(err);
        res
        .status(200)
        .json({success: false, message: "Call not acheived", data: {}});
    }
}

module.exports = {
    createNewNoteController,
    getAllNotesController,
    updateNotesController
}