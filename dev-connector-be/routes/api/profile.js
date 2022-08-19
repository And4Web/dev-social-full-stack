const express = require('express');
const router = express.Router();
const passport = require('passport');

//Load Profile Model
const Profile = require('../../models/Profile');
//Load User Model
const User = require('../../models/User');

// @route GET api/profile/test
// @desc profile test endpoint
// @access Public

router.get('/test', (req, res)=>res.json({msg: "profile is working."}))

// @route GET api/profile
// @desc user profile after successful login
// @access Private

router.get('/', passport.authenticate('jwt', {session: false}), (req, res)=>{
  const errors = {};
  
  Profile.findOne({user: req.user.id}).then(profile => {
    if(!profile){
      errors.noProfile = 'There is no profile for this user.';
      return res.status(404).json(errors);
    }
    res.json(profile);
  }).catch(err => res.status(404).json(err))
});

module.exports = router