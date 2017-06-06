var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sha512 = require('js-sha512').sha512;

var sslPath = '/home/testload/.cert/';

var options = {  
    key: fs.readFileSync(sslPath + 'privkey1.pem'),
    cert: fs.readFileSync(sslPath + 'fullchain1.pem')
};

var app = express();

// your express configuration here
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/ppum', (req, res) => {
	var salt = 'YH0RwzBavo';
	// var udf = '';
	var { udf, key, txnid, amount, productinfo, firstname, email } = req.body;
	console.log(JSON.stringify(req.body));
	var hashSequence = key 
					  + '|' + txnid
					  + '|' + amount
					  + '|' + productinfo
					  + '|' + firstname
					  + '|' + email
					  + '|' + udf
					  + '|||||||||'
					  + '|' + salt; 
	var hash = sha512(hashSequence);
	// res.send(`hash is ${hash}`);
	res.json({hash});
});

app.use('/success', (req, res) => {
	res.send('success');
})
var httpServer = http.createServer(app);
var httpsServer = https.createServer(options, app);

httpServer.listen(8080);
httpsServer.listen(8443);