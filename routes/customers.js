const errors = require('restify-errors');
const Customer = require('../models/Customer');

module.exports = server => {
  // @route   GET /customers
  // @desc    Get all customers
  // @access  Public
  server.get('/customers', async (req, res, next) => {
    // res.send({ msg: 'Testing route' });
    try {
      const customer = await Customer.find({});
      res.send(customer);
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });
};
