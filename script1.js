var express = require('express');
var app =express();
var path = require('path');
var mysql = require('mysql');
var bodyParser=require('body-parser');
var sesssion=require('express-session');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
	secret: '*&^^&^#^!&@*'
}));
app.get('/login', function (req,res) {
	// body...
	res.sendFile('login.html',{root: __dirname});
});
app.post('/login', function (req,res) {
	res.end(JSON.stringify(req.body));
	if(req.body.username=='admin' && req.body.password=='root')
		sesson.id=req.body.useername;
	
  var post_data = req.body;
  console.log(post_data);
});
app.listen('1337');
console.log('server is running');