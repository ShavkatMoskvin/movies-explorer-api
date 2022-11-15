const mongoose = require('mongoose');
const { LINK_REGEXP } = require('../utils/constants');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    duration: {
      type: Number,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      minlength: 2,
      required: true,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return LINK_REGEXP.test(v);
        },
      },
    },
    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return LINK_REGEXP.test(v);
        },
      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return LINK_REGEXP.test(v);
        },
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
  },
);
module.exports = mongoose.model('movie', movieSchema);
