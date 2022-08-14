const express = require('express');
const port = process.env.PORT || 5000;
const db = require('./dbConfig/dbConfig');

const users = require("./routes/api/users");
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');


const app = express();

//database connect
db.db;

app.get('/', (req, res)=>res.send("Hello, Anand!"))

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.listen(port, ()=>console.log(`Your Server is running at Port ${port}`))