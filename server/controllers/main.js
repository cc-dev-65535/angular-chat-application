const index = function(req, res, next) {
  res.render('index', { title: 'Simple Chat Web Application' });
}

module.exports = {
  index
};
