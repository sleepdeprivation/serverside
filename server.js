#!/usr/bin/nodejs
var express = require('express');
var bodyParser = require('body-parser');
var corser = require('corser');
var mysql = require('mysql');
//var fs = require('fs');		//for loading debug JSON objects from file, remove later
var app = express();


app.use(corser.create());
app.use(bodyParser.json());



/* DATABASE CONFIGURATION */
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'hermes',
    password: 'apollo11'
});

var dbToUse = 'Hermes';

//use the database for any queries run
var useDatabaseQry = 'USE ' + dbToUse;


//this table exists
//create the User table if it does not exist
connection.query(useDatabaseQry, function (err) {
    if (err) throw err;
});

function getUserPosts(userID, callback){
	connection.query('select username from HeadMessage where userID=?;', [userID],
		function (err, result){
			if(err){
				console.log(err);
				callback(true);
				return;
			}
			callback(false, result);
		}
	);
}

function getChildrenOf(messageID, callback){
	connection.query('select * from ReplyMessages where parentID=?;', [messageID],
		function (err, result){
			if(err){
				console.log(err);
				callback(true);
				return;
			}
			callback(false, result);
		}
	);
}


function getAllHeads(callback){
	connection.query('select * from HeadMessage;',
		function (err, result){
			if(err){
				console.log(err);
				callback(true);
				return;
			}
			callback(false, result);
		}
	);
}

//Debug UI, remove later
app.get('/', function(req, res){
	var responseHTML = '<h1>Debug frontend for Hermes DB</h1>\n' +
		'<p><a href="/submit">Submit routes</a></p>\n' +
		'<form action="/getPostsByRange">\n' + 
		'<p>getPostsByRange</p>\n' +
		'latMin: <input type="text" id="latMin" name="latMin" /><br />\n' +
		'lonMin: <input type="text" id="lonMin" name="lonMin" /><br />\n' +
		'latMax: <input type="text" id="latMax" name="latMax" /><br />\n' +
		'lonMax: <input type="text" id="lonMax" name="lonMax" /><br />\n' +
		'<input type="submit" />\n' + 
		'</form>';
	res.send(responseHTML);
});

app.get('/submit', function (req, res){
	var responseHTML = 	'<form method="post" action="/submit/newop">\n' + 
				'<input type="submit" name="submitop" value="Submit test OP">\n' + 
				'</form>\n<br />\n';
	//reply route hasn't been set up yet
	//var responseHTML +=	'<form method="post" action="/submit/newreply>\n' + 
	//			'<input type="submit" name="submitreply" value="Submit test reply">\n'+
	//			'</form>';
	res.send(responseHTML);
});

/*
	Template for incoming requests
	JSON block will be in req.body. It will need to be
	funnelled into the correct database tables
	Probably we should set up different routes expecting different inputs
*/	
app.post('/submit/newop', function(req, res){
	console.log(req.body);
	var jspost = req.body;
	var qry = connection.query('INSERT INTO HeadMessage SET ?;', jspost,
	function(err, result) { 
		if (err){
			res.send(err);
		}else{
			res.send(result);
		}
	});
	console.log(qry.sql);
});

app.post('/submit/newreply', function(req, res) {
	console.log(req.body);
	var jspost = JSON.parse(req.body);
	var qry = connection.query('INSERT INTO ReplyMessage SET ?', jspost, function(err, result) {
		if (err) {
			res.send(err);
		}
	});
	console.log(qry.sql);
});

/*
	Outgoing requests
	As per the usual we get what the user sent out of req.query
	and can use it in a mysql query or what have you
	We should set up different routes for different types of queries
*/

app.get('/getPostsByRange', function(req, res){
	var 	latMin = parseFloat(req.query.latMin),
		lonMin = parseFloat(req.query.lonMin),
		latMax = parseFloat(req.query.latMax),
		lonMax = parseFloat(req.query.lonMax);
	console.log('latMin='+latMin+'\n'+
		'lonMin='+lonMin+'\n'+
		'latMax='+latMax+'\n'+
		'lonMax='+lonMax+'\n');

	var qry = 'SELECT * FROM HeadMessage WHERE lat>=' + mysql.escape(latMin) +
		' AND lat<=' + mysql.escape(latMax) + 
		' AND lon>=' + mysql.escape(lonMin) + 
		' AND lon<=' + mysql.escape(lonMax);
	console.log(qry);
	connection.query(qry, function(err, result) { 
		if (err){
			res.send(err);
		}
		else {
			console.log(result);
			res.send(result);
		}
	});
	//console.log(qry.sql);
});

app.get('/getPostsByUser', function(req, res){
	var userID = parseInt(req.query.userid);

	//good to know:
	//console.log(parseInt("asdf"));	//NaN
	//console.log(parseInt("1.234"));	//1

	if(userID != NaN){

		getUserPosts(userID, function(status, result){
			if(!status){
				console.log(result);
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(result));
			}else{
				res.send("lookup failed");
			}
		});
	}else{
		res.send("failed");
	}
});

app.get('/getRepliesTo', function(req, res){
	var parentID = parseInt(req.query.parentID);
	var qry = 'SELECT * FROM ReplyMessage WHERE parentID=' + mysql.escape(parentID);
	console.log(qry);
	connection.query(qry, function(err, result) {
		if (err) {
			res.send(err);
		}
		else {
			console.log(result);
			res.send(result);
		}
	});
});
	

//CB's old getRepliesTo function
app.get('/getRepliesTo/old', function(req, res){
	var messageID = String(req.query.messageID);

	//good to know:
	//console.log(parseInt("asdf"));	//NaN
	//console.log(parseInt("1.234"));	//1

	if(messageID != undefined){

		getUserPosts(messageID, function(status, result){
			if(!status){
				console.log(result);
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(result));
			}else{
				res.send("lookup failed");
			}
		});
	}else{
		res.send("failed");
	}
});



app.get('/getAllHeads', function(req, res){
	getAllHeads(function(status, result){
		res.setHeader('Content-Type', 'application/json');
		if(!status){
			res.end(JSON.stringify(result));
		}else{
			res.end("[]");
		}
	});
	
});







app.set("port", "8001");
app.listen(app.get("port"));
