const mongoose = require('mongoose');


/**
 * Connect to mongo db
 * @returns {object} Mongoose connection
 *
 */
exports.connect = () => {
  const options = { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true };

  mongoose.connect(process.env.DB_URL, options);
  mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
  mongoose.set('useFindAndModify', false);
  // print mongoose logs in dev env
  // mongoose.set('debug', config.db.debug === 'true');
  // Exit application on error

  mongoose.connection.on('error', (err) => {
    console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err}`);
    process.exit(-1);
  });

  return mongoose.connection;
};


exports.disconnect = () => {
  mongoose.disconnect();
};
