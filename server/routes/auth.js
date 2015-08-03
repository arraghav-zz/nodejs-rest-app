var jwt = require('jwt-simple');
var User = require('../models/user');

var auth = {
  login: function(req, res) {
    var username = req.body.username || '';
    var password = req.body.password || '';

    if (username == '' || password == '') {
      res.status(401);
      res.json ({
        "status": 401,
        "message": "Invalid credentials"
      })
      return;
    }

    // Fire a query to your DB and check if the credentials are valid
    auth.validate (username, password, function(err, dbUserObj) {
      if (err) {throw err;}
    
      if (!dbUserObj) {
        res.status(401);
        res.json ({
          "status": 401,
          "message": "Invalid credentials"
        })
        return;
      }

      if (dbUserObj) {
        // If authentication is success, we will generate a token
        // and dispatch it to the client
        var retObj = {
          name: dbUserObj.username,
          role: dbUserObj.role,
          _id: dbUserObj._id
        };

        res.json(genToken(retObj));
        return;
      }
    });

    },

  validate: function(username, password, cb) {
    // spoofing the DB response for simplicity
    User.findOne({ username: username }, function (err, user) {
      if (err) { throw err; }

      // No user found with that username
      if (!user) { return null; }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { throw(err); }

        // Password did not match
        if (!isMatch) { return null; }

        // Success
        cb(null, user);
      });

    });

    /*
    var dbUserObj = {
      name: 'raghav',
      role: 'admin',
      username: 'raghav'
    };


    return dbUserObj;*/
  },

  validateUser: function(username, cb) {
    // spoofing the DB response for simplicity
    User.findOne({ username: username }, function (err, user) {
      if (err) { throw err; }
      cb(null, user);
    });

    /*
    var dbUserObj = {
      name: 'raghav',
      role: 'admin',
      username: 'raghav'
    };


    return dbUserObj;*/
  }
}

// private method
function genToken(user) {
  console.log ("Generating token " + user);
  var expires = expiresIn(1);
  var token = jwt.encode({
    exp: expires
  }, require('../config/secret')());

  return {
    token: token,
    expires: expires,
    user: user
  };
}

function expiresIn (numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays); 
}

module.exports = auth;