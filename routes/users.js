const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
    getCurrentUser,
  } = require('../controllers/users');

router.get('/users/me', getCurrentUser)
router.patch('/users/me', celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }))

module.exports = router;

