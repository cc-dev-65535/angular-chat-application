const index = function(req, res, next) {
  res.render('index', { title: 'Chat Web Application' });
}

module.exports = {
  index
};
