var express = require('express');
var app =express();
var path = require('path');
var mysql = require('mysql');
var bodyParser=require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
var sess=null;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: 'bfyagfablu67624%%%&^%(sg',
        cookie: {
            maxAge: 60000
        }
    }));
app.use(cookieParser());
app.get('/login', function (req,res) {
	// body...
	console.log('Login page');
	res.sendFile('login.html',{root: __dirname});
});

app.get('/query', function (req,res) {
	// body...
	console.log('query page');
	res.sendFile('/views/query.ejs',{root: __dirname});
});

app.get('/signup', function (req,res) {
	console.log('Signup page');// body...
	res.sendFile('signup.html',{root: __dirname});
});
app.get('/about', function (req,res) {
	console.log('about page');// body...
	res.sendFile('about.html',{root: __dirname});
});

app.get('/faq', function (req,res) {
	console.log('faq page');// body...
	res.sendFile('faq.html',{root: __dirname});
});

app.get('/', function (req,res) {
	// body...
	console.log('Index page');
	res.sendFile('index.html',{root: __dirname});

});

app.get('/papers', function (req,res) {
	// body...
	console.log('papers page');
	res.sendFile('papers.html',{root: __dirname});

});

app.get('/dashboard', function (req,res) {
	// body...
	console.log('dashboard page');
	if(sess!=null)
	res.sendFile('dashboard.html',{root: __dirname});
	else res.send('YOU MUST LOGIN FIRST!');

});

app.post('/dashboard', function (req,res) {
	if(req.body.search==null)
	{
		connection.query('SELECT book_name FROM book_list WHERE  branch LIKE %\''+req.body.branches+'\'%' +'AND semester LIKE \'%'+req.body.sem+'%\'',function(error,rows,fields){
		if(!!error){
			console.log('error!');
			res.send('ERROR!');
		}
		else
			{
				console.log('SEARCH  SUCCESSFUL');
				var len=rows.length;
				res.render('query.ejs', {
				length :len,
    			'sql': rows
  }); 		
}
	});
	}
		else{
	
connection.query('SELECT book_name FROM book_list WHERE book_name LIKE \'%'+req.body.search+'%\' AND branch LIKE \'%'+req.body.branches+'%\'' +'AND semester LIKE \'%'+req.body.sem+'%\'',function(error,rows,fields){
		if(!!error){
			console.log('error!');
			res.send('ERROR!');
		}
		else
			{
				console.log('SEARCH  SUCCESSFUL');
				var len=rows.length;
				res.render('query.ejs', {
				length :len,
    			'sql': rows
  }); 		
}
	}); }//res.redirect('/redirects');
});



app.get('/prof',function(req,res){

if(sess!=null){
				console.log(req.session.email);
connection.query('SELECT * FROM profile WHERE email_id LIKE \'%'+req.session.username+'%\' ',function(error,rows,fields){
		if(!!error){
			console.log('error!');
			res.send('ERROR!');
		}
		else
			{
				console.log(rows);
				var len=rows.length;
				res.render('profile1.ejs', {
				length :len,
    			'sql': rows
  }); 		
}
	}); 
		}
else res.redirect('/login');
})



app.get('/redirect',function(req,res){

if(sess!=null){
			connection.query('SELECT username,id,email_id,contact,branch,semester,DOB from profile where email_id=\''+sess.username+'\' AND id is not null AND username is not null AND branch is not null AND semester is not null ',function(error,rows,fields){
				console.log('query SUCCESSFUL');
				if(!!error){
					console.log('error');
				
				res.send('Error!');
			}
				else{
					if(rows.length)
						res.redirect('/dashboard');
					else{
						res.redirect('/profile');

					}
				}
			}

			);
		}
else res.send('YOU MUST LOGIN FIRST!');
});


app.get('/profile1', function (req,res) {
	// body...
	console.log('profile page');
	if(sess!=null){
		res.sendFile('/views/profile1.ejs',{root: __dirname});
	}
	else{
		res.send('YOU MUST LOGIN FIRST!');

		}
	}
	);

app.post('/profile', function (req,res) {
	
	connection.query('INSERT INTO profile (username,id,contact,email_id,DOB,Branch,semester) VALUES (\''+req.session.username+'\',\''+req.body.id+'\',\''+req.body.contact+'\',\''+req.session.username+'\',\''+req.body.date+'\',\''+req.body.branches+'\',\''+req.body.sem+'\')',function(error,rows,fields){
		if(!!error){
			console.log('error!');
			res.send('ERROR!');
		}
		else
			{
				console.log('PROFILE INSERT SUCCESSFUL');
				res.redirect('/dashboard');			}
	});
	//res.redirect('/redirects');
});

app.post('/feedback', function (req,res) {
	
	connection.query('INSERT INTO feedback (id,title,feedback) VALUES (\''+req.body.id+'\',\''+req.body.title+'\',\''+req.body.textarea+'\')',function(error,rows,fields){
		if(!!error){
			console.log('error!');
			res.send('ERROR!');
		}
		else
			{
				console.log('FEEDBACK INSERT SUCCESSFUL');
				res.redirect('/');			}
	});
	//res.redirect('/redirects');
});


app.get('/feedback', function (req,res) {
	// body...
	console.log('feedback page');
	res.sendFile('feedback.html',{root: __dirname});
});
app.get('/logout',function(req,res){
	if(req.session==null || sess==null)
		res.send('YOU MUST LOGIN FIRST!');
	else{
console.log('log out page');
sess=null;
req.session=null;
res.redirect('/');
}
});
app.post('/login', function (req,res) {

		connection.query('SELECT username,password,email FROM users WHERE password LIKE ' +'\''+ req.body.password+'\' ' +'AND ( username LIKE ' +'\''+ req.body.username+'\' OR email LIKE '+'\''+req.body.username+'\' )',function(error,rows,fields){
		if(!!error){
			console.log('error!');
			res.send('Error!');
		}
		else
			{

				if(!rows.length)
					{
					//res.render('login.html', { error : 'INVALID LOGIN DETAILS'});
					//res.redirect('/invalid');
					res.end('Invalid Login details');
					console.log('invalid details');
					}
				else{
						req.session.username=req.body.username;
						req.session.email=req.body.email;
						req.session.password=req.body.password;
						sess=req.session;
						console.log(req.cookies);
						console.log(req.session);
						console.log(req.session.username);
					console.log('success');
					res.redirect('/redirect');
				}
			}
	});
	//res.redirect('/redirects');
});

app.post('/signup', function (req,res) {
	
	connection.query('INSERT INTO users (username,password,email) VALUES  (\''+ req.body.username+'\' ' +', \'' + req.body.confirmpassword+'\' ,\''+req.body.email+'\' )',function(error,rows,fields){
		if(!!error){
			console.log('error!');
			res.send('ERROR!');
		}
		else
			{
				if(!rows.length)
					{
					res.sendFile('/profile.html',{root: __dirname});					//res.redirect('/invalid');
					console.log('Signup SUCCESSFUL');
					}
				else{
					res.end('Signup FAILED');
					console.log('Signup FAILED');
					//res.redirect('/user');
				}

			}
	});
	//res.redirect('/redirects');
});


app.get('/user',function(req,res){
if(req.session.email){
res.end(req.session.id+req.session.email+req.session.password);
}
else {
	res.redirect('/login');
}

});



var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'magic',
  database: 'db'
});
connection.connect();
app.listen('1337');
console.log('server is running');