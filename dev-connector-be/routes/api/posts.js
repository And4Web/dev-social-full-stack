const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../models/Post');

// validation
const validatePostInput = require('../../validation/post');

// @route GET api/posts/test
// @desc posts test endpoint
// @access Public

router.get('/test', (req, res)=>res.json({msg: "posts is working."}))

// @route POST api/posts
// @desc  creates a new post
// @access Private

router.post('/', passport.authenticate('jwt', {session: false}), (req, res)=>{
  //validate
  const {errors, isValid} = validatePostInput(req.body);

  if(!isValid){
    //return response with 400 status and errors object.
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  })

  newPost.save().then(post => res.json(post));
})


module.exports = router;