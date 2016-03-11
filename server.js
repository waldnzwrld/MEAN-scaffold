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

//register the apiRouter by defining a URL segment 
//

/*
app.use(`/api`, require(`./app/routes`));
app.use(`/api/users`, require(`./app/routes/users`));
app.use(`/api/courses`, require(`./app/routes/courses`));
app.use(`/api/lessons`, require(`./app/routes/lessons`));
app.use(`/api/assignments`, require(`./app/routes/assignments`));
*/

//basic route for home page 
//
app.get(`*`, (req, res) => {
    res.sendFile(path.join(`${__dirname}/public/app/index.html`));
});


//Start the server 
//
let server = app.listen(config.port, () => {
    console.log(`THWNN is ready on port: ${config.port}`);
});
module.exports = server;

