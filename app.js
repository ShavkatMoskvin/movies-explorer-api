/* eslint-disable linebreak-style */
require('dotenv').config();
const express = require('express');

const app = express();
const { PORT = 3002 } = process.env;
const { celebrate, Joi, errors } = require('celebrate');

const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { validateUrl } = require('./utils/utils');
const { login, createUser } = require('./controllers/users');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateUrl, 'custom validation'),
  }),
}), createUser);

app.use(cors({
  origin: [
    'http://api.moskvin.nomoredomains.xyz',
    'https://api.moskvin.nomoredomains.xyz',
    'http://localhost:3000',
    'http://localhost:3002',
    '127.0.0.1',
  ],
  credentials: true,
}));

app.use(auth);
app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/moviesdb', {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(userRouter);
app.use(movieRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`); /* eslint-disable-line no-console */
});
