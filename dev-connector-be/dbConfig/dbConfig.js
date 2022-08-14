const mongoose = require('mongoose');
const key = require('./keys')

const db = mongoose.connect(key.mongoURI).then(()=>console.log("mongoDB is connected now.")).catch(err=>console.log(err));

module.exports = db;