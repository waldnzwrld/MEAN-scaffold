'use strict';

// Call packages
// 

let    express = require('express'),
        app = express(),
        path = require('path'),
        config = require('./config'),
        bodyParser = require('body-parser'),
        morgan = require('morgan'),
        mongoose = require('mongoose');

//connect to mongodb using URL in config.js 
//
/*mongoose.connect(config.database);
mongoose.connection.on('open', function(err) {
    if (err)
        console.log(err);
    console.log('Connected to Database');
});*/

//use body-parser to handle information from POST requests 
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

//Allow the use of Cross Origin Requests [CORS]
//
app.use( (req, res, next) => {
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    res.setHeader(`Access-Control-Allow-Methods`, `GET, POST`);
    res.setHeader(`Access-Control-Allow-Headers`, `X-Requested-With,content-type, Authorization`);
    next();
});

//configure morgan for logging (in this case to console)
//
app.use(morgan(`dev`));

//Add static dir for public files 
//
app.use(express.static(`${__dirname}/public`));


//app.use(`/api`, require(`./app/ROUTE`));


//basic route for home page 
//
app.get(`*`, (req, res) => {
    res.sendFile(path.join(`${__dirname}/public/app/index.html`));
});


//Start the server 
//
let server = app.listen(config.port, () => {
    console.log(`ready on port: ${config.port}`);
});
module.exports = server;

