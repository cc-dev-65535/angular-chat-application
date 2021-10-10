const index = function(req, res, next) {
  res.render('index', { title: 'Simple Chat Client' });
}

module.exports = {
  index
};
