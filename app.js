import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import StorageManager from './src/utils/ncp/storageManager';
import fs from 'fs';
import cors from 'cors';
import multer from 'multer';
import convertManager from './src/service/convertManager';

let storage = new StorageManager();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const upload = multer({
  storage: multer.memoryStorage(),
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/upload', (req, res) => {
  storage.upload(
    'jsim/',
    'newFile.txt',
    fs.createReadStream(path.join('./src/assets/final.pdf'))
  );
  res.send('hi');
});

app.post('/convert', [[], upload.single('file')], (req, res) => {
  convertManager.convert(req.file);
  // const { originalname, buffer, size } = req.file;
  // // let stream = Readable.from(buffer.toString());
  // storage.upload('jsim/', originalname, buffer, size, () => {
  //   res.status(200).json({
  //     resultMessage: 'success',
  //     resultCode: 200,
  //   });
  // });
});

app.use(
  cors({
    origin: [
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
    credential: true,
  })
);

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
