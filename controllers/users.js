/* eslint-disable linebreak-style */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;
  userModel
    .findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  userModel.findOne({ email })
    .then((mail) => {
      if (mail) {
        throw new ConflictError('Пользователь с таким email уже существует.');
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => userModel.create({
            name,
            email,
            password: hash,
          }))
          .then((user) => res.send({
            name: user.name,
            id: user._id,
            email: user.email,
          }))
          .then((user) => res.status(200).send(user))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              throw new BadRequestError('Переданы некорректные данные при создании пользователя.');
            }
          })
          .catch(next);
      }
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name } = req.body;
  const userId = req.user._id;
  userModel
    .findByIdAndUpdate(
      userId,
      { name },
      { new: true, runValidators: true },
    )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные или неполные данные'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        // eslint-disable-next-line no-undef
        NODE_ENV === 'production' ? JWT_SECRET : 'secret',
        { expiresIn: '7d' },
      );

      res.send({ message: 'Успешный вход', token });
    })
    .catch(() => {
      next(new UnauthorizedError('Неправильная почта или пароль'));
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  userModel.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};
