const restify = require('restify');
const mongoose = require('mongoose');
// const rjwt = require('restify-jwt-community');
require('dotenv').config();

// dotenv.config();

const port = process.env.PORT;

const server = restify.createServer();

// Middleware
server.use(restify.plugins.bodyParser());

// Protect Routes
// server.use(rjwt({ secret: process.env.secret }).unless({ path: ['/auth'] }));

// Server
server.listen(port, () => {
  mongoose.set('useFindAndModify', false);
  mongoose.connect(
    process.env.mongoDB,
    { useNewUrlParser: true }
  );
});

const db = mongoose.connection;

db.on('error', err => console.log(err));

db.once('open', () => {
  require('./routes/customers')(server);
  require('./routes/users')(server);
  console.log(`Server running on port ${port}`);
});
