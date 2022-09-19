/* eslint-disable linebreak-style */
module.exports.validateUrl = (url) => {
  // eslint-disable-next-line no-useless-escape
  const regex = /^https?:\/\/(www\.)?[a-zA-Z\d]+\.[\w\-._~:\/?#[\]@!$&'()*+,;=]{2,}#?$/g;
  if (regex.test(url)) {
    return url;
  }
  throw new Error('Invalid url');
};
