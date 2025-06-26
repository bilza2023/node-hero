const ac = require('../config/accessControl');

function allow(action, resource) {
  return (req, res, next) => {
    const permission = ac.can(req.user.role)[action](resource);
    if (!permission.granted) {
      return res.status(403).send('Access denied');
    }
    next();
  };
}

module.exports = { allow };
