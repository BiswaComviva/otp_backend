const express = require("express");
const otpGen = require("../../processes/otp/otpGen");
const queries = require('../../config/queries/mysqlQueries');
const queriesData = require('../../config/queryData/userQueryData');
const conn = require('../../config/database');
const otprouter = express.Router();
var dateTime = require('node-datetime');
var moment = require("moment");



async function otp_flow(phno,userid,time){
  const otpObj = new otpGen();
  // checking for number of trials
  if (time.trials > 0){
    console.log("log: Number of trials is greater than 0")
    var otp = otpObj.createOTP('91'+phno);
    await queriesData.updateOtpsTrials(userid,otp);
    return 1
    }
  else{
    console.log("log: Number of trials is  0")
    return 0
    }
  }

async function output_json(res,flag){
  console.log("log: Flag for output json is",flag)
  if(flag==1){
    res.status(200).json({
          message: "OTP sent successfully ! ",
          code:1
      });
    }
    else {
      res.status(200).json({
        message: "Maximum number of attempts done. ",
        code:4

      });
    }
}


otprouter.post('/' ,  async (req,res,next) =>  {

    const otpObj = new otpGen();
    const { userid , phno, isLoggedIn} =  await queriesData.checkRegistered(req.body.userid)
    var dt = dateTime.create();
    dt.format('Y/m/d H:M:S');
    var current_datetime=new Date(dt.now());

    // Check if user exists and not logged in

    if((userid) && (!isLoggedIn)) {
      // Get user information from otp page
      const  time = await queriesData.checkUserExistance(req.body.userid);
      var user_last_access_time=time.time;
      // check if user has already requested otp before
      if(time){
          // Check for time frame
          console.log("log : user exists in otp table")
          if((Math.abs(current_datetime-user_last_access_time)/ 36e5)<24){
            console.log("log : user timeframe is < 24 hours")
              var flag=await otp_flow(phno,userid,time)
              output_json(res,flag,1)
              }
          else {
            // User timefrme is > 24 hours , update the number of trials
            console.log("log : user time frame is greater than 24 hours")
            await queriesData.updateOtpsTime(userid);
            var flag=await otp_flow(phno,userid,time)
            output_json(res,flag)
          }
      }
      // User has not requested data before
      else {
        console.log("log: Creating new entry in otps table")
        // create otp row for new user
        var otp = otpObj.createOTP('91'+phno);
        await queriesData.insertOtps(userid,otp);
        output_json(res,1)
        }
      }
      // User exists nut already logged in
      else if(isLoggedIn){
        console.log("log: User logged in")

        res.status(200).json({
                message: "USER IS ALREADY LOGGED IN  ",
                code:2
            });
          }
      // User not registered
      else {
          res.status(200).json({
                message: "USER NOT REGISTERED ",
                code:3
            });
          }
      });


otprouter.post('/:otpId' , async (req,res,next) => {

    const otpObj = new otpGen();
    const otp = req.params.otpId
    const userid=req.body.userid

    const isvalid = otpObj.ValidateOTP(otp);
    console.log(isvalid);
    if(isvalid == false) {
      await queriesData.updateOtpsTrials(userid,otp);
       res.status(200).json({
           message: "Please enter valid OTP",
           code: 5
       });
    } else {
      await queriesData.updateUserLogin(userid);
      await queriesData.updateOtpsTime(userid);
        res.status(200).json({
            message: "Login Successfull",
            code: 6
        })
    }

});

module.exports = otprouter;
