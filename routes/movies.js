const router = require('express').Router();
const { celebrate, Joi, CelebrateError } = require('celebrate');

const isURL = require('validator/lib/isURL');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const urlValidator = (value) => {
  if (!isURL(value)) {
    throw new CelebrateError(`${value} ${'не является URL адресом'}`);
  }
  return value;
};

router.get('/movies', getMovies);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(1).max(100),
    director: Joi.string().required().min(1).max(100),
    duration: Joi.number().required(),
    year: Joi.string().required().min(2).max(4),
    description: Joi.string().required().min(1).max(5000),
    nameRU: Joi.string().required().min(1).max(100),
    nameEN: Joi.string().required().min(1).max(100),
    image: Joi.string().required().custom(urlValidator),
    trailer: Joi.string().required().custom(urlValidator),
    thumbnail: Joi.string().required().custom(urlValidator),
    movieId: Joi.number().required(),
  }),
}), createMovie);
router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().alphanum().length(24)
      .hex(),
  }),
}), deleteMovie);

module.exports = router;
