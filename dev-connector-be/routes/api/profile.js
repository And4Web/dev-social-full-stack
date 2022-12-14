const express = require('express');
const router = express.Router();
const passport = require('passport');

//load validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

//Load Profile Model
const Profile = require('../../models/Profile');
//Load User Model
const User = require('../../models/User');
const profile = require('../../validation/profile');

// @route GET api/profile/test
// @desc profile test endpoint
// @access Public

router.get('/test', (req, res)=>res.json({msg: "profile is working."}))

// @route GET api/profile
// @desc user profile after successful login
// @access Private

router.get('/', passport.authenticate('jwt', {session: false}), (req, res)=>{
  const errors = {};
  
  Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']).then(profile => {
    if(!profile){
      errors.noProfile = 'There is no profile for this user.';
      return res.status(404).json(errors);
    }
    res.json(profile);
  }).catch(err => res.status(404).json(err))
});

// @route GET api/profile/all
// @desc get all profiles
// @access Public

router.get('/all', (req, res)=>{
  const errors = {};
  Profile.find({}).populate('user', ['name', 'avatar']).then(async profiles=>{
    if(!profiles){
      errors.noProfiles = 'There are no profiles.'
      res.status(404).json(errors);
    }
    res.json({profiles: await Profile.find({})});
  }).catch(err=>res.status(400).json({profiles: 'There are no profiles.'}));
})


// @route GET api/profile/handle/:handle
// @desc get profile by handle
// @access Public

router.get('/handle/:handle', (req, res)=>{
  const errors = {};
  Profile.findOne({handle: req.params.handle}).populate('user', ['name', 'avatar']).then(profile=>{
    if(!profile){
      errors.noProfile = 'This profile does not exist.'
      res.status(404).json(errors);
    }
    res.json(profile);
  }).catch(err=>res.status(400).json(err));
})

// @route GET api/profile/user/:userId
// @desc get profile by user Id
// @access Public

router.get('/user/:userId', (req, res)=>{
  const errors = {};
  Profile.findOne({user: req.params.userId}).populate('user', ['name', 'avatar']).then(profile=>{
    if(!profile){
      errors.noProfile = 'This profile does not exist.'
      res.status(404).json(errors);
    }
    res.json(profile);
  }).catch(err=>res.status(400).json({profile: 'This user does not exist.'}));
})

// @route POST api/profile
// @desc  create/update user profile
// @access Private

router.post('/', passport.authenticate('jwt', {session: false}), (req, res)=>{
  //validate profile
  const {errors, isValid} = validateProfileInput(req.body);
  if(!isValid){
    //return errors
    res.status(400).json(errors);
  }
  // get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if(req.body.handle) profileFields.handle = req.body.handle;
  if(req.body.company) profileFields.company = req.body.company;
  if(req.body.website) profileFields.website = req.body.website;
  if(req.body.location) profileFields.location = req.body.location;
  if(req.body.bio) profileFields.bio = req.body.bio;
  if(req.body.status) profileFields.status = req.body.status;
  if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
  //Skills - split into array 
  if(typeof req.body.skills !== 'undefined'){
    profileFields.skills = req.body.skills.split(',');
  } 
  //Social
  profileFields.social = {};
  if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
  if(req.body.discord) profileFields.social.discord = req.body.discord;

  Profile.findOne({user: req.user.id}).then(profile=>{
    if(profile){
      //update
      Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true}).then(profile=>res.json(profile))
    }else{
      //create
      //check if the handle exists
      Profile.findOne({handle: profileFields.handle}).then(profile=>{
        if(profile){
          errors.handle = 'this handle already exists.';
          res.status(400).json(errors)
        }
        //save profile
        new Profile(profileFields).save().then(profile=>res.json(profile));
      })
    }
  })
});

// @route POST api/profile/experience
// @desc  create/update user experience
// @access Private

router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res)=>{
  //validate experience
  const {errors, isValid} = validateExperienceInput(req.body);
  if(!isValid){
    //return errors
    res.status(400).json(errors);
  }
  Profile.findOne({user: req.user.id}).then(profile=>{
    const newExp = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    }
    //Add to exp Array
    profile.experience.unshift(newExp);
    profile.save().then(profile=> res.json(profile))
  })
})

// @route POST api/profile/education
// @desc  create/update user education
// @access Private

router.post('/education', passport.authenticate('jwt', {session: false}), (req, res)=>{
  //validate education
  const {errors, isValid} = validateEducationInput(req.body);
  if(!isValid){
    //return errors
    res.status(400).json(errors);
  }
  Profile.findOne({user: req.user.id}).then(profile=>{
    const newEdu = {
      school: req.body.school,
      course: req.body.course,
      degree: req.body.degree,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    }
    //Add to exp Array
    profile.education.unshift(newEdu);
    profile.save().then(profile=> res.json(profile))
  })
})

// @route DELETE api/profile/experience/:expID
// @desc  delete user experience
// @access Private

router.delete('/experience/:expId', passport.authenticate('jwt', {session: false}), (req, res)=>{
  //validate experience
  const {errors, isValid} = validateExperienceInput(req.body);
  if(!isValid){
    //return errors
    res.status(400).json(errors);
  }
  Profile.findOne({user: req.user.id}).then(profile=>{
    //get remove index
    const removeIndex = profile.experience.map(item=>item.id).indexOf(req.params.expId);

    //splice out of the array
    profile.experience.splice(removeIndex, 1);

    //save
    profile.save().then(profile=> res.json(profile))
  }).catch(err => res.status(404).json(err))
})

// @route DELETE api/profile/education/:eduID
// @desc  delete user education
// @access Private

router.delete('/education/:eduId', passport.authenticate('jwt', {session: false}), (req, res)=>{
  //validate education
  const {errors, isValid} = validateEducationInput(req.body);
  if(!isValid){
    //return errors
    res.status(400).json(errors);
  }
  Profile.findOne({user: req.user.id}).then(profile=>{
    //get remove index
    const removeIndex = profile.education.map(item=>item.id).indexOf(req.params.eduId);

    //splice out of array
    profile.education.splice(removeIndex, 1);

    //save
    profile.save().then(profile=> res.json(profile))
  }).catch(err=>res.status(404).json(err))
})

// @route DELETE api/profile
// @desc  delete user profile
// @access Private

router.delete('/', passport.authenticate('jwt', {session: false}), (req, res)=>{
   Profile.findOneAndRemove({user: req.user.id}).then(()=>{
    User.findOneAndRemove({_id: req.user.id}).then(()=>res.json({deleteSuccess: "Profile deleted"}))
   })

})

module.exports = router