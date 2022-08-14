const mongoose = require('mongoose');
const key = require('./keys')

const db = mongoose.connect(key.mongoURI).then(()=>console.log("Connecte to MongoDB now.")).catch(err=>console.log(err));

module.exports = db;