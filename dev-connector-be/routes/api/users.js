const express = require('express');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys');

//Load validation data
const validateRegisterInput = require('../../validation/register');

const router = express.Router();

//bring User model
const User = require('../../models/User');


// @route   GET api/users
// @desc    users endpoint - get all users
// @access  Public

router.get("/", async (req, res)=>{
  res.json({users: await User.find({}, {password: 0, __v: 0})})
// read this tut for mongoose methods: https://www.geeksforgeeks.org/mongoose-find-function/
})

// @route   GET api/users/test
// @desc    users endpoint - test
// @access  Public

router.get('/test', (req, res)=>res.json({msg: "users is working."}));

// @route   GET api/users/register
// @desc    users endpoint to register new user
// @access  Public

router.post('/register', (req, res)=>{
  //check validation
  const {errors, isValid} = validateRegisterInput(req.body);
  if(!isValid){
    return res.status(400).json(errors)
  }
  //find user in database
  User.findOne({email: req.body.email}).then(user=>{
    if(user){
      return res.status(400).json({email: "This email already exists."})
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', //size
        r: 'pg',  //rating
        d: 'mm'   //default
      })

    //Create new User

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      })

      //Encrypt the password for better security

      bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(newUser.password, salt, (err, hash)=>{
          if(err) throw err;
          newUser.password = hash;          
          newUser.save().then(user=> res.json(user)).catch(e=> console.log(e))
        })
      })

    }
  })
});

// @route   GET api/users/login
// @desc    login the existing user and generating/using tokens 
// @access  Public

router.post('/login', (req, res)=>{
  const email = req.body.email;
  const password = req.body.password;

  //find user in database

  User.findOne({email}).then(user=>{
    //check for user
    if(!user){
      return res.status(400).json({email: "User not found."})
    }
    //check password
    bcrypt.compare(password, user.password).then(isMatch=>{
      if(isMatch){
        // on Successful login
        // res.json({msg: "Login Success."})

        // create token using this payload
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        }
        // Sign Token
        jwt.sign(payload, keys.secretTokenKey, {expiresIn: 3600}, (err, token)=>{
          res.json({
            success: true,
            token: "Bearer " + token,
          })
        })
      } else{
        return res.status(400).json({password:"Incorrect Password."})
      }
    })
  })
})

// @route   GET api/users/current
// @desc    Return current user after authentication 
// @access  Private

router.get('/current', passport.authenticate('jwt', {session: false}), (req, res)=>{
  res.json({msg: "success", user: {name: req.user.name, email: req.user.email, avatar: req.user.avatar? req.user.avatar: "null", createdAt: req.user.date}})
})


module.exports = router