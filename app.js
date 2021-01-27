import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import multer from 'multer';
import './env/env.js';
import convertManager from './src/service/convertManager';
import dotenv from 'dotenv';

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// MULTER
const upload = multer({
  storage: multer.memoryStorage(),
});

var app = express();

app.use(
  cors({
    origin: [
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTION'],
    credential: true,
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// FILE SIZE CONFIG
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.disable('x-powered-by');

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/convert', upload.single('file'), async (req, res) => {
  try {
    let imagePathList = await convertManager.convert(req.file);

    res.status(200).json({
      resultData: imagePathList,
      resultCode: 200,
    });
  } catch (error) {
    console.log('error: ', error);
    if (error.message === 'BAD_REQUEST') {
      res.status(400).json({
        resultData: error.message,
        resultCode: 400,
      });
    } else {
      res.status(500).json({
        resultData: error,
        resultCode: 500,
      });
    }
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
