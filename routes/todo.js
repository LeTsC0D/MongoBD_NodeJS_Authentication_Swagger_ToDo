const Todo = require("../models/ToDo");
const router = require("express").Router();
const bcrypt = require("bcrypt");
var otpGenerator = require('otp-generator');


router.post("/todos", async (req, res) => {
    try {
      //generate new hashed otp
      const salt = await bcrypt.genSalt(10);
      const OTP=otpGenerator.generate(6, { upperCase: false, specialChars: false });
      const hashedOtp = await bcrypt.hash(OTP, salt);
  
      //create new todo
      const newTodo= new Todo({
        task: req.body.task,
        otp:hashedOtp,
        status: req.body.status,
      });
  
      //save todo and respond
      const todo = await newTodo.save();
      return res.status(200).json(todo);
    } catch (err) {
      return res.status(500).json(err)
    }
  });



router.patch("/todos/:id", async (req, res) => {
try {

//update todo and respond
const todo = await Todo.findByIdAndUpdate(req.params.id, {
    $set: req.body,
});

res.status(200).json("ToDo has been updated partally");
} catch (err) {
    return res.status(500).json(err)
}
});


router.put("/todos/:id", async (req, res) => {
try {
    //generate new hashed otp
    const salt = await bcrypt.genSalt(10);
    const OTP=otpGenerator.generate(6, { upperCase: false, specialChars: false });
    const hashedOtp = await bcrypt.hash(OTP, salt);
    const newTodo={...req.body,otp:hashedOtp}
    //update todo and respond
    const todo = await Todo.findByIdAndUpdate(req.params.id, {
        $set: newTodo,
    });

    res.status(200).json("ToDo has been updated fully");
    } catch (err) {
        return res.status(500).json(err)
    }
});



router.get("/todos/:id", async (req, res) => {
    try {
        //fetch todo 
        const todo = await Todo.findById(req.params.id);
        res.status(200).json(todo);
        } catch (err) {
            return res.status(500).json(err)
        }
});



router.delete("/todos/:id", async (req, res) => {
    try {
        //fetch todo 
        const todo = await Todo.findByIdAndDelete(req.params.id);
        res.status(200).json("todo has been deleted");
        } catch (err) {
            return res.status(500).json(err)
        }
});

    


  module.exports = router;