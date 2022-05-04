const userSchema = require('../../model/userModel');
const UserProfileSchema = require('../../model/userProfileModel');
const NotesSchema = require('../../model/notesModel');

// Get User By Id
const getUserByIdService = async (id)=> {
    const user = await userSchema.findById(id);
    try {
        if(user){
            const userProfile = await UserProfileSchema.findOne({userId: user._id});
            if(userProfile) {
                return ({
                    exist: true,
                    data: {userId: user._id,userProfileId: userProfile._id}
                });
            }else {
                return{exist: false, data: {}};
            }            
        }else {
            return{exist: false, data: {}};
        }
    }catch(err){
        console.log("[ERROR] Getting user by email");
        console.log(error);
        return {success: false, data:{}};
    }    
};

// Get Note by title
const getNoteByTitleService = async(title)=> {
    const note = await NotesSchema
        .findOne({title: title})
        .populate(["userProfileId", "userId"]);

    try {
        if(note) {
            return { exist: true, data: note};
        }else {
            return { exist: false, data: {}};
        }
    }catch(err) {
        console.log("[ERROR: SERVICES] Fetching note by title");
        console.log(err);
    }
}

// Creating new note
const createNoteService = async (note)=> {
    try {
        const newNote = new NotesSchema(note);        
        await newNote.save((error, note) => {
          if (error) {
              console.log("[ERROR] Creating new note");
              console.log(error);
          }
          return note;
        });
        return newNote;
    }catch (error) {
        console.log("[ERROR: SERVICE] Creating new note");
    }
}

// Getting all notes for user
const getAllNotesServices = async(data)=> {
    const notes = await NotesSchema.find(data).populate(["userProfileId", "userId"]);
    try {
        if(notes) {
            return {count: notes.length, data: notes};
        }else {
            return { count: 0, data: []};
        }
    }catch(err) {
        console.log("[ERROR: SERVICES] Fetching all notes of user");
        console.log(err); 
    }
}

// Getting note by ID
const getNoteByIdService = async(noteId)=> {
    const note = await NotesSchema.findById(noteId).populate(['userProfileId','userId']);
    try {
        if(note) {
            return {exist: true, data: note};
        }else {
            return {exist: false, data: {}};
        }
    }catch(err) {
        console.log("[ERROR: SERVICE] Exception: Trying to get note by ID");
        console.log(err);
    }
}

// Updating note by id
const updateNoteById = async(id, data)=> {
    const note = await NotesSchema.findById(id);
    try {
        if(note) {
            const updatedNote = await NotesSchema.findByIdAndUpdate(
                id, 
                data, 
                {new: true,}
            );
            return {updated: true, data: updatedNote};            
        }else {
            return {updated: false, data: {}};  
        }
    }catch(err) {
        console.log("[SERVICES] trying to update new stock count error")
    }
}

module.exports= {
    getUserByIdService,
    getNoteByTitleService,
    createNoteService,
    getAllNotesServices,
    getNoteByIdService,
    updateNoteById
}