const express = require("express");
const userQueryData = require('../../config/queryData/userQueryData');
const userrouter = express.Router();

userrouter.post('/' , async (req,res,next) => {
    
    const stat = await userQueryData.insertUser(req.body.userid , req.body.username , req.body.msisdn , req.body.isLoggedIn);
    if(stat){
    res.status(200).json({
        message: "USER REGISTERED SUCCESSFULLY"
    });
} else {
    res.status(200).json({
        message: "ERROR OCCURED WHILE REGISTERING"
    });
}
});

userrouter.get('/' , async (req,res,next) => {
    const users = await userQueryData.getAllUsers();

    (users => {
        res.json(users);
    })
    .catch(err => console.log(err));
});


module.exports = userrouter;