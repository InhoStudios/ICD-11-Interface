var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors = require('cors');

const dotenv = require("dotenv");
dotenv.config();

var indexRouter = require('./routes/index');
var tokenRouter = require('./routes/token');
var searchRouter = require('./routes/search');
var entityRouter = require('./routes/entity');
var sqlRouter = require('./routes/sqldb.js');
var uploadRouter = require('./routes/upload');
var selectRouter = require('./routes/db_select');
var insertRouter = require('./routes/db_insert');
var imageRouter = require('./routes/image');
var patientIDRouter = require('./routes/patient_id');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());

app.use(logger('dev'));
app.use(express.json({ limit: '40000kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/public', express.static('public'));
app.use('/token', tokenRouter);
app.use('/search', searchRouter);
app.use('/entity', entityRouter);
app.use('/sqldb', sqlRouter);
app.use('/upload', uploadRouter);
app.use('/db_select', selectRouter);
app.use('/db_insert', insertRouter);
app.use('/image', imageRouter);
app.use('/patient_id', patientIDRouter);

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
  res.render('error');
});

module.exports = app;
