/* This is node.js*/

var express = require('express');
var app = express();

app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// start at URL/files
//var popup = require('popups');



app.use('/files', express.static('files'));

var Schemas = require('./Schemas.js');

var Request = Schemas.Request;
var Employee = Schemas.Employee;
var User = Schemas.User;
var mert = 0;

console.log("Hello");

var fs = require('fs');
                    
var myCss = {
  style : fs.readFileSync('./files/mystyles.css', 'utf8')
};


var Id = Schemas.Id;
var nameID = "ID";
app.use('/log', (req, res, next) => {
    //    console.log("log cunt");
    // res.sendFile(path.join(__dirname + '/files/index.html'));
    var rbutton = req.query.lorginization;//.document.querySelector('input[name="organization"]:checked').value;
    if(rbutton === null){
        var err = new Error('No organization Selected');
        err.status = 400;
        res.send("no organization selected")
        return next(err);
    }
    Employee.authenticate(req.query.lusername, req.query.lpassword, rbutton, function (error, user) {
        if (error || !user) {
            res.send("Wrong username or password");
            var err = new Error('Wrong username or password.');
            err.status = 401;
            return next(err);
        } else {
            User.find ((err, allUsers) => {
                if (err) {
                    res.type('html').status(500);
                    res.send('Error');
                    console.log(err);
                } else {
                    var allRequests = [];   
                    console.log('All users: ' + allUsers); 
                    if(rbutton === "mert") {  
                    console.log("MERT EMPLOYEE");
                    mert = 1;  
                    allUsers.forEach((user) => {
                        user.requests.forEach((req) => {
                          if(req.type==="MERT")
                            allRequests.push(req);
                        });
                    });
                }else {
                  mert = 0;
                    allUsers.forEach((user) => {
                        user.requests.forEach((req) => {
                          if(req.type==="POLICE" || req.type==="ESCORT")
                            allRequests.push(req);
                        });
                    });
                }

                    console.log("myCss.styles");
                    res.render('showAll', {
                      requests : allRequests,
                      myCss: myCss
                    });
                }
            });
        }
    });
});
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

app.use('/pending', (req, res) => {
  User.find ((err, allUsers) => {
    if (err) {
      res.type('html').status(500);
      res.send('Error');
      console.log(err);
    } else {
      var pendingRequests = [];     
      allUsers.forEach((user) => {
        console.log('All users: ' + user);
        user.requests.forEach((req) => {
          if(mert == 1){
          if(req.status == 0 & req.type === "MERT") {
            pendingRequests.push(req);
          }
        } else {
          if(req.status == 0 & req.type !== "MERT") {
            pendingRequests.push(req);
          }
        }
        });
      });
      res.render('showPending', {
        requests : pendingRequests,
        myCss: myCss
      });
    }
  });
});

app.use('/accepted', (req, res) => {
  User.find ((err, allUsers) => {
    if (err) {
      res.type('html').status(500);
      res.send('Error');
      console.log(err);
    } else {
      var acceptedRequests = [];     
      allUsers.forEach((user) => {
        console.log('All users: ' + user);
        user.requests.forEach((req) => {
          if(mert == 1){
          if(req.status == 1 & req.type === "MERT") {
            acceptedRequests.push(req);
          }
        } else {
          if(req.status == 1 & req.type != "MERT") {
            acceptedRequests.push(req);
          }
        }
        });
      });
      res.render('showAccepted', {
        requests : acceptedRequests,
        myCss: myCss
      });
    }
  });
});

app.use('/completed', (req, res) => {
  User.find ((err, allUsers) => {
    if (err) {
      res.type('html').status(500);
      res.send('Error');
      console.log(err);
    } else {
      var completedRequests = [];     
      allUsers.forEach((user) => {
        console.log('All users: ' + user);
        user.requests.forEach((req) => {
          if(mert == 1){
          if(req.status == 2 & req.type === "MERT") {
            completedRequests.push(req);
          }
        } else {
          if(req.status == 2 & req.type !== "MERT") {
            completedRequests.push(req);
          }
        }
        });
      });
      res.render('showCompleted', {
        requests : completedRequests,
        myCss: myCss
      });
    }
  });
});

app.use('/filter', (req, res) => {
  User.find ((err, allUsers) => {
    if (err) {
      res.type('html').status(500);
      res.send('Error');
      console.log(err);
    } else {
      var orderedRequests = [];     
      allUsers.forEach((user) => {
        console.log('All users: ' + user);
        user.requests.forEach((req) => {
          if(mert == 1) {
            if(req.type === "MERT"){
          orderedRequests.push(req);
            }
          }else{
            if(req.type === "POLICE" || req.type === "ESCORT"){
          orderedRequests.push(req);
            }
          }
        });
      });
      orderedRequests.sort((a,b) => b.date - a.date);
     // var sorted = _.sortBy(orderedRequests, dateProp);
      res.render('showAll', {
        requests : orderedRequests,
        myCss: myCss
      });
    }
  });
});

app.use('/register', (req, res, next) => {
    if (req.body.Rpassword !== req.body.Rconfirm_password) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    }
    if (req.body.Rusername &&
        req.body.Rpassword &&
        req.body.Rconfirm_password) {
        var rbutton = req.body.rorginization;//.document.querySelector('input[name="organization"]:checked').value;
        console.log(req.body.rorginization)
        var employee = {
            username: req.body.Rusername,
            password: req.body.Rpassword,
            organization: rbutton
        };
        Employee.create(employee, function (error, user) {
            if (error) {
                //duplicate key
                       if (error.code === 11000 ) {
                           //                  next(error);
                           // res.send('User Already Exists<br><a type="button" href="/files/login">Go Back</a>');
                           res.render('alreadyRegistered', {
                              myCss : myCss
                            });
                }
            return next(error);
            } else {
                 // res.send('Registered<br><a type="button" href="/files/login">Go Back</a>');
                 res.render('registered', {
                      myCss : myCss
                    });
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
      allUsers.forEach((user) => {
        console.log('All users: ' + user);
        user.requests.forEach((req) => {
          if(mert == 1){
            if(req.type === "MERT"){
          allRequests.push(req);
             }
          }else{
            if(req.type === "POLICE" || req.type === "ESCORT"){
          allRequests.push(req);
             }
          }
        });
      });
      res.render('showAll', {
        requests : allRequests,
        myCss: myCss
      });
    }
  });
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
                                        res.render('update', {
                                          request : newUser.requests[index],
                                          myCss : myCss
                                        });
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
                    res.render('showOne', {
                      request : request,
                      myCss: myCss
                    });
                }
            }
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
                                res.render('deleted', {
                                  request: request,
                                  myCss : myCss
                                });
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
        console.log("Err:" + err);
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
            console.log("Err2:" + err2);
            res.type('html').status(500);
            res.send('Error');
          } else {
            user.requests.push(request);
            user.save((err3) => {
              if (err3) {
                console.log("Err3:" + err3);
                res.type('html').status(500);
                res.send('Error');
              } else {
                var i = idTracker.id;
                idTracker.id = i + 1;
                idTracker.save((err4) => {
                  if (err4) {
                    console.log("Err4:" + err4);
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
      user.save((err5) => {
        if (err5) {
          console.log("Err5:" + err5);
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


app.use('/term', (req, res, next) => {
    return res.sendFile(path.join(__dirname + '/files/index.html'));
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Authorization failed');
                    err.status = 400;
                    return next(err);
                } else {
                    return res.send('<h1>Name: </h1>' + user.username + '<br><a type="button" href="/logout">Logout</a>')
                }
            }
        });
});

app.use('/logout', (req, res, next) => {
    console.log("logout cunt");
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

app.use('/', (req, res) => {
    res.redirect('/files/login.html');
});

app.listen(process.env.PORT || 3000  () =>
    { console.log('Listening on port 3000');
    } );
