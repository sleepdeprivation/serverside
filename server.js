var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var database = require('./database.js');

var app = express();
app.use(bodyParser.json());

//this table exists
//create the User table if it does not exist
database.connection.query(database.useDatabaseQry, function (err) {
    if (err) throw err;
});

function getUserPosts(userID, callback){
	database.connection.query('select username from HeadMessage where userID=?;', [userID],
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
	database.connection.query('select * from ReplyMessages where parentID=?;', [messageID],
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
	database.connection.query('select * from HeadMessage;',
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

// get client's IP for logging purposes
function logIP(req){
	var ip = req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;
	var currentdate = new Date();
	var timestamp = currentdate.getFullYear()+'/'+(currentdate.getMonth()+1)+'/'+currentdate.getDate()+' '+
		currentdate.getHours()+':'+currentdate.getMinutes()+':'+currentdate.getSeconds();
	console.log(ip + ' - ' + timestamp);
}

//Debug UI, remove later
app.get('/', function(req, res){
	var responseHTML = '<h1>Debug frontend for Hermes DB</h1>\n' +
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

/*
	Template for incoming requests
	JSON block will be in req.body. It will need to be
	funnelled into the correct database tables
	Probably we should set up different routes expecting different inputs
*/	
app.post('/submit/newop', function(req, res){
	//console.log(req.body);
	var jspost = req.body;
	var qry = database.connection.query('INSERT INTO HeadMessage SET ?;', jspost,
	function(err, result) { 
		if (err){
			res.send(err);
		}else{
			res.send(result);
		}
	});
	logIP(req);
	console.log(qry.sql);
});

app.post('/submit/newreply', function(req, res) {
	//console.log(req.body);
	var jspost = req.body;
	var qry = database.connection.query('INSERT INTO ReplyMessage SET ?', jspost, function(err, result) {
	        if (err){
                        res.send(err);
                }else{
                        res.send(result);
                }
	});
	logIP(req);
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
	/*console.log('latMin='+latMin+'\n'+
		'lonMin='+lonMin+'\n'+
		'latMax='+latMax+'\n'+
		'lonMax='+lonMax+'\n');*/

	var qry = 'SELECT messageID,posterID,content,lat,lon,numUpvotes,numDownvotes,timePosted,uname' + 
		' FROM HeadMessage JOIN H_User ON H_User.userID=HeadMessage.posterID' +
		' WHERE lat>=' + mysql.escape(latMin) +
		' AND lat<=' + mysql.escape(latMax) + 
		' AND lon>=' + mysql.escape(lonMin) + 
		' AND lon<=' + mysql.escape(lonMax);
	logIP(req);
	console.log(qry);
	database.connection.query(qry, function(err, result) { 
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
	var qry = 'SELECT messageID,posterID,parentID,content,numUpvotes,numDownvotes,timePosted,uname' +
		' FROM ReplyMessage JOIN H_User ON H_User.userID=ReplyMessage.posterID' +
		' WHERE parentID=' + mysql.escape(parentID);
	logIP(req);
	console.log(qry);
	database.connection.query(qry, function(err, result) {
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







app.set("port", "8003");
app.listen(app.get("port"));
