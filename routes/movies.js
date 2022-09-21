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
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    image: Joi.string().required().custom(urlValidator),
    trailerLink: Joi.string().required().custom(urlValidator),
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
