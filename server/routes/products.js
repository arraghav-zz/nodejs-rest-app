var Product = require('../models/product');

var products = {
  getAll: function(req, res) {
    Product.find({userId: req.user._id}, function (err, products) {
      if (err) {
        res.send(err);
      }
      res.json(products);
    });
  },

  getOne: function(req,res) {
    var id = req.params.id;
    Product.find({userId: req.user._id, _id: id }, function (err, product) {
      if (err) {
        res.send(err);
      }
      res.json(product);
    });
  },

  create: function(req,res) {
    // Create a new instance of the Product model
    var newProduct = new Product();

    // Set the beer properties that came from the POST data
    newProduct.name = req.body.name;
    newProduct.type = req.body.type;
    newProduct.quantity = req.body.quantity;
    newProduct.userId = req.user._id;

    // Save the beer and check for errors
    newProduct.save(function(err) {
      if (err)
        res.send(err);

      res.json({ message: 'Product added to the DB!', data: newProduct });
    });
  },

  update: function(req, res) {
    Product.update({ userId: req.user._id, _id: req.params.id }, { quantity: req.body.quantity }, function(err, num, raw) {
      if (err)
        res.send(err);

      res.json({ message: num + ' updated' });
    });
  },

  delete: function(req,res) {
    Product.remove({ userId: req.user._id, _id: req.params.id }, function(err) {
      if (err)
        res.send(err);

      res.json({ message: 'Product removed from the DB!' });
    });
  }
};

module.exports = products;