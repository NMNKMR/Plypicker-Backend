const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();

require('./controllers/authController'); //To enable Passport Configuration

//Importing Routes
const userRouter = require('./routes/userRoutes');
const cartRouter = require('./routes/cartRoutes');
const attendRouter = require('./routes/attendRoutes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

//Connect Database
mongoose.connect(process.env.DB_URL)
.then(()=> console.log("Database Connected")).catch((err)=> console.log(err))

//Executing Routers for different endpoints/routes
app.use('/auth', userRouter);

//Enabling JWT Authorization for Cart and Orders Routes.
app.use('/cart', passport.authenticate('jwt', {session: false}), cartRouter);
app.use('/attendance', passport.authenticate('jwt', {session: false}), attendRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({error: err});
});

module.exports = app;
