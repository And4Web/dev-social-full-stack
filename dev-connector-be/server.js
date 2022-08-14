const express = require('express');
const port = process.env.PORT || 5000;
const db = require('./dbConfig/dbConfig');

const app = express();

//database connect
db.db;

app.get('/', (req, res)=>res.send("Hello, Anand!"))

app.listen(port, ()=>console.log(`Your Server is running at Port ${port}`))