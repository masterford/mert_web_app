/* This is index.js */

var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.use('/files', express.static('files'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

 app.use('/files', (req, res) => {
 	res.redirect('/files/userform.html');
 });

var Schemas = require('./Schemas.js');

var Request = Schemas.Request;
var Employee = Schemas.Employee;
var User = Schemas.User;


app.use('/create', (req, res) => {

	console.log("try to create new user");

	var newUser = new User ({ // defined in Schemas.js
		username: req.body.username,
		id: req.body.id,
		password: req.body.password,
	});

	newUser.save( (err) => {
		if (err) { 
     		res.type('html').status(500);
			res.send('Error: ' + err); 
		}
		else {
			res.redirect('/public/dummy.html');
			console.log("successful");
     		// res.render('created', { user: newUser });
     	} 
	});
});

app.listen(3000,  () => 
	{ console.log('Listening on port 3000'); } ); 
