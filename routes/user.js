const express = require("express");
const router = express.Router();
const  User  = require("../models/User1");
const bcrypt = require("bcrypt");
// const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/AuthMiddleware");
const jwt = require('jsonwebtoken');
const JWT_SECRET="process.env.jwt";

// console.log("sjgf")


router.post("/signup", async (req, res) => {
  // console.log("sdf")
    try {
      
      //generate new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
      //create new user
      const newUser = new User({
        email: req.body.email,
        password: ""+hashedPassword, 
      });
      console.log(newUser)
      //save user and respond
      const user = await newUser.save();
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json(err)
    }
  });

const verifyUserLogin = async (email,password)=>{
    try {
      // console.log(User)
        const user = await User.findOne({email:email})
        console.log(user)
        if(!user){
            return {status:'error',error:'user not found'}
        }
        if(await bcrypt.compare(password,user.password)){
            // creating a JWT token
            token = jwt.sign({username:user.email,type:'user'},JWT_SECRET,{expiresIn: '60s'})
            return {status:'ok',data:token}
        }
        return {status:'error',error:'invalid password'}
    } catch (error) {
        console.log(error);
        return {status:'error',error:'timed out'}
    }
}

router.get("/", validateToken, (req, res) => {
    return res.status(200).json("user with valid access token")
  });
  
router.post('/login',async(req,res)=>{
  console.log("login")
  const {email,password}=req.body;
  // we made a function to verify our user login
  const response = await verifyUserLogin(email,password);
  if(response.status==='ok'){
      // storing our JWT web token as a cookie in our browser
      //1 minute experies
      res.cookie('token',token,{ maxAge: 60000}); 
      return res.status(200).json(response)
  }else{
      res.status(500).json(response);
  }
})


module.exports = router;