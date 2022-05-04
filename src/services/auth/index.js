const userSchema = require('../../model/userModel');
const UserProfileSchema = require('../../model/userProfileModel');

// Get User By Email [SERVICES]
const getUserByEmail = async (email)=> {
    const user = await userSchema.findOne({email});
    try {
        if(user){
            return{exist: true, data: user};
        }else {
            return{exist: false, data: {}};
        }
    }catch(err){
        console.log("[ERROR] Getting user by email");
        console.log(error);
        return {success: false, data:{}};
    }    
};

// Create New User [SERVICES]
const createNewUser = async (user)=> {
    try {
        const newUser = new userSchema(user);
        await newUser.save((error, user) => {
          if (error) {
              console.log("[ERROR] Creating new user");
              console.log(error);
          }
          return user;
        });
        return newUser;
    }catch (error) {
        console.log("[EXCEPTION] Creating new user");
    }
};

// Create New User Profile [SERVICES]
const createNewUserProfile = async (data)=> {
    try {
        const newUserProfile = new UserProfileSchema(data);
        await newUserProfile.save((error, userProfile) => {
          if (error) {
              console.log("[ERROR] Creating new user profile");
              console.log(error);
          }
          return userProfile;
        });
        return newUserProfile;
    }catch (error) {
        console.log("[EXCEPTION] Creating new user profile");
    }
};

// Get User Profile by UserID
const getUserProfileByUserId = async (userId)=> {
    const userProfile = await UserProfileSchema.findOne({userId});
    try {
        if(userProfile){
            return{exist: true, data: userProfile};
        }else {
            return{exist: false, data: {}};
        }
    }catch(err){
        console.log("[ERROR] Getting user by email");
        console.log(error);
        return {success: false, data:{}};
    }    
}

module.exports= {
    getUserByEmail,
    createNewUser,
    createNewUserProfile,
    getUserProfileByUserId
};