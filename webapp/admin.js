/* This is admin.js */

var express = require('express');
var app = express();

app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('files'));

var Schemas = require('./Schemas.js');

var Request = Schemas.Request;
var Employee = Schemas.Employee;
var User = Schemas.User;
var Id = Schemas.Id;

var nameID = "ID";

Id.findOne({name : nameID}, (err, id) => {
	if (err) {
		console.log(err);
	} else if (!id) {
		var idTracker = new Id({
			'name': nameID,
			'id': 0
		});
		idTracker.save((err) => {
			if (err) {
				console.log(err);
			}
		});
	}
});

app.use('/all', (req, res) => {
	User.find ((err, allUsers) => {
		if (err) {
			res.type('html').status(500);
			res.send('Error');
			console.log(err);
		} else {
			var allRequests = [];	
			console.log('All users: ' + allUsers);		
			allUsers.forEach((user) => {
				user.requests.forEach((req) => {
					allRequests.push(req);
				});
			});
			res.render('showAll', { requests : allRequests });
		}
	});
});

app.use('/request', (req, res) => {
	var reqID = req.query.id;
	if (!reqID) {
		console.log('No ID');
		res.type('html').status(500);
		res.send('Error');
	} else {
		User.find( (err, allUsers) => {
			if (err) {
				console.log(err);
				res.type('html').status(500);
				res.send('Error');
			} else {
				var request;
				allUsers.forEach((user) => {
					user.requests.forEach((req) => {
						if (req.id == reqID) {
							request = req;
						}
					});
				});
				if (!request) {
					console.log('No request');
					res.type('html').status(500);
					res.send('Error');
				} else {
					res.render('showOne', {request : request});
				}
			}
		});
	}
});

app.use('/update', (req, res) => {
	var reqID = req.body.id;
	var status = req.body.status;
	if (!reqID || !status) {
		console.log('No ID');
		res.type('html').status(500);
		res.send('Error');
	} else {
		console.log('id: ' + reqID);
		console.log('status: ' + status);
		User.find( (err, allUsers) => {
			allUsers.forEach( (user) => {
				user.requests.forEach( (req) => {
					if (reqID == req.id) {
						var index = user.requests.indexOf(req);
						var newReq;
						if (status == 'Accepted') {
							newReq = new Request({
								'id': req.id,
								'type': req.type,
								'date': req.date,
								'latitude': req.latitude,
								'longitude': req.longitude,
								'status': 1,
								'phoneNumber': req.phoneNumber
							});
						} else if (status == 'Completed') {
							newReq = new Request({
								'id': req.id,
								'type': req.type,
								'date': req.date,
								'latitude': req.latitude,
								'longitude': req.longitude,
								'status': 2,
								'phoneNumber': req.phoneNumber
							});
						} else {
							newReq = new Request({
								'id': req.id,
								'type': req.type,
								'date': req.date,
								'latitude': req.latitude,
								'longitude': req.longitude,
								'status': 0,
								'phoneNumber': req.phoneNumber
							});
						}
						user.requests[index] = newReq;
						var newUser = new User({
							'username': user.username,
							'password': user.password,
							'requests': user.requests
						});
						User.deleteOne({username : user.username}, (err2, obj) => {
							if (err2) {
								console.log(err2);
								res.type('html').status(500);
								res.send('Error');
							} else {
								newUser.save((err3) => {
									if (err3) {
										console.log(err2);
										res.type('html').status(500);
										res.send('Error');
									} else {
										res.render('update', {request : newUser.requests[index]});
									}
								});
							}
						});
					}
				});
			});
		});
	}
});


app.use('/delete', (req, res) => {
	var reqID = req.body.id;
	if (!reqID) {
		console.log('No ID');
		res.type('html').status(500);
		res.send('Error');
	} else {
		User.find( (err, allUsers) => {
			allUsers.forEach( (user) => {
				user.requests.forEach( (req) => {
					if (reqID == req.id) {
						var index = user.requests.indexOf(req);
						var request = user.requests[index];
						user.requests.splice(index, 1);
						user.save((err) => {
							if (err) {
								console.log('Issue saving');
								res.type('html').status(500);
								res.send('Error');
							} else {
								res.render('deleted', {request: request});
							}
						});
					}
				});
			});
		});
	}
});

app.use('/api', (req, res) => {
	var type = req.query.type;
	var date = req.query.date;
	var latitude = req.query.latitude;
	var longitude = req.query.longitude;
	var status = 0;
	var username = req.query.username;
	var phoneNumber = req.query.phoneNumber;
	var password = req.query.password;
	if (type) {
		Id.findOne({name : nameID}, (err, idTracker) => {
			if (err) {
				console.log(err);
				res.type('html').status(500);
				res.send('Error');
			} else {
				console.log('Request');
				var request = new Request({
					'id': idTracker.id,
					'type': type,
		    		'date': date,
		    		'latitude': latitude,
		    		'longitude': longitude,
		    		'status': status,
		    		'phoneNumber': phoneNumber
				});
				User.findOne({username : username}, (err2, user) => {
					if (err2) {
						console.log(err);
						res.type('html').status(500);
						res.send('Error');
					} else {
						user.requests.push(request);
						user.save((err3) => {
							if (err3) {
								console.log(err3);
								res.type('html').status(500);
								res.send('Error');
							} else {
								var i = idTracker.id;
								idTracker.id = i + 1;
								idTracker.save((err4) => {
									if (err4) {
										console.log(err3);
										res.type('html').status(500);
										res.send('Error');
									} else {
										res.json({'id': i});
									}
								});
							}
						});
					}
				});
			}
		});
	} else {
		console.log('User');
		if (password) {
			var user = new User({
				'username': username,
				'password': password,
				'requests': []
			});
			user.save((err) => {
				if (err) {
					console.log(err);
					res.type('html').status(500);
					res.send('Error');
				} else {
					res.json({
						'inserted': true
					});
				}
			});
		} else {
			console.log('Wrong query');
			res.type('html').status(500);
			res.send('Error');
		}
	}
});


app.listen(3000,  () => 
	{ console.log('Listening on port 3000'); } );