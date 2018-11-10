const dotenv = require('dotenv');
const restify = require('restify');
const mongoose = require('mongoose');

dotenv.config();

const port = process.env.PORT;

const server = restify.createServer();

// Middleware
server.use(restify.plugins.bodyParser());

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
  console.log(`Server running on port ${port}`);
});
