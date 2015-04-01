#!/usr/bin/nodejs
var express = require('express');
var bodyParser = require('body-parser');
var corser = require('corser');
var mysql = require('mysql');
var fs = require('fs');		//for loading debug JSON objects from file, remove later
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

/*
	Template for incoming requests
	JSON block will be in req.body. It will need to be
	funnelled into the correct database tables
	Probably we should set up different routes expecting different inputs
*/
app.post('/asdf', function(req, res){
	console.log("Got a post, here's the body");
	console.log(req.body);
	res.send("that's it");
});

app.post('/submit/newop', function(req, res){
	console.log(req.body);
	//using local JSON file for testing
	var post = fs.readFile('testpost.json', function (err,data) {
		if (err) {
			console.log(err);
		}
	});
	console.log(post);
	//var qry = connection.query('INSERT INTO HeadMessage SET ?', post, function(err, result) { 
		
	//});
	//console.log(qry.sql);
});

/*
	Outgoing requests
	As per the usual we get what the user sent out of req.query
	and can use it in a mysql query or what have you
	We should set up different routes for different types of queries
*/
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
