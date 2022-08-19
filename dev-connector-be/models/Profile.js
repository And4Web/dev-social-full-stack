const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  handle:{
    type: String,
    required: true,
    max: 40
  },
  company:{
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  githubUsername: {
    type: String
  },
  experience: [
    {
      title:{
        type: String,
        required: true
      },
      company:{
        type: String
      },
      location:{
        type: String
      },
      from:{
        type: Date,
        required: true
      },
      to:{
        type: Date
      },
      current:{
        type: Boolean,
        default: false    
      },
      discription:{
        type: String
      }
    }
  ],
  education: [
    {
      course:{
        type: String,
        required: true
      },
      school:{
        type: String,
        required: true
      },
      degree:{
        type: String,
        required: true
      },
      from:{
        type: Date,
        required: true
      },
      to:{
        type: Date
      },
      current:{
        type: Boolean,
        default: false    
      },
      discription:{
        type: String
      }
    }
  ],
  social:{
    youtube: {
      type: String
    },
    facebook: {
      type: String
    },
    twitter: {
      type: String
    },
    instagram: {
      type: String
    },
    linkedin: {
      type: String
    },
    discord: {
      type: String
    },

  },
  date:{
    type: Date,
    defaul: Date.now
  }
})

module.exports = Profile = mongoose.model('profile', ProfileSchema);