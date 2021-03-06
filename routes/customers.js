const errors = require('restify-errors');
const Customer = require('../models/Customer');
const rjwt = require('restify-jwt-community');
require('dotenv').config();

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

  // @route   GET /customers
  // @desc    Get a single customer
  // @access  Public
  server.get('/customers/:id', async (req, res, next) => {
    try {
      const customer = await Customer.findById(req.params.id);
      res.send(customer);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no customer with this id of ${req.params.id}`
        )
      );
    }
  });

  // @route   POST /customers
  // @desc    Create all customers
  // @access  Public
  server.post(
    '/customers',
    rjwt({ secret: process.env.secret }),
    async (req, res, next) => {
      // Check for json
      if (!req.is('application/json')) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }

      const { name, email, balance } = req.body;

      const customer = new Customer({
        name,
        email,
        balance
      });

      try {
        const newCustomer = await customer.save();
        res.send(201);
        next();
      } catch (err) {
        return next(new errors.InternalError(err.message));
      }
    }
  );

  // @route   PUT /customers
  // @desc    Update an existing customer
  // @access  Public
  server.put('/customers/:id', async (req, res, next) => {
    // Check for json
    if (!req.is('application/json')) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }

    try {
      const customer = await Customer.findOneAndUpdate(
        { _id: req.params.id },
        req.body
      );
      res.send(200);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no customer with this id of ${req.params.id}`
        )
      );
    }
  });

  // @route   DELETE /customers
  // @desc    Delete an existing customer
  // @access  Public
  server.del('/customers/:id', async (req, res, next) => {
    try {
      const customer = await Customer.findOneAndRemove({ _id: req.params.id });
      res.send(204);
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no customer with this id of ${req.params.id}`
        )
      );
    }
  });
};
