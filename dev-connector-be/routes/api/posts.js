const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../models/Post');

// Profile model
const Profile = require('../../models/Post');

// validation
const validatePostInput = require('../../validation/post');
const validateCommentInput = require('../../validation/comment');
const { validate } = require('../../models/Post');

// @route GET api/posts/test
// @desc posts test endpoint
// @access Public

router.get('/test', (req, res)=>res.json({msg: "posts is working."}))

// @route GET api/posts
// @desc  get all posts
// @access Public

router.get('/', (req, res) => {
  Post.find()
  .sort({date: -1})
  .then(posts => res.json(posts))
  .catch(() => res.status(404).json({noPostsFound: 'no posts found.'}))
})

// @route GET api/posts/:postId
// @desc  get a single post by id
// @access Public

router.get('/:postId', (req, res)=>{
  Post.findById(req.params.postId)
  .then(post => res.json(post))
  .catch(() => res.status(404).json({noPostFound: 'no post having this id found.'}))
})

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

// @route DELETE api/posts/:postId
// @desc  deletes post by id
// @access Private

router.delete('/:postId', passport.authenticate("jwt", {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
  .then(profile => {
    Post.findById(req.params.postId)
    .then(post => {
      //check for the post owner
      if(post.user.toString() !== req.user.id){
        return res.status(405).json({notAuthorized: 'user not authorized.'})
      }
      //delete post
      post.remove().then(() => res.json({success: true}));
    })
    .catch(err=> res.status(400).json({postNotFound: 'no post found.'}))
  })
})

// @route POST api/posts/like/:postId
// @desc  Like post
// @access Private

router.post('/like/:postId', passport.authenticate("jwt", {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
  .then(profile => {
    Post.findById(req.params.postId)
    .then(post => {

      //Check if already liked
      if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
        return res.status(404).json({alreadyLiked: 'You already liked this post.'})
      }
      //Add user to likes array
      post.likes.unshift({user: req.user.id})

      post.save().then(post => res.json(post))
    })
    .catch(() => res.status(400).json({postNotFound: 'no post found.'}))
  })
})

// @route POST api/posts/unlike/:postId
// @desc  Unlike post
// @access Private

router.post('/unlike/:postId', passport.authenticate("jwt", {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
  .then(profile => {
    Post.findById(req.params.postId)
    .then(post => {
      //Check if already liked
      if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
        return res.status(404).json({notLiked: 'You have not yet liked this post.'})
      }

      //remove index
      const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)

      //Splice out the like
      post.likes.splice(removeIndex, 1)

      post.save().then(post => res.json(post))
    })
    .catch(() => res.status(400).json({postNotFound: 'no post found.'}))
  })
})

// @route POST api/posts/comment/:postId
// @desc  Comment on a post
// @access Private

router.post('/comment/:postId', passport.authenticate('jwt', {session: false}), (req, res) => {

  const {errors, isValid} = validateCommentInput(req.body);
  if(!isValid){
    //return response with 400 status and errors object.
    return res.status(400).json(errors);
  }

  Post.findById(req.params.postId)
  .then(post => {
    const newComment = {
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    }
    
    //Add comment to Comments array
    post.comments.unshift(newComment);

    //save
    post.save().then(post => res.json(post))
  })
  .catch(() => res.status(404).json({postNotFound: 'post not found.'}))

})
// @route DELETE api/posts/comment/:postId/:commentId
// @desc  remove Comment from a post
// @access Private

router.delete('/comment/:postId/:commentId', passport.authenticate('jwt', {session: false}), (req, res) => {

  Post.findById(req.params.postId)
  .then(post => {
    //check to see if comment exists

    if(post.comments.filter(comment => comment._id.toString() === req.params.commentId).lenght === 0){
      return res.status(404).json({commentNotFound: 'commment not found.'})
    }

    //Get removeIndex

    const removeIndex = post.comments.map(comment => comment._id.toString()).indexOf(req.params.commentId);
    
    //splice the comment away from the comments array

    post.comments.splice(removeIndex, 1);

    //save

    post.save().then(post => res.json(post))

  })
  .catch(() => res.status(404).json({postNotFound: 'post not found.'}))

})

module.exports = router;