var express = require('express');
var bodyParser = require('body-parser');
var corser = require('corser');
var app = express();


app.use(corser.create());
app.use(bodyParser.json());



app.post('/asdf', function(req, res){
	console.log("Got a post, here's the body");
	console.log(req.body);
	res.send("that's it");
});

app.set("port", "8003");
app.listen(app.get("port"));
