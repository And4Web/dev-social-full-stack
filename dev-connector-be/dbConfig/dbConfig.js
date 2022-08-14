const mongoose = require('mongoose');
const key = require('./keys')

const db = mongoose.connect(key.mongoURI).then(()=>console.log("Connected to MongoDB now.")).catch(err=>console.log(err));

module.exports = db;