var otpGenerator = require('otp-generator');
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyparser=require("body-parser");
var cookieParser = require('cookie-parser');

const todoRoute = require("./routes/todo");
const userRoute = require("./routes/user");

app.use(express.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(cookieParser());

mongoose.connect("mongodb+srv://shashank:Password_123@facebookdb.5sfnbit.mongodb.net/facebookdb?retryWrites=true&w=majority"
    ,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("Connected to MongoDB");
    }
  );

  app.use("/api/todoapi", todoRoute);
  app.use("/api/authapi", userRoute);

  app.listen(process.env.PORT || 3001, () => {
    console.log("Backend server is running!");
  });