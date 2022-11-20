const express = require("express");
const router = express.Router();
const  User  = require("../models/User1");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const jwt = require('jsonwebtoken');
const JWT_SECRET="process.env.jwt";
var otpGenerator = require('otp-generator');
const Vonage = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "2cb07ee0",
  apiSecret: "HxJiai0ODI6tnqu0"
})

/**    
 * @swagger
 * /api/authapi/signup:
 *  post:
 *    summary: user signup.
 *    description: create the Specific todo
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        schema:
 *           type: object
 *           required:
 *             - username
 *             - phonenumber
 *           properties:
 *             username:
 *               type: string
 *             phonenumber:
 *               type: string 
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          schema:
 *            type: object
 */ 
router.post("/signup", async (req, res) => {

      if(tempuser==null){     
        const from = "Testing APIs"
        var phonenumber=req.body.phonenumber;
        console.log(phonenumber)
        var to = "91"+phonenumber;   
        const text = 'A test message sent '      
        vonage.message.sendSms(from, to, text, (err, responseData) => {
          if (err) {
              console.log(err);
              return res.status(500).json(err)
          } else {
              if(responseData.messages[0]['status'] === "0") {
                  console.log("Message sent successfully.");
                  try {
                    //generate new password
                    const salt = await bcrypt.genSalt(10);
                    const OTP=otpGenerator.generate(6, { upperCase: false, specialChars: false });
                    console.log(OTP)
                    const hashedOtp = await bcrypt.hash(OTP, salt);
                    const tempuser = await User.findOne({phonenumber:phonenumber})                  
                    //create new user
                    const newUser = new User({
                      username: req.body.username,
                      phonenumber: req.body.phonenumber, 
                      otp:""+hashedOtp,
                    });
                    console.log(newUser)    
                    //save user and respond
                    const user = await newUser.save();    
                    return res.status(500).json("Signup Success")
                    } catch (err) {
                      return res.status(500).json(err)
                    }          
                  
              } else {
                
                  console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                  return res.status(500).json(responseData)
                }
          }
        })      
      }else{
        return res.status(500).json("Phone Number is already Registered")
      }
    
  });

const verifyUserLogin = async (phonenumber)=>{
    try {
      // console.log(User)
        const user = await User.findOne({phonenumber:phonenumber})
        console.log(user)
        if(!user){
            return {status:'error',error:'user not found'}
        }
        if(phonenumber==user.phonenumber){
            // creating a JWT token
            // 10 minutes
            token = jwt.sign({phonenumber:user.phonenumber,type:'user'},JWT_SECRET,{expiresIn: '600s'})
            return {status:'ok',data:token,otp:user.otp}
        }
        return {status:'error',error:'invalid phonenumber'}
    } catch (error) {
        console.log(error);
        return {status:'error',error:'timed out'}
    }
}


/**
 * @swagger
 * /api/authapi/:
 *  get:
 *    summary: user authentication.
 *    description: Returns the Specific todo
 *    parameters:
 *      - name: accessToken
 *        in: header
 *        description: an authorization header
 *        required: true
 *        type: string 
 *    responses:
 *      '200':
 *        description: A successful response
 *        schema:
 *          type: object
 * 
 */
router.get("/", validateToken, (req, res) => {
    return res.status(200).json("user with valid access token")
  });

/**
 * @swagger
 * /api/authapi/login:
 *  post:
 *    summary: login authentication.
 *    description: create the Specific todo
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        schema:
 *           type: object
 *           required:
 *             - phonenumber
 *             - userotp
 *           properties:
 *             phonenumber:
 *               type: string
 *             userotp:
 *               type: string 
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          schema:
 *            type: object
 */  
//
router.post('/signin',async(req,res)=>{
  console.log("signin")
  const {phonenumber,userotp}=req.body;
  // we made a function to verify our user login
  const response = await verifyUserLogin(phonenumber);
  if(response.status==='ok'){
      if(response.otp==userotp){
        // storing our JWT web token as a cookie in our browser
        // 10 minute experies
        res.cookie('token',token,{ maxAge: 600000}); 
        return res.status(200).json(response)
      }else{
        res.status(500).json(response);
      }
  }else{
      res.status(500).json(response);
  }
})

   
module.exports = router;