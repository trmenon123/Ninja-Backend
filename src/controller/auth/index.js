const { authServices }= require('../../services');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('config');

// Create User [CONTROLLER]
const createUser = async (req,res)=> {
    const userQuery = await authServices.getUserByEmail(req?.body?.email);
    try{
        if(userQuery?.exist== true) {
            res.status(200)
            .json({
                success: false, 
                message:"User already Exist", 
                data: userQuery?.data
            });            
        }
        if(userQuery?.exist== false) {
            // Call to create new user            
            const userData = { email: req.body?.email, password: req.body?.password};            
            const newUser = await authServices.createNewUser(userData);
            if(newUser) {
                const userProfileData = {
                    userId: newUser._id,
                    firstName: req.body?.firstName,
                    lastName: req.body?.lastName,
                    address: req.body?.address,
                };
                const newUserProfile = await authServices.createNewUserProfile(userProfileData);
                res.status(200)
                .json({
                    success: true, 
                    message: "New user created", 
                    data: newUserProfile
                });
            }else {
                res.status(200)
                .json({
                    success: false, 
                    message: "Unable to create User Account", 
                    data: {}
                }); 
            }
        }
    }catch(err){
        res.status(200).json({success: false, message: "Call not acheived", data: {}});
    }
};

// User Signin [CONTROLLER]
const signin = async(req, res)=> {
    const userQuery = await authServices.getUserByEmail(req.body?.email);
    try{
        if(userQuery?.exist=== false) {
            res.status(200).json({
                success: false, 
                message: "User not registered", 
                data: {}
            });
        }
        if(userQuery?.exist=== true) {

            // Getting User Profile
            const userProfile = await authServices.getUserProfileByUserId(userQuery?.data?._id);
            if(userProfile?.exist === true) {

                // Getting encrypted password 
                const validpassword = await bcrypt.compare(
                    req.body?.password,
                    userQuery?.data?.password
                );

                if(validpassword) {
                    // JWT Authentication
                    const secret = config.get("jwt.secret");
                    const token = jwt.sign(
                        {_id: userQuery?.data._id},
                        secret,
                        {expiresIn: '1d'}
                    );

                    res.cookie('token', token, {expiresIn:'1d'});

                    res.status(200).json({
                        success: true, 
                        message: "Signin success", 
                        data: userProfile?.data, 
                        token
                    });
                }else {
                    res.status(200).json({
                        success: false, 
                        message: "Incorrect Password", 
                        data: {}
                    });
                } 
            }else {
                res.status(200).json({
                    success: false, 
                    message: "Unable to get User Profile", 
                    data: {}
                });
            }                             
        }
    }catch(err){
        console.log("[ERROR] User Signin terminated");
        console.log(err);   
        res.status(200).json({
            success: false, 
            message: "API failed", 
            data: {}
        });     
    }
};

// User Signout [CONTROLLER]
const signout = (req, res)=> {
    res.clearCookie('token');
    res.json({
        success: true,
        message: "Signout success"
    });
};

// Middleware
const requireSignin= expressJwt({
    secret: config.get("jwt.secret"),
    algorithms: ["HS256"], // added later
    userProperty: "auth",
});

module.exports= {
    createUser,
    signin,
    signout,
    requireSignin
}