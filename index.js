var otpGenerator = require('otp-generator');
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyparser=require("body-parser");
var cookieParser = require('cookie-parser');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const todoRoute = require("./routes/todo");
const userRoute = require("./routes/user");

app.use(express.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(cookieParser());
const port = process.env.PORT || 3001;

mongoose.connect("mongodb+srv://shashank:Password_123@facebookdb.5sfnbit.mongodb.net/facebookdb?retryWrites=true&w=majority"
    ,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("Connected to MongoDB");
    }
  );
  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: "1.0.0",
        title: "Customer API",
        description: "Customer API Information",
        contact: {
          name: " Developer"
        },
        servers: [`http://localhost:${port}`]
      }
    },
    // ['.routes/*.js']
    apis: ['./routes/*.js']
  };

  app.use("/api/todoapi", todoRoute);
  app.use("/api/authapi", userRoute);

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  app.listen(port, () => {
    console.log("Backend server is running!");
  });