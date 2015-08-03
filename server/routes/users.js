var User = require('../models/user');

var userObj = function() {
  User.find(function(err, userObj) {
    if (err)
      throw err;
    console.log(userObj.length);

    if (userObj.length == 0) {
      var user = new User({
        username: 'admin',
        password: 'node-jwt',
        role: 'admin'
      });

      user.save(function(err) {
        if (err) throw err;

        console.log('Admin User added to the DB!' + user);
      });
    } else {
      console.log('Users already available in DB');
    }

  });
};

userObj();

var users = {
 
  getAll: function(req, res) {
    User.find(function(err, users) {
      if (err)
        res.send(err);

      res.json(users);
    });
  },
 
  getOne: function(req, res) {
    User.find({_id: req.params.id},function(err, user) {
      if (err)
        res.send(err);

      res.json(user);
    });
  },
 
  create: function(req, res) {
    var user = new User({
      username: req.body.username,
      password: req.body.password,
      role: 'user'
    });

    user.save(function(err) {
      if (err)
        res.send(err);

      res.json({ message: 'New User added to the DB!', data: user });
    });
  },
 
  delete: function(req, res) {
    User.remove({_id: req.params.id }, function(err) {
      if (err)
        res.send(err);

      res.json({ message: 'User removed from the DB!' });
    });
  }
};
 
module.exports = users;