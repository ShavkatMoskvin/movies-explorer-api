require('dotenv').config();
const express = require('express');

const app = express();
const { PORT = 3002 } = process.env;
const { errors } = require('celebrate');

const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const rateLimiter = require('./middlewares/rateLimit');

app.use(express.json());
app.use(
  cors({
    origin: [
      'http://api.moskvin.nomoredomains.xyz',
      'https://api.moskvin.nomoredomains.xyz',
      'http://localhost:3000',
      'http://localhost:3002',
      '127.0.0.1',
    ],
    credentials: true,
  }),
);

app.use(helmet());
app.use(errorLogger);
app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/moviesdb', {
  useNewUrlParser: true,
});

app.use(requestLogger);
app.use(rateLimiter);
app.use('/', router);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `App listening on port ${PORT}`,
  );
});
