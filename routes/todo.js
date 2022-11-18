const Todo = require("../models/ToDo");
const router = require("express").Router();
const bcrypt = require("bcrypt");
var otpGenerator = require('otp-generator');



/**
 * @swagger
 * /api/todoapi/todos:
 *  post:
 *    summary: create a todo by ID.
 *    description: create the Specific todo
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        schema:
 *           type: object
 *           required:
 *             - task
 *             - status
 *           properties:
 *             task:
 *               type: string
 *             status:
 *               type: string 
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          schema:
 *            type: object
 */                  
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

/**
 * @swagger
 * /api/todoapi/todos/{todoId}:
 *  get:
 *    summary: Returns a todo by ID.
 *    description: Returns the Specific todo
 *    parameters:
 *      - name: todoId
 *        in: path
 *        required: true
 *    responses:
 *      '200':
 *        description: A successful response
 *        schema:
 *          type: object
 * 
 */
 router.get("/todos/:id", async (req, res) => {
    try {
        //fetch todo 
        const todo = await Todo.findById(req.params.id);
        res.status(200).json(todo);
        } catch (err) {
            return res.status(500).json(err)
        }
});


/**
 * @swagger
 * /api/todoapi/todos/{todoId}:
 *  patch:
 *    summary: update a todo by ID.
 *    description: update the Specific todo
 *    parameters:
 *      - name: todoId
 *        in: path
 *        required: true 
 *      - in: body
 *        name: body
 *        schema:
 *           type: object
 *           properties:
 *             task:
 *               type: string
 *             status:
 *               type: string 
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          schema:
 *            type: object
 */   
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

/**
 * @swagger
 * /api/todoapi/todos/{todoId}:
 *  put:
 *    summary: update a todo by ID.
 *    description: update the Specific todo
 *    parameters:
 *      - name: todoId
 *        in: path
 *        required: true 
 *      - in: body
 *        name: body
 *        schema:
 *           type: object
 *           properties:
 *             task:
 *               type: string
 *             status:
 *               type: string 
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          schema:
 *            type: object
 */                  
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




/**
 * @swagger
 * /api/todoapi/todos/{todoId}:
 *  delete:
 *    summary: Returns a todo by ID.
 *    description: Returns the Specific todo
 *    parameters:
 *      - name: todoId
 *        in: path
 *        required: true
 *    responses:
 *      '200':
 *        description: A successful response
 *        schema:
 *          type: object
 * 
 */
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