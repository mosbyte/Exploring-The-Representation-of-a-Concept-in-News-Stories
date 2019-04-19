// server.js

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 5000;
const path = require("path");
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./database.js');
const chantRoute = require('./chantFunctions');
const ritualRoute = require('./ritualFunctions');

mongoose.Promise = global.Promise;
mongoose.connect(config.chant_ritual_db, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('could not make a connection to the database'+ err)}
);

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client/build")));


app.use('/chantnews', chantRoute);
app.use('/ritualnews', ritualRoute);

app.listen(PORT, function(){
  console.log('Server is running on Port:',PORT);
});